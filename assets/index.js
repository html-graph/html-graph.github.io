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
  const copyBtn = element.querySelector("[data-use-case-copy]");
  const implCode = element.querySelector("[data-use-case-impl]");
  const anchor = element.querySelector("[data-use-case-anchor]");

  copyBtn.addEventListener("click", () => {
    copy(implCode.innerText);
  });

  anchor.addEventListener("click", (event) => {
    event.preventDefault();
  });

  anchor.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    const href = event.currentTarget.href;

    setTimeout(() => {
      window.open(href, "_blank");
    }, 100);
  });
});

document.querySelectorAll("[data-code]").forEach((element) => {
  const lang = element.dataset.code;

  const temp = document.createElement("div");
  temp.innerHTML = element.innerText;

  const highlightedCode = hljs.highlight(temp.innerText, {
    language: lang,
  }).value;

  const pre = element.querySelector("pre");

  pre.innerHTML = highlightedCode.trim();

  const copyBtn = element.querySelector("[data-copy]");

  copyBtn.addEventListener("click", () => {
    copy(temp.innerText);
  });
});

function copy(text) {
  navigator.clipboard.writeText(text);
  Toastify({
    text: "Copied!",
    close: true,
    offset: {
      y: 70,
    },
    gravity: "top",
    position: "right",
    style: {
      background: "#666666",
    },
  }).showToast();
}

const highlightElement = () => {
  const hash = window.location.hash;
  const value = hash.replace(/^#/, '');
  const target = document.querySelector(`[data-ref-target="${value}"]`)

  if (!target) {
    return;
  }

  target.classList.add("hl");

  setTimeout(() => {
    target.classList.remove("hl");
  }, 1000);
}

window.addEventListener("hashchange", () => {
  highlightElement();
}, false);

highlightElement();

const setActiveTab = (tabs, index) => {
  tabs.querySelectorAll("[data-tab]").forEach((tab) => {
    const currentIndex = tab.dataset.tab;

    if (currentIndex === index) {
      tab.dataset.tabActive = "";
    } else {
      delete tab.dataset.tabActive;
    }
  });

  tabs.querySelectorAll("[data-tab-content]").forEach((tab) => {
    const currentIndex = tab.dataset.tabContent;

    if (currentIndex === index) {
      tab.style.display = "block";
    } else {
      tab.style.display = "none";
    }
  });
}

document.querySelectorAll("[data-tabs]").forEach((tabs) => {
  tabs.querySelectorAll("[data-tab]").forEach((tab) => {
    tab.addEventListener('click', () => {
      const index = tab.dataset.tab;

      setActiveTab(tabs, index);
    });
  });
});

const burger = document.querySelector("[data-burger]");
const menuWrapper = document.querySelector("[data-menu-wrapper]");


burger.addEventListener("click", () => {
  burger.classList.toggle("show");
  menuWrapper.classList.toggle("show");
});
