document.querySelectorAll("[data-impl]").forEach((element) => {
  const url = element.dataset.impl;
  const lang = element.dataset.implLang;

  fetch(url)
    .then((res) => res.text())
    .then((text) => {
      const highlightedCode = hljs.highlight(text, { language: lang }).value;

      element.innerHTML = highlightedCode;
    });
});

document.querySelectorAll("[data-use-case]").forEach((element) => {
  const demoBtn = element.querySelector("[data-use-case-demo-btn]");
  const implBtn = element.querySelector("[data-use-case-impl-btn]");
  const demo = element.querySelector("[data-use-case-demo]");
  const impl = element.querySelector("[data-use-case-impl]");

  demoBtn.addEventListener("click", () => {
    demo.style.display = "block";
    demoBtn.classList.add("use-case__btn_active");
    impl.style.display = "none";
    implBtn.classList.remove("use-case__btn_active");
  });

  implBtn.addEventListener("click", () => {
    demo.style.display = "none";
    demoBtn.classList.remove("use-case__btn_active");
    impl.style.display = "block";
    implBtn.classList.add("use-case__btn_active");
  });
});

document.querySelectorAll("[data-code]").forEach((element) => {
  const lang = element.dataset.code;

  const temp = document.createElement("div");
  temp.innerHTML = element.innerText;

  const highlightedCode = hljs.highlight(temp.innerText, {
    language: lang,
  }).value;

  element.innerHTML = highlightedCode.trim();
});

document.querySelectorAll("[data-ref]").forEach((element) => {
  const ref = element.dataset.ref;

  element.addEventListener("click", () => {
    const target = document.querySelector(`[data-ref-target="${ref}"]`);
    target.scrollIntoView({ behavior: "smooth" });
    target.classList.add("hl");

    setTimeout(() => {
      target.classList.remove("hl");
    }, 1000);
  });
});
