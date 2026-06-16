/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-tile.
 * Base block: cards
 * Source URL: https://www.westpac.co.nz
 * Generated: 2026-06-16
 *
 * Note: Selector logic verified against the rendered live DOM (10 .tile-item
 * anchors, each with img.tile-item__icon + span.tile-item__cta) and against the
 * cached block-context/cards-tile/source.html. The headless live-validation
 * harness serves a stripped page variant where .tile-block is not rendered, so
 * automatic markdown validation cannot exercise this selector; extraction was
 * confirmed manually instead.
 *
 * Source structure (validated against block-context/cards-tile/source.html):
 *   <div class="tile-block tile-block--columns-five">
 *     <h2 class="tile-block__title">...</h2>            (handled as section defaultContent)
 *     <div class="tile-block__items">
 *       <a class="tile-item" href="...">
 *         <img class="tile-item__icon" src="..." alt="">
 *         <span class="tile-item__cta">Label</span>
 *       </a>
 *       ...
 *     </div>
 *   </div>
 *
 * Target (cards block): one row per card, each row has an image cell and a body cell.
 *   cards.js decorates the single-picture div as the card image and the other div as
 *   the card body, so each card here becomes [icon image, linked label].
 */
export default function parse(element, { document }) {
  // Each tile-item is one card. Fall back to direct children if the wrapper class differs.
  const items = Array.from(
    element.querySelectorAll('.tile-item, .tile-block__items > a'),
  );
  // De-duplicate in case the two selectors overlap on the same anchors.
  const uniqueItems = [...new Set(items)];

  const cells = uniqueItems.map((item) => {
    // Image cell: the tile icon, emitted as an EDS icon token (`:name:`) so it
    // is served from the local /icons/ folder (external SVGs fail EDS image
    // validation). md2html converts the token back into span.icon on render.
    const img = item.querySelector('img.tile-item__icon, img');
    let iconCell = '';
    if (img) {
      const src = img.getAttribute('src') || '';
      const file = src.split('/').pop().replace(/\.svg.*$/i, '');
      if (file) {
        const p = document.createElement('p');
        p.textContent = `:${file}:`;
        iconCell = p;
      }
    }

    // Body cell: a link carrying the CTA label, pointing at the tile's href.
    const href = item.getAttribute('href');
    const labelEl = item.querySelector('.tile-item__cta, span');
    const labelText = (labelEl ? labelEl.textContent : item.textContent).trim();

    const link = document.createElement('a');
    if (href) link.href = href;
    link.textContent = labelText;

    return [iconCell, link];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tile', cells });
  element.replaceWith(block);
}
