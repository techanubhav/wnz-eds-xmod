import { createOptimizedPicture, decorateIcons } from '../../scripts/aem.js';

// Convert a leftover `:icon-name:` text token into an EDS icon span. The
// aem.page pipeline normally does this server-side, but the local html-folder
// dev server serves raw content, so handle it here too (no-op when already a span).
function tokenToIcon(div) {
  const match = div.textContent.trim().match(/^:([a-z0-9-]+):$/i);
  if (match) {
    const span = document.createElement('span');
    span.className = `icon icon-${match[1]}`;
    div.replaceChildren(span);
    return true;
  }
  return false;
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      const isIcon = tokenToIcon(div);
      if (div.children.length === 1 && (div.querySelector('picture') || div.querySelector('.icon') || isIcon)) div.className = 'cards-tile-card-image';
      else div.className = 'cards-tile-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);
  decorateIcons(block);
}
