const API_URL = "https://suiting-fabrics-production.up.railway.app/api";
let PRODUCTS = [];

/* ========= LIKES (Favoris) ========= */
function loadLikes() {
  try { return JSON.parse(localStorage.getItem("thobe_likes") || "[]"); }
  catch { return []; }
}
function saveLikes(list) { localStorage.setItem("thobe_likes", JSON.stringify(list)); }
function isLiked(id) { return loadLikes().includes(id); }
function toggleLike(id) {
  const likes = loadLikes();
  const i = likes.indexOf(id);
  if (i >= 0) likes.splice(i, 1); else likes.push(id);
  saveLikes(likes);
}
function renderLikesCount() {
  const el = document.getElementById("favCount");
  if (!el) return;
  el.textContent = String(loadLikes().length);
}

const WHATSAPP_PHONE = "212661935547";

function formatMAD(n) { return `${n} MAD`; }

function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("cat");
}

function productCardHTML(p) {
  const liked = isLiked(p.id);
  return `
    <article class="card product-card" data-product-id="${p.id}" style="cursor:pointer">
      <div class="card-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy">

        <!-- ❤️ Like overlay -->
        <button class="like-btn ${liked ? "liked" : ""}" type="button" data-like="${p.id}" aria-label="J'aime">
          <svg viewBox="0 0 24 24" class="like-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <div class="card-body">
        <h3 class="card-title">${p.name}</h3>
        <p class="card-desc">${p.desc || p.description || ""}</p>

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
  newGrid:       document.getElementById("newProductsGrid"),
  bestGrid:      document.getElementById("bestProductsGrid"),
  grid:          document.getElementById("productsGrid"),
  search:        document.getElementById("searchInput"),
  sort:          document.getElementById("sortSelect"),
  catTabs:       document.getElementById("catTabs"),
  favoritesGrid: document.getElementById("favoritesGrid"),
  favEmpty:      document.getElementById("favEmpty"),
};

let state = { query: "", sort: "featured" };

function getVisibleProducts() {
  let list = [...PRODUCTS];
  const cat = getCategoryFromURL();
  if (cat) list = list.filter(p => p.category === cat);
  if (state.query.trim()) {
    const q = state.query.trim().toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || (p.desc || "").toLowerCase().includes(q));
  }
  if (state.sort === "price_asc")  list.sort((a, b) => a.price - b.price);
  if (state.sort === "price_desc") list.sort((a, b) => b.price - a.price);
  return list;
}

function renderProduitsPage() {
  if (!els.grid) return;
  els.grid.innerHTML = getVisibleProducts().map(productCardHTML).join("");
}

function renderFavoritesPage() {
  if (!els.favoritesGrid) return;
  const likes = loadLikes();
  const list = PRODUCTS.filter(p => likes.includes(p.id));
  if (els.favEmpty) els.favEmpty.style.display = list.length ? "none" : "block";
  els.favoritesGrid.innerHTML = list.map(productCardHTML).join("");
}

function renderHomePage() {
  if (!els.newGrid || !els.bestGrid) return;
  const LIMIT = window.matchMedia("(max-width: 760px)").matches ? 4 : 6;
  els.newGrid.innerHTML  = PRODUCTS.slice(0, LIMIT).map(productCardHTML).join("");
  els.bestGrid.innerHTML = PRODUCTS.slice(LIMIT, LIMIT * 2).map(productCardHTML).join("");
}

function highlightCategoryTabs() {
  if (!els.catTabs) return;
  const cat = getCategoryFromURL();
  els.catTabs.querySelectorAll("a.cat-tab").forEach(a => {
    const href = a.getAttribute("href") || "";
    const isTous = href === "produits.html";
    a.classList.toggle("active", (!cat && isTous) || (cat && href.includes(`cat=${cat}`)));
  });
}

/* ========= EVENTS (Delegation for likes) ========= */
function bindGlobalLikeEvents() {
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-like]");
    if (!btn) return;
    const id = btn.getAttribute("data-like");
    toggleLike(id);
    btn.classList.toggle("liked", isLiked(id));
    renderLikesCount();
  });
}

function initEvents() {
  if (els.search) {
    els.search.addEventListener("input", e => { state.query = e.target.value; renderProduitsPage(); });
  }
  if (els.sort) {
    els.sort.addEventListener("change", e => { state.sort = e.target.value; renderProduitsPage(); });
  }
}

/* ========= PRODUCT MODAL ========= */
let modalImgs = [];
let modalIdx  = 0;

function createModal() {
  if (document.getElementById("productModal")) return;
  const div = document.createElement("div");
  div.id = "productModal";
  div.className = "product-modal";
  div.setAttribute("role", "dialog");
  div.setAttribute("aria-modal", "true");
  div.innerHTML = `
    <div class="modal-panel" id="modalPanel">
      <!-- Image side -->
      <div class="modal-img-wrap" id="modalImgWrap">
        <img id="modalImg" src="" alt="">
        <button class="modal-arrow modal-arrow-prev hidden" id="modalPrev" aria-label="Précédent">&#8592;</button>
        <button class="modal-arrow modal-arrow-next hidden" id="modalNext" aria-label="Suivant">&#8594;</button>
        <div class="modal-dots" id="modalDots"></div>
      </div>
      <!-- Info side -->
      <div class="modal-info">
        <div class="modal-category" id="modalCategory"></div>
        <h2 class="modal-name"   id="modalName"></h2>
        <div class="modal-price"  id="modalPrice"></div>
        <div class="modal-divider"></div>
        <p class="modal-desc"    id="modalDesc"></p>
        <a class="modal-wa-btn"  id="modalWaBtn" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 448 512" fill="currentColor">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
          Commander sur WhatsApp
        </a>
        <button class="modal-close" id="modalClose" aria-label="Fermer">&#x2715;</button>
      </div>
    </div>
  `;
  document.body.appendChild(div);

  // Close on backdrop click
  div.addEventListener("click", e => { if (e.target === div) closeModal(); });
  // Close button
  document.getElementById("modalClose").addEventListener("click", closeModal);
  // Arrows
  document.getElementById("modalPrev").addEventListener("click", () => slideModal(-1));
  document.getElementById("modalNext").addEventListener("click", () => slideModal(+1));
  // Keyboard
  document.addEventListener("keydown", e => {
    if (!div.classList.contains("open")) return;
    if (e.key === "Escape")      closeModal();
    if (e.key === "ArrowLeft")   slideModal(-1);
    if (e.key === "ArrowRight")  slideModal(+1);
  });
}

function openModal(product) {
  // Build image list: support future multi-image (images[]) or single image_url
  const imgs = Array.isArray(product.images) && product.images.length
    ? product.images
    : [product.img || product.image_url || ""];

  modalImgs = imgs;
  modalIdx  = 0;

  // Fill info
  document.getElementById("modalName").textContent     = product.name || "";
  document.getElementById("modalCategory").textContent = product.category || "";
  document.getElementById("modalPrice").textContent    = formatMAD(product.price);
  document.getElementById("modalDesc").textContent     = product.description || product.desc || "Aucune description disponible.";

  // WhatsApp link
  const waText = `Bonjour, je veux commander : ${product.name} (${formatMAD(product.price)})`;
  document.getElementById("modalWaBtn").href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(waText)}`;

  // Arrows & dots
  const prev  = document.getElementById("modalPrev");
  const next  = document.getElementById("modalNext");
  const dots  = document.getElementById("modalDots");
  const multi = imgs.length > 1;
  prev.classList.toggle("hidden", !multi);
  next.classList.toggle("hidden", !multi);
  dots.innerHTML = multi
    ? imgs.map((_, i) => `<button class="modal-dot${i === 0 ? " active" : ""}" data-idx="${i}" aria-label="Image ${i + 1}"></button>`).join("")
    : "";
  if (multi) {
    dots.querySelectorAll(".modal-dot").forEach(btn => {
      btn.addEventListener("click", () => goToSlide(Number(btn.dataset.idx)));
    });
  }

  // Image
  setModalImage(0);

  // Open
  document.getElementById("productModal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function setModalImage(idx) {
  const img = document.getElementById("modalImg");
  img.style.opacity = "0";
  setTimeout(() => {
    img.src = modalImgs[idx] || "";
    img.style.opacity = "1";
  }, 120);
  document.querySelectorAll(".modal-dot").forEach((d, i) => d.classList.toggle("active", i === idx));
}

function goToSlide(idx) {
  modalIdx = (idx + modalImgs.length) % modalImgs.length;
  setModalImage(modalIdx);
}

function slideModal(dir) { goToSlide(modalIdx + dir); }

function closeModal() {
  const m = document.getElementById("productModal");
  if (m) m.classList.remove("open");
  document.body.style.overflow = "";
}

/* Bind card click → modal (skip like-btn, wa-btn, a tags) */
function bindCardClicks() {
  document.addEventListener("click", e => {
    if (e.target.closest(".like-btn")) return;
    if (e.target.closest(".wa-btn"))   return;
    if (e.target.closest("a.btn"))     return;
    const card = e.target.closest(".product-card[data-product-id]");
    if (!card) return;
    const id = card.getAttribute("data-product-id");
    const product = PRODUCTS.find(p => p.id === id);
    if (product) openModal(product);
  });
}

/* ========= INIT ========= */
function init() {
  createModal();
  bindCardClicks();
  bindGlobalLikeEvents();
  initEvents();
  renderHomePage();
  highlightCategoryTabs();
  renderProduitsPage();
  renderFavoritesPage();
  renderLikesCount();
}

async function initAPI() {
  try {
    const res  = await fetch(`${API_URL}/products`);
    const data = await res.json();
    if (data.success) {
      PRODUCTS = data.products.map(p => ({
        ...p,
        img:        p.image_url || "./assets/img/products/thobe-01.jpg",
        desc:       p.description || "",
        isNew:      p.is_new,
        bestSeller: p.best_seller,
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
