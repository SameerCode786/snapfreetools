import { 
  Share2, 
  Copy, 
  MessageCircle, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Mail, 
  Instagram,
  Check
} from "lucide-react";

export const PLATFORMS = [
  {
    id: "native",
    label: "Native Share",
    icon: Share2,
    colorClass: "hover:border-slate-400 text-slate-700",
    bgClass: "bg-white",
    requiresNative: true
  },
  {
    id: "copy",
    label: "Copy Link",
    icon: Copy,
    activeIcon: Check,
    colorClass: "hover:border-amber-300 text-slate-700",
    bgClass: "bg-white"
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    colorClass: "hover:border-emerald-400 text-emerald-600",
    bgClass: "bg-white"
  },
  {
    id: "twitter",
    label: "X / Twitter",
    icon: Twitter,
    colorClass: "hover:border-sky-400 text-sky-500",
    bgClass: "bg-white"
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: Facebook,
    colorClass: "hover:border-blue-500 text-blue-600",
    bgClass: "bg-white"
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    colorClass: "hover:border-blue-600 text-blue-700",
    bgClass: "bg-white"
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    colorClass: "hover:border-amber-400 text-amber-600",
    bgClass: "bg-white"
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: Instagram,
    colorClass: "hover:border-pink-400 text-pink-600",
    bgClass: "bg-white",
    isFallback: true
  }
];
