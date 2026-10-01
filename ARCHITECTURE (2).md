# ErrorLens: Architecture

## 1. Summary

ErrorLens v1 is a **static, client-side web app**. There is no server and no database. All matching happens in the browser, so it is fast, free to host and easy to explain. An optional AI fallback (v2) is added through a small serverless proxy.

## 2. System Context

```
 +-----------+      paste error + language      +--------------------+
 | Developer | -------------------------------> |  ErrorLens (Browser)|
 |           | <------------------------------- |  HTML / CSS / JS    |
 +-----------+      explanation + fix           +---------+----------+
                                                          |
                                      (v2, only if no rule matches)
                                                          v
                                               +--------------------+
                                               | Serverless proxy   |
                                               | (holds API key)    |
                                               +---------+----------+
                                                         v
                                               +--------------------+
                                               |  AI model API      |
                                               +--------------------+
```

## 3. Component Overview

```
 index.html
 |
 +-- UI Layer
 |     +-- Input panel (textarea, language select, Explain button, example chips)
 |     +-- Result panel (title, what, why, fix, code example, copy button)
 |
 +-- Logic Layer
 |     +-- Normalizer      trims and cleans the input text
 |     +-- Matcher         finds the best pattern for text + language
 |     +-- Fallback        builds general debugging steps
 |     +-- (v2) AI client  calls the proxy when Matcher finds nothing
 |
 +-- Data Layer
       +-- patterns[]      list of error pattern objects
       +-- examples[]      demo errors for the chips
```

| Component | Responsibility |
|-----------|----------------|
| UI Layer | Collects input, shows results, handles theme and responsiveness |
| Normalizer | Trims whitespace, keeps the first meaningful lines of a long stack trace |
| Matcher | Tests each pattern's regex; prefers patterns for the selected language |
| Fallback | Returns generic steps when nothing matches |
| Patterns data | Single source of truth for all explanations |

## 4. Data Model

```js
// One entry in patterns[]
{
  regex: /cannot read propert(y|ies) of (undefined|null)/i, // how to recognise it
  languages: ["JavaScript"],                                // where it applies
  title: "Reading a property of an empty value",
  explanation: "Your code tried to use a property on undefined or null.",
  causes: ["Variable never assigned", "Data not loaded yet"],
  fixes:  ["Check the value exists", "Use optional chaining"],
  codeExample: "console.log(user?.name ?? 'Unknown');"
}
```

## 5. Request Flow

```
User clicks "Explain"
        |
        v
  Input empty? --yes--> show "paste an error" message
        |no
        v
  Normalizer cleans text
        |
        v
  Matcher: patterns for selected language first, then all patterns
        |
   +----+-----------+
   |                |
 match           no match
   |                |
   v                v
 Render result   (v1) Fallback steps
                 (v2) AI client -> proxy -> model -> Render result
```

### Matching rules
1. If the language is not "Other", test patterns that list that language first.
2. If none match, test the remaining patterns.
3. Order patterns from specific to general so a precise error wins over a broad one.
4. The first match wins.

## 6. Folder Structure

Single file for the hackathon:

```
errorlens/
  index.html        UI, styles, logic and pattern data in one file
```

If the project grows:

```
errorlens/
  index.html
  css/styles.css
  js/
    app.js          UI wiring and rendering
    matcher.js      matching and fallback logic
    patterns.js     pattern data
  api/explain.js    (v2) serverless proxy for the AI call
```

## 7. Technology Choices

| Area | Choice | Reason |
|------|--------|--------|
| Frontend | HTML, CSS, vanilla JS | No build step, easy to explain, runs anywhere |
| Matching | Regular expressions | Deterministic, fast, fully understandable |
| Styling | CSS variables and `prefers-color-scheme` | Simple theming, light and dark |
| Fonts | Plus Jakarta Sans, JetBrains Mono (system fallbacks) | Readable UI and code |
| Hosting | Any static host (GitHub Pages, Netlify, Vercel) | Free and quick |
| AI (v2) | Serverless function + model API | Keeps the API key off the client |

## 8. Security and Privacy

- Render user input with `textContent`, never `innerHTML`, to prevent XSS.
- v1 sends no data anywhere; all processing stays in the browser.
- In v2, never put the API key in client code. Call a serverless proxy that adds the key, limits request size and rate-limits calls.
- In v2, tell users their error text is sent to an AI service.

## 9. Performance

- Around 15 to 50 regex tests per request, well under 100 ms.
- A single file under about 20 KB loads instantly.
- No network calls in v1 except the font stylesheet.

## 10. Testing Plan

| Type | What to test |
|------|--------------|
| Unit | Each pattern matches its sample error and not unrelated ones |
| Functional | Empty input, matched error, unmatched error, wrong language selected |
| UI | Mobile width (360 px), keyboard-only use, light and dark theme |
| Demo | The four example chips return a result with no console errors |

## 11. Extensibility

- **Add a new error:** add one object to `patterns[]`.
- **Add a new language:** add it to the dropdown and tag patterns with it.
- **Add AI mode:** implement the AI client behind the same render function, called only when the Matcher returns nothing.

## 12. Hackathon Explainability Notes

Use this short script with the judges:

1. "The user pastes an error and picks a language."
2. "We clean the text and test it against our pattern list, language first."
3. "The first match gives a stored explanation, causes, fix and code example."
4. "If nothing matches, we show general debugging steps. In v2, an AI model handles that case through a secure proxy."
