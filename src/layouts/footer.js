import Link from "next/link";
import { Facebook, Twitter, Github, Mail, Linkedin } from "lucide-react";
import { FOOTER_NAVIGATION } from "@/config/footerNavigation";
import { ALL_TOOLS } from "@/features/tools-hub/constants/allToolsRegistry";

export default function Footer() {
  // Read popular tools dynamically from unified registry
  const popularTools = ALL_TOOLS
    .filter(tool => tool.status === "live" && tool.popular)
    .slice(0, 5);

  const getIcon = (iconName) => {
    switch (iconName) {
      case "Twitter": return <Twitter size={16} />;
      case "Facebook": return <Facebook size={16} />;
      case "Github": return <Github size={16} />;
      case "LinkedIn": return <Linkedin size={16} />;
      case "Mail": return <Mail size={16} />;
      default: return null;
    }
  };

  return (
    <footer id="footer" className="relative bg-[#08111F] text-slate-300 pt-16 pb-8 border-t border-slate-800/60 overflow-hidden" role="contentinfo" aria-label="SnapFreeTools Site Footer">
      {/* Decorative CSS static gradients */}
      <div aria-hidden="true" className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none select-none" />
      <div aria-hidden="true" className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none select-none" />
      
      {/* Static very low opacity noise decoration */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40 select-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Column 1: Brand Section */}
          <div className="space-y-6 lg:col-span-1">
            <Link href="/" className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-amber-500/20 rounded-xl">
              <img src="/brand/logo.svg" alt="SnapFreeTools Logo" className="h-9 w-auto brightness-0 invert" />
            </Link>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              {FOOTER_NAVIGATION.brand.mission}
            </p>
            
            {/* Trust Indicators */}
            <div className="space-y-2.5">
              {FOOTER_NAVIGATION.brand.trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2 text-[10px] font-extrabold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1 rounded-xl w-fit uppercase tracking-wider select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {indicator}
                </div>
              ))}
            </div>

            {/* Social Icons / Contact */}
            <div className="pt-2">
              {(() => {
                const activeSocials = FOOTER_NAVIGATION.brand.socials.filter(social => social.url !== "");
                
                if (activeSocials.length === 1 && activeSocials[0].name === "Email") {
                  const emailSocial = activeSocials[0];
                  return (
                    <a
                      href={emailSocial.url}
                      aria-label="Contact us via email"
                      className="inline-flex items-center gap-2.5 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors outline-none group"
                    >
                      <span className="w-8 h-8 rounded-xl bg-slate-850/60 hover:bg-amber-500/10 group-hover:text-amber-400 border border-slate-700/30 group-hover:border-amber-500/30 flex items-center justify-center text-slate-400 transition-all shrink-0">
                        {getIcon(emailSocial.icon)}
                      </span>
                      <span>Contact us</span>
                    </a>
                  );
                }

                // Fallback / multi-social rendering
                return (
                  <div className="flex gap-3">
                    {activeSocials.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                        title={social.name}
                        className="w-8 h-8 rounded-xl bg-slate-850/60 hover:bg-amber-500/10 hover:text-amber-400 border border-slate-700/30 hover:border-amber-500/30 flex items-center justify-center text-slate-400 transition-all outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                      >
                        {getIcon(social.icon)}
                      </a>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Column 2: Tools Navigation Categories */}
          <nav className="space-y-4" aria-label="Tools directory navigation">
            <h4 className="text-[10px] font-extrabold text-white uppercase tracking-widest border-b border-slate-800/60 pb-2">
              Tool categories
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_NAVIGATION.columns[0].links.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.route}
                    className="text-xs font-semibold text-slate-400 hover:text-white transition-colors outline-none focus-visible:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: Dynamic Popular Tools */}
          <nav className="space-y-4" aria-label="Popular tools navigation">
            <h4 className="text-[10px] font-extrabold text-white uppercase tracking-widest border-b border-slate-800/60 pb-2">
              Popular Tools
            </h4>
            <ul className="space-y-2.5">
              {popularTools.map((tool) => (
                <li key={tool.id}>
                  <Link 
                    href={`/${tool.slug}`}
                    className="text-xs font-semibold text-slate-400 hover:text-white transition-colors outline-none focus-visible:text-white"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4: Company Links (Filtered live only) */}
          <nav className="space-y-4" aria-label="Company navigation">
            <h4 className="text-[10px] font-extrabold text-white uppercase tracking-widest border-b border-slate-800/60 pb-2">
              Company
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_NAVIGATION.columns[3].links
                .filter(link => link.status !== "soon")
                .map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.route}
                      className="text-xs font-semibold text-slate-400 hover:text-white transition-colors outline-none focus-visible:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          {/* Column 5: Legal Pages (Completed pages only) */}
          <nav className="space-y-4" aria-label="Legal documents navigation">
            <h4 className="text-[10px] font-extrabold text-white uppercase tracking-widest border-b border-slate-800/60 pb-2">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_NAVIGATION.columns[4].links.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.route}
                    className="text-xs font-semibold text-slate-400 hover:text-white transition-colors outline-none focus-visible:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

        </div>

        {/* Bottom copyright and tagline */}
        <div className="border-t border-slate-800/60 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p className="font-semibold text-center md:text-left">
            {FOOTER_NAVIGATION.bottom.copyright}
          </p>
          <p className="text-[10px] font-extrabold text-slate-400/80 uppercase tracking-widest hidden md:block select-none">
            {FOOTER_NAVIGATION.bottom.tagline}
          </p>
          <div className="flex gap-4">
            {FOOTER_NAVIGATION.bottom.links.map((link) => (
              <Link 
                key={link.name}
                href={link.route}
                className="hover:text-slate-300 transition-colors outline-none font-semibold"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
