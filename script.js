/* ===== SAKTI GOLD – Script ===== */

/* ---------------------------------------------------------------
   IMPORTANT: PUT YOUR REAL WHATSAPP NUMBER HERE
   Format: country code + number, digits only, no + or spaces.
   Example for India: "919876543210"
---------------------------------------------------------------- */
const WHATSAPP_NUMBER = "919250780259"; // <-- CHANGE THIS

const $ = (s, all = false) => all ? [...document.querySelectorAll(s)] : document.querySelector(s);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const numberIsPlaceholder = /X/i.test(WHATSAPP_NUMBER);

/* Build a wa.me link */
const waLink = text => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

/* 1. Loader – hides when page is ready (max 2.4 s so it never blocks) */
const loader = $("#loader");
const hideLoader = () => loader.classList.add("hide");
window.addEventListener("load", () => setTimeout(hideLoader, reduceMotion ? 0 : 1900));
setTimeout(hideLoader, 2400);

/* 2. Navbar: change colour on scroll + back-to-top button */
const navbar = $("#navbar"), toTop = $("#toTop");
let ticking = false;
function onScroll() {
  const y = window.scrollY;
  navbar.classList.toggle("scrolled", y > 60);
  toTop.classList.toggle("show", y > 600);
  if (!reduceMotion) {
    // Gentle parallax for hero layers (only while hero is visible)
    if (y < window.innerHeight) {
      $("[data-speed]", true).forEach(el => {
        el.style.transform = `translateY(${y * parseFloat(el.dataset.speed)}px)`;
      });
    }
  }
  ticking = false;
}
window.addEventListener("scroll", () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

/* 3. Mobile menu */
const menuBtn = $("#menuBtn"), navLinks = $("#navLinks");
function setMenu(open) {
  menuBtn.classList.toggle("open", open);
  navLinks.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open);
  if (open) navbar.classList.add("scrolled");
  else onScroll();
}
menuBtn.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
navLinks.addEventListener("click", e => { if (e.target.tagName === "A") setMenu(false); });

/* 4. Scroll reveal */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
  });
}, { threshold: 0.15 });
$(".reveal", true).forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 90}ms`;
  io.observe(el);
});

/* 5. Hero crops and floating particles (lightweight DOM, CSS animated) */
const isSmall = window.innerWidth < 700;
/* Birds: small silhouettes flying across the sky (CSS animated).
   Smaller birds = farther away = slower and lighter, which looks natural. */
const BIRD_SVG = `<svg viewBox="0 0 40 20"><path class="wing wl" d="M20 11 Q11 0 0 5 Q10 6 20 11Z"/><path class="wing wr" d="M20 11 Q29 0 40 5 Q30 6 20 11Z"/><ellipse cx="20" cy="11.5" rx="2.4" ry="1.4" fill="#10241a"/></svg>`;
if (!reduceMotion) {
  const box = $("#birds"), count = isSmall ? 6 : 10;
  for (let i = 0; i < count; i++) {
    const depth = Math.random();                 // 0 = far, 1 = near
    const size = 14 + depth * 26;                // px
    const b = document.createElement("div");
    b.className = "bird";
    b.style.width = size + "px";
    b.style.top = 6 + Math.random() * 30 + "%";
    b.style.opacity = 0.45 + depth * 0.45;
    b.style.animationDuration = 38 - depth * 16 + Math.random() * 6 + "s";
    b.style.animationDelay = -Math.random() * 40 + "s";
    const inner = document.createElement("div");
    inner.className = "bird-inner";
    inner.style.animationDuration = 3 + Math.random() * 3 + "s";
    inner.innerHTML = BIRD_SVG;
    const flap = 0.45 + (1 - depth) * 0.25 + Math.random() * 0.15; // far birds flap a bit slower
    inner.querySelectorAll(".wing").forEach(w => { w.style.animationDuration = flap + "s"; });
    b.appendChild(inner);
    box.appendChild(b);
  }
}
if (!reduceMotion) {
  const pBox = $("#particles");
  for (let i = 0; i < (isSmall ? 10 : 20); i++) {
    const p = document.createElement("span");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = 8 + Math.random() * 10 + "s";
    p.style.animationDelay = -Math.random() * 10 + "s";
    pBox.appendChild(p);
  }
}

/* 6. WhatsApp buttons (floating, products, footer) */
$(".wa-link", true).forEach(a => { a.href = waLink(a.dataset.msg); });

/* 7. Contact form -> WhatsApp message */
const form = $("#contactForm"), status = $("#formStatus");
form.addEventListener("submit", e => {
  e.preventDefault();
  const fields = { name: $("#name"), phone: $("#phone"), interest: $("#interest") };
  let ok = true;
  Object.values(fields).forEach(f => f.classList.remove("invalid"));
  if (fields.name.value.trim().length < 2) { fields.name.classList.add("invalid"); ok = false; }
  if (!/^[+\d][\d\s-]{8,14}$/.test(fields.phone.value.trim())) { fields.phone.classList.add("invalid"); ok = false; }
  if (!fields.interest.value) { fields.interest.classList.add("invalid"); ok = false; }
  status.className = "status";
  if (!ok) { status.textContent = "Please fill name, a valid phone number and product."; return; }

  const text =
`*New Inquiry – SAKTI GOLD*
Name: ${fields.name.value.trim()}
Phone: ${fields.phone.value.trim()}
Product: ${fields.interest.value}
Message: ${$("#message").value.trim() || "-"}`;

  if (numberIsPlaceholder) {
    status.textContent = "Owner note: set WHATSAPP_NUMBER in script.js first.";
    return;
  }
  status.textContent = "Opening WhatsApp…";
  status.classList.add("ok");
  window.open(waLink(text), "_blank", "noopener");
});

/* 8. Footer year */
$("#year").textContent = new Date().getFullYear();
