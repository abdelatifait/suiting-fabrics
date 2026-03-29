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
const pImage1 = document.getElementById("pImage1");
const pImage2 = document.getElementById("pImage2");
const pImage3 = document.getElementById("pImage3");
const pImage4 = document.getElementById("pImage4");
let currentOldImages = [];

const pDesc = document.getElementById("pDesc");
const boldBtn = document.getElementById("boldBtn");
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
    let imgArray = [];
    let imgPath = "";
    const filesToUpload = [];

    if (pImage1.files[0]) filesToUpload.push(pImage1.files[0]);
    if (pImage2.files[0]) filesToUpload.push(pImage2.files[0]);
    if (pImage3.files[0]) filesToUpload.push(pImage3.files[0]);
    if (pImage4.files[0]) filesToUpload.push(pImage4.files[0]);

    // Handle image upload if files are selected
    if (filesToUpload.length > 0) {
      const formData = new FormData();
      for (const file of filesToUpload) {
        formData.append("images", file);
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
        imgPath = imgArray[0] || "";
      } else {
        alert("Erreur lors de l'upload de l'image : " + uploadData.message);
        formSubmitBtn.disabled = false;
        formSubmitBtn.textContent = editingId ? "Mettre à jour le produit" : "Ajouter le produit";
        return;
      }
    } else {
      // If no new files uploaded, keep the old images
      imgArray = currentOldImages;
      imgPath = imgArray[0] || "";
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
      pImage1.value = "";
      pImage2.value = "";
      pImage3.value = "";
      pImage4.value = "";
      currentOldImages = [];
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
  currentOldImages = [];
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
      
      currentOldImages = p.images && p.images.length > 0 ? p.images : (p.image_url ? [p.image_url] : []);
      pImage1.value = "";
      pImage2.value = "";
      pImage3.value = "";
      pImage4.value = "";
      
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

// --- 4. Utilities ---
if (boldBtn && pDesc) {
  boldBtn.addEventListener("click", () => {
    const start = pDesc.selectionStart;
    const end = pDesc.selectionEnd;
    const text = pDesc.value;
    const selection = text.substring(start, end);
    
    if (selection) {
      const before = text.substring(0, start);
      const after = text.substring(end);
      pDesc.value = before + "<b>" + selection + "</b>" + after;
      
      // Update selection for better UX
      pDesc.focus();
      const newPos = end + 7; // <b> and </b> length
      pDesc.setSelectionRange(newPos, newPos);
    } else {
      // If nothing selected, just insert the tags and put cursor in between
      const before = text.substring(0, start);
      const after = text.substring(start);
      pDesc.value = before + "<b></b>" + after;
      pDesc.focus();
      pDesc.setSelectionRange(start + 3, start + 3);
    }
  });
}

// Init
checkAuth();
