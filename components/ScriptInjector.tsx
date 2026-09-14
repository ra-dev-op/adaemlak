import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';

const ScriptInjector: React.FC = () => {
  const { googleSettings } = useData();

  useEffect(() => {
    const removeElement = (id: string) => {
      document.getElementById(id)?.remove();
    };

    const analyticsId = googleSettings.analyticsId.trim();
    const tagManagerId = googleSettings.tagManagerId?.trim() || '';
    const adsConversionId = googleSettings.adsConversionId.trim();
    const isLegacyUniversalAnalytics = /^UA-\d+-\d+$/i.test(analyticsId);
    const primaryTagId = analyticsId || adsConversionId;

    if (!tagManagerId) {
      removeElement('gtm-script');
      removeElement('gtm-noscript');
    } else {
      let gtmScript = document.getElementById('gtm-script') as HTMLScriptElement | null;
      if (!gtmScript) {
        gtmScript = document.createElement('script');
        gtmScript.id = 'gtm-script';
        document.head.appendChild(gtmScript);
      }
      gtmScript.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${tagManagerId}');
      `;

      let gtmNoScript = document.getElementById('gtm-noscript') as HTMLElement | null;
      if (!gtmNoScript) {
        gtmNoScript = document.createElement('noscript');
        gtmNoScript.id = 'gtm-noscript';
        document.body.prepend(gtmNoScript);
      }
      gtmNoScript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${tagManagerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    }

    if (!primaryTagId) {
      removeElement('ga-script');
      removeElement('ga-inline');
      removeElement('ga-legacy');
    } else if (isLegacyUniversalAnalytics) {
      removeElement('ga-script');
      removeElement('ga-inline');

      let legacyScript = document.getElementById('ga-legacy') as HTMLScriptElement | null;
      if (!legacyScript) {
        legacyScript = document.createElement('script');
        legacyScript.id = 'ga-legacy';
        document.head.appendChild(legacyScript);
      }
      legacyScript.innerHTML = `
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        ga('create', '${analyticsId}', 'auto');
        ga('send', 'pageview');
      `;
    } else {
      removeElement('ga-legacy');

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
    const verificationValue = (() => {
      const rawValue = googleSettings.searchConsoleMeta.trim();
      const contentMatch = rawValue.match(/content=["']([^"']*)["']/);
      const assignmentMatch = rawValue.match(/google-site-verification=([^\s"'<>]+)/);

      return contentMatch?.[1] || assignmentMatch?.[1] || (!rawValue.includes('<') ? rawValue : '');
    })();

    if (verificationValue) {
      const meta =
        verificationMeta ||
        (() => {
          const newMeta = document.createElement('meta');
          newMeta.setAttribute('name', 'google-site-verification');
          document.head.appendChild(newMeta);
          return newMeta;
        })();

      meta.setAttribute('content', verificationValue);
    } else if (verificationMeta) {
      verificationMeta.remove();
    }
  }, [googleSettings]);

  return null;
};

export default ScriptInjector;
