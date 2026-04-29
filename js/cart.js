/**
 * TCS BIKE — cart.js
 * Gestion complète du panier (localStorage)
 * Compatible V2 commande / export PDF
 */

'use strict';

import { lsGet, lsSet, lsRemove, formatPrice, buildOrder } from './utils.js';
import { updateCartCount, showToast } from './main.js';

const CART_KEY = 'tcs_cart';

/* ── Lecture / écriture ─────────────────────────────────── */
export function getCart() {
  return lsGet(CART_KEY, []);
}

function saveCart(cart) {
  lsSet(CART_KEY, cart);
  updateCartCount();
}

/* ── Ajouter un produit ─────────────────────────────────── */
export function addToCart(product) {
  const cart     = getCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id:       product.id,
      name:     product.name,
      category: product.category,
      price:    product.price,
      quantity: 1,
      image:    product.image
    });
  }

  saveCart(cart);
  showToast(`${product.name} ajouté au panier`);
}

/* ── Supprimer un produit ───────────────────────────────── */
export function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
}

/* ── Modifier la quantité ───────────────────────────────── */
export function updateQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart(cart);
}

/* ── Vider le panier ────────────────────────────────────── */
export function clearCart() {
  lsRemove(CART_KEY);
  updateCartCount();
}

/* ── Totaux ─────────────────────────────────────────────── */
export function getCartTotals() {
  const cart     = getCart();
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 0 && subtotal < 1000 ? 19.90 : 0;
  const total    = subtotal + shipping;
  return { subtotal, shipping, total, count: cart.reduce((n, i) => n + i.quantity, 0) };
}

/* ══════════════════════════════════════════════════════════
   PAGE PANIER — rendu cart.html
   ══════════════════════════════════════════════════════════ */
export function initCartPage() {
  renderCartPage();
}

function renderCartPage() {
  const root = document.getElementById('cart-root');
  if (!root) return;

  const cart   = getCart();
  const totals = getCartTotals();

  if (cart.length === 0) {
    root.innerHTML = `
      <div class="cart-empty" data-reveal>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <h2>Votre panier est vide</h2>
        <p>Découvrez notre sélection de vélos et accessoires premium.</p>
        <a href="catalog.html" class="btn btn-primary btn-lg">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"/><polyline points="9 11 12 14 22 4"/></svg>
          Voir le catalogue
        </a>
      </div>`;
    return;
  }

  root.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items" id="cart-items"></div>
      <aside class="cart-summary" data-reveal data-reveal-delay="2">
        <h2 class="heading-md cart-summary__title">Récapitulatif</h2>
        <div class="cart-summary__row">
          <span>Sous-total</span>
          <span id="summary-subtotal">${formatPrice(totals.subtotal)}</span>
        </div>
        <div class="cart-summary__row">
          <span>Livraison</span>
          <span id="summary-shipping">${totals.shipping === 0 ? '<span class="text-accent">Gratuite</span>' : formatPrice(totals.shipping)}</span>
        </div>
        <div class="cart-summary__row">
          <span class="body-sm text-muted">Livraison offerte dès 1 000 €</span>
          <span></span>
        </div>
        <div class="cart-summary__total">
          <span class="cart-summary__total-label">Total</span>
          <span class="cart-summary__total-price" id="summary-total">${formatPrice(totals.total)}</span>
        </div>
        <div class="cart-summary__actions">
          <button class="btn btn-primary btn-lg" id="btn-checkout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Passer commande
          </button>
          <a href="catalog.html" class="btn btn-outline">Continuer mes achats</a>
          <button class="btn btn-danger" id="btn-clear-cart">Vider le panier</button>
        </div>
      </aside>
    </div>`;

  renderCartItems();
  bindCartEvents();
}

function renderCartItems() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  const cart = getCart();
  container.innerHTML = cart.map(item => `
    <div class="cart-item card" data-id="${item.id}" data-reveal>
      <img class="cart-item__img"
           src="${item.image}"
           alt="${item.name}"
           onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80'">
      <div class="cart-item__info">
        <div class="cart-item__category label">${item.category}</div>
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__price-unit">${formatPrice(item.price)} / unité</div>
      </div>
      <div class="cart-item__actions">
        <span class="cart-item__subtotal">${formatPrice(item.price * item.quantity)}</span>
        <div class="qty-control">
          <button class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Diminuer">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Augmenter">+</button>
        </div>
        <button class="btn btn-danger" data-action="remove" data-id="${item.id}">Supprimer</button>
      </div>
    </div>
  `).join('');

  // Re-trigger reveal
  document.querySelectorAll('[data-reveal]').forEach(el => {
    el.classList.remove('revealed');
    setTimeout(() => el.classList.add('revealed'), 50);
  });
}

function updateSummary() {
  const totals = getCartTotals();
  const subEl  = document.getElementById('summary-subtotal');
  const shipEl = document.getElementById('summary-shipping');
  const totEl  = document.getElementById('summary-total');

  if (subEl)  subEl.textContent  = formatPrice(totals.subtotal);
  if (shipEl) shipEl.innerHTML   = totals.shipping === 0 ? '<span class="text-accent">Gratuite</span>' : formatPrice(totals.shipping);
  if (totEl)  totEl.textContent  = formatPrice(totals.total);
}

function bindCartEvents() {
  const cartItems  = document.getElementById('cart-items');
  const btnClear   = document.getElementById('btn-clear-cart');
  const btnCheckout = document.getElementById('btn-checkout');

  // Délégation d'événements sur les items
  if (cartItems) {
    cartItems.addEventListener('click', (e) => {
      const btn    = e.target.closest('[data-action]');
      if (!btn) return;
      const id     = btn.dataset.id;
      const action = btn.dataset.action;

      if (action === 'inc')    { updateQty(id, +1); }
      if (action === 'dec')    { updateQty(id, -1); }
      if (action === 'remove') { removeFromCart(id); showToast('Produit retiré', 'error'); }

      renderCartItems();
      updateSummary();

      // Panier vide → re-render complet
      if (getCart().length === 0) renderCartPage();
    });
  }

  // Vider
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (confirm('Vider le panier ?')) {
        clearCart();
        renderCartPage();
        showToast('Panier vidé', 'error');
      }
    });
  }

  // Commande (V2 placeholder)
  if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
      const order = buildOrder(getCart());
      console.log('[TCS] Commande préparée :', order);
      showToast('Commande bientôt disponible — V2 en cours 🚀');
      // V2: window.location.href = `checkout.html?order=${order.id}`;
    });
  }
}
