import { ALL_TOOLS } from "@/features/tools-hub/constants/allToolsRegistry";

export const CALCULATORS = ALL_TOOLS.filter(tool => tool.group === "Calculators");
