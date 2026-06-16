/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero-donate
 * Base block: hero
 * Source URL: https://www.westpac.co.nz
 * Generated: 2026-06-16
 *
 * Target structure (see blocks/hero-donate/hero-donate.js):
 *   - Row 1: image cell — the lifestyle/background image (decorate() checks
 *     `:scope > div:first-child picture` to toggle the `no-image` class).
 *   - Row 2: content cell — heading + summary paragraph + CTA link(s).
 */
export default function parse(element, { document }) {
  // Image: lifestyle image lives in .page-header__right; fall back to any img in the header.
  const image = element.querySelector(
    '.page-header__lifestyle-image, .page-header__right img, img',
  );

  // Heading: page-header title; fall back to any heading in the header.
  const heading = element.querySelector(
    '.page-header__title, h1, h2, h3',
  );

  // Summary/lead paragraph.
  const summary = element.querySelector(
    '.page-header__summary, p.lead, .page-header__left p',
  );

  // CTA link(s): one or more donate/learn links.
  const ctaLinks = Array.from(
    element.querySelectorAll('.page-header__links a, .page-header__link'),
  );

  const cells = [];

  // Row 1: image cell (only when an image is present so decorate() can detect it).
  if (image) {
    cells.push([image]);
  }

  // Row 2: content cell with heading, summary, and CTA(s).
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (summary) contentCell.push(summary);
  contentCell.push(...ctaLinks);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-donate',
    cells,
  });

  element.replaceWith(block);
}
