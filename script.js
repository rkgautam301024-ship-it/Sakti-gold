/* ===== SAKTI GOLD – Script ===== */

/* ---------------------------------------------------------------
   IMPORTANT: PUT YOUR REAL WHATSAPP NUMBER HERE
   Format: country code + number, digits only, no + or spaces.
   Example for India: "919876543210"
---------------------------------------------------------------- */
const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // <-- CHANGE THIS

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
const cropBox = $("#crops");
for (let i = 0; i < (isSmall ? 26 : 60); i++) {
  const c = document.createElement("i");
  c.className = "crop";
  c.style.left = (i / (isSmall ? 26 : 60)) * 100 + Math.random() * 2 + "%";
  c.style.height = 40 + Math.random() * 70 + "px";
  c.style.animationDelay = -Math.random() * 3.5 + "s";
  c.style.animationDuration = 2.8 + Math.random() * 2 + "s";
  cropBox.appendChild(c);
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
