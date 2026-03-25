(function () {
  const navLinks = [
    { href: "index.html", label: "Accueil" },
    { href: "produits.html", label: "Produits" },
    { href: "a-propos.html", label: "À propos" },
    { href: "contact.html", label: "Contact" },
  ];

  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  const INSTAGRAM_URL = "https://www.instagram.com/suiting_fabrics_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";
  const WHATSAPP_NUMBER = "212661935547"; // بدون +

  const iconInstagram = `
  <svg viewBox="0 0 24 24" class="header-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>`;

  const iconWhatsApp = `
  <svg viewBox="0 0 448 512" class="header-icon" fill="currentColor">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>`;

  const iconHeart = `
  <svg viewBox="0 0 24 24" class="header-icon heart-icon-main" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>`;




  function headerHTML() {
    return `
<header class="site-header">
  <div class="container header-row">

    <div class="header-left">
      <button class="nav-toggle" id="navToggle" type="button" aria-label="Menu">☰</button>
      <nav class="nav-left" id="mainNav">
        ${navLinks.map(l => `<a href="${l.href}" class="${l.href === current ? "active" : ""}">${l.label}</a>`).join("")}
      </nav>
    </div>

    <a class="brand-text" href="index.html" aria-label="SUITING FABRICS">SUITING FABRICS</a>

    <div class="header-right">

  <a class="icon-link" href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
    ${iconInstagram}
  </a>

  <a class="icon-link" href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
    ${iconWhatsApp}
  </a>

  <!-- ❤️ Favoris -->
  <a class="icon-link icon-like" href="favoris.html" aria-label="Favoris">
    ${iconHeart}
    <span id="favCount" class="icon-badge">0</span>
  </a>

</div>


    </div>

  </div>
</header>`;
  }

  function footerHTML() {
    const year = new Date().getFullYear();
    return `
<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-col footer-brand-col">
      <div class="footer-logo">SUITING FABRICS</div>
<div class="footer-tagline">
  Thobes premium au Maroc • Commande rapide via WhatsApp • Qualité & style.
</div>
      <div class="footer-social">
        <a class="footer-social-btn" href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a class="footer-social-btn" href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
    </div>

    <div class="footer-col">
      <div class="footer-title">Pages</div>
      <div class="footer-links">
        ${navLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join("")}
      </div>
    </div>

    <div class="footer-col">
      <div class="footer-title">Catégories</div>
      <div class="footer-links">
        <a href="produits.html?cat=imprime">Imprimé</a>
        <a href="produits.html?cat=simple">Simple</a>
        <a href="produits.html?cat=motifs">Motifs</a>
      </div>
    </div>

    <div class="footer-col">
      <div class="footer-title">Contact</div>
      <div class="footer-contact footer-contact-center">
  <div class="fc-item">
    <div class="fc-title">ADRESSE</div>
    <div class="fc-value">Rue Jeddah, Nador</div>
  </div>

  <div class="fc-item">
    <div class="fc-title">WHATSAPP</div>
    <div class="fc-value">+212 6 61 93 55 47</div>
  </div>

  <div class="fc-item">
    <div class="fc-title">HORAIRES</div>
    <div class="fc-value">10:00 – 20:00
    
    </div>

  </div>
</div>



  <div class="container footer-bottom">
    <div class="footer-copy">© ${year} SUITING FABRICS • Tous droits réservés</div>
    <div class="footer-mini-links">
      <a href="a-propos.html">À propos</a>
      <a href="contact.html">Contact</a>
    </div>
  </div>
</footer>`;
  }

  const headerMount = document.getElementById("siteHeader");
  const footerMount = document.getElementById("siteFooter");
  if (headerMount) headerMount.innerHTML = headerHTML();
  if (footerMount) footerMount.innerHTML = footerHTML();

  // Mobile menu
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (toggle && nav) toggle.addEventListener("click", () => nav.classList.toggle("open"));
})();
