/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Westpac NZ site-wide cleanup.
 *
 * Removes non-authorable site chrome (global header/nav, footer, cookie consent,
 * skip links, utility/search widgets) and leftover non-content elements so the
 * import contains only the page-level authorable content under <main>.
 *
 * Selector sources:
 * - The captured DOM (migration-work/cleaned.html) is already trimmed to
 *   <main id="main"> with 9 content <section> elements. None of the selectors
 *   below match anything inside that authorable content — they target the global
 *   shell that wraps it on the live www.westpac.co.nz page (validated against the
 *   live URL), so they are safe.
 * - Standard global chrome elements (header, footer, nav) and common
 *   cookie/skip-link/utility selectors carried by the Westpac NZ site shell.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent / privacy overlays and floating widgets. These can sit
    // above or alongside the page content and must go before block parsing so
    // they never interfere with block matching. None are present in the
    // authorable <main> content of cleaned.html.
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '.optanon-alert-box-wrapper',
      '[id*="CookieBanner"]',
      '[class*="cookie-banner"]',
      '[class*="cookie-notice"]',
      '.cookie-consent',
      '#cookie-policy',
      '[id*="LivePerson"]',
      '[class*="lp-window"]',
      '.chat-widget',
      '[class*="chatbot"]',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome wrapping the page content on the live site.
    // Restricted to global shell elements / utility regions — the authorable
    // content in cleaned.html uses .page-header, .tile-block, .quick-link-block,
    // .small-pricing-block, .promo-block, .content-switch-block, .content-block,
    // and .carousel-block, none of which match the selectors below.
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      '[role="banner"]',
      '[role="navigation"]',
      '[role="contentinfo"]',
      '[class*="site-header"]',
      '[class*="global-header"]',
      '[class*="main-nav"]',
      '[class*="mega-menu"]',
      '[class*="breadcrumb"]',
      '[class*="skip-link"]',
      '.skip-to-content',
      '[class*="site-footer"]',
      '[class*="global-footer"]',
      '[class*="back-to-top"]',
      '[class*="site-search"]',
      '[class*="search-overlay"]',
      'iframe',
      'noscript',
      'script',
      'style',
      'link',
    ]);

    // Strip tracking / behavioural attributes left on any element.
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
      el.removeAttribute('data-tracking');
      el.removeAttribute('data-analytics');
      el.removeAttribute('data-gtm');
    });
  }
}
