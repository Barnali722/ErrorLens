# ErrorLens Testing Guide

## 🎯 Quick Test (No Installation Required)

**Just want to see it work?**

1. Open `standalone-demo.html` in your web browser
2. Click it or drag it into your browser
3. Try the example error chips
4. Paste your own error messages

✅ **This version works immediately without any setup!**

---

## 🔧 Full Version Test (With Backend)

### Step 1: Install Dependencies

Open a terminal in the `backend` folder and run:

```bash
# Option 1: Using PowerShell
cd backend
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install

# Option 2: Using Command Prompt
cd backend
npm install

# Option 3: Using the batch file
backend\install.bat
```

### Step 2: Start the Backend

```bash
# Option 1: Using npm
cd backend
npm start

# Option 2: Using node directly
cd backend
node server.js

# Option 3: Using the batch file
backend\start.bat
```

You should see:
```
✨ ErrorLens API server running on http://localhost:3000
📊 Health check: http://localhost:3000/api/health
🔧 Analyze endpoint: POST http://localhost:3000/api/analyze
```

### Step 3: Open the Frontend

Open `frontend/index.html` in your web browser

**OR** use a local server:
```bash
# Using Python
cd frontend
python -m http.server 8000

# Using PHP
cd frontend
php -S localhost:8000

# Using VS Code Live Server extension
Right-click index.html -> Open with Live Server
```

---

## ✅ Test Cases

### Test 1: JavaScript TypeError
```
Input: TypeError: Cannot read properties of undefined (reading 'name')
Language: JavaScript
Expected: Should show explanation about undefined/null access
```

### Test 2: Python NameError
```
Input: NameError: name 'x' is not defined
Language: Python
Expected: Should show explanation about undefined variables
```

### Test 3: Java NullPointerException
```
Input: NullPointerException
Language: Java
Expected: Should show explanation about null references
```

### Test 4: Python IndexError
```
Input: IndexError: list index out of range
Language: Python
Expected: Should show explanation about array bounds
```

### Test 5: JavaScript ReferenceError
```
Input: ReferenceError: foo is not defined
Language: JavaScript
Expected: Should show explanation about undeclared variables
```

### Test 6: Unknown Error
```
Input: Some random error message
Language: Other
Expected: Should show generic debugging guide
```

---

## 🧪 API Testing (Backend Only)

### Test Health Endpoint
```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/health"

# Or open in browser
http://localhost:3000/api/health
```

Expected Response:
```json
{
  "status": "ok",
  "message": "ErrorLens API is running",
  "version": "1.0.0"
}
```

### Test Analyze Endpoint
```bash
# PowerShell
$body = @{
    errorText = "TypeError: Cannot read properties of undefined"
    language = "javascript"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/analyze" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

### Test Examples Endpoint
```bash
http://localhost:3000/api/examples
```

### Test Languages Endpoint
```bash
http://localhost:3000/api/languages
```

---

## 🎨 UI/UX Testing Checklist

- [ ] Page loads without errors
- [ ] Fonts load correctly (Plus Jakarta Sans, JetBrains Mono)
- [ ] Dark mode works (change system theme)
- [ ] Example chips are clickable
- [ ] Clicking chip fills the textarea
- [ ] Language dropdown works
- [ ] "Explain this error" button responds
- [ ] Loading animation shows (if using backend)
- [ ] Results display correctly
- [ ] Code example has copy button
- [ ] Copy button shows "Copied!" confirmation
- [ ] Empty state shows when no input
- [ ] Error state shows when backend is down (frontend only)
- [ ] Smooth scrolling to results works
- [ ] Responsive on mobile (resize browser to 360px)
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Focus states are visible

---

## 📱 Responsive Testing

Test at these breakpoints:
- Desktop: 1920px
- Laptop: 1366px
- Tablet: 768px
- Mobile Large: 640px
- Mobile Small: 360px

---

## 🐛 Troubleshooting

### Problem: npm commands don't work
**Solution:** Use the provided batch files or npm.cmd directly:
```bash
"C:\Program Files\nodejs\npm.cmd" install
```

### Problem: Backend won't start
**Solution:** Check if port 3000 is available:
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID)
taskkill /F /PID <PID>
```

### Problem: Frontend can't connect to backend
**Solutions:**
1. Make sure backend is running on port 3000
2. Check browser console for errors
3. Use `standalone-demo.html` instead

### Problem: CORS errors
**Solution:** The backend already has CORS enabled. If issues persist, make sure you're accessing frontend via http:// not file://

### Problem: Fonts not loading
**Solution:** Make sure you have internet connection for Google Fonts, or the page is served via http:// not file://

---

## 📊 Expected Results

### Success Metrics
- ✅ All 15+ error patterns recognized
- ✅ Analysis returns in < 1 second
- ✅ UI is responsive and smooth
- ✅ No console errors
- ✅ Accessible via keyboard
- ✅ Works on mobile devices
- ✅ Dark mode functions correctly

### Performance
- Initial page load: < 2 seconds
- API response time: < 500ms
- No memory leaks after 10 analyses
- Smooth 60fps animations

---

## 🎓 Demo Script for Judges

1. **Open standalone-demo.html**
   - "Here's ErrorLens - it helps developers understand errors"

2. **Click first example chip**
   - "We have quick examples to test"

3. **Click Explain**
   - "The app analyzes the error and breaks it down"

4. **Show the result sections**
   - "What happened - plain English explanation"
   - "Why it happened - common causes"
   - "How to fix it - step by step instructions"
   - "Code example - with copy button"

5. **Try another language**
   - Select Python
   - Click second example chip
   - "Works across multiple languages"

6. **Show responsive design**
   - Resize browser window
   - "Fully responsive down to 360px"

7. **Show dark mode**
   - Switch system theme
   - "Automatic dark mode support"

8. **Explain architecture** (if time)
   - "The full version has a separated frontend and backend"
   - "Backend is a Node.js API with Express"
   - "Frontend is pure HTML/CSS/JS"
   - "This standalone version includes everything for demo purposes"

---

## 📝 Notes

- The standalone demo has 3 error patterns for quick testing
- The full backend has 15+ patterns
- All code is heavily commented for judges
- Both versions are production-ready
- Easy to extend with more patterns or AI integration

**Good luck with the challenge! 🚀**
