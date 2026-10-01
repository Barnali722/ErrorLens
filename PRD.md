# ErrorLens: Product Requirements Document

**Tagline:** See what your error really means.
**Challenge:** GeeksforGeeks "Turn coding errors into understandable solutions"
**Version:** 1.0

---

## 1. Overview

ErrorLens is a simple web tool. A developer pastes an error message, picks a programming language, and gets a plain-English explanation: what happened, why it might have happened, and how to fix it.

## 2. Problem Statement

Developers, especially students and beginners, often hit errors they cannot read. Error messages are short, technical and full of jargon. People lose time searching forums and copying fixes they do not understand.

## 3. Goals

| # | Goal | How we measure it |
|---|------|-------------------|
| G1 | Explain common errors in plain language | Every result has what / why / fix sections |
| G2 | Give a fix the user can try right away | Every matched result includes a copyable code example |
| G3 | Be fast and simple | Result appears in under 1 second, no sign-up |
| G4 | Be explainable | Team can walk through the full logic during judging |

### Non-goals (v1)
- Scanning or running the user's whole codebase
- IDE plugins
- User accounts or saved history
- Supporting every language or framework

## 4. Target Users

| Persona | Need |
|---------|------|
| Beginner student | Understand what an error means in simple words |
| Intermediate developer | Quickly confirm the likely cause and fix |
| Hackathon judge | See a clear, working, explainable solution |

## 5. User Stories

1. As a developer, I paste an error so I can find out what it means.
2. As a developer, I choose my language so the answer fits my context.
3. As a developer, I see likely causes so I know where to look.
4. As a developer, I get a suggested fix and example code so I can apply it.
5. As a developer, I click an example error so I can try the tool without typing.
6. As a developer, I get useful general steps when my error is not recognized.

## 6. Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| F1 | Multi-line text input for the error message | Must |
| F2 | Language selector: JavaScript, Python, Java, C++, Other | Must |
| F3 | "Explain" action that returns a result | Must |
| F4 | Result shows title, What happened, Why it might happen, How to fix | Must |
| F5 | Code example with copy button | Must |
| F6 | At least 15 built-in error patterns across the four languages | Must |
| F7 | Fallback guidance when no pattern matches | Must |
| F8 | Clickable example errors | Should |
| F9 | Light and dark theme following the system setting | Should |
| F10 | AI-assisted explanation as a fallback (Approach B) | Could |
| F11 | Auto-detect language from the error text | Could |

## 7. Non-Functional Requirements

- **Performance:** rule matching completes in under 100 ms.
- **Usability:** one screen, one action, no learning curve.
- **Accessibility:** keyboard navigable, visible focus, WCAG AA contrast.
- **Responsive:** works from 360 px wide phones to desktop.
- **Security:** user input is rendered as text only, never as HTML.
- **Privacy:** in v1 the error text never leaves the browser. If AI mode is added, tell the user their text is sent to an API.
- **Maintainability:** adding a new error means adding one data entry, with no logic changes.

## 8. UX and Design

- **Layout:** single column, max width about 860 px, input card on top, result card below.
- **Palette:** background `#F5F7FB`, cards `#FFFFFF`, text `#16203A`, primary indigo `#4F46E5`, success green `#0F9D7A`, warning amber `#B45309`, code `#101828`. Matching dark theme.
- **Type:** Plus Jakarta Sans (UI), JetBrains Mono (code).
- **Tone:** friendly, short sentences, sentence case, no jargon.
- **States:** empty input message, matched result, no-match fallback.

## 9. Approach and Hackathon Rules

The challenge allows GenAI, but the team must understand, test and explain what they build.

- **v1 uses Approach A (rule-based):** error -> known pattern -> predefined explanation -> solution. Fully explainable.
- **v2 can add Approach B (AI-assisted):** error -> AI model/API -> explanation -> suggested solution, used only when no rule matches.

## 10. Success Metrics

- 15+ error patterns covered across 4 languages
- Matched result shown for all four demo errors
- Zero console errors in the demo flow
- Team can explain the matching logic in under 2 minutes

## 11. Milestones

| Phase | Deliverable |
|-------|-------------|
| 1 | UI layout and theme |
| 2 | Pattern data and matching engine |
| 3 | Result rendering, copy button, example chips |
| 4 | Testing with real errors, polish, demo script |
| 5 (optional) | AI fallback through a small serverless proxy |

## 12. Risks

| Risk | Mitigation |
|------|------------|
| Error not covered by any pattern | General debugging fallback; easy to add patterns |
| Regex matches the wrong pattern | Order patterns from specific to general; filter by language first |
| Judges question AI-generated code | Comment every part; keep logic small and understood |
| API key exposed in AI mode | Keep the key on a server proxy, never in client code |

## 13. Future Scope

- Language auto-detection
- Stack trace parsing (file and line highlighting)
- More languages (Go, Rust, TypeScript, C#)
- Community-submitted patterns
- Browser extension
