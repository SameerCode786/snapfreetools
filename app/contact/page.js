import { generatePageMetadata } from "@/seo/metadata";
import ContactFeature from "@/features/contact";

export function generateMetadata() {
  return generatePageMetadata("contact");
}

export default function Page() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://snapfreetools.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Contact",
        "item": "https://snapfreetools.com/contact"
      }
    ]
  };

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact SnapFreeTools | Support, Feedback & Inquiries",
    "description": "Contact SnapFreeTools for tool support, bug reports, feature suggestions, advertising inquiries, partnerships, privacy questions, and general feedback.",
    "url": "https://snapfreetools.com/contact",
    "isPartOf": {
      "@type": "WebSite",
      "name": "SnapFreeTools",
      "url": "https://snapfreetools.com/"
    },
    "mainEntity": {
      "@type": "Organization",
      "name": "SnapFreeTools",
      "url": "https://snapfreetools.com/",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "sameerwebdeveloper41@gmail.com",
        "contactType": "customer support",
        "availableLanguage": "English"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <ContactFeature />
    </>
  );
}
