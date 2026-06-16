/**
 * Applies authored section metadata (e.g. style) to the parent section.
 * The standard EDS aem.js consumes "Section Metadata" tables during
 * decorateSections; this minimal scaffold does not, so this block applies
 * the style class to its containing section and removes itself from view.
 * @param {Element} block The section-metadata block element
 */
export default function decorate(block) {
  const section = block.closest('.section');
  if (section) {
    [...block.children].forEach((row) => {
      const cells = row.children;
      if (cells.length < 2) return;
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].textContent.trim();
      if (key === 'style' && value) {
        value.split(',').forEach((style) => {
          const cls = style.trim().replace(/\s+/g, '-').toLowerCase();
          if (cls) section.classList.add(cls);
        });
      } else if (key) {
        section.dataset[key] = value;
      }
    });
  }
  block.remove();
}
