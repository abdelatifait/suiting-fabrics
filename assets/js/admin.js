const API_URL = "https://suiting-fabrics-production.up.railway.app/api";

// --- State ---
let currentProducts = [];
let editingId = null;


// --- Elements ---
const loginOverlay = document.getElementById("loginOverlay");
const adminContent = document.getElementById("adminContent");
const adminPassword = document.getElementById("adminPassword");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

const adminProductList = document.getElementById("adminProductList");
const pCount = document.getElementById("pCount");
// Code generator UI elements removed as they are no longer needed
const codeGeneratorSection = document.querySelector(".code-generator-section");
if(codeGeneratorSection) codeGeneratorSection.style.display = "none";


const addProductForm = document.getElementById("addProductForm");
const formSubmitBtn = addProductForm.querySelector('button[type="submit"]');
const cancelEditBtn = document.getElementById("cancelEditBtn");

// Form Fields
const productId = document.getElementById("productId");
const pName = document.getElementById("pName");
const pPrice = document.getElementById("pPrice");
const pCategory = document.getElementById("pCategory");
const pImage = document.getElementById("pImage"); 
const pImageFile = document.getElementById("pImageFile");

const pDesc = document.getElementById("pDesc");
const pIsNew = document.getElementById("pIsNew");
const pBestSeller = document.getElementById("pBestSeller");

// --- 1. Authentication ---
async function checkAuth() {
  if (sessionStorage.getItem("adminAuth") === "true") {
    loginOverlay.style.display = "none";
    adminContent.style.display = "block";
    await fetchProducts();
    renderUI();
  }
}


loginBtn.addEventListener("click", async () => {
  const password = adminPassword.value;
  try {
    const res = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    
    if (data.success) {
      sessionStorage.setItem("adminAuth", "true");
      sessionStorage.setItem("adminPass", password);
      loginOverlay.style.display = "none";
      adminContent.style.display = "block";
      await fetchProducts();
      renderUI();
    } else {
      loginError.style.display = "block";
      loginError.textContent = data.message;
    }
  } catch (err) {
    loginError.style.display = "block";
    loginError.textContent = "Erreur de connexion au serveur.";
  }
});


adminPassword.addEventListener("keypress", (e) => {
  if (e.key === "Enter") loginBtn.click();
});

// --- 2. Logic ---

async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/admin/products`, {
      headers: { "x-admin-password": sessionStorage.getItem("adminPass") }
    });
    const data = await res.json();
    if (data.success) {
      currentProducts = data.products.map(p => ({
        ...p,
        img: p.image_url || "./assets/img/products/thobe-01.jpg",
        isNew: p.is_new,
        bestSeller: p.best_seller
      }));
    }
  } catch (err) {
    console.error("Failed to fetch products", err);
  }
}

function renderUI() {
  renderList();
}

function renderList() {
  pCount.textContent = currentProducts.length;
  adminProductList.innerHTML = "";
  
  // Sort reverse to see newest first
  const sorted = [...currentProducts].reverse();

  sorted.forEach(p => {
    const d = document.createElement("div");
    d.className = "product-list-item";
    d.innerHTML = `
      <img src="${p.img}" onerror="this.src='./assets/img/products/thobe-01.jpg'" class="product-list-img">
      <div class="product-list-info">
        <div class="product-list-title">${p.name} ${p.isNew ? '<span style="color:red;font-size:0.7rem;">[NEW]</span>' : ''}</div>
        <div class="product-list-price">${p.price} MAD - <b>${p.category}</b></div>
      </div>
      <div>
        <button class="btn edit-btn" data-id="${p.id}" style="padding: 5px 10px; font-size: 0.8rem;">Modifier</button>
        <button class="btn error delete-btn" data-id="${p.id}" style="padding: 5px 10px; font-size: 0.8rem; background: #dc3545; color: white;">Supprimer</button>
      </div>
    `;
    adminProductList.appendChild(d);
  });
}

// Code generation removed


// --- 3. Actions ---

addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  formSubmitBtn.disabled = true;
  formSubmitBtn.textContent = "Traitement en cours...";

  try {
    let imgPath = pImage.value;
    let imgArray = [];

    // Handle image upload if files are selected
    if (pImageFile.files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < pImageFile.files.length; i++) {
        formData.append("images", pImageFile.files[i]);
      }

      const uploadRes = await fetch(`${API_URL}/admin/upload`, {
        method: "POST",
        headers: { "x-admin-password": sessionStorage.getItem("adminPass") },
        body: formData
      });
      const uploadData = await uploadRes.json();
      if (uploadData.success) {
        // First image is the main thumbnail (image_url), the rest/all are the array (images)
        imgArray = uploadData.urls;
        imgPath = imgArray[0];
      } else {
        alert("Erreur lors de l'upload de l'image : " + uploadData.message);
        formSubmitBtn.disabled = false;
        formSubmitBtn.textContent = editingId ? "Mettre à jour le produit" : "Ajouter le produit";
        return;
      }
    }

    const productPayload = {
      name: pName.value,
      price: Number(pPrice.value),
      category: pCategory.value,
      description: pDesc.value,
      image_url: imgPath,
      images: imgArray.length > 0 ? imgArray : (imgPath ? [imgPath] : []),
      is_new: pIsNew.checked,
      best_seller: pBestSeller.checked
    };

    const url = editingId 
      ? `${API_URL}/admin/products/${editingId}`
      : `${API_URL}/admin/products`;
      
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": sessionStorage.getItem("adminPass")
      },
      body: JSON.stringify(productPayload)
    });

    const data = await res.json();
    if (data.success) {
      await fetchProducts();
      addProductForm.reset();
      pImageFile.value = "";
      editingId = null;
      formSubmitBtn.textContent = "Ajouter le produit";
      cancelEditBtn.style.display = "none";
      renderUI();
    } else {
      alert("Erreur: " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Erreur de connexion au serveur.");
  } finally {
    formSubmitBtn.disabled = false;
    if (!editingId) formSubmitBtn.textContent = "Ajouter le produit";
  }
});

cancelEditBtn.addEventListener("click", () => {
  editingId = null;
  addProductForm.reset();
  formSubmitBtn.textContent = "Ajouter le produit";
  cancelEditBtn.style.display = "none";
});

adminProductList.addEventListener("click", async (e) => {
  const id = e.target.getAttribute("data-id");
  if (!id) return;

  if (e.target.classList.contains("delete-btn")) {
    if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      try {
        const res = await fetch(`${API_URL}/admin/products/${id}`, {
          method: "DELETE",
          headers: { "x-admin-password": sessionStorage.getItem("adminPass") }
        });
        const data = await res.json();
        if (data.success) {
          await fetchProducts();
          renderUI();
        } else {
          alert("Erreur de suppression: " + data.message);
        }
      } catch (err) {
        alert("Erreur serveur.");
      }
    }
  }

  if (e.target.classList.contains("edit-btn")) {
    const p = currentProducts.find(x => x.id === id);
    if (p) {
      editingId = p.id;
      pName.value = p.name;
      pPrice.value = p.price;
      pCategory.value = p.category;
      pImage.value = p.image_url || ""; // Use the full URL or part of it
      pDesc.value = p.description || "";
      pIsNew.checked = p.is_new;
      pBestSeller.checked = p.best_seller;
      
      formSubmitBtn.textContent = "Mettre à jour le produit";
      cancelEditBtn.style.display = "block";
      
      // Scroll to top
      window.scrollTo({top: 0, behavior:"smooth"});
    }
  }
});

// Init
checkAuth();
