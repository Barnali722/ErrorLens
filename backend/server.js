/* ========================================
   ERRORLENS BACKEND SERVER
   Node.js + Express API for error analysis
   ======================================== */

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON request bodies

/* ========================================
   ERROR PATTERNS DATABASE
   Centralized error knowledge base
   ======================================== */
const errorPatterns = [
    // JavaScript Errors
    {
        regex: /TypeError.*Cannot read propert(y|ies) of (undefined|null)/i,
        languages: ['javascript'],
        title: 'TypeError: Cannot read properties of undefined/null',
        explanation: 'You tried to access a property or method on a variable that is undefined or null. This means the variable doesn\'t have a value yet, or the object you expected doesn\'t exist.',
        causes: [
            'The variable was never assigned a value',
            'An object property doesn\'t exist',
            'A function returned undefined instead of an expected object',
            'Asynchronous data hasn\'t loaded yet',
            'A DOM element wasn\'t found'
        ],
        fixes: [
            'Check if the variable exists before accessing it using optional chaining (?.)',
            'Use a conditional statement to verify the value is not null or undefined',
            'Initialize variables with default values',
            'Ensure async operations complete before accessing the data'
        ],
        codeExample: `// Problem: Accessing property on undefined
const user = undefined;
console.log(user.name); // TypeError!

// Solution 1: Optional chaining
console.log(user?.name); // undefined (no error)

// Solution 2: Check before access
if (user && user.name) {
    console.log(user.name);
}

// Solution 3: Default value
const user = getUser() || { name: 'Guest' };
console.log(user.name); // Works!`
    },
    {
        regex: /ReferenceError.*is not defined/i,
        languages: ['javascript'],
        title: 'ReferenceError: Variable is not defined',
        explanation: 'You\'re trying to use a variable that JavaScript doesn\'t know about. Either the variable was never declared, or it\'s not accessible in the current scope.',
        causes: [
            'The variable name is misspelled',
            'The variable was declared in a different scope (like inside a function)',
            'You forgot to declare the variable with let, const, or var',
            'The script or module containing the variable hasn\'t loaded yet'
        ],
        fixes: [
            'Check the spelling of the variable name',
            'Declare the variable before using it with let or const',
            'Make sure the variable is in the correct scope',
            'If using external libraries, ensure they are loaded before your script'
        ],
        codeExample: `// Problem: Using undeclared variable
console.log(message); // ReferenceError!

// Solution 1: Declare the variable first
let message = 'Hello';
console.log(message); // Works!

// Solution 2: Check for existence
if (typeof message !== 'undefined') {
    console.log(message);
}`
    },
    {
        regex: /TypeError.*is not a function/i,
        languages: ['javascript'],
        title: 'TypeError: Something is not a function',
        explanation: 'You\'re trying to call something as a function, but it\'s not actually a function. It might be undefined, null, or a different data type like a number or string.',
        causes: [
            'The function name is misspelled',
            'The variable was overwritten with a non-function value',
            'You forgot the parentheses when defining a function',
            'The method doesn\'t exist on that object',
            'Incorrect use of arrow functions or this context'
        ],
        fixes: [
            'Verify the function name is spelled correctly',
            'Check that the variable actually contains a function',
            'Use console.log to check the variable type before calling it',
            'Make sure the method exists on the object you\'re using'
        ],
        codeExample: `// Problem: Variable is not a function
const calculate = 42;
calculate(); // TypeError!

// Solution: Ensure it's a function
const calculate = (a, b) => a + b;
calculate(2, 3); // Works! Returns 5

// Problem: Method doesn't exist
const user = { name: 'John' };
user.getName(); // TypeError!

// Solution: Check method exists or add it
const user = { 
    name: 'John',
    getName() { return this.name; }
};
user.getName(); // Works!`
    },
    {
        regex: /SyntaxError/i,
        languages: ['javascript'],
        title: 'SyntaxError: Invalid syntax',
        explanation: 'JavaScript found code that doesn\'t follow the language rules. This is like a typo in the structure of your code, such as missing brackets, quotes, or semicolons.',
        causes: [
            'Missing or mismatched brackets, parentheses, or quotes',
            'Missing commas in arrays or objects',
            'Using reserved keywords as variable names',
            'Incorrect use of operators'
        ],
        fixes: [
            'Check that all opening brackets have closing brackets',
            'Make sure strings are properly quoted',
            'Look for missing commas in object and array literals',
            'Use a code editor with syntax highlighting to spot errors'
        ],
        codeExample: `// Problem: Missing closing bracket
const obj = { name: 'John', age: 30; // SyntaxError!

// Solution: Add closing bracket
const obj = { name: 'John', age: 30 }; // Works!

// Problem: Missing quote
const message = 'Hello; // SyntaxError!

// Solution: Close the string
const message = 'Hello'; // Works!`
    },

    // Python Errors
    {
        regex: /NameError.*name '.*' is not defined/i,
        languages: ['python'],
        title: 'NameError: Name is not defined',
        explanation: 'Python can\'t find the variable, function, or module you\'re trying to use. It either doesn\'t exist, hasn\'t been imported, or is misspelled.',
        causes: [
            'The variable name is misspelled',
            'The variable hasn\'t been created yet',
            'Missing import statement for a module or function',
            'Variable is defined in a different scope'
        ],
        fixes: [
            'Check the spelling of the variable or function name',
            'Make sure you define variables before using them',
            'Add the necessary import statements at the top of your file',
            'Ensure the variable is in the correct scope'
        ],
        codeExample: `# Problem: Using undefined variable
print(message)  # NameError!

# Solution: Define the variable first
message = "Hello, World!"
print(message)  # Works!

# Problem: Missing import
result = math.sqrt(16)  # NameError!

# Solution: Import the module
import math
result = math.sqrt(16)  # Works!`
    },
    {
        regex: /KeyError/i,
        languages: ['python'],
        title: 'KeyError: Dictionary key not found',
        explanation: 'You tried to access a dictionary using a key that doesn\'t exist. Python dictionaries throw an error when you ask for a key they don\'t have.',
        causes: [
            'The key name is misspelled',
            'The key was never added to the dictionary',
            'Case sensitivity - "Name" vs "name" are different keys',
            'The dictionary is empty or wasn\'t initialized properly'
        ],
        fixes: [
            'Check if the key exists before accessing it using "in" keyword',
            'Use the .get() method with a default value',
            'Verify the key spelling and capitalization',
            'Print the dictionary to see what keys are available'
        ],
        codeExample: `# Problem: Key doesn't exist
user = {'name': 'John', 'age': 30}
print(user['email'])  # KeyError!

# Solution 1: Use .get() with default
print(user.get('email', 'No email'))  # Works!

# Solution 2: Check key exists first
if 'email' in user:
    print(user['email'])
else:
    print('No email found')

# Solution 3: Use try-except
try:
    print(user['email'])
except KeyError:
    print('Email key not found')`
    },
    {
        regex: /IndexError.*list index out of range/i,
        languages: ['python'],
        title: 'IndexError: List index out of range',
        explanation: 'You tried to access a position in a list that doesn\'t exist. Lists are zero-indexed, and you can only access positions from 0 to len(list) - 1.',
        causes: [
            'The list is shorter than expected',
            'Using the wrong index number (often forgetting lists start at 0)',
            'The list is empty',
            'Loop index goes beyond list length'
        ],
        fixes: [
            'Check the list length before accessing an index',
            'Use len(list) to verify how many items exist',
            'Make sure loop counters don\'t exceed list length',
            'Use negative indexing (-1) to access from the end'
        ],
        codeExample: `# Problem: Index out of range
fruits = ['apple', 'banana']
print(fruits[5])  # IndexError!

# Solution 1: Check length first
if len(fruits) > 5:
    print(fruits[5])
else:
    print('Index too large')

# Solution 2: Use try-except
try:
    print(fruits[5])
except IndexError:
    print('Index not available')

# Solution 3: Safe iteration
for i in range(len(fruits)):
    print(fruits[i])  # Always safe`
    },
    {
        regex: /IndentationError/i,
        languages: ['python'],
        title: 'IndentationError: Unexpected indentation',
        explanation: 'Python uses indentation (spaces or tabs) to define code blocks. This error means your indentation is inconsistent or incorrect.',
        causes: [
            'Mixing tabs and spaces',
            'Missing indentation after if, for, while, def, or class statements',
            'Too much or too little indentation',
            'Copy-pasting code with different indentation styles'
        ],
        fixes: [
            'Use either all spaces (4 spaces recommended) or all tabs, never mix them',
            'Make sure code blocks after colons are indented',
            'Configure your editor to show whitespace characters',
            'Use a consistent indentation style throughout your file'
        ],
        codeExample: `# Problem: Inconsistent indentation
def greet(name):
print(f"Hello {name}")  # IndentationError!

# Solution: Proper indentation (4 spaces)
def greet(name):
    print(f"Hello {name}")  # Works!

# Problem: Missing indentation
if True:
print("This is wrong")  # IndentationError!

# Solution: Add indentation
if True:
    print("This is correct")  # Works!`
    },
    {
        regex: /ModuleNotFoundError|ImportError.*No module named/i,
        languages: ['python'],
        title: 'ModuleNotFoundError: No module found',
        explanation: 'Python can\'t find the module you\'re trying to import. Either it\'s not installed, the name is wrong, or Python can\'t find it in the search path.',
        causes: [
            'The package isn\'t installed in your environment',
            'The module name is misspelled',
            'You\'re using the wrong Python environment (different virtual environment)',
            'The module isn\'t in Python\'s search path'
        ],
        fixes: [
            'Install the package using pip: pip install package_name',
            'Check the correct spelling of the module name',
            'Activate the correct virtual environment',
            'Verify the package is installed: pip list'
        ],
        codeExample: `# Problem: Module not installed
import requests  # ModuleNotFoundError!

# Solution: Install the package first
# In terminal: pip install requests
import requests  # Now it works!

# Check installed packages
# In terminal: pip list

# For specific versions
# In terminal: pip install requests==2.28.0

# Create requirements.txt
# requests==2.28.0
# Then: pip install -r requirements.txt`
    },
    {
        regex: /ZeroDivisionError/i,
        languages: ['python'],
        title: 'ZeroDivisionError: Division by zero',
        explanation: 'You tried to divide a number by zero, which is mathematically undefined. Python raises this error to prevent invalid calculations.',
        causes: [
            'Dividing by a variable that equals zero',
            'Using modulo operator (%) with zero',
            'Calculation error that results in zero denominator',
            'User input that resulted in zero'
        ],
        fixes: [
            'Check if the divisor is zero before dividing',
            'Add input validation to prevent zero values',
            'Use try-except to handle the error gracefully',
            'Provide a default value or alternative calculation'
        ],
        codeExample: `# Problem: Dividing by zero
result = 10 / 0  # ZeroDivisionError!

# Solution 1: Check before dividing
divisor = 0
if divisor != 0:
    result = 10 / divisor
else:
    result = None
    print("Cannot divide by zero")

# Solution 2: Use try-except
try:
    result = 10 / divisor
except ZeroDivisionError:
    result = 0
    print("Division by zero handled")

# Solution 3: Validate input
def safe_divide(a, b):
    return a / b if b != 0 else float('inf')`
    },
    {
        regex: /AttributeError.*has no attribute/i,
        languages: ['python'],
        title: 'AttributeError: Object has no attribute',
        explanation: 'You tried to access a method or property that doesn\'t exist on the object. The object either doesn\'t have that attribute, or you\'re using the wrong type.',
        causes: [
            'The attribute name is misspelled',
            'The object is of a different type than expected',
            'The attribute was never defined on the class',
            'The object is None instead of the expected type'
        ],
        fixes: [
            'Check the spelling of the attribute name',
            'Verify the object type using type() or isinstance()',
            'Make sure the object is initialized properly',
            'Check the object\'s available attributes using dir()'
        ],
        codeExample: `# Problem: Wrong attribute name
text = "Hello"
text.uppercse()  # AttributeError!

# Solution: Use correct spelling
text.upper()  # Works!

# Problem: Wrong type
number = 42
number.append(5)  # AttributeError!

# Solution: Use correct type
numbers = [42]
numbers.append(5)  # Works!

# Check available methods
print(dir(text))  # Lists all methods`
    },

    // Java Errors
    {
        regex: /NullPointerException/i,
        languages: ['java'],
        title: 'NullPointerException',
        explanation: 'You tried to use an object reference that points to null. This is similar to trying to open a door when there\'s no door there.',
        causes: [
            'An object wasn\'t initialized before use',
            'A method returned null when you expected an object',
            'Array or collection element is null',
            'Forgot to instantiate an object with "new"'
        ],
        fixes: [
            'Initialize objects before using them',
            'Check if objects are null before accessing them',
            'Use Optional<T> in Java 8+ to handle potential null values',
            'Ensure constructors properly initialize all fields'
        ],
        codeExample: `// Problem: Using null object
String name = null;
System.out.println(name.length()); // NullPointerException!

// Solution 1: Initialize the object
String name = "John";
System.out.println(name.length()); // Works!

// Solution 2: Check for null
if (name != null) {
    System.out.println(name.length());
}

// Solution 3: Use Optional (Java 8+)
Optional<String> optName = Optional.ofNullable(name);
optName.ifPresent(n -> System.out.println(n.length()));

// Solution 4: Provide default
String name = getName() != null ? getName() : "Guest";`
    },
    {
        regex: /ArrayIndexOutOfBoundsException/i,
        languages: ['java'],
        title: 'ArrayIndexOutOfBoundsException',
        explanation: 'You tried to access an array position that doesn\'t exist. Arrays have fixed sizes, and valid indices go from 0 to length - 1.',
        causes: [
            'Using an index larger than array.length - 1',
            'Using a negative index',
            'Off-by-one error in loop conditions',
            'Array is smaller than expected'
        ],
        fixes: [
            'Check array length before accessing indices',
            'Ensure loop conditions are correct (i < array.length, not i <= array.length)',
            'Validate index values before use',
            'Use enhanced for loop to avoid index issues'
        ],
        codeExample: `// Problem: Index out of bounds
int[] numbers = {1, 2, 3};
System.out.println(numbers[5]); // ArrayIndexOutOfBoundsException!

// Solution 1: Check bounds
if (index >= 0 && index < numbers.length) {
    System.out.println(numbers[index]);
}

// Solution 2: Correct loop condition
for (int i = 0; i < numbers.length; i++) { // Not <=
    System.out.println(numbers[i]);
}

// Solution 3: Enhanced for loop (safest)
for (int num : numbers) {
    System.out.println(num);
}

// Solution 4: Use ArrayList for dynamic sizing
ArrayList<Integer> list = new ArrayList<>();`
    },
    {
        regex: /cannot find symbol|symbol not found/i,
        languages: ['java'],
        title: 'Cannot find symbol',
        explanation: 'The Java compiler can\'t find a variable, method, or class you\'re trying to use. It\'s either not defined, misspelled, or not imported.',
        causes: [
            'Variable, method, or class name is misspelled',
            'Missing import statement for external classes',
            'Using a variable before it\'s declared',
            'Variable declared in wrong scope',
            'Case sensitivity issue (Java is case-sensitive)'
        ],
        fixes: [
            'Check spelling and capitalization',
            'Add the necessary import statements',
            'Declare variables before using them',
            'Ensure the class or method is accessible (public/private/protected)',
            'Make sure you\'re in the correct scope'
        ],
        codeExample: `// Problem: Symbol not found
System.out.println(message); // Cannot find symbol!

// Solution: Declare the variable
String message = "Hello";
System.out.println(message); // Works!

// Problem: Missing import
ArrayList<String> list = new ArrayList<>(); // Cannot find symbol!

// Solution: Add import
import java.util.ArrayList;
ArrayList<String> list = new ArrayList<>(); // Works!

// Problem: Wrong case
String Name = "John"; // Variable is uppercase
System.out.println(name); // Cannot find symbol!

// Solution: Match the case
System.out.println(Name); // Works!`
    },

    // C++ Errors
    {
        regex: /segmentation fault|segfault|sigsegv/i,
        languages: ['cpp'],
        title: 'Segmentation Fault (SIGSEGV)',
        explanation: 'Your program tried to access memory it doesn\'t have permission to access. This is a crash caused by invalid memory operations.',
        causes: [
            'Dereferencing a null or uninitialized pointer',
            'Accessing array out of bounds',
            'Using deleted or freed memory',
            'Stack overflow from infinite recursion',
            'Writing to read-only memory'
        ],
        fixes: [
            'Initialize all pointers before use',
            'Check pointers for nullptr before dereferencing',
            'Use array bounds checking',
            'Avoid dangling pointers (pointers to deleted memory)',
            'Use smart pointers (unique_ptr, shared_ptr) to manage memory'
        ],
        codeExample: `// Problem: Null pointer dereference
int* ptr = nullptr;
*ptr = 42; // Segmentation fault!

// Solution 1: Initialize pointer properly
int value = 0;
int* ptr = &value;
*ptr = 42; // Works!

// Solution 2: Check for nullptr
if (ptr != nullptr) {
    *ptr = 42;
}

// Solution 3: Use smart pointers (C++11+)
#include <memory>
std::unique_ptr<int> ptr = std::make_unique<int>(42);

// Problem: Array out of bounds
int arr[3] = {1, 2, 3};
arr[10] = 5; // Segmentation fault!

// Solution: Check bounds or use vector
std::vector<int> vec = {1, 2, 3};
if (index < vec.size()) {
    vec[index] = 5;
}`
    },
    {
        regex: /undefined reference/i,
        languages: ['cpp'],
        title: 'Undefined reference',
        explanation: 'The linker can\'t find the implementation of a function or variable you declared. The declaration exists, but the definition is missing.',
        causes: [
            'Function is declared but never defined',
            'Missing source file in compilation',
            'Missing library in linker command',
            'Incorrect function signature (name or parameters)',
            'Namespace or scope issues'
        ],
        fixes: [
            'Implement all declared functions',
            'Include all necessary source files in compilation',
            'Link required libraries with -l flag',
            'Check that function signatures match between declaration and definition',
            'Verify namespace usage'
        ],
        codeExample: `// Problem: Function declared but not defined
// header.h
void calculate(int x);

// main.cpp
int main() {
    calculate(5); // Undefined reference!
    return 0;
}

// Solution: Provide implementation
// header.h
void calculate(int x);

// implementation.cpp
void calculate(int x) {
    // Implementation here
    std::cout << x * 2 << std::endl;
}

// Compile both files:
// g++ main.cpp implementation.cpp -o program

// For libraries, link them:
// g++ main.cpp -lm  // Link math library`
    },
    {
        regex: /undeclared identifier|was not declared/i,
        languages: ['cpp'],
        title: 'Undeclared identifier',
        explanation: 'The compiler doesn\'t recognize the variable or function name. It hasn\'t been declared in the current scope.',
        causes: [
            'Variable or function name is misspelled',
            'Missing #include directive for standard library',
            'Variable used before declaration',
            'Wrong namespace or scope',
            'Missing using declaration'
        ],
        fixes: [
            'Check spelling and capitalization',
            'Add necessary #include directives',
            'Declare variables before using them',
            'Add "std::" prefix or "using namespace std;"',
            'Ensure you\'re in the correct scope'
        ],
        codeExample: `// Problem: Missing include
cout << "Hello"; // Undeclared identifier!

// Solution: Add include and namespace
#include <iostream>
using namespace std;
cout << "Hello"; // Works!

// Or use std:: prefix
#include <iostream>
std::cout << "Hello"; // Works!

// Problem: Using before declaring
x = 5; // Undeclared identifier!

// Solution: Declare first
int x;
x = 5; // Works!

// Or declare and initialize
int x = 5; // Works!`
    },

    // Generic fallback for any language
    {
        regex: /.*/,
        languages: ['javascript', 'python', 'java', 'cpp', 'other'],
        title: 'Debugging guide',
        explanation: 'We couldn\'t match your error to a specific pattern, but here\'s a general approach to debugging any error.',
        causes: [
            'Syntax errors (typos, missing punctuation)',
            'Logic errors (wrong algorithm or conditions)',
            'Type mismatches (using wrong data types)',
            'Scope issues (variables not accessible)',
            'Missing dependencies or imports'
        ],
        fixes: [
            'Read the error message carefully - it usually tells you where the problem is',
            'Check the line number mentioned in the error',
            'Use console.log / print / cout to inspect variable values',
            'Break down complex code into smaller, testable parts',
            'Search the exact error message online - others have likely faced it',
            'Use a debugger to step through your code line by line',
            'Check documentation for the functions or libraries you\'re using'
        ],
        codeExample: `// General debugging approach

// 1. Add logging to understand what's happening
console.log('Variable value:', myVariable);
console.log('Function called with:', parameter);

// 2. Check types
console.log('Type:', typeof myVariable);

// 3. Use conditional breakpoints
if (myVariable === undefined) {
    debugger; // Pauses execution in dev tools
}

// 4. Try-catch for better error info
try {
    // Your code here
} catch (error) {
    console.error('Error details:', error);
}

// 5. Comment out code to isolate the problem
// Gradually uncomment until error appears`
    }
];

/* ========================================
   ERROR ANALYSIS FUNCTION
   Matches error text against patterns
   ======================================== */
function analyzeError(errorText, language) {
    const cleanText = errorText.trim();
    
    if (!cleanText) {
        return null;
    }

    // Try language-specific matches first
    let match = errorPatterns.find(pattern => 
        pattern.languages.includes(language.toLowerCase()) &&
        pattern.regex.test(cleanText) &&
        pattern.regex.source !== '.*'
    );

    // If no language-specific match, try any language
    if (!match) {
        match = errorPatterns.find(pattern => 
            pattern.regex.test(cleanText) &&
            pattern.regex.source !== '.*'
        );
    }

    // Use generic fallback if still no match
    if (!match) {
        match = errorPatterns.find(pattern => pattern.regex.source === '.*');
    }

    return match;
}

/* ========================================
   API ENDPOINTS
   ======================================== */

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'ErrorLens API is running',
        version: '1.0.0'
    });
});

// Main error analysis endpoint
app.post('/api/analyze', (req, res) => {
    try {
        const { errorText, language } = req.body;

        // Validation
        if (!errorText || typeof errorText !== 'string') {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'errorText is required and must be a string'
            });
        }

        if (!language || typeof language !== 'string') {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'language is required and must be a string'
            });
        }

        // Analyze the error
        const result = analyzeError(errorText, language);

        if (!result) {
            return res.status(404).json({
                error: 'No match found',
                message: 'Unable to analyze the error'
            });
        }

        // Return the analysis
        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Error analyzing:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'An error occurred while analyzing'
        });
    }
});

// Get all supported languages
app.get('/api/languages', (req, res) => {
    const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'cpp', label: 'C++' },
        { value: 'other', label: 'Other' }
    ];
    res.json({ success: true, data: languages });
});

// Get example errors
app.get('/api/examples', (req, res) => {
    const examples = [
        {
            text: 'TypeError: Cannot read properties of undefined',
            language: 'javascript'
        },
        {
            text: 'NameError: name \'x\' is not defined',
            language: 'python'
        },
        {
            text: 'NullPointerException',
            language: 'java'
        },
        {
            text: 'IndexError: list index out of range',
            language: 'python'
        },
        {
            text: 'ReferenceError: foo is not defined',
            language: 'javascript'
        }
    ];
    res.json({ success: true, data: examples });
});

/* ========================================
   START SERVER
   ======================================== */
app.listen(PORT, () => {
    console.log(`✨ ErrorLens API server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔧 Analyze endpoint: POST http://localhost:${PORT}/api/analyze`);
});

module.exports = app;
