# ⚡ DevFix Quick Start

## 🎯 Fastest Way (30 seconds)

1. **Double-click** `standalone-demo.html`
2. **Click** an example error chip
3. **Click** "Explain this error"
4. **Done!** ✨

That's it! The app works immediately.

---

## 🚀 Full Version (2 minutes)

### Terminal 1 - Backend
```bash
cd backend
npm install
npm start
```

Wait for: `✨ DevFix API server running on http://localhost:3000`

### Terminal 2 - Frontend
```bash
# Just open frontend/index.html in your browser
# Or double-click it
```

---

## 📁 Project Structure

```
ErrorLens/
├── standalone-demo.html    ← 🎯 START HERE (no setup needed)
├── backend/
│   ├── server.js          ← Express API
│   └── package.json
├── frontend/
│   ├── index.html         ← Main app (needs backend)
│   ├── styles.css
│   └── app.js
└── README.md              ← Full documentation
```

---

## 🎨 What It Does

**Input:** Any programming error message

**Output:**
- ✅ What happened (plain English)
- ✅ Why it happened (causes)
- ✅ How to fix it (steps)
- ✅ Code example (with copy button)

**Languages:**
- JavaScript, Python, Java, C++, Other

**Patterns:** 15+ common errors

---

## 🎓 For Judges

**"How does it work?"**
- Rule-based pattern matching
- Regex to identify error types
- Language-specific solutions
- Structured for AI integration

**"Can I see the code?"**
- Every file is heavily commented
- Clear section headers
- Explained architecture
- Easy to understand

**"Is it production ready?"**
- ✅ XSS protection
- ✅ Error handling
- ✅ Responsive design
- ✅ Accessibility (WCAG)
- ✅ Dark mode support

---

## 💡 Tips

- Use `standalone-demo.html` for quick demos
- Use full version to show backend/frontend separation
- Check `TESTING.md` for comprehensive test cases
- All code has comments explaining every part

---

## ❓ Problems?

### Backend won't start
```bash
# Use batch file instead
backend\start.bat
```

### Frontend can't connect
```bash
# Use standalone version
Open standalone-demo.html
```

### npm doesn't work
```bash
# Use full path
"C:\Program Files\nodejs\npm.cmd" install
```

---

**Made for GeeksforGeeks DevFix Challenge 2024** 🏆
