(function () {
  function fullSizeSource(src) {
    if (!src) {
      return src;
    }
    return src.replace("/thumbs/", "/");
  }

  function captionFor(image) {
    var card = image.closest(".image_card, .output_card, .card");
    if (!card) {
      return image.alt || "";
    }
    var heading = card.querySelector(".caption h3, h3");
    if (heading && heading.textContent.trim()) {
      return heading.textContent.trim();
    }
    return image.alt || "";
  }

  function createLightbox() {
    var overlay = document.createElement("div");
    overlay.className = "lightbox_overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Expanded image viewer");

    var panel = document.createElement("div");
    panel.className = "lightbox_panel";

    var close = document.createElement("button");
    close.className = "lightbox_close";
    close.type = "button";
    close.setAttribute("aria-label", "Close expanded image");
    close.textContent = "Close";

    var img = document.createElement("img");
    img.className = "lightbox_image";
    img.alt = "";

    var cap = document.createElement("p");
    cap.className = "lightbox_caption";

    panel.appendChild(close);
    panel.appendChild(img);
    panel.appendChild(cap);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    function hide() {
      overlay.classList.remove("visible");
      img.removeAttribute("src");
      document.body.classList.remove("lightbox_open");
    }

    close.addEventListener("click", hide);
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        hide();
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && overlay.classList.contains("visible")) {
        hide();
      }
    });

    return {
      show: function (sourceImage) {
        img.src = fullSizeSource(sourceImage.getAttribute("src"));
        img.alt = sourceImage.getAttribute("alt") || "";
        cap.textContent = captionFor(sourceImage);
        overlay.classList.add("visible");
        document.body.classList.add("lightbox_open");
        close.focus();
      }
    };
  }

  document.addEventListener("DOMContentLoaded", function () {
    var viewer = createLightbox();
    var images = document.querySelectorAll("main img");

    images.forEach(function (image) {
      image.classList.add("expandable_image");
      image.setAttribute("tabindex", "0");
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", "Expand image");
      image.setAttribute("title", "Click to expand");

      image.addEventListener("click", function () {
        viewer.show(image);
      });

      image.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          viewer.show(image);
        }
      });
    });
  });
})();
