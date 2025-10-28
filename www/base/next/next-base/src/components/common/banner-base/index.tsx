import { BannerConsent, type BannerConsentProps } from './components/banner-consent';
import { BannerDownload, type BannerDownloadProps } from './components/banner-download';
import { BannerRedirect, type BannerRedirectProps } from './components/banner-redirect';

export const BannerBase = {
	Consent: BannerConsent,
	Redirect: BannerRedirect,
	Download: BannerDownload,
};

export type { BannerConsentProps, BannerDownloadProps, BannerRedirectProps };
