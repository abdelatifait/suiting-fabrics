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
  <svg viewBox="0 0 24 24" class="header-icon" aria-hidden="true">
    <rect x="6" y="6" width="12" height="12" rx="3"
      fill="none" stroke="currentColor" stroke-width="1.7"/>
    <circle cx="12" cy="12" r="3"
      fill="none" stroke="currentColor" stroke-width="1.7"/>
    <circle cx="16.2" cy="7.8" r="0.9" fill="currentColor"/>
  </svg>`;

  const iconWhatsApp = `
  <svg viewBox="0 0 24 24" class="header-icon" aria-hidden="true">
    <path d="M12 3a8.5 8.5 0 0 0-7.3 12.9L4 21l5.3-0.7A8.5 8.5 0 1 0 12 3z"
      fill="none" stroke="currentColor" stroke-width="1.7"
      stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.2 9.2c.3-.4.6-.4.9-.2l.8.6c.3.2.3.5.2.8l-.3.7c-.1.3 0 .6.2.8.8.9 1.7 1.6 2.8 2.1.3.1.6.1.8-.1l.6-.5c.3-.2.6-.2.9 0l.8.5c.3.2.4.5.3.8-.2.7-.8 1.2-1.5 1.3-2.1.3-5.2-1.8-6.8-4.1-1-1.5-1.2-2.7-.7-3.7z"
      fill="none" stroke="currentColor" stroke-width="1.5"
      stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const iconHeart = `
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

  <path
    d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-1.344-.757 25.683 25.683 0 0 1-2.617-1.772C4.688 16.17 2.25 13.497 2.25 10.5 2.25 8.014 4.264 6 6.75 6c1.4 0 2.716.662 3.5 1.688A4.5 4.5 0 0 1 13.75 6c2.486 0 4.5 2.014 4.5 4.5 0 2.997-2.438 5.67-5.405 7.866a25.684 25.684 0 0 1-2.617 1.772 15.247 15.247 0 0 1-1.344.757l-.022.012-.007.003-.003.002a.75.75 0 0 1-.704 0l-.003-.002Z"
    fill="none"
    stroke="currentColor"
    stroke-width="1.9"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;




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
