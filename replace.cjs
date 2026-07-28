const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "src");

function walk(currentDir) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith(".js") || fullPath.endsWith(".jsx")) {
      let content = fs.readFileSync(fullPath, "utf-8");
      if (content.includes('import * as Icons from "lucide-react";')) {
        content = content.replace(
          'import * as Icons from "lucide-react";',
          'import { Icons } from "@/lib/lucide-icons";'
        );
        fs.writeFileSync(fullPath, content, "utf-8");
        console.log("Updated", fullPath);
      }
    }
  }
}

walk(dir);
console.log("Done");
