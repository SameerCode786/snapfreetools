import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface ToolCardProps {
  key?: string;
  name: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: string;
  delay?: number;
}

export default function ToolCard({ name, description, icon: Icon, path, color, delay = 0 }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link
        to={path}
        className="block bg-white p-6 rounded-2xl border border-slate-200 card-hover group h-full"
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white ${color}`}>
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{name}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
      </Link>
    </motion.div>
  );
}
