const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const icons = new Set();

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Match Icons.Something
      const regex1 = /Icons\.([A-Za-z0-9_]+)/g;
      let match;
      while ((match = regex1.exec(content)) !== null) {
        icons.add(match[1]);
      }
      
      // Match icon: "Something"
      const regex2 = /icon:\s*['"]([A-Za-z0-9_]+)['"]/g;
      while ((match = regex2.exec(content)) !== null) {
        icons.add(match[1]);
      }
    }
  }
}

walk(srcDir);

// Convert to array and filter out anything obviously not an icon (like lowercase)
const iconArray = Array.from(icons).filter(name => /^[A-Z][a-zA-Z0-9]*$/.test(name));

const fileContent = `// Auto-generated icon map to prevent massive Turbopack bundling
import {
${iconArray.map(icon => `  ${icon}`).join(',\n')}
} from "lucide-react";

export const Icons = {
${iconArray.map(icon => `  ${icon}`).join(',\n')}
};
`;

fs.writeFileSync(path.join(srcDir, 'lib', 'lucide-icons.js'), fileContent, 'utf8');
console.log('Successfully generated lucide-icons.js with', iconArray.length, 'icons');
