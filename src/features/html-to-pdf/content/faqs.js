/**
 * Frequently Asked Questions for HTML to PDF Converter
 * Content strictly matches actual backend implementation and security constraints.
 */

export const HTML_TO_PDF_FAQS = [
  {
    question: "What is HTML to PDF conversion?",
    answer: "HTML to PDF conversion transforms structured HTML markup, CSS styling, and public web pages into formatted PDF documents suitable for printing, archiving, and sharing."
  },
  {
    question: "Can I convert a webpage URL to PDF?",
    answer: "Yes. In Website URL mode, enter any publicly accessible HTTP or HTTPS web address. Our backend renders the webpage using an isolated Chromium engine and returns a downloadable PDF."
  },
  {
    question: "Can I paste HTML code and convert it to PDF?",
    answer: "Yes. In Paste HTML mode, you can paste raw HTML markup up to 10MB. The code is sanitized and rendered into a formatted PDF document."
  },
  {
    question: "Can I upload an HTML file?",
    answer: "Yes. In Upload HTML File mode, you can select or drag and drop .html or .htm files up to 10MB for conversion."
  },
  {
    question: "Which PDF page sizes are supported?",
    answer: "You can choose from standard page sizes including A4 (default), Letter, Legal, and A3."
  },
  {
    question: "Can I convert pages in portrait or landscape orientation?",
    answer: "Yes. Both Portrait (vertical) and Landscape (horizontal) orientations are supported."
  },
  {
    question: "Can I preserve background colors and graphics?",
    answer: "Yes. You can toggle the 'Print Backgrounds' setting on or off to control whether CSS background colors, images, and gradients are included in the generated PDF."
  },
  {
    question: "Can I choose between print and screen CSS media styling?",
    answer: "Yes. You can select 'Print CSS Styles' to emulate @media print stylesheets or 'Screen CSS Styles' to render the webpage as seen in a desktop browser viewport."
  },
  {
    question: "How are custom CSS styles and page breaks handled?",
    answer: "Our engine supports modern CSS layouts including Flexbox, Grid, Google Web Fonts, and standard page break utilities (page-break-after: always / break-after: page). You can also enable 'Respect CSS @page' to honor document page dimensions."
  },
  {
    question: "Are private or local network URLs supported?",
    answer: "No. Access to localhost (127.0.0.1), private IP ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), link-local addresses, and cloud metadata endpoints (169.254.169.254) is strictly blocked by our security policy."
  },
  {
    question: "Can I convert HTML with JavaScript execution?",
    answer: "For Website URL mode, JavaScript execution is supported to render dynamic web pages. For pasted or uploaded HTML, JavaScript execution is disabled and dangerous script tags are sanitized before rendering."
  },
  {
    question: "Can I upload a ZIP file containing CSS stylesheets or images?",
    answer: "No. ZIP package upload is not currently supported. For URL mode, external resources (images, stylesheets, fonts) are loaded securely over HTTPS if available."
  }
];
