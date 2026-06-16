/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-promo
 * Base block: columns
 * Source URL: https://www.westpac.co.nz
 * Generated: 2026-06-16
 * Validated against live DOM: image (picture) + heading + paragraph + CTA.
 *
 * Source structure (.promo-block on live site):
 *   .promo-block__image-wrap > picture/img        -> image column
 *   .promo-block__content                         -> content column
 *     h2.promo-block__title                       -> heading
 *     p.promo-block__summary (may be empty)        -> summary (skipped if empty)
 *     p (unclassed)                               -> body paragraph
 *     .promo-block__buttons a.btn                 -> CTA(s)
 *
 * Target (columns, two-up): a single row with two columns
 * [imageCell, contentCell]. The `promo-block--right` variant places the image
 * on the right visually; column ordering is handled by the block CSS, so we
 * preserve the source DOM order (image first, content second).
 */
export default function parse(element, { document }) {
  // --- Image column -------------------------------------------------------
  // Prefer a <picture>, then an explicit promo image, then any image inside
  // the image wrapper.
  const picture = element.querySelector('.promo-block__image-wrap picture, picture');
  const image = element.querySelector('.promo-block__image, .promo-block__image-wrap img, img');
  const imageEl = picture || image || element.querySelector('.promo-block__image-wrap');

  // --- Content column -----------------------------------------------------
  const content = element.querySelector('.promo-block__content') || element;

  const heading = content.querySelector('h1, h2, h3, .promo-block__title');

  // All paragraphs in the content area, dropping empty/whitespace-only ones.
  const paragraphs = Array.from(content.querySelectorAll('p'))
    .filter((p) => p.textContent.trim().length > 0);

  // CTAs: links within the buttons wrapper, falling back to any content link.
  let ctaLinks = Array.from(content.querySelectorAll('.promo-block__buttons a'));
  if (ctaLinks.length === 0) {
    ctaLinks = Array.from(content.querySelectorAll('a'));
  }

  // Build the content cell from clean, semantic nodes.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  contentCell.push(...paragraphs);
  contentCell.push(...ctaLinks);

  // Single row, two columns: image | content.
  const cells = [[imageEl, contentCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
