import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
}

export function SEO({
  title,
  description,
  canonical,
  type = "website",
  image = "/og-image.jpg" // fallback image if you have one
}: SEOProps) {
  const defaultTitle = "VFRA | Digital Forensics, Cybercrime Investigation & Intelligence Solutions";
  const defaultDesc = "VFRA provides digital forensics, cybercrime investigation support, forensic reporting, intelligence workflows, certificate verification and secure evidence handling for legal professionals, institutions and investigation teams.";
  const siteName = "Vigilant Forensic Research and Analytics Pvt. Ltd.";

  const seoTitle = title ? `${title} | VFRA` : defaultTitle;
  const seoDesc = description || defaultDesc;

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDesc} />
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDesc} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={image} />
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDesc} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
