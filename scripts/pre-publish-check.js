#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 发布前检查...\n');

// 检查必要文件是否存在
const requiredFiles = [
  'dist/index.js',
  'dist/index.esm.js',
  'dist/index.d.ts',
  'README.md',
  'LICENSE',
  'package.json'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log('✅', file);
  } else {
    console.log('❌', file, '- 文件不存在');
    allFilesExist = false;
  }
});

// 检查 package.json 配置
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

console.log('\n📦 Package.json 检查:');
console.log('✅ 名称:', packageJson.name);
console.log('✅ 版本:', packageJson.version);
console.log('✅ 描述:', packageJson.description);
console.log('✅ 主入口:', packageJson.main);
console.log('✅ 模块入口:', packageJson.module);
console.log('✅ 类型定义:', packageJson.types);

// 检查导出
try {
  const exports = require('../dist/index.js');
  console.log('\n🔧 导出检查:');
  
  const expectedExports = [
    'useFetch',
    'useDebounce', 
    'useDebounceState',
    'useDebounceCallback',
    'debounce',
    'useToggle',
    'useLocalStorage',
    'useSse'
  ];
  
  expectedExports.forEach(exportName => {
    if (exports[exportName]) {
      console.log('✅', exportName, '- 类型:', typeof exports[exportName]);
    } else {
      console.log('❌', exportName, '- 导出不存在');
      allFilesExist = false;
    }
  });
  
} catch (error) {
  console.log('❌ 导出检查失败:', error.message);
  allFilesExist = false;
}

console.log('\n' + '='.repeat(50));

if (allFilesExist) {
  console.log('🎉 所有检查通过！可以发布到 npm');
  console.log('\n发布命令:');
  console.log('npm publish --access public');
} else {
  console.log('❌ 检查失败，请修复问题后再发布');
  process.exit(1);
}