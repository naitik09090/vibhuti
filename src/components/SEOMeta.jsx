import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEOMeta({ title, description, keywords }) {
  const fullTitle = `${title} | Vibhuti Enterprise - Premium Financial Services`;
  const defaultDesc = "Vibhuti Enterprise offers premium financial services including Home Loans, Business Loans, Mortgage Loans, and customized financial solutions with luxury banking features in Surat, Gujarat.";
  const defaultKeys = "financial services, premium banking, home loan, business loan, mortgage loan, emi calculator, Vibhuti Enterprise, loan eligibility, Surat finance, Surat loans";

  // Schema data representing the financial consulting service
  const schemaJsonLD = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "Vibhuti Enterprise",
    "image": "https://vibhutienterprise.com/assets/logo.png",
    "@id": "https://vibhutienterprise.com/#financialservice",
    "url": "https://vibhutienterprise.com",
    "telephone": "+919409126965",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Shop No. 115, Nidhi Complex, 1st Floor, Opp. Chowpati, Nana Varachha",
      "addressLocality": "Surat",
      "addressRegion": "Gujarat",
      "postalCode": "395006",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 21.206254,
      "longitude": 72.887208
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:30",
      "closes": "19:00"
    },
    "sameAs": [
      "https://wa.me/917862808887"
    ]
  };

  useEffect(() => {
    document.title = fullTitle;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description || defaultDesc);

    let metaKeys = document.querySelector('meta[name="keywords"]');
    if (!metaKeys) {
      metaKeys = document.createElement('meta');
      metaKeys.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeys);
    }
    metaKeys.setAttribute('content', keywords || defaultKeys);
  }, [title, description, keywords, fullTitle]);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="keywords" content={keywords || defaultKeys} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Vibhuti Enterprise" />
      
      {/* JSON-LD Schema structured metadata */}
      <script type="application/ld+json">
        {JSON.stringify(schemaJsonLD)}
      </script>
    </Helmet>
  );
}
