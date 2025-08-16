'use client';

import { useEffect } from 'react';
import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import getConfig from './cookie-consent-config';

const CookieConsentComponent = () => {
  useEffect(() => {
    const initCookieConsent = async () => {
      await CookieConsent.run(getConfig());
    };

    initCookieConsent().catch(console.error);
  }, []);

  return <></>;
};

export default CookieConsentComponent;
