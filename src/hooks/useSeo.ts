import { useEffect } from "react";

interface SeoConfig {
  title: string;
  description: string;
  path: string;
  image?: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

const setMeta = (key: string, attr: "name" | "property", value: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

export function useSeo({
  title,
  description,
  path,
  image,
  structuredData,
}: SeoConfig) {
  useEffect(() => {
    const baseUrl = "https://novaris.app";
    const canonicalUrl = `${baseUrl}${path}`;

    document.title = title;

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    setMeta("description", "name", description);
    setMeta("og:type", "property", "website");
    setMeta("og:site_name", "property", "Novaris");
    setMeta("og:title", "property", title);
    setMeta("og:description", "property", description);
    setMeta("og:url", "property", canonicalUrl);
    setMeta("twitter:card", "name", "summary_large_image");
    setMeta("twitter:title", "name", title);
    setMeta("twitter:description", "name", description);

    if (image) {
      const imageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;
      setMeta("og:image", "property", imageUrl);
      setMeta("twitter:image", "name", imageUrl);
    }

    const scriptId = "novaris-route-jsonld";
    const previous = document.getElementById(scriptId);
    if (previous) {
      previous.remove();
    }

    if (structuredData) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [title, description, path, image, structuredData]);
}
