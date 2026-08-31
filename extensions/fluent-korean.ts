import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { CONFIG_DIR_NAME, getAgentDir } from "@earendil-works/pi-coding-agent";

type Variant = "coding" | "not-coding";

interface Config {
	enabled: boolean;
	variant: Variant;
	append: string;
}

const GUIDELINE_FILES: Record<Variant, string> = {
	coding: "fluent-korean.md",
	"not-coding": "fluent-korean-not-coding.md",
};

const VARIANT_LABELS: Record<Variant, string> = {
	coding: "coding (코딩 작업용이며, 서브에이전트 조항을 포함합니다)",
	"not-coding": "not-coding (코드를 직접 변경하지 않는 작업에 사용합니다)",
};

const MENU: { value: "off" | Variant; label: string }[] = [
	{ value: "off", label: "off: 지침을 적용하지 않습니다" },
	{ value: "coding", label: `coding: ${VARIANT_LABELS.coding}` },
	{ value: "not-coding", label: `not-coding: ${VARIANT_LABELS["not-coding"]}` },
];

const CONFIG_FILE = "fluent-korean.json";
const DEFAULTS: Config = { enabled: true, variant: "coding", append: "" };

const guidelinesDir = join(dirname(fileURLToPath(import.meta.url)), "..", "guidelines");

function readConfigFile(path: string): Partial<Config> {
	if (!existsSync(path)) return {};
	try {
		return JSON.parse(readFileSync(path, "utf-8")) as Partial<Config>;
	} catch (err) {
		console.error(`fluent-korean: ${path} 을 읽지 못했습니다: ${err}`);
		return {};
	}
}

function loadConfig(cwd: string): Config {
	const merged: Config = {
		...DEFAULTS,
		...readConfigFile(join(getAgentDir(), CONFIG_FILE)),
		...readConfigFile(join(cwd, CONFIG_DIR_NAME, CONFIG_FILE)),
	};

	const env = process.env.PI_FLUENT_KOREAN;
	if (env === "off") merged.enabled = false;
	else if (env === "coding" || env === "not-coding") {
		merged.enabled = true;
		merged.variant = env;
	}

	return merged;
}

function saveGlobalConfig(config: Config): string {
	const path = join(getAgentDir(), CONFIG_FILE);
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, `${JSON.stringify(config, null, 2)}\n`);
	return path;
}

function buildInstructions(config: Config): string {
	const guideline = readFileSync(join(guidelinesDir, GUIDELINE_FILES[config.variant]), "utf-8").trim();
	const extra = config.append.trim();
	return `\n\n# 한국어 서술 지침 (fluent-korean)\n\n${guideline}${extra ? `\n\n${extra}` : ""}\n`;
}

export default function fluentKoreanExtension(pi: ExtensionAPI) {
	let config = DEFAULTS;

	function describe(): string {
		return config.enabled ? `fluent-korean: ${VARIANT_LABELS[config.variant]}` : "fluent-korean: 꺼져 있습니다";
	}

	function refreshStatus(ctx: ExtensionContext): void {
		ctx.ui.setStatus("fluent-korean", config.enabled ? `한국어:${config.variant}` : undefined);
	}

	pi.on("session_start", async (_event, ctx) => {
		config = loadConfig(ctx.cwd);
		refreshStatus(ctx);
	});

	pi.on("before_agent_start", async (event) => {
		if (!config.enabled) return undefined;
		return { systemPrompt: event.systemPrompt + buildInstructions(config) };
	});

	pi.registerCommand("fluent-korean", {
		description: "한국어 서술 지침의 적용 여부와 판을 전환합니다",
		getArgumentCompletions: (prefix) =>
			["status", "off", "coding", "not-coding"]
				.filter((value) => value.startsWith(prefix))
				.map((value) => ({ value, label: value })),
		handler: async (args, ctx) => {
			const arg = args.trim();

			if (arg === "status") {
				ctx.ui.notify(describe(), "info");
				return;
			}

			let choice: string | undefined = arg;
			if (choice === "") {
				const picked = await ctx.ui.select(
					"한국어 서술 지침",
					MENU.map((item) => item.label),
				);
				if (picked === undefined) return;
				choice = MENU.find((item) => item.label === picked)?.value;
			}

			if (choice !== "off" && choice !== "coding" && choice !== "not-coding") {
				ctx.ui.notify(
					`알 수 없는 값입니다: ${choice}. off, coding, not-coding 중에서 선택해주세요.`,
					"warning",
				);
				return;
			}

			config =
				choice === "off" ? { ...config, enabled: false } : { ...config, enabled: true, variant: choice };
			const path = saveGlobalConfig(config);
			refreshStatus(ctx);
			ctx.ui.notify(`${describe()}\n설정을 ${path} 에 저장했으며, 다음 턴부터 적용됩니다.`, "info");
		},
	});
}
