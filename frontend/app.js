/* ========================================
   ERRORLENS FRONTEND APPLICATION
   Connects to backend API for error analysis
   ======================================== */

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

/* ========================================
   API SERVICE FUNCTIONS
   Handles communication with backend
   ======================================== */

/**
 * Analyze error text using the backend API
 * @param {string} errorText - The error message to analyze
 * @param {string} language - Programming language
 * @returns {Promise<Object>} Analysis result
 */
async function analyzeError(errorText, language) {
    try {
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                errorText: errorText.trim(),
                language: language.toLowerCase()
            })
        });

        // Parse JSON response
        const data = await response.json();

        // Handle non-OK responses
        if (!response.ok) {
            throw new Error(data.message || 'Failed to analyze error');
        }

        return data;
    } catch (error) {
        // Network or parsing errors
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Get example errors from the backend
 * @returns {Promise<Array>} List of example errors
 */
async function getExamples() {
    try {
        const response = await fetch(`${API_BASE_URL}/examples`);
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Failed to load examples:', error);
        // Return fallback examples if API fails
        return [
            { text: 'TypeError: Cannot read properties of undefined', language: 'javascript' },
            { text: 'NameError: name \'x\' is not defined', language: 'python' },
            { text: 'NullPointerException', language: 'java' },
            { text: 'IndexError: list index out of range', language: 'python' },
            { text: 'ReferenceError: foo is not defined', language: 'javascript' }
        ];
    }
}

/* ========================================
   UI UPDATE FUNCTIONS
   Handles DOM manipulation and display
   ======================================== */

/**
 * Show loading state on the button
 * @param {boolean} isLoading - Whether to show loading state
 */
function setLoadingState(isLoading) {
    const btn = document.getElementById('explainBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');

    if (isLoading) {
        btn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';
    } else {
        btn.disabled = false;
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
    }
}

/**
 * Display the analysis result in the UI
 * @param {Object} result - Analysis result from API
 */
function displayResult(result) {
    const resultSection = document.getElementById('resultSection');
    const emptyState = document.getElementById('emptyState');
    const errorState = document.getElementById('errorState');
    const resultContent = document.getElementById('resultContent');

    // Hide all states first
    emptyState.style.display = 'none';
    errorState.style.display = 'none';
    resultContent.style.display = 'none';

    if (!result) {
        // Show empty state
        emptyState.style.display = 'block';
        resultSection.classList.add('visible');
        return;
    }

    // Show result content
    resultContent.style.display = 'block';

    // Populate title (safe from XSS using textContent)
    document.getElementById('errorTitle').textContent = result.title;

    // Populate explanation
    document.getElementById('explanation').textContent = result.explanation;

    // Populate causes list
    const causesList = document.getElementById('causesList');
    causesList.innerHTML = ''; // Clear previous
    result.causes.forEach(cause => {
        const li = document.createElement('li');
        li.textContent = cause; // Safe from XSS
        causesList.appendChild(li);
    });

    // Populate fixes list
    const fixesList = document.getElementById('fixesList');
    fixesList.innerHTML = ''; // Clear previous
    result.fixes.forEach(fix => {
        const li = document.createElement('li');
        li.textContent = fix; // Safe from XSS
        fixesList.appendChild(li);
    });

    // Populate code example
    document.getElementById('codeExample').textContent = result.codeExample;

    // Show the result section with animation
    resultSection.classList.add('visible');

    // Smooth scroll to result
    setTimeout(() => {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

/**
 * Display error state when API fails
 * @param {string} message - Error message to display
 */
function displayError(message) {
    const resultSection = document.getElementById('resultSection');
    const emptyState = document.getElementById('emptyState');
    const errorState = document.getElementById('errorState');
    const resultContent = document.getElementById('resultContent');

    // Hide other states
    emptyState.style.display = 'none';
    resultContent.style.display = 'none';

    // Show error state
    errorState.style.display = 'block';
    document.getElementById('errorMessage').textContent = message;

    // Show the result section
    resultSection.classList.add('visible');

    // Scroll to error
    setTimeout(() => {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

/* ========================================
   EVENT HANDLERS
   ======================================== */

/**
 * Handle the main "Explain this error" button click
 */
async function handleExplainClick() {
    const errorText = document.getElementById('errorInput').value;
    const language = document.getElementById('languageSelect').value;

    // Validation
    if (!errorText.trim()) {
        displayResult(null);
        return;
    }

    // Show loading state
    setLoadingState(true);

    try {
        // Call API
        const response = await analyzeError(errorText, language);

        // Display result
        if (response.success && response.data) {
            displayResult(response.data);
        } else {
            throw new Error('Invalid response from server');
        }
    } catch (error) {
        // Display error
        displayError(
            error.message === 'Failed to fetch' 
                ? 'Unable to connect to the server. Make sure the backend is running on http://localhost:3000'
                : error.message
        );
    } finally {
        // Hide loading state
        setLoadingState(false);
    }
}

/**
 * Handle example chip click
 * @param {Event} e - Click event
 */
function handleChipClick(e) {
    const exampleText = e.target.textContent;
    document.getElementById('errorInput').value = exampleText;
    
    // Auto-select appropriate language based on example
    if (exampleText.includes('TypeError') || exampleText.includes('ReferenceError')) {
        document.getElementById('languageSelect').value = 'javascript';
    } else if (exampleText.includes('NameError') || exampleText.includes('IndexError')) {
        document.getElementById('languageSelect').value = 'python';
    } else if (exampleText.includes('NullPointerException')) {
        document.getElementById('languageSelect').value = 'java';
    }

    // Focus on the textarea for better UX
    document.getElementById('errorInput').focus();
}

/**
 * Handle copy button click
 */
async function handleCopyClick() {
    const codeText = document.getElementById('codeExample').textContent;
    const copyBtn = document.getElementById('copyBtn');

    try {
        // Try modern clipboard API
        await navigator.clipboard.writeText(codeText);
        
        // Show "Copied" confirmation
        copyBtn.classList.add('copied');
        
        // Remove the class after animation completes
        setTimeout(() => {
            copyBtn.classList.remove('copied');
        }, 2000);
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = codeText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.classList.remove('copied');
        }, 2000);
    }
}

/* ========================================
   INITIALIZATION
   Set up event listeners when DOM is ready
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Main explain button
    document.getElementById('explainBtn').addEventListener('click', handleExplainClick);

    // Example chips
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', handleChipClick);

        // Keyboard accessibility for chips
        chip.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                chip.click();
            }
        });
    });

    // Copy button
    document.getElementById('copyBtn').addEventListener('click', handleCopyClick);

    // Allow Enter key to trigger explain (Shift+Enter for new line)
    document.getElementById('errorInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleExplainClick();
        }
    });

    // Load examples from API (optional enhancement)
    getExamples().then(examples => {
        // Could dynamically populate chips here if needed
        console.log('Examples loaded:', examples);
    });
});

/* ========================================
   FUTURE ENHANCEMENTS
   
   1. Add error history/recent searches
   2. Implement search suggestions as user types
   3. Add ability to rate solutions (helpful/not helpful)
   4. Cache results in localStorage
   5. Add keyboard shortcuts (Ctrl+Enter to submit)
   6. Implement dark mode toggle
   7. Add language detection from error text
   8. Support multiple errors at once
   ======================================== */
