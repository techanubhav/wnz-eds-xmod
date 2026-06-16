/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-donate.js
  function parse(element, { document: document2 }) {
    const image = element.querySelector(
      ".page-header__lifestyle-image, .page-header__right img, img"
    );
    const heading = element.querySelector(
      ".page-header__title, h1, h2, h3"
    );
    const summary = element.querySelector(
      ".page-header__summary, p.lead, .page-header__left p"
    );
    const ctaLinks = Array.from(
      element.querySelectorAll(".page-header__links a, .page-header__link")
    );
    const cells = [];
    if (image) {
      cells.push([image]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (summary) contentCell.push(summary);
    contentCell.push(...ctaLinks);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "hero-donate",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-tile.js
  function parse2(element, { document: document2 }) {
    const items = Array.from(
      element.querySelectorAll(".tile-item, .tile-block__items > a")
    );
    const uniqueItems = [...new Set(items)];
    const cells = uniqueItems.map((item) => {
      const icon = item.querySelector("img.tile-item__icon, img");
      const href = item.getAttribute("href");
      const labelEl = item.querySelector(".tile-item__cta, span");
      const labelText = (labelEl ? labelEl.textContent : item.textContent).trim();
      const link = document2.createElement("a");
      if (href) link.href = href;
      link.textContent = labelText;
      return [icon, link];
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-tile", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-quicklink.js
  function parse3(element, { document: document2 }) {
    const itemsWrapper = element.querySelector(".quick-link-block__items") || element;
    const items = Array.from(itemsWrapper.querySelectorAll(":scope > a.quick-link-item, :scope > a"));
    const cells = [];
    items.forEach((item) => {
      const icon = item.querySelector("img.quick-link-item__icon, img");
      const label = item.querySelector(".quick-link-item__text, span");
      const href = item.getAttribute("href");
      const link = document2.createElement("a");
      if (href) link.setAttribute("href", href);
      link.textContent = (label ? label.textContent : item.textContent).trim();
      const imageCell = icon || "";
      const bodyCell = link;
      cells.push([imageCell, bodyCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-quicklink", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-rate.js
  function parse4(element, { document: document2 }) {
    const items = Array.from(
      element.querySelectorAll(".pricing-card, .small-pricing-block__items > a")
    );
    const uniqueItems = [...new Set(items)];
    const cells = uniqueItems.map((card) => {
      const body = [];
      const specialLabel = card.querySelector('.pricing-card__special-label, [class*="special-label"]');
      if (specialLabel) body.push(specialLabel);
      const title = card.querySelector('.pricing-card__title, h3, [class*="card__title"]');
      if (title) body.push(title);
      const main = card.querySelector('.pricing-card__main, [class*="card__main"]');
      if (main) body.push(main);
      const subtitle = card.querySelector('.pricing-card__subtitle, h4, [class*="card__subtitle"]');
      if (subtitle) body.push(subtitle);
      const description = card.querySelector('.pricing-card__description, [class*="card__description"]');
      if (description) body.push(description);
      const href = card.getAttribute("href");
      if (href) {
        const link = document2.createElement("a");
        link.href = href;
        link.textContent = (title ? title.textContent : card.textContent).trim() || href;
        body.push(link);
      }
      return [body];
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-rate", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse5(element, { document: document2 }) {
    const picture = element.querySelector(".promo-block__image-wrap picture, picture");
    const image = element.querySelector(".promo-block__image, .promo-block__image-wrap img, img");
    const imageEl = picture || image || element.querySelector(".promo-block__image-wrap");
    const content = element.querySelector(".promo-block__content") || element;
    const heading = content.querySelector("h1, h2, h3, .promo-block__title");
    const paragraphs = Array.from(content.querySelectorAll("p")).filter((p) => p.textContent.trim().length > 0);
    let ctaLinks = Array.from(content.querySelectorAll(".promo-block__buttons a"));
    if (ctaLinks.length === 0) {
      ctaLinks = Array.from(content.querySelectorAll("a"));
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    contentCell.push(...paragraphs);
    contentCell.push(...ctaLinks);
    const cells = [[imageEl, contentCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-switch.js
  function parse6(element, { document: document2 }) {
    const options = Array.from(
      element.querySelectorAll(".content-switch-block__options > li, ul > li")
    );
    const uniqueOptions = [...new Set(options)];
    const desc = element.querySelector(".content-switch-block__desc, p, span");
    const descText = desc ? desc.textContent.trim() : "";
    const intro = element.querySelector(".content-switch-block__label, h3");
    const cells = uniqueOptions.map((option, i) => {
      const label = document2.createElement("strong");
      label.textContent = option.textContent.trim();
      const content = [];
      if (i === 0 && intro) {
        const introP = document2.createElement("p");
        introP.textContent = intro.textContent.trim();
        content.push(introP);
      }
      if (descText) {
        const descP = document2.createElement("p");
        descP.textContent = descText;
        content.push(descP);
      }
      return [label, content];
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-switch", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-news.js
  function parse7(element, { document: document2 }) {
    const items = [
      ...new Set(
        Array.from(
          element.querySelectorAll(".carousel-item, .carousel-block__items > a")
        )
      )
    ];
    const cells = items.map((item) => {
      const image = item.querySelector("img.carousel-item__image, .carousel-item__image-wrapper img, img");
      const href = item.getAttribute("href");
      const titleEl = item.querySelector(".carousel-item__title, h1, h2, h3, h4, h5, h6");
      const summaryEl = item.querySelector(".carousel-item__summary, p");
      const content = [];
      if (titleEl) {
        const titleText = titleEl.textContent.trim();
        const heading = document2.createElement(titleEl.tagName.toLowerCase() || "h3");
        if (href) {
          const link = document2.createElement("a");
          link.href = href;
          link.textContent = titleText;
          heading.append(link);
        } else {
          heading.textContent = titleText;
        }
        content.push(heading);
      }
      if (summaryEl) content.push(summaryEl);
      return [image, content];
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/westpac-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        ".optanon-alert-box-wrapper",
        '[id*="CookieBanner"]',
        '[class*="cookie-banner"]',
        '[class*="cookie-notice"]',
        ".cookie-consent",
        "#cookie-policy",
        '[id*="LivePerson"]',
        '[class*="lp-window"]',
        ".chat-widget",
        '[class*="chatbot"]'
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        '[role="banner"]',
        '[role="navigation"]',
        '[role="contentinfo"]',
        '[class*="site-header"]',
        '[class*="global-header"]',
        '[class*="main-nav"]',
        '[class*="mega-menu"]',
        '[class*="breadcrumb"]',
        '[class*="skip-link"]',
        ".skip-to-content",
        '[class*="site-footer"]',
        '[class*="global-footer"]',
        '[class*="back-to-top"]',
        '[class*="site-search"]',
        '[class*="search-overlay"]',
        "iframe",
        "noscript",
        "script",
        "style",
        "link"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("onclick");
        el.removeAttribute("data-track");
        el.removeAttribute("data-tracking");
        el.removeAttribute("data-analytics");
        el.removeAttribute("data-gtm");
      });
    }
  }

  // tools/importer/transformers/westpac-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;
    const doc = element.ownerDocument || document;
    const contentRoot = element.querySelector("main") || element;
    const resolve = (selector) => {
      if (!selector) return null;
      return contentRoot.querySelector(selector) || doc.querySelector(selector);
    };
    const topLevelFor = (node) => {
      let current = node;
      while (current && current.parentElement && current.parentElement !== contentRoot) {
        current = current.parentElement;
      }
      return current;
    };
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const anchor = resolve(section.selector);
      if (!anchor) continue;
      const boundary = topLevelFor(anchor);
      if (!boundary || !boundary.parentElement) continue;
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        boundary.parentElement.insertBefore(metaBlock, boundary.nextSibling);
      }
      if (i > 0) {
        const hr = doc.createElement("hr");
        boundary.parentElement.insertBefore(hr, boundary);
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-donate": parse,
    "cards-tile": parse2,
    "cards-quicklink": parse3,
    "cards-rate": parse4,
    "columns-promo": parse5,
    "tabs-switch": parse6,
    "carousel-news": parse7
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Westpac NZ homepage with hero, promotional cards, product highlights, and supporting content sections",
    urls: ["https://www.westpac.co.nz"],
    blocks: [
      { name: "hero-donate", instances: [".page-header"] },
      { name: "cards-tile", instances: [".tile-block"] },
      { name: "cards-quicklink", instances: [".quick-link-block"] },
      { name: "cards-rate", instances: [".small-pricing-block"] },
      { name: "columns-promo", instances: [".promo-block"] },
      { name: "tabs-switch", instances: [".content-switch-block"] },
      { name: "carousel-news", instances: [".carousel-block"] }
    ],
    sections: [
      { id: "hero", name: "Hero", selector: ".page-header", style: null, blocks: ["hero-donate"], defaultContent: [] },
      { id: "announcement-banner", name: "Announcement banner", selector: ".site-banner--announcement", style: "purple-tint", blocks: [], defaultContent: [".site-banner--announcement .container"] },
      { id: "how-can-we-help", name: "How can we help", selector: "#how-can-we-help", style: null, blocks: ["cards-tile"], defaultContent: [".tile-block__title"] },
      { id: "quick-links", name: "Quick links", selector: "#get-help", style: null, blocks: ["cards-quicklink"], defaultContent: [] },
      { id: "featured-rates", name: "Featured rates", selector: "#featured-rates", style: "pale-grey", blocks: ["cards-rate"], defaultContent: [".small-pricing-block__title", ".cta-link", ".small-pricing-block__disclaimer"] },
      { id: "scams-promo", name: "Scams promo", selector: "#scams", style: "pink-tint", blocks: ["columns-promo"], defaultContent: [] },
      { id: "financial-wellbeing", name: "Financial wellbeing", selector: "#financial-wellb", style: null, blocks: ["tabs-switch"], defaultContent: [] },
      { id: "news-stories-intro", name: "News & stories intro", selector: "#news-and-stories", style: "pale-grey", blocks: [], defaultContent: [".content-block__title", ".content-block__content"] },
      { id: "news-stories-carousel", name: "News & stories carousel", selector: "#news-carousel", style: "pale-grey", blocks: ["carousel-news"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
