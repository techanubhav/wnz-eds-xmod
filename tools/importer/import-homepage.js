/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroDonateParser from './parsers/hero-donate.js';
import cardsTileParser from './parsers/cards-tile.js';
import cardsQuicklinkParser from './parsers/cards-quicklink.js';
import cardsRateParser from './parsers/cards-rate.js';
import columnsPromoParser from './parsers/columns-promo.js';
import tabsSwitchParser from './parsers/tabs-switch.js';
import carouselNewsParser from './parsers/carousel-news.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/westpac-cleanup.js';
import sectionsTransformer from './transformers/westpac-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-donate': heroDonateParser,
  'cards-tile': cardsTileParser,
  'cards-quicklink': cardsQuicklinkParser,
  'cards-rate': cardsRateParser,
  'columns-promo': columnsPromoParser,
  'tabs-switch': tabsSwitchParser,
  'carousel-news': carouselNewsParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Westpac NZ homepage with hero, promotional cards, product highlights, and supporting content sections',
  urls: ['https://www.westpac.co.nz'],
  blocks: [
    { name: 'hero-donate', instances: ['.page-header'] },
    { name: 'cards-tile', instances: ['.tile-block'] },
    { name: 'cards-quicklink', instances: ['.quick-link-block'] },
    { name: 'cards-rate', instances: ['.small-pricing-block'] },
    { name: 'columns-promo', instances: ['.promo-block'] },
    { name: 'tabs-switch', instances: ['.content-switch-block'] },
    { name: 'carousel-news', instances: ['.carousel-block'] },
  ],
  sections: [
    { id: 'hero', name: 'Hero', selector: '.page-header', style: null, blocks: ['hero-donate'], defaultContent: [] },
    { id: 'announcement-banner', name: 'Announcement banner', selector: '.site-banner--announcement', style: 'purple-tint', blocks: [], defaultContent: ['.site-banner--announcement .container'] },
    { id: 'how-can-we-help', name: 'How can we help', selector: '#how-can-we-help', style: null, blocks: ['cards-tile'], defaultContent: ['.tile-block__title'] },
    { id: 'quick-links', name: 'Quick links', selector: '#get-help', style: null, blocks: ['cards-quicklink'], defaultContent: [] },
    { id: 'featured-rates', name: 'Featured rates', selector: '#featured-rates', style: 'pale-grey', blocks: ['cards-rate'], defaultContent: ['.small-pricing-block__title', '.cta-link', '.small-pricing-block__disclaimer'] },
    { id: 'scams-promo', name: 'Scams promo', selector: '#scams', style: 'pink-tint', blocks: ['columns-promo'], defaultContent: [] },
    { id: 'financial-wellbeing', name: 'Financial wellbeing', selector: '#financial-wellb', style: null, blocks: ['tabs-switch'], defaultContent: [] },
    { id: 'news-stories-intro', name: 'News & stories intro', selector: '#news-and-stories', style: 'pale-grey', blocks: [], defaultContent: ['.content-block__title', '.content-block__content'] },
    { id: 'news-stories-carousel', name: 'News & stories carousel', selector: '#news-carousel', style: 'pale-grey', blocks: ['carousel-news'], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY - cleanup runs first, then section breaks/metadata
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform cleanup + section breaks/metadata
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
