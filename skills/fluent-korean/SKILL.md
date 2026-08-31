---
name: fluent-korean
description: Apply the fluent-korean writing guideline to Korean output so sentences keep their particles, endings, and predicates instead of collapsing into telegraphic noun strings. Use when the user asks to fix or review Korean phrasing ("한국어 다듬어줘", "이 문장 어색해", "한국어 지침대로 다시 써줘", "번역투 고쳐줘"), when producing a Korean deliverable that must read well (문서, 보고서, 릴리스 노트, 커밋 설명문, 사용자 안내문), or when a subagent prompt is written in Korean. Skip for code, code comments, commit message subject lines, quoted text, and any artifact that already has its own style guide.
---

# 한국어 서술 지침 적용

이 스킬은 `fluent-korean` 지침 본문을 읽어들여, 지금 작성 중인 한국어 산출물에 적용하는 절차를 안내합니다.

## 이 스킬을 쓰기 전에 확인할 사항

이 패키지의 확장(extension)을 켜 두었다면 지침은 이미 시스템 프롬프트에 들어가 있으므로, 이 스킬을 따로 부를 필요가 없습니다. `/fluent-korean status` 로 적용 여부를 확인할 수 있습니다.

확장을 끄고 필요할 때만 지침을 적용하려는 경우, 또는 이미 작성한 한국어 문장을 지침에 맞추어 교정하려는 경우에 이 스킬을 사용합니다.

## 절차

1. 이 스킬 디렉토리 기준으로 `../../guidelines/fluent-korean.md` 를 읽습니다. 코드를 직접 변경하지 않는 작업이라면 같은 위치의 `fluent-korean-not-coding.md` 를 대신 읽어도 됩니다. 두 파일의 차이는 서브에이전트 관련 조항 하나뿐입니다.

2. 지침 본문을 **요약하지 말고 그대로** 읽습니다. 조항마다 붙어 있는 대괄호 예시가 그 조항이 의도한 동작을 결정하기 때문에, 예시를 제외하면 조항을 잘못 적용하게 됩니다.

3. 작성했거나 작성할 한국어 문장에 지침을 적용합니다. 교정 작업이라면 고친 부분과 그 근거가 되는 조항을 함께 제시합니다.

## 적용하지 않는 범위

지침 본문에도 명시되어 있으나, 실제 작업에서 자주 헷갈리는 경계를 정리합니다.

| 대상 | 적용 여부 |
| --- | --- |
| 사용자에게 전달하는 설명, 보고, 문서 본문 | 적용합니다. |
| 변수명, 함수명, 코드 주석, 로그 문자열 | 적용하지 않습니다. 프로젝트의 기존 관례를 따릅니다. |
| 커밋 메시지 | 적용하지 않습니다. 저장소의 기존 관례를 따릅니다. |
| 인용문, 원문을 그대로 옮기는 부분 | 적용하지 않습니다. |
| 코드 블록 안의 수도코드나 요약 기호 | 적용하지 않습니다. |
| 이미 별도의 문체 지침이 정해져 있는 산출물 | 적용하지 않습니다. 판단이 어려우면 사용자에게 확인합니다. |
| 영어로 작성해야 하는 텍스트 | 적용하지 않습니다. 이 지침은 한국어를 한국어답게 쓰라는 지시이지, 영어를 한국어로 바꾸라는 지시가 아닙니다. |
