/* ========================================
   SETUP TEST SCRIPT
   Checks if everything is ready to run
   ======================================== */

const fs = require('fs');
const path = require('path');

console.log('🔍 ErrorLens Setup Test\n');
console.log('=' .repeat(50));

// Check Node.js version
console.log('\n✓ Node.js version:', process.version);

// Check if backend files exist
const backendFiles = [
    'backend/server.js',
    'backend/package.json'
];

const frontendFiles = [
    'frontend/index.html',
    'frontend/styles.css',
    'frontend/app.js'
];

console.log('\n📁 Checking Backend Files:');
backendFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '✓' : '✗'} ${file}`);
});

console.log('\n📁 Checking Frontend Files:');
frontendFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '✓' : '✗'} ${file}`);
});

// Check if node_modules exists
const hasNodeModules = fs.existsSync('backend/node_modules');
console.log('\n📦 Dependencies:');
if (hasNodeModules) {
    console.log('  ✓ node_modules found');
    
    // Check for required packages
    const requiredPackages = ['express', 'cors'];
    requiredPackages.forEach(pkg => {
        const exists = fs.existsSync(`backend/node_modules/${pkg}`);
        console.log(`  ${exists ? '✓' : '✗'} ${pkg}`);
    });
} else {
    console.log('  ✗ node_modules not found');
    console.log('  ⚠️  Run: cd backend && npm install');
}

console.log('\n' + '='.repeat(50));
console.log('\n📋 Next Steps:');
console.log('  1. Install dependencies: cd backend && npm install');
console.log('  2. Start backend: cd backend && npm start');
console.log('  3. Open frontend: Open frontend/index.html in browser');
console.log('\n✨ ErrorLens will be ready to test!\n');
