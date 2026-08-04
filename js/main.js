/* =========================================================
   SDCP SITE SCRIPT
   Shared across every page (linked at the bottom of each HTML
   file). Three independent features, each self-contained in
   its own DOMContentLoaded listener so a page missing one of
   the target elements (e.g. no .figure-number on non-home pages)
   simply no-ops for that block instead of throwing.
   ========================================================= */

/* --- Stat counters (homepage "Our impact at a glance") ---
   Animates each .figure-number from 0 up to its data-target
   value over a fixed duration using requestAnimationFrame. */
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".figure-number");
  const duration = 2000; // total animation duration in ms

  // On Arabic pages (<html lang="ar">) render the counters with Arabic-Indic
  // digits (٠-٩) so the numerals stay consistent with the surrounding Arabic
  // copy; English pages keep plain Western digits. Without this, .toLocaleString()
  // falls back to the browser's default locale regardless of page language.
  const isArabic = document.documentElement.lang === "ar";
  const formatNumber = n =>
    isArabic ? n.toLocaleString("ar", { numberingSystem: "arab" }) : n.toLocaleString("en-US");

  counters.forEach(counter => {
    const target = +counter.getAttribute("data-target");
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // clamp between 0–1
      counter.textContent = formatNumber(Math.floor(progress * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        counter.textContent = formatNumber(target); // ensure final value
      }
    };

    requestAnimationFrame(animate);
  });
});


/* --- Region map switcher (homepage "Locations" section) ---
   Clicking a region in the list swaps the embedded Google Maps
   iframe's src to that region's data-map URL. */
document.addEventListener("DOMContentLoaded", () => {
  const mapFrame = document.getElementById("map-frame");
  const regionItems = document.querySelectorAll(".locations-list li");

  regionItems.forEach(item => {
    item.addEventListener("click", () => {
      const newMap = item.getAttribute("data-map");
      mapFrame.src = newMap;
    });
  });
});

/* --- Mobile navigation toggle (hamburger menu) ---
   Below 900px (see responsive.css) the hamburger button and
   dropdown nav become visible. This wires the click behavior:
   toggle open/closed, flip the icon to an X (.active class,
   styled in styles.css), keep aria-expanded in sync for
   screen readers, and auto-close the menu after a link tap. */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".navbar-inner nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav-open");
    toggle.classList.toggle("active", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close the menu when a link is clicked
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("nav-open");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
});


