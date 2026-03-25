// import { PRODUCTS } from "./products-data.js";
let PRODUCTS = [];
const API_URL = "http://localhost:3001/api"; // To be updated to Railway URL later


/* ========= LIKES (Favoris) ========= */
function loadLikes() {
  try {
    return JSON.parse(localStorage.getItem("thobe_likes") || "[]");
  } catch {
    return [];
  }
}
function saveLikes(list) {
  localStorage.setItem("thobe_likes", JSON.stringify(list));
}
function isLiked(id) {
  return loadLikes().includes(id);
}
function toggleLike(id) {
  const likes = loadLikes();
  const i = likes.indexOf(id);
  if (i >= 0) likes.splice(i, 1);
  else likes.push(id);
  saveLikes(likes);
}
function renderLikesCount() {
  const el = document.getElementById("favCount");
  if (!el) return;
  el.textContent = String(loadLikes().length);
}

const WHATSAPP_PHONE = "212661935547";

function formatMAD(n) {
  return `${n} MAD`;
}

function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("cat");
}

function productCardHTML(p) {
  const liked = isLiked(p.id);

  return `
    <article class="card product-card">
      <div class="card-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy">

        <!-- ❤️ Like overlay -->
        <button class="like-btn ${liked ? "liked" : ""}" type="button" data-like="${p.id}" aria-label="J'aime">
          <svg viewBox="0 0 24 24" class="like-icon" aria-hidden="true" style="overflow:visible">
  <path class="like-path"
    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
       2 6 4 4 6.5 4
       8.24 4 9.91 4.81 11 6.09
       12.09 4.81 13.76 4 15.5 4
       18 4 20 6 20 8.5
       20 12.28 16.6 15.36 13.45 20.03
       L12 21.35Z"
    fill="none"
    stroke="currentColor"
    stroke-width="1.9"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>

            <path class="like-path"
              d="M12 21s-7.5-4.9-9.8-9.6C0.8 8.2 3.1 5.5 6.2 5.5c1.9 0 3.4 1 4.2 2.3.8-1.3 2.3-2.3 4.2-2.3 3.1 0 5.4 2.7 4 5.9C19.5 16.1 12 21 12 21z"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <div class="card-body">
        <h3 class="card-title">${p.name}</h3>
        <p class="card-desc">${p.desc}</p>

        <div class="card-meta">
          <div class="price">${formatMAD(p.price)}</div>
        </div>

        <!-- ✅ Only WhatsApp -->
        <div class="card-actions">
          <a class="btn primary wa-btn" target="_blank" rel="noopener noreferrer"
             href="https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
               `Bonjour, je veux commander : ${p.name} (${formatMAD(p.price)})`
             )}">
            Commander sur WhatsApp
          </a>
        </div>
      </div>
    </article>
  `;
}

/* ========= RENDER ========= */
const els = {
  newGrid: document.getElementById("newProductsGrid"),
  bestGrid: document.getElementById("bestProductsGrid"),
  grid: document.getElementById("productsGrid"),
  search: document.getElementById("searchInput"),
  sort: document.getElementById("sortSelect"),
  catTabs: document.getElementById("catTabs"),

  // ✅ Favoris page
  favoritesGrid: document.getElementById("favoritesGrid"),
  favEmpty: document.getElementById("favEmpty"),
};


let state = { query: "", sort: "featured" };

function getVisibleProducts() {
  let list = [...PRODUCTS];

  const cat = getCategoryFromURL();
  if (cat) list = list.filter((p) => p.category === cat);

  if (state.query.trim()) {
    const q = state.query.trim().toLowerCase();
    list = list.filter(
      (p) => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
    );
  }

  if (state.sort === "price_asc") list.sort((a, b) => a.price - b.price);
  if (state.sort === "price_desc") list.sort((a, b) => b.price - a.price);

  return list;
}

function renderProduitsPage() {
  if (!els.grid) return;
  const list = getVisibleProducts();
  els.grid.innerHTML = list.map(productCardHTML).join("");
}

function renderFavoritesPage(){
  if (!els.favoritesGrid) return;

  const likes = loadLikes();
  const list = PRODUCTS.filter(p => likes.includes(p.id));

  if (els.favEmpty) {
    els.favEmpty.style.display = list.length ? "none" : "block";
  }

  els.favoritesGrid.innerHTML = list.map(productCardHTML).join("");
}


function renderHomePage() {
  if (!els.newGrid || !els.bestGrid) return;

  const LIMIT = window.matchMedia("(max-width: 760px)").matches ? 4 : 6;

  els.newGrid.innerHTML = PRODUCTS.slice(0, LIMIT).map(productCardHTML).join("");
  els.bestGrid.innerHTML = PRODUCTS.slice(LIMIT, LIMIT * 2).map(productCardHTML).join("");
}

function highlightCategoryTabs() {
  if (!els.catTabs) return;

  const cat = getCategoryFromURL();
  const links = els.catTabs.querySelectorAll("a.cat-tab");

  links.forEach((a) => {
    const href = a.getAttribute("href") || "";
    const isTous = href === "produits.html";
    const isActive = (!cat && isTous) || (cat && href.includes(`cat=${cat}`));
    a.classList.toggle("active", isActive);
  });
}

/* ========= EVENTS (Delegation for likes) ========= */
function bindGlobalLikeEvents() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-like]");
    if (!btn) return;

    const id = btn.getAttribute("data-like");
    toggleLike(id);

    // UI
    btn.classList.toggle("liked", isLiked(id));
    renderLikesCount();
  });
}

function initEvents() {
  if (els.search) {
    els.search.addEventListener("input", (e) => {
      state.query = e.target.value;
      renderProduitsPage();
    });
  }

  if (els.sort) {
    els.sort.addEventListener("change", (e) => {
      state.sort = e.target.value;
      renderProduitsPage();
    });
  }
}

function init() {
  bindGlobalLikeEvents();
  initEvents();

  renderHomePage();
  highlightCategoryTabs();
  renderProduitsPage();
  renderFavoritesPage();   // ✅

  renderLikesCount();
}

async function initAPI() {
  try {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    if (data.success) {
      PRODUCTS = data.products;
      // Map API fields to frontend fields if needed
      PRODUCTS = PRODUCTS.map(p => ({
        ...p,
        img: p.image_url || "./assets/img/products/thobe-01.jpg",
        isNew: p.is_new,
        bestSeller: p.best_seller
      }));
      init();
    } else {
      console.error("Failed to load products:", data.message);
    }
  } catch (err) {
    console.error("API error:", err);
  }
}

window.addEventListener("DOMContentLoaded", initAPI);
