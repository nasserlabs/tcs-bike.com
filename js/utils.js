/**
 * TCS BIKE — utils.js
 * Fonctions utilitaires réutilisables
 * Prêt pour V2 (commande, export PDF, bon de commande)
 */

'use strict';

// ─── Format prix ───────────────────────────────────────────
/**
 * Formate un nombre en prix EUR
 * @param {number} amount
 * @returns {string} ex: "1 299 €"
 */
export function formatPrice(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Formate un prix court sans style Intl
 * @param {number} amount
 * @returns {string} ex: "1 299 €"
 */
export function formatPriceShort(amount) {
  return amount.toLocaleString('fr-FR') + ' €';
}

// ─── localStorage helpers ──────────────────────────────────
/**
 * Lit une valeur depuis localStorage (parse JSON)
 * @param {string} key
 * @param {*} fallback valeur par défaut si absent ou erreur
 */
export function lsGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn('[TCS] lsGet error:', e);
    return fallback;
  }
}

/**
 * Sauvegarde une valeur dans localStorage (stringify JSON)
 * @param {string} key
 * @param {*} value
 */
export function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[TCS] lsSet error:', e);
  }
}

/**
 * Supprime une clé du localStorage
 * @param {string} key
 */
export function lsRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('[TCS] lsRemove error:', e);
  }
}

// ─── Génération d'ID commande ──────────────────────────────
/**
 * Génère un numéro de commande unique (V2)
 * Format: TCS-YYYYMMDD-XXXX
 * @returns {string}
 */
export function generateOrderId() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TCS-${date}-${rand}`;
}

// ─── Structure commande (V2 ready) ────────────────────────
/**
 * Construit un objet commande depuis le panier
 * Compatible avec futur checkout.html + export PDF
 * @param {Array} cartItems — tableau d'items panier
 * @param {Object} customerInfo — infos client (V2)
 * @returns {Object} order
 */
export function buildOrder(cartItems, customerInfo = {}) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 1000 ? 0 : 19.90;
  const total = subtotal + shipping;

  return {
    id: generateOrderId(),
    date: new Date().toISOString(),
    customer: customerInfo,
    items: cartItems.map(item => ({
      id:       item.id,
      name:     item.name,
      category: item.category,
      price:    item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
      image:    item.image
    })),
    subtotal,
    shipping,
    total,
    status: 'pending'
  };
}

// ─── Debounce ──────────────────────────────────────────────
/**
 * Debounce une fonction (utile pour recherche live)
 * @param {Function} fn
 * @param {number} delay ms
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ─── Sanitize HTML (sécurité minime) ──────────────────────
/**
 * Échappe les caractères HTML dangereux
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(str).replace(/[&<>"']/g, c => map[c]);
}

// ─── Scroll to element ─────────────────────────────────────
/**
 * Scroll doux vers un élément
 * @param {string|HTMLElement} target — sélecteur ou élément
 */
export function smoothScrollTo(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── Date formatée ─────────────────────────────────────────
/**
 * Formate une date ISO en français
 * @param {string} isoString
 * @returns {string} ex: "29 avril 2025"
 */
export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}
