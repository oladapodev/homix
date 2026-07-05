(function () {
  function revealIn(root) {
    var targets = root.querySelectorAll("[data-reveal]");
    if (!targets.length || !window.gsap) return;
    window.gsap.fromTo(
      targets,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.05,
        overwrite: true,
      },
    );
  }

  function countUp(root) {
    var targets = root.querySelectorAll("[data-counter]");
    if (!window.gsap) return;
    targets.forEach(function (el) {
      var end = Number(el.getAttribute("data-counter"));
      if (!Number.isFinite(end)) return;
      var state = { value: 0 };
      window.gsap.to(state, {
        value: end,
        duration: 0.9,
        ease: "power1.out",
        onUpdate: function () {
          el.textContent = Math.round(state.value).toLocaleString();
        },
      });
    });
  }

  function cardsIn(root) {
    var cards = root.querySelectorAll("article[data-reveal]");
    if (!cards.length || !window.gsap) return;
    window.gsap.fromTo(
      cards,
      { opacity: 0, scale: 0.97 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "back.out(1.6)",
        stagger: 0.03,
        overwrite: true,
      },
    );
  }

  function init(root) {
    revealIn(root);
    countUp(root);
  }

  document.addEventListener("DOMContentLoaded", function () {
    init(document);
  });

  document.body.addEventListener("htmx:afterSwap", function (event) {
    cardsIn(event.target);
    revealIn(event.target);
  });
})();
