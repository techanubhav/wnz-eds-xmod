/*
 * cards-rate — Westpac "Featured rates" pricing cards.
 * Each authored row becomes a card: optional "Special" label, product title (h3),
 * a large rate number with %/p.a. units, a subtitle (h4) and a small description,
 * plus a trailing link that acts as the whole-card CTA.
 */

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const body = document.createElement('div');
    body.className = 'cards-rate-card-body';
    // pull all authored cells' content into a single card body
    [...row.children].forEach((cell) => {
      while (cell.firstChild) body.append(cell.firstChild);
    });

    // mark the optional leading "Special" label (a <p> that precedes the h3 title)
    const firstEl = body.firstElementChild;
    const titleEl = body.querySelector('h3');
    if (firstEl && firstEl.tagName === 'P' && titleEl
      && [...body.children].indexOf(firstEl) < [...body.children].indexOf(titleEl)) {
      firstEl.classList.add('cards-rate-label');
    }

    // group the rate number + %/p.a. units into a single "main" row.
    // pattern: <p>5.09</p><p>%</p><p>p.a.</p>
    const numberP = [...body.children].find((el) => el.tagName === 'P'
      && /^[$£€]?\s*[\d.,]+%?$/.test(el.textContent.trim())
      && el.textContent.trim() !== '');
    if (numberP) {
      const pct = numberP.nextElementSibling;
      const sub = pct ? pct.nextElementSibling : null;
      const main = document.createElement('div');
      main.className = 'cards-rate-main';

      const number = document.createElement('div');
      number.className = 'cards-rate-number';
      number.textContent = numberP.textContent.trim();

      const unit = document.createElement('div');
      unit.className = 'cards-rate-unit';
      if (pct && /^%$/.test(pct.textContent.trim())) {
        const pctEl = document.createElement('span');
        pctEl.className = 'cards-rate-percentage';
        pctEl.textContent = pct.textContent.trim();
        unit.append(pctEl);
      }
      if (sub && /p\.?a\.?/i.test(sub.textContent.trim())) {
        const subEl = document.createElement('span');
        subEl.className = 'cards-rate-subunit';
        subEl.textContent = sub.textContent.trim();
        unit.append(subEl);
      }

      main.append(number);
      if (unit.childElementCount) main.append(unit);

      numberP.replaceWith(main);
      if (pct && unit.querySelector('.cards-rate-percentage')) pct.remove();
      if (sub && unit.querySelector('.cards-rate-subunit')) sub.remove();
    }

    // style title / subtitle / description
    body.querySelector('h3')?.classList.add('cards-rate-title');
    const h4 = body.querySelector('h4');
    h4?.classList.add('cards-rate-subtitle');

    // the trailing link is the card CTA — turn the subtitle into the link text
    const linkP = [...body.children].reverse().find((el) => el.tagName === 'P' && el.querySelector('a'));
    const link = linkP ? linkP.querySelector('a') : null;
    if (link && h4) {
      // reuse the subtitle text as the visible CTA, wrap it in the card link
      const a = document.createElement('a');
      a.href = link.href;
      a.className = 'cards-rate-cta';
      a.append(...h4.childNodes);
      h4.append(a);
      linkP.remove();
    }
    // mark the small description paragraph(s) that remain
    [...body.children].forEach((el) => {
      if (el.tagName === 'P' && !el.classList.contains('cards-rate-label')) {
        el.classList.add('cards-rate-description');
      }
    });

    li.append(body);
    ul.append(li);
  });

  block.replaceChildren(ul);
}
