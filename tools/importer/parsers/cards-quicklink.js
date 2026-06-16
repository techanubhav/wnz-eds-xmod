/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-quicklink
 * Base block: cards
 * Source URL: https://www.westpac.co.nz
 * Generated: 2026-06-16
 *
 * Source structure (validated against
 * migration-work/block-context/cards-quicklink/source.html):
 *   .quick-link-block > .quick-link-block__items > a.quick-link-item
 *     > img.quick-link-item__icon + span.quick-link-item__text
 *
 * Target (cards block): one row per card. Each card has an image cell
 * (the icon, rendered as card-image) and a body cell (the linked label).
 */
export default function parse(element, { document }) {
  // Each quick-link item becomes a card row.
  // Scope strictly to the items wrapper so unrelated anchors (e.g. login menu
  // links elsewhere on the page) are never picked up.
  const itemsWrapper = element.querySelector('.quick-link-block__items') || element;
  const items = Array.from(itemsWrapper.querySelectorAll(':scope > a.quick-link-item, :scope > a'));

  const cells = [];

  items.forEach((item) => {
    // Image cell: the icon image. The cards block treats a cell with only a
    // picture/img as the card image.
    const icon = item.querySelector('img.quick-link-item__icon, img');

    // Body cell: a link wrapping the label text, preserving the destination.
    const label = item.querySelector('.quick-link-item__text, span');
    const href = item.getAttribute('href');

    const link = document.createElement('a');
    if (href) link.setAttribute('href', href);
    link.textContent = (label ? label.textContent : item.textContent).trim();

    const imageCell = icon || '';
    const bodyCell = link;

    cells.push([imageCell, bodyCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-quicklink', cells });
  element.replaceWith(block);
}
