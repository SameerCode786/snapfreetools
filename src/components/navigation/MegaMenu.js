import { CALCULATORS } from "@/features/student-hub/shared/constants/calculatorList";
import MegaMenuColumn from "./MegaMenuColumn";
import MegaMenuCard from "./MegaMenuCard";
import { motion } from "motion/react";

export default function MegaMenu({ onClose }) {
  // Filter items by category
  const academicItems = CALCULATORS.filter(c => c.category === "Academic Calculators");
  const studentItems = CALCULATORS.filter(c => c.category === "Student & Admission Tools");
  const financialItems = CALCULATORS.filter(c => c.category === "Financial Calculators");
  const utilityItems = CALCULATORS.filter(c => c.category === "Utility Calculators");
  
  // Featured item
  const featuredItem = CALCULATORS.find(c => c.featured) || CALCULATORS[0];

  return (
    <motion.div 
      id="desktop-mega-menu"
      role="region"
      aria-label="Calculators Directory"
      initial={{ opacity: 0, y: 12, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.99 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-0 right-0 bg-white border-b border-slate-200/80 shadow-2xl z-50 pointer-events-auto max-h-[calc(100vh-4.5rem)] overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {/* Column 1: Featured Promo Card */}
        <div className="flex flex-col h-full">
          <MegaMenuCard item={featuredItem} onItemClick={onClose} />
        </div>

        {/* Column 2: Academic Calculators */}
        <div className="h-full">
          <MegaMenuColumn 
            title="Academic Calculators" 
            items={academicItems} 
            onItemClick={onClose} 
          />
        </div>

        {/* Column 3: Student & Admission */}
        <div className="h-full">
          <MegaMenuColumn 
            title="Student & Admission" 
            items={studentItems} 
            onItemClick={onClose} 
          />
        </div>

        {/* Column 4: Financial & Utility (Stacked) */}
        <div className="flex flex-col gap-8 h-full">
          <MegaMenuColumn 
            title="Financial Tools" 
            items={financialItems} 
            onItemClick={onClose} 
          />
          <MegaMenuColumn 
            title="Utility Tools" 
            items={utilityItems} 
            onItemClick={onClose} 
          />
        </div>
      </div>
    </motion.div>
  );
}

