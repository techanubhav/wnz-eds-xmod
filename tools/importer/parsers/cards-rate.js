/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-rate.
 * Base block: cards
 * Source URL: https://www.westpac.co.nz (.small-pricing-block)
 * Generated: 2026-06-16
 *
 * Source HTML validated against block-context/cards-rate/source.html.
 * Source structure (validated against block-context/cards-rate/source.html):
 *   <div class="small-pricing-block ...">
 *     <div class="small-pricing-block__left">          (title + CTA -> section defaultContent)
 *     <div class="small-pricing-block__right">
 *       <div class="small-pricing-block__items">
 *         <a class="pricing-card[ pricing-card--special]" href="...">
 *           <p class="pricing-card__special-label">Special</p>   (optional)
 *           <h3 class="pricing-card__title">...</h3>
 *           <div class="pricing-card__main"><span .number/.percentage/.subunit></div>
 *           <h4 class="pricing-card__subtitle">...</h4>
 *           <p class="pricing-card__description">...</p>
 *         </a>
 *         ...
 *       </div>
 *       <div class="small-pricing-block__disclaimer">...</div>   (section defaultContent)
 *     </div>
 *   </div>
 *
 * Target (cards block): one row per pricing card. These rate cards have no
 * image, so each card becomes a single body cell holding its content
 * (special label, title, rate figure, subtitle, description, link).
 */
export default function parse(element, { document }) {
  // Each pricing-card is one card. Fall back to direct children of the items
  // wrapper if the class differs. De-duplicate to handle selector overlap.
  const items = Array.from(
    element.querySelectorAll('.pricing-card, .small-pricing-block__items > a'),
  );
  const uniqueItems = [...new Set(items)];

  const cells = uniqueItems.map((card) => {
    const body = [];

    // Optional "Special" label.
    const specialLabel = card.querySelector('.pricing-card__special-label, [class*="special-label"]');
    if (specialLabel) body.push(specialLabel);

    // Card title.
    const title = card.querySelector('.pricing-card__title, h3, [class*="card__title"]');
    if (title) body.push(title);

    // Main rate figure (number + percentage + unit) kept together.
    const main = card.querySelector('.pricing-card__main, [class*="card__main"]');
    if (main) body.push(main);

    // Subtitle.
    const subtitle = card.querySelector('.pricing-card__subtitle, h4, [class*="card__subtitle"]');
    if (subtitle) body.push(subtitle);

    // Description / fine print.
    const description = card.querySelector('.pricing-card__description, [class*="card__description"]');
    if (description) body.push(description);

    // Preserve the card's destination link.
    const href = card.getAttribute('href');
    if (href) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = (title ? title.textContent : card.textContent).trim() || href;
      body.push(link);
    }

    return [body];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-rate', cells });
  element.replaceWith(block);
}
