export const FOOTER_NAVIGATION = {
  brand: {
    logo: "/brand/logo.svg",
    mission: "Fast, private, and easy-to-use online tools for everyday work.",
    trustIndicators: [
      "Free Tools",
      "Privacy First",
      "No Signup Required"
    ],
    socials: [
      { name: "Twitter", icon: "Twitter", url: "" },
      { name: "Facebook", icon: "Facebook", url: "" },
      { name: "Github", icon: "Github", url: "" },
      { name: "LinkedIn", icon: "LinkedIn", url: "" },
      { name: "Email", icon: "Mail", url: "mailto:support@snapfreetools.com" }
    ]
  },
  columns: [
    {
      title: "Tools",
      links: [
        { name: "PDF Tools", route: "/pdf-tools" },
        { name: "Calculators", route: "/calculators" },
        { name: "Word Counter", route: "/word-counter" },
        { name: "Image Compressor", route: "/image-compressor" }
      ]
    },
    {
      title: "Popular Tools",
      links: [
        { name: "PDF to Word", route: "/pdf-to-word" },
        { name: "GPA Calculator", route: "/gpa-calculator" },
        { name: "Word Counter", route: "/word-counter" },
        { name: "Image Compressor", route: "/image-compressor" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", route: "#", status: "soon" },
        { name: "How-to Guides", route: "#", status: "soon" },
        { name: "PDF Guides", route: "#", status: "soon" },
        { name: "Student Guides", route: "#", status: "soon" },
        { name: "Tool Comparisons", route: "#", status: "soon" },
        { name: "FAQs", route: "#", status: "soon" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", route: "/about" },
        { name: "Contact", route: "/contact" },
        { name: "Advertise With Us", route: "#", status: "soon" },
        { name: "Feedback", route: "#", status: "soon" },
        { name: "Suggest a Tool", route: "#", status: "soon" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", route: "/privacy-policy" },
        { name: "Terms of Use", route: "/terms" },
        { name: "Cookie Policy", route: "/cookie-policy" },
        { name: "Disclaimer", route: "/disclaimer" },
        { name: "Advertising Disclosure", route: "/advertising-disclosure" },
        { name: "DMCA Policy", route: "/dmca" },
        { name: "Accessibility", route: "/accessibility" }
      ]
    }
  ],
  bottom: {
    copyright: "© 2026 SnapFreeTools. All rights reserved.",
    tagline: "Built for speed and privacy",
    links: [
      { name: "Privacy", route: "/privacy-policy" },
      { name: "Terms", route: "/terms" },
      { name: "Cookies", route: "/cookie-policy" }
    ]
  }
};
