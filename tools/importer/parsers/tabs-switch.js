/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-switch.
 * Base block: tabs
 * Source URL: https://www.westpac.co.nz
 * Generated: 2026-06-16
 *
 * Note: The live URL is protected by Akamai bot protection and returns a 403
 * to headless browsers, so the live-validation harness reports "No results".
 * Selector logic was verified against the cached
 * block-context/tabs-switch/source.html (identical to the .content-switch-block
 * section in migration-work/cleaned.html).
 *
 * Source structure (validated against block-context/tabs-switch/source.html):
 *   <div class="content-switch-block">
 *     <h2 class="content-switch-block__title">Financial wellbeing.</h2>
 *     <h3 class="content-switch-block__label">I want to know more about</h3>
 *     <ul class="content-switch-block__options">
 *       <li>financial hardship</li>
 *       <li>managing my money</li>
 *       <li>managing my home loan</li>
 *     </ul>
 *     <span class="content-switch-block__desc">Take control of your finances ...</span>
 *   </div>
 *
 * The source is a topic-driven content switcher: each <li> in __options is a
 * selectable topic (becomes a tab label) and __desc is the guidance shown when a
 * topic is selected. The live page swaps panel content via JS, so the only
 * panel content present in the source DOM is the shared description.
 *
 * Target (tabs block): first row is the block name; each subsequent row is a
 * single tab with [Tab Label, Tab Content]. Each topic option becomes one tab.
 */
export default function parse(element, { document }) {
  // Topic options become the tab labels. Fall back to any list items inside the
  // block if the options-list class differs.
  const options = Array.from(
    element.querySelectorAll('.content-switch-block__options > li, ul > li'),
  );
  const uniqueOptions = [...new Set(options)];

  // Shared guidance/description shown for a selected topic.
  const desc = element.querySelector('.content-switch-block__desc, p, span');
  const descText = desc ? desc.textContent.trim() : '';

  // Intro label (e.g. "I want to know more about") preceding the options.
  const intro = element.querySelector('.content-switch-block__label, h3');

  const cells = uniqueOptions.map((option, i) => {
    // Tab label cell: the topic text.
    const label = document.createElement('strong');
    label.textContent = option.textContent.trim();

    // Tab content cell: the shared guidance description. Prepend the intro label
    // to the first tab so no source content is dropped.
    const content = [];
    if (i === 0 && intro) {
      const introP = document.createElement('p');
      introP.textContent = intro.textContent.trim();
      content.push(introP);
    }
    if (descText) {
      const descP = document.createElement('p');
      descP.textContent = descText;
      content.push(descP);
    }

    return [label, content];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-switch', cells });
  element.replaceWith(block);
}
