(() => {
  'use strict';

  // ============================================================
  // ФОТОГРАФИИ САЙТА — МЕНЯЙТЕ ССЫЛКИ ТОЛЬКО В ЭТОМ БЛОКЕ.
  // ============================================================
  const SITE_IMAGES = {
    heroMain: 'https://avatars.mds.yandex.net/get-altay/932730/2a0000016676b83edc3407c19702fd8d581d/XXXL', // ГЛАВНОЕ ФОТО: первый экран + первая фотография галереи

    heroDetail: 'https://avatars.mds.yandex.net/get-altay/14110197/2a0000019445d4ef59a2c96fe1b00b862cc1/XXXL', // ВТОРОЕ ФОТО ИНТЕРЬЕРА: маленькое фото + вторая фотография галереи

    hookah: 'https://avatars.mds.yandex.net/get-altay/11183932/2a00000190a04d0bc34107398b5d17000200/XXXL', // ФОТО КАЛЬЯНА: блок «Настроение» + третья фотография галереи

    drinks: 'https://avatars.mds.yandex.net/get-altay/19673716/2a0000019d7be47b02b82033f70323d99363/XXXL' // ФОТО НАПИТКОВ: четвёртая фотография галереи
  };

  // ============================================================
  // ОБНОВЛЕНИЕ ФОТОГРАФИЙ
  // Все изображения берут ссылки из SITE_IMAGES.
  // ============================================================

  document.querySelectorAll('[data-site-image]').forEach((img) => {
    const imageKey = img.dataset.siteImage;
    const imageUrl = SITE_IMAGES[imageKey];

    if (imageUrl) {
      img.src = imageUrl;
      img.dataset.currentSiteImage = imageUrl;
    }
  });

  // Галерея использует те же фотографии.
  document.querySelectorAll('[data-gallery-image]').forEach((item) => {
    const imageKey = item.dataset.galleryImage;
    const imageUrl = SITE_IMAGES[imageKey];
    const image = item.querySelector('img');

    if (imageUrl) {
      item.dataset.gallerySrc = imageUrl;
    } else if (image && image.src) {
      item.dataset.gallerySrc = image.src;
    }
  });

  const body = document.body;
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  // ============================================================
  // МОБИЛЬНОЕ МЕНЮ
  // ============================================================

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');

      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute(
        'aria-label',
        isOpen ? 'Закрыть меню' : 'Открыть меню'
      );

      body.classList.toggle('menu-open', isOpen);
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');

        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Открыть меню');

        body.classList.remove('menu-open');
      });
    });
  }

  // ============================================================
  // ТЕКУЩИЙ ГОД В ПОДВАЛЕ
  // ============================================================

  const yearElement = document.getElementById('year');

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ============================================================
  // ОБРАБОТКА ЗАГРУЗКИ ФОТОГРАФИЙ
  // ============================================================

  document.querySelectorAll(
    '.photo-frame img, .gallery-item img'
  ).forEach((img) => {

    img.addEventListener('error', () => {
      img.classList.add('image-load-failed');
      img.style.display = 'none';

      const fallback = img.parentElement &&
        img.parentElement.querySelector('.photo-fallback');

      if (fallback) {
        fallback.style.zIndex = '0';
      }
    }, { once: true });

    img.addEventListener('load', () => {
      img.classList.remove('image-load-failed');
      img.style.display = 'block';

      const fallback = img.parentElement &&
        img.parentElement.querySelector('.photo-fallback');

      if (fallback) {
        fallback.style.zIndex = '-1';
      }
    }, { once: true });

  });

  // ============================================================
  // ГАЛЕРЕЯ С УВЕЛИЧЕНИЕМ ФОТОГРАФИЙ
  // ============================================================

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');

  const closeButton = document.getElementById('lightboxClose');
  const prevButton = document.getElementById('lightboxPrev');
  const nextButton = document.getElementById('lightboxNext');

  const galleryItems = Array.from(
    document.querySelectorAll('[data-gallery-image]')
  );

  let currentImageIndex = 0;

  if (
    lightbox &&
    lightboxImage &&
    closeButton &&
    prevButton &&
    nextButton &&
    galleryItems.length
  ) {

    // Показать выбранную фотографию.
    const showImage = (index) => {

      currentImageIndex =
        (index + galleryItems.length) % galleryItems.length;

      const item = galleryItems[currentImageIndex];
      const itemImage = item.querySelector('img');

      const source =
        item.dataset.gallerySrc ||
        (itemImage && itemImage.src);

      if (!source) return;

      lightboxImage.src = source;

      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');

      body.classList.add('lightbox-open');

      closeButton.focus();
    };

    // Закрыть увеличенную фотографию.
    const closeImage = () => {

      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');

      body.classList.remove('lightbox-open');

      lightboxImage.src = '';
    };

    // Открытие фотографий по нажатию.
    galleryItems.forEach((item, index) => {

      item.addEventListener('click', () => {
        showImage(index);
      });

    });

    // Кнопки управления.
    closeButton.addEventListener('click', closeImage);

    prevButton.addEventListener('click', () => {
      showImage(currentImageIndex - 1);
    });

    nextButton.addEventListener('click', () => {
      showImage(currentImageIndex + 1);
    });

    // Закрытие при нажатии на фон.
    lightbox.addEventListener('click', (event) => {

      if (event.target === lightbox) {
        closeImage();
      }

    });

    // Управление клавиатурой.
    document.addEventListener('keydown', (event) => {

      if (!lightbox.classList.contains('is-open')) return;

      if (event.key === 'Escape') {
        closeImage();
      }

      if (event.key === 'ArrowLeft') {
        showImage(currentImageIndex - 1);
      }

      if (event.key === 'ArrowRight') {
        showImage(currentImageIndex + 1);
      }

    });

  }

})();