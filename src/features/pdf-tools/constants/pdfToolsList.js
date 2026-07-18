import { ALL_TOOLS } from "@/features/tools-hub/constants/allToolsRegistry";

export const PDF_TOOLS = ALL_TOOLS
  .filter(tool => tool.group === "PDF Tools")
  .map(tool => ({
    ...tool,
    shortDescription: tool.description
  }));
