import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';

const ScriptInjector: React.FC = () => {
  const { googleSettings } = useData();

  useEffect(() => {
    const removeElement = (id: string) => {
      document.getElementById(id)?.remove();
    };

    const analyticsId = googleSettings.analyticsId.trim();
    const adsConversionId = googleSettings.adsConversionId.trim();
    const primaryTagId = analyticsId || adsConversionId;

    if (!primaryTagId) {
      removeElement('ga-script');
      removeElement('ga-inline');
    } else {
      let script = document.getElementById('ga-script') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = 'ga-script';
        script.async = true;
        document.head.appendChild(script);
      }
      script.src = `https://www.googletagmanager.com/gtag/js?id=${primaryTagId}`;

      let inlineScript = document.getElementById('ga-inline') as HTMLScriptElement | null;
      if (!inlineScript) {
        inlineScript = document.createElement('script');
        inlineScript.id = 'ga-inline';
        document.head.appendChild(inlineScript);
      }

      const configCalls = [analyticsId, adsConversionId]
        .filter(Boolean)
        .map((id) => `gtag('config', '${id}');`)
        .join('\n');

      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        ${configCalls}
      `;
    }

    const verificationMeta = document.querySelector('meta[name="google-site-verification"]');
    const match = googleSettings.searchConsoleMeta.match(/content="([^"]*)"/);

    if (match && match[1]) {
      const meta =
        verificationMeta ||
        (() => {
          const newMeta = document.createElement('meta');
          newMeta.setAttribute('name', 'google-site-verification');
          document.head.appendChild(newMeta);
          return newMeta;
        })();

      meta.setAttribute('content', match[1]);
    } else if (verificationMeta) {
      verificationMeta.remove();
    }
  }, [googleSettings]);

  return null;
};

export default ScriptInjector;
