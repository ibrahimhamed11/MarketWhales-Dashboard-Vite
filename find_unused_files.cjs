const fs = require('fs');
const path = require('path');

const srcDir = './src';
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

// Get all source files
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (extensions.some(ext => file.endsWith(ext))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Extract import statements from a file
function extractImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = [];
    
    // Match various import patterns
    const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"](\.{1,2}\/[^'"]*)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  } catch (error) {
    return [];
  }
}

// Resolve import path to actual file
function resolveImportPath(importPath, fromFile) {
  const fromDir = path.dirname(fromFile);
  let resolved = path.resolve(fromDir, importPath);
  
  // Try different extensions
  if (!fs.existsSync(resolved)) {
    for (const ext of extensions) {
      const withExt = resolved + ext;
      if (fs.existsSync(withExt)) {
        return withExt;
      }
    }
    
    // Try index files
    const indexPath = path.join(resolved, 'index');
    for (const ext of extensions) {
      const indexWithExt = indexPath + ext;
      if (fs.existsSync(indexWithExt)) {
        return indexWithExt;
      }
    }
  }
  
  return fs.existsSync(resolved) ? resolved : null;
}

const allFiles = getAllFiles(srcDir);
const importedFiles = new Set();

// Entry points
const entryPoints = [
  './src/main.jsx',
  './src/routes.jsx'
];

// Start from entry points and follow imports
function followImports(filePath, visited = new Set()) {
  if (visited.has(filePath) || !fs.existsSync(filePath)) {
    return;
  }
  
  visited.add(filePath);
  importedFiles.add(path.resolve(filePath));
  
  const imports = extractImports(filePath);
  
  imports.forEach(importPath => {
    const resolved = resolveImportPath(importPath, filePath);
    if (resolved) {
      followImports(resolved, visited);
    }
  });
}

// Follow imports from entry points
entryPoints.forEach(entry => {
  if (fs.existsSync(entry)) {
    followImports(entry);
  }
});

// Find unused files
const unusedFiles = allFiles.filter(file => {
  const resolved = path.resolve(file);
  return !importedFiles.has(resolved);
});

console.log('Potentially unused files:');
unusedFiles.forEach(file => {
  console.log(file);
});

console.log(`\nTotal files: ${allFiles.length}`);
console.log(`Used files: ${importedFiles.size}`);
console.log(`Potentially unused files: ${unusedFiles.length}`);
