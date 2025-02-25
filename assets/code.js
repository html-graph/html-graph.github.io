document.querySelectorAll("[data-code]").forEach((element) => {
  const url = element.dataset.code;
  console.log(url);

  fetch(url)
    .then((res) => res.text())
    .then((text) => {
      element.innerText = text;
    });
});
