import { getEnabledAnalyticsConfig, hasEnabledAnalyticsConfig } from "@microboat/web/config/analytics";
import type { CookieConsentConfig } from "vanilla-cookieconsent";

const getConfig = () => {
	const enabledAnalytics = getEnabledAnalyticsConfig();
	const hasAnalytics = hasEnabledAnalyticsConfig();

	// Build services object dynamically based on enabled analytics
	const analyticsServices: Record<string, any> = {};

	enabledAnalytics.forEach((provider) => {
		analyticsServices[provider.id] = {
			label: provider.label,
			onAccept: provider.onAccept,
		};
	});

	const config: CookieConsentConfig = {
		// root: 'body',
		// autoShow: true,
		// disablePageInteraction: true,
		// hideFromBots: true,
		// mode: 'opt-in',
		// revision: 0,

		cookie: {
			// name: 'cc_cookie',
			// domain: location.hostname,
			// path: '/',
			// sameSite: "Lax",
			// expiresAfterDays: 365,
		},

		/**
		 * Callback functions
		 */
		onFirstConsent: ({ cookie }) => {
			console.log("onFirstConsent fired", cookie);
		},

		onConsent: ({ cookie }) => {
			console.log("onConsent fired!", cookie);
		},

		onChange: ({ changedCategories, changedServices }) => {
			console.log("onChange fired!", changedCategories, changedServices);
		},

		onModalReady: ({ modalName }) => {
			console.log("ready:", modalName);
		},

		onModalShow: ({ modalName }) => {
			console.log("visible:", modalName);
		},

		onModalHide: ({ modalName }) => {
			console.log("hidden:", modalName);
		},

		// https://cookieconsent.orestbida.com/reference/configuration-reference.html#guioptions
		guiOptions: {
			consentModal: {
				layout: "box",
				position: "bottom left",
				equalWeightButtons: true,
				flipButtons: false,
			},
			preferencesModal: {
				layout: "box",
				equalWeightButtons: true,
				flipButtons: false,
			},
		},

		categories: {
			necessary: {
				enabled: true, // this category is enabled by default
				readOnly: true, // this category cannot be disabled
			},
			...(hasAnalytics && {
				analytics: {
					autoClear: {
						cookies: [
							{
								name: /^_ga/, // regex: match all cookies starting with '_ga'
							},
							{
								name: "_gid", // string: exact cookie name
							},
							{
								name: "__plausible", // Plausible cookies
							},
						],
					},
					// https://cookieconsent.orestbida.com/reference/configuration-reference.html#category-services
					services: analyticsServices,
				},
			}),
			ads: {},
		},

		language: {
			default: "en",
			translations: {
				en: {
					consentModal: {
						title: "We use cookies",
						description:
							"We use cookies to ensure you get the best experience on our website.",
						acceptAllBtn: "Accept all",
						acceptNecessaryBtn: "Reject all",
						showPreferencesBtn: "Manage Individual preferences",
						// closeIconLabel: 'Reject all and close modal',
						footer: `
                        <a href="/legal/terms-of-service" target="_blank">Terms of Service</a>
                        <a href="/legal/privacy-policy" target="_blank">Privacy Policy</a>
                    `,
					},
					preferencesModal: {
						title: "Manage cookie preferences",
						acceptAllBtn: "Accept all",
						acceptNecessaryBtn: "Reject all",
						savePreferencesBtn: "Accept current selection",
						closeIconLabel: "Close modal",
						serviceCounterLabel: "Service|Services",
						sections: [
							{
								title: "Your Privacy Choices",
								description:
									"In this panel you can express some preferences related to the processing of your personal information. You may review and change expressed choices at any time by resurfacing this panel via the provided link. To deny your consent to the specific processing activities described below, switch the toggles to off or use the 'Reject all' button and confirm you want to save your choices.",
							},
							{
								title: "Strictly Necessary",
								description:
									"These cookies are essential for the proper functioning of the website and cannot be disabled.",

								//this field will generate a toggle linked to the 'necessary' category
								linkedCategory: "necessary",
							},
							...(hasAnalytics
								? [
										{
											title: "Performance and Analytics",
											description:
												"These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.",
											linkedCategory: "analytics",
											cookieTable: {
												caption: "Cookie table",
												headers: {
													name: "Cookie",
													domain: "Domain",
													desc: "Description",
												},
												body: [
													...(enabledAnalytics.find(p => p.id === 'google')
														? [
																{
																	name: "_ga",
																	domain: location.hostname,
																	desc: "Google Analytics",
																},
															]
														: []),
													...(enabledAnalytics.find(p => p.id === 'umami')
														? [
																{
																	name: "umami",
																	domain: location.hostname,
																	desc: "Umami Analytics cookies",
																},
															]
														: []),
													...(enabledAnalytics.find(p => p.id === 'plausible')
														? [
																{
																	name: "__plausible",
																	domain: location.hostname,
																	desc: "Plausible Analytics cookies",
																},
															]
														: []),
												],
											},
										},
									]
								: []),
							{
								title: "Targeting and Advertising",
								description:
									"These cookies are used to make advertising messages more relevant to you and your interests. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers.",
								linkedCategory: "ads",
							},
							{
								title: "More information",
								description:
									'For any queries in relation to my policy on cookies and your choices, please see our <a href="/legal/privacy-policy" target="_blank">Privacy Policy</a> page.',
							},
						],
					},
				},
			},
		},
	};

	return config;
};

export default getConfig;
