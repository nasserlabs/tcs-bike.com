/**
 * TCS BIKE — catalog.js
 * Données produits + rendu dynamique + filtres
 */

'use strict';

import { formatPrice, debounce } from './utils.js';
import { addToCart } from './cart.js';

/* ══════════════════════════════════════════════════════════
   CATALOGUE PRODUITS
   ══════════════════════════════════════════════════════════ */
export const PRODUCTS = [
  // ── Vélos de route ──────────────────────────────────────
  {
    id: 'vr-001',
    name: 'Aero Race Pro',
    category: 'Vélo de route',
    price: 3490,
    badge: 'Nouveau',
    desc: 'Cadre carbone full aero, groupe Shimano Ultegra Di2, roues 50mm.',
    image: 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=600&q=80',
    featured: true
  },
  {
    id: 'vr-002',
    name: 'Endurance SL',
    category: 'Vélo de route',
    price: 2190,
    badge: null,
    desc: 'Géométrie confort longue distance, Shimano 105 12v, fourche carbone.',
    image: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=600&q=80',
    featured: true
  },
  {
    id: 'vr-003',
    name: 'Sprint X Carbon',
    category: 'Vélo de route',
    price: 4850,
    badge: 'Top vente',
    desc: 'Compétition pure. Cadre UD carbon, Shimano Dura-Ace, poids 7,1 kg.',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80',
    featured: false
  },
  {
    id: 'vr-004',
    name: 'Gran Fondo',
    category: 'Vélo de route',
    price: 1590,
    badge: null,
    desc: 'Polyvalent, confortable, idéal pour les sorties du week-end.',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600&q=80',
    featured: false
  },

  // ── VTT ─────────────────────────────────────────────────
  {
    id: 'vtt-001',
    name: 'Trail Shredder',
    category: 'VTT',
    price: 2890,
    badge: 'Nouveau',
    desc: 'Full-suspension 29", débattement 140mm, SRAM GX Eagle 12v.',
    image: 'https://images.unsplash.com/photo-1544191696-15693072e0d6?w=600&q=80',
    featured: true
  },
  {
    id: 'vtt-002',
    name: 'Enduro Beast',
    category: 'VTT',
    price: 4200,
    badge: null,
    desc: 'Race enduro, 160mm de débattement, RockShox Super Deluxe.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    featured: false
  },
  {
    id: 'vtt-003',
    name: 'XC Rocket',
    category: 'VTT',
    price: 1990,
    badge: null,
    desc: 'Cross-country, rigide aluminium, Shimano SLX 12v, fourche 100mm.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80',
    featured: false
  },

  // ── Vélo de ville ────────────────────────────────────────
  {
    id: 'vv-001',
    name: 'Urban Cruiser',
    category: 'Vélo de ville',
    price: 890,
    badge: null,
    desc: 'Confort urbain, garde-boue intégrés, porte-bagage, 7 vitesses.',
    image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&q=80',
    featured: true
  },
  {
    id: 'vv-002',
    name: 'Commuter E',
    category: 'Vélo de ville',
    price: 1750,
    badge: 'Promo',
    badgeType: 'promo',
    desc: 'Vélo électrique urban, autonomie 80km, moteur Bosch Active.',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80',
    featured: false
  },

  // ── Accessoires ──────────────────────────────────────────
  {
    id: 'acc-001',
    name: 'Casque Aero TCS',
    category: 'Accessoires',
    price: 189,
    badge: null,
    desc: 'Certifié CE, ventilation optimale, visière intégrée amovible.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    featured: false
  },
  {
    id: 'acc-002',
    name: 'Kit Pédales SPD',
    category: 'Accessoires',
    price: 95,
    badge: null,
    desc: 'Pédales double face SPD + chaussures vélo route incluses.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80',
    featured: false
  },
  {
    id: 'acc-003',
    name: 'Compteur GPS Pro',
    category: 'Accessoires',
    price: 249,
    badge: null,
    desc: 'GPS couleur, cartographie, capteur cadence + fréquence cardiaque.',
    image: 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=600&q=80',
    featured: false
  },
  {
    id: 'acc-004',
    name: 'Cuissard Comp',
    category: 'Accessoires',
    price: 75,
    badge: 'Promo',
    badgeType: 'promo',
    desc: 'Chamois premium 8h, bretelles silicone, tissu respirant.',
    image: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=600&q=80',
    featured: false
  },

  // ── Entretien ────────────────────────────────────────────
  {
    id: 'ent-001',
    name: 'Kit Entretien Complet',
    category: 'Entretien',
    price: 55,
    badge: null,
    desc: 'Dégraissant, lubrifiant chaîne, cire, chiffons microfibres.',
    image: 'https://images.unsplash.com/photo-1544191696-15693072e0d6?w=600&q=80',
    featured: false
  },
  {
    id: 'ent-002',
    name: 'Outillage Pro',
    category: 'Entretien',
    price: 129,
    badge: null,
    desc: 'Trousse d\'outils complète pour mécanicien amateur ou pro.',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80',
    featured: false
  }
];

/* ── Catégories uniques ─────────────────────────────────── */
export const CATEGORIES = ['Tous', ...new Set(PRODUCTS.map(p => p.category))];

/* ── Prix max ─────────────────────────────────────────────── */
export const PRICE_RANGES = [
  { label: 'Tous les prix', max: Infinity },
  { label: 'Moins de 200 €',  max: 200 },
  { label: 'Moins de 500 €',  max: 500 },
  { label: 'Moins de 2 000 €', max: 2000 },
  { label: 'Plus de 2 000 €', min: 2000 }
];

/* ══════════════════════════════════════════════════════════
   PAGE CATALOGUE — rendu
   ══════════════════════════════════════════════════════════ */
let activeCategory = 'Tous';
let activePriceMax = Infinity;
let activePriceMin = 0;
let searchQuery    = '';

export function initCatalogPage() {
  renderFilters();
  renderProducts();
}

/* ── Filtres ────────────────────────────────────────────── */
function renderFilters() {
  // Tags catégories
  const tagsContainer = document.getElementById('filter-tags');
  if (tagsContainer) {
    tagsContainer.innerHTML = CATEGORIES.map(cat => `
      <button class="filter-tag ${cat === 'Tous' ? 'active' : ''}" data-cat="${cat}">${cat}</button>
    `).join('');

    tagsContainer.addEventListener('click', e => {
      const btn = e.target.closest('.filter-tag');
      if (!btn) return;
      activeCategory = btn.dataset.cat;
      tagsContainer.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts();
    });
  }

  // Select prix
  const priceSelect = document.getElementById('filter-price');
  if (priceSelect) {
    priceSelect.innerHTML = PRICE_RANGES.map((r, i) => `<option value="${i}">${r.label}</option>`).join('');
    priceSelect.addEventListener('change', () => {
      const range = PRICE_RANGES[priceSelect.value];
      activePriceMax = range.max ?? Infinity;
      activePriceMin = range.min ?? 0;
      renderProducts();
    });
  }

  // Recherche texte
  const searchInput = document.getElementById('filter-search');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      searchQuery = searchInput.value.trim().toLowerCase();
      renderProducts();
    }, 250));
  }
}

/* ── Rendu produits ─────────────────────────────────────── */
function renderProducts() {
  const grid = document.getElementById('products-grid');
  const countEl = document.getElementById('result-count');
  if (!grid) return;

  const filtered = PRODUCTS.filter(p => {
    const matchCat  = activeCategory === 'Tous' || p.category === activeCategory;
    const matchMin  = p.price >= activePriceMin;
    const matchMax  = p.price <= activePriceMax;
    const matchSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery) ||
      p.desc.toLowerCase().includes(searchQuery);
    return matchCat && matchMin && matchMax && matchSearch;
  });

  if (countEl) countEl.textContent = `${filtered.length} produit${filtered.length > 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results" style="grid-column:1/-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p>Aucun produit trouvé</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => productCardHTML(p)).join('');

  // Bind add to cart
  grid.querySelectorAll('.product-card__add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.closest('[data-product-id]').dataset.productId;
      const product = PRODUCTS.find(p => p.id === id);
      if (product) addToCart(product);
    });
  });

  // Scroll reveal
  grid.querySelectorAll('[data-reveal]').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 0.07}s`;
    setTimeout(() => el.classList.add('revealed'), 50);
  });
}

/* ── HTML carte produit ─────────────────────────────────── */
export function productCardHTML(p) {
  const badgeHTML = p.badge
    ? `<span class="product-card__badge ${p.badgeType === 'promo' ? 'product-card__badge--promo' : ''}">${p.badge}</span>`
    : '';

  return `
    <article class="product-card card" data-product-id="${p.id}" data-reveal>
      <div class="product-card__image-wrap">
        <img class="product-card__image" src="${p.image}" alt="${p.name}"
             loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'">
        ${badgeHTML}
      </div>
      <div class="product-card__body">
        <div class="product-card__category label">${p.category}</div>
        <h3 class="product-card__name">${p.name}</h3>
        <p class="product-card__desc">${p.desc}</p>
        <div class="product-card__footer">
          <span class="product-card__price">${formatPrice(p.price)}</span>
          <button class="product-card__add" aria-label="Ajouter au panier">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Ajouter
          </button>
        </div>
      </div>
    </article>`;
}
