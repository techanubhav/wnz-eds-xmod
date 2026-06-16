/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Westpac NZ section breaks + section metadata.
 *
 * Driven entirely by payload.template.sections from page-templates.json — it
 * does not hardcode site selectors. For the homepage template there are 9
 * sections, so this inserts:
 *   - one <hr> before each section except the first  (expected: 8)
 *   - one Section Metadata block for each section that has a `style`
 *     (announcement-banner=purple-tint, featured-rates=pale-grey,
 *      scams-promo=pink-tint, news-stories-intro=pale-grey,
 *      news-stories-carousel=pale-grey  => expected: 5)
 *
 * Each section.selector is validated against the captured DOM
 * (migration-work/cleaned.html): .page-header, .site-banner--announcement,
 * #how-can-we-help, #get-help, #featured-rates, #scams, #financial-wellb,
 * #news-and-stories, #news-carousel all resolve to elements on the page.
 *
 * Runs in afterTransform only (blocks are already parsed at this point).
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const template = payload && payload.template;
  const sections = template && Array.isArray(template.sections) ? template.sections : [];
  if (sections.length < 2) return;

  const doc = element.ownerDocument || document;

  // The content root whose direct children are the section boundaries.
  // `element` is typically document.body, whose only child is <main>; using
  // body directly would collapse every section onto the same boundary, so
  // descend into <main> when present.
  const contentRoot = element.querySelector('main') || element;

  // Resolve each section's anchor element from its template selector.
  const resolve = (selector) => {
    if (!selector) return null;
    return contentRoot.querySelector(selector) || doc.querySelector(selector);
  };

  // Find the direct child of contentRoot that contains the resolved anchor,
  // so the <hr> / metadata block is inserted at the section boundary rather
  // than deep inside the section's markup.
  const topLevelFor = (node) => {
    let current = node;
    while (current && current.parentElement && current.parentElement !== contentRoot) {
      current = current.parentElement;
    }
    return current;
  };

  // Process in reverse so insertions don't shift the positions of
  // not-yet-processed sections.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    const anchor = resolve(section.selector);
    if (!anchor) continue;

    const boundary = topLevelFor(anchor);
    if (!boundary || !boundary.parentElement) continue;

    // Section Metadata block for sections that declare a style.
    if (section.style) {
      const metaBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      // Place the metadata block at the end of the section.
      boundary.parentElement.insertBefore(metaBlock, boundary.nextSibling);
    }

    // Section break before every section except the first.
    if (i > 0) {
      const hr = doc.createElement('hr');
      boundary.parentElement.insertBefore(hr, boundary);
    }
  }
}
