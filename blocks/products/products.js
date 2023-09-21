import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { addElement } from '../../scripts/scripts.js';

async function loadFragment(path) {
  if (path && path.startsWith('/')) {
    const resp = await fetch(`${path}`);
    if (resp.ok) {
      return resp.json();
    }
  }
  return null;
}

export default async function decorate(block) {
  const { search } = window.location;
  let params;

  if (search) {
    const searchParams = new URLSearchParams(search);
    params = Object.fromEntries(searchParams.entries());
  }
  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();
  const products = await loadFragment(`${path}?sheet=${params.activity}`);
  const ul = addElement('ul', { class: 'product-list' });
  products.data.forEach((product) => {
    const li = addElement('li', { class: 'product-item' });
    const div = document.createElement('div');
    const picture = createOptimizedPicture(product.product_thumbnail_url);
    const span = addElement('span', { id: product.product_name }, { innerHTML: `<strong>${product.product_name}</strong>` });
    span.innerHTML += `<p>${product.product_short_description}</p>`;
    span.innerHTML += `<strong class='price'>${product.product_price}</strong>`;
    span.innerHTML += '<p style=\'text-align:center\'><a href=\'#\' class=\'button add2Cart\'>Add to Cart</a></p>';
    span.querySelector('.add2Cart').addEventListener('click', ((e) => {
      alert('You didn\'t actually think I was going to add "Add to Cart" functionality'); // eslint-disable-line no-alert
      e.preventDefault();
    }));
    div.append(picture);
    div.append(span);
    li.append(div);
    ul.append(li);
  });
  link.replaceWith(ul);
}
