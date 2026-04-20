
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';

interface SeoHeadProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  canonicalUrl?: string;
  schema?: object | object[];
  noIndex?: boolean;
}

const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  keywords,
  image,
  type = 'website',
  canonicalUrl,
  schema,
  noIndex = false
}) => {
  const { seoSettings, generalSettings } = useData();
  const location = useLocation();
  const baseUrl = seoSettings.baseUrl.replace(/\/$/, '');
  const normalizedTitle = title.trim();
  const fullTitle =
    normalizedTitle === seoSettings.siteTitle
      ? seoSettings.siteTitle
      : `${normalizedTitle} ${seoSettings.titleSeparator} ${seoSettings.siteTitle}`;
  const finalDesc = description || seoSettings.siteDescription;
  const finalKeywords = keywords || seoSettings.siteKeywords;
  const finalImage = image
    ? image.startsWith('http')
      ? image
      : `${baseUrl}${image.startsWith('/') ? image : `/${image}`}`
    : seoSettings.logoUrl;
  const currentUrl = canonicalUrl || `${baseUrl}${location.pathname}`;
  const robotsValue = noIndex ? 'noindex, nofollow' : 'index, follow';

  useEffect(() => {
    document.title = fullTitle;

    const updateMeta = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const updateLink = (rel: string, href: string, extraAttributes?: Record<string, string>) => {
      let element = document.querySelector(`link[rel='${rel}']`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
      if (extraAttributes) {
        Object.entries(extraAttributes).forEach(([key, value]) => {
          element?.setAttribute(key, value);
        });
      }
    };

    updateMeta('robots', robotsValue);
    updateMeta('description', finalDesc);
    updateMeta('keywords', finalKeywords);
    updateMeta('theme-color', '#e8af36');
    updateMeta('format-detection', 'telephone=no');
    updateMeta('og:locale', 'tr_TR', 'property');

    updateMeta('og:title', fullTitle, 'property');
    updateMeta('og:description', finalDesc, 'property');
    updateMeta('og:image', finalImage, 'property');
    updateMeta('og:image:alt', normalizedTitle, 'property');
    updateMeta('og:url', currentUrl, 'property');
    updateMeta('og:type', type, 'property');
    updateMeta('og:site_name', seoSettings.siteTitle, 'property');

    updateMeta('twitter:card', 'summary_large_image', 'name');
    updateMeta('twitter:title', fullTitle, 'name');
    updateMeta('twitter:description', finalDesc, 'name');
    updateMeta('twitter:image', finalImage, 'name');
    updateMeta('twitter:url', currentUrl, 'name');

    updateLink('canonical', currentUrl);
    updateLink('icon', seoSettings.faviconUrl, { type: 'image/svg+xml' });
    updateLink('shortcut icon', seoSettings.faviconUrl);

    let scriptSchema = document.querySelector("#structured-data");
    if (!scriptSchema) {
      scriptSchema = document.createElement('script');
      scriptSchema.id = "structured-data";
      scriptSchema.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptSchema);
    }
    
    const baseSchema: any = {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": seoSettings.siteTitle,
      "image": seoSettings.logoUrl,
      "@id": seoSettings.baseUrl,
      "url": seoSettings.baseUrl,
      "telephone": seoSettings.contactPhone,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": seoSettings.contactAddress,
        "addressLocality": "İstanbul",
        "addressCountry": "TR"
      }
    };

    // Enhance schema with corporate data if available
    if (generalSettings.mersisNo) {
        baseSchema.taxID = generalSettings.mersisNo;
    }
    if (generalSettings.chamberRegistrationNo) {
        baseSchema.identifier = generalSettings.chamberRegistrationNo;
    }
    if (generalSettings.chamberName) {
        baseSchema.memberOf = {
            "@type": "Organization",
            "name": generalSettings.chamberName
        };
    }

    const schemaPayload = schema
      ? Array.isArray(schema)
        ? [baseSchema, ...schema]
        : [baseSchema, schema]
      : baseSchema;

    scriptSchema.textContent = JSON.stringify(schemaPayload);
  }, [fullTitle, normalizedTitle, finalDesc, finalKeywords, finalImage, currentUrl, type, schema, robotsValue, seoSettings, generalSettings]);

  return null;
};

export default SeoHead;
