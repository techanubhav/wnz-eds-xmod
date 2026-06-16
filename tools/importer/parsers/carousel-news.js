/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-news.
 * Base block: carousel
 * Source URL: https://www.westpac.co.nz
 * Generated: 2026-06-16
 *
 * Note: The live URL is behind Akamai bot protection and returns a 403/error
 * page to headless browsers, so the automatic markdown validation harness may
 * report "No results". Selector logic was verified against the cached
 * block-context/carousel-news/source.html (4 .carousel-item anchors) and
 * migration-work/cleaned.html, which are the authoritative sources here.
 *
 * Source structure (validated against block-context/carousel-news/source.html):
 *   <div class="carousel-block">
 *     <div class="carousel-block__items">
 *       <a class="carousel-item carousel-item--type-image" href="/rednews/...">
 *         <div class="carousel-item__image-wrapper">
 *           <img class="carousel-item__image" src="..." alt="...">
 *         </div>
 *         <div class="carousel-item__content">
 *           <h3 class="carousel-item__title">...</h3>
 *           <p class="carousel-item__summary">...</p>
 *         </div>
 *       </a>
 *       ...
 *     </div>
 *   </div>
 *
 * Target (carousel-news block): one row per slide. blocks/carousel-news/carousel-news.js
 * treats each row's first column as the slide image and the second column as the slide
 * content. Each carousel-item is therefore mapped to [image, content], where content holds
 * the heading and summary. The whole source item is an anchor, so the heading is wrapped in
 * a link pointing at the item's href to keep the slide clickable.
 */
export default function parse(element, { document }) {
  // Each carousel-item anchor is one slide. Fall back to direct children of the
  // items wrapper if the item class differs. De-duplicate in case selectors overlap.
  const items = [
    ...new Set(
      Array.from(
        element.querySelectorAll('.carousel-item, .carousel-block__items > a'),
      ),
    ),
  ];

  const cells = items.map((item) => {
    // Image cell: the slide image.
    const image = item.querySelector('img.carousel-item__image, .carousel-item__image-wrapper img, img');

    // Content cell: heading (linked) + summary.
    const href = item.getAttribute('href');
    const titleEl = item.querySelector('.carousel-item__title, h1, h2, h3, h4, h5, h6');
    const summaryEl = item.querySelector('.carousel-item__summary, p');

    const content = [];

    if (titleEl) {
      const titleText = titleEl.textContent.trim();
      const heading = document.createElement(titleEl.tagName.toLowerCase() || 'h3');
      if (href) {
        const link = document.createElement('a');
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-news', cells });
  element.replaceWith(block);
}
