const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'frontend', 'public', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

console.log('🔍 Validating index.html...\n');

let errorCount = 0;

// Test 1: Check for script.src with inline code (should use textContent)
console.log('Test 1: Checking for script.src with inline code...');
if (html.match(/\.src\s*=\s*['"`]\s*\(/)) {
    console.log('❌ FAIL: script.src with inline code found (should use textContent)');
    errorCount++;
} else {
    console.log('✅ PASS: No script.src with inline code');
}

// Test 2: Check script tag balance
console.log('\nTest 2: Checking script tag balance...');
const openScripts = (html.match(/<script/g) || []).length;
const closeScripts = (html.match(/<\/script>/g) || []).length;
if (openScripts !== closeScripts) {
    console.log(`❌ FAIL: Mismatched script tags (${openScripts} open, ${closeScripts} close)`);
    errorCount++;
} else {
    console.log(`✅ PASS: All ${openScripts} script tags properly closed`);
}

// Test 3: Check for unclosed tags
console.log('\nTest 3: Checking for common unclosed tags...');
const htmlTags = html.match(/<html/g) || [];
const htmlCloseTags = html.match(/<\/html>/g) || [];
const bodyTags = html.match(/<body/g) || [];
const bodyCloseTags = html.match(/<\/body>/g) || [];
const headTags = html.match(/<head/g) || [];
const headCloseTags = html.match(/<\/head>/g) || [];

if (htmlTags.length !== htmlCloseTags.length ||
    bodyTags.length !== bodyCloseTags.length ||
    headTags.length !== headCloseTags.length) {
    console.log('❌ FAIL: Some major tags are not properly closed');
    errorCount++;
} else {
    console.log('✅ PASS: All major tags properly closed');
}

// Test 4: Check for DOCTYPE
console.log('\nTest 4: Checking for DOCTYPE...');
if (html.match(/<!doctype html>/i)) {
    console.log('✅ PASS: DOCTYPE declaration present');
} else {
    console.log('❌ FAIL: DOCTYPE declaration missing');
    errorCount++;
}

// Test 5: Check for root div
console.log('\nTest 5: Checking for React root div...');
if (html.match(/<div\s+id=['"]root['"]/)) {
    console.log('✅ PASS: Root div found');
} else {
    console.log('❌ FAIL: Root div not found');
    errorCount++;
}

// Test 6: Check file size
console.log('\nTest 6: Checking file size...');
const fileSize = html.length;
console.log(`✅ INFO: File size is ${fileSize} bytes (${(fileSize / 1024).toFixed(2)} KB)`);

// Test 7: Check for syntax errors in embedded scripts
console.log('\nTest 7: Checking for common JavaScript syntax errors...');
const scriptBlocks = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g) || [];
let scriptErrors = 0;

scriptBlocks.forEach((block, index) => {
    // Check for unmatched braces (basic check)
    const openBraces = (block.match(/{/g) || []).length;
    const closeBraces = (block.match(/}/g) || []).length;
    const openParens = (block.match(/\(/g) || []).length;
    const closeParens = (block.match(/\)/g) || []).length;
    
    if (openBraces !== closeBraces) {
        console.log(`   ⚠️  Script block ${index + 1}: Unmatched braces (${openBraces} open, ${closeBraces} close)`);
        scriptErrors++;
    }
    if (openParens !== closeParens) {
        console.log(`   ⚠️  Script block ${index + 1}: Unmatched parentheses (${openParens} open, ${closeParens} close)`);
        scriptErrors++;
    }
});

if (scriptErrors === 0) {
    console.log('✅ PASS: No obvious syntax errors in scripts');
} else {
    console.log(`⚠️  WARNING: ${scriptErrors} potential syntax issue(s) found`);
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 VALIDATION SUMMARY');
console.log('='.repeat(50));

if (errorCount === 0) {
    console.log('✅ All tests passed!');
    console.log('✅ index.html is valid and ready to use');
    process.exit(0);
} else {
    console.log(`❌ ${errorCount} error(s) found`);
    console.log('⚠️  Please fix the errors above');
    process.exit(1);
}
