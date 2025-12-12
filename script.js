document.addEventListener('DOMContentLoaded', () => {
    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        revealElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Trigger once on load
    revealOnScroll();


    // --- Mobile Menu ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileMenuPanel = document.querySelector('.mobile-menu-panel');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (mobileMenuBtn && closeMenuBtn && mobileMenuPanel) {
        const toggleMenu = () => {
            mobileMenuPanel.classList.toggle('active');
            document.body.style.overflow = mobileMenuPanel.classList.contains('active') ? 'hidden' : 'auto';
        };

        mobileMenuBtn.addEventListener('click', toggleMenu);
        closeMenuBtn.addEventListener('click', toggleMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }


    // --- Carousel Logic ---
    const carouselContainer = document.querySelector('.carousel-container');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (carouselContainer && prevBtn && nextBtn) {
        const getScrollDistance = () => {
            const referenceCard = carouselContainer.querySelector('.project-card');
            if (!referenceCard) return 0;
            const gap = 32; // matches CSS gap (2rem)
            return referenceCard.offsetWidth + gap;
        };

        const scrollByStep = (direction) => {
            const distance = getScrollDistance();
            if (!distance) return;
            carouselContainer.scrollBy({
                left: direction * distance,
                behavior: 'smooth'
            });
        };

        nextBtn.addEventListener('click', () => scrollByStep(1));
        prevBtn.addEventListener('click', () => scrollByStep(-1));

        // Enable swipe gestures on touch devices
        let touchStartX = 0;
        let touchStartY = 0;
        let touchCurrentX = 0;
        let touchCurrentY = 0;
        let isSwiping = false;
        const swipeThreshold = 60;

        const onTouchStart = (event) => {
            const touch = event.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchCurrentX = touchStartX;
            touchCurrentY = touchStartY;
            isSwiping = true;
        };

        const onTouchMove = (event) => {
            if (!isSwiping) return;
            const touch = event.touches[0];
            touchCurrentX = touch.clientX;
            touchCurrentY = touch.clientY;
        };

        const onTouchEnd = () => {
            if (!isSwiping) return;
            const deltaX = touchCurrentX - touchStartX;
            const deltaY = touchCurrentY - touchStartY;
            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);

            if (absDeltaX > swipeThreshold && absDeltaX > absDeltaY) {
                scrollByStep(deltaX < 0 ? 1 : -1);
            }

            isSwiping = false;
        };

        carouselContainer.addEventListener('touchstart', onTouchStart, { passive: true });
        carouselContainer.addEventListener('touchmove', onTouchMove, { passive: true });
        carouselContainer.addEventListener('touchend', onTouchEnd);
        carouselContainer.addEventListener('touchcancel', onTouchEnd);
    }

    // --- Project Modal Preview ---
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalClose = document.querySelector('.modal-close');
    const modalSlides = document.querySelector('.modal-slides');
    const modalPrev = document.querySelector('.modal-nav.prev');
    const modalNext = document.querySelector('.modal-nav.next');

    let modalIndex = 0;

    const projectCards = document.querySelectorAll('.project-card');
    let currentImages = [];

    const renderModalSlide = () => {
        modalSlides.innerHTML = '';
        const currentSrc = currentImages[modalIndex];
        if (!currentSrc) return;

        const slide = document.createElement('div');
        slide.className = 'modal-slide';
        const img = document.createElement('img');
        img.src = currentSrc;
        img.loading = 'lazy';
        img.onerror = () => {
            img.remove();
            const placeholder = document.createElement('div');
            placeholder.style.width = '100%';
            placeholder.style.height = '420px';
            placeholder.style.background = 'linear-gradient(45deg, #334155, #0ea5e9)';
            slide.appendChild(placeholder);
        };
        slide.appendChild(img);
        modalSlides.appendChild(slide);
        requestAnimationFrame(() => {
            slide.classList.add('active');
        });
    };

    const openModalWithImages = (images = []) => {
        currentImages = images;
        modalIndex = 0;
        renderModalSlide();

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    modalClose && modalClose.addEventListener('click', closeModal);
    modalOverlay && modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    modalNext && modalNext.addEventListener('click', () => {
        const total = currentImages.length;
        if (total === 0) return;
        modalIndex = (modalIndex + 1) % total;
        renderModalSlide();
    });

    modalPrev && modalPrev.addEventListener('click', () => {
        const total = currentImages.length;
        if (total === 0) return;
        modalIndex = (modalIndex - 1 + total) % total;
        renderModalSlide();
    });

    // Bind each "Lihat Detail" to open modal with placeholder images
    projectCards.forEach((card) => {
        const detailLink = card.querySelector('.btn-link');
        const dataImages = card.getAttribute('data-images');
        const images = dataImages
            ? dataImages.split(',').map(s => s.trim()).filter(Boolean)
            : [
                `https://picsum.photos/seed/${Math.random().toString(36).slice(2)}/1200/800`,
                `https://picsum.photos/seed/${Math.random().toString(36).slice(2)}/1200/800`,
                `https://picsum.photos/seed/${Math.random().toString(36).slice(2)}/1200/800`
              ];

        detailLink && detailLink.addEventListener('click', (e) => {
            e.preventDefault();
            openModalWithImages(images);
        });
    });
});

// ============ Gallery Lightbox ============
document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryLightbox = document.querySelector('.gallery-lightbox');
    const lightboxImg = galleryLightbox.querySelector('.lightbox-img');
    const lightboxCaption = galleryLightbox.querySelector('.lightbox-caption');
    const lightboxClose = galleryLightbox.querySelector('.lightbox-close');
    const lightboxPrev = galleryLightbox.querySelector('.lightbox-nav.prev');
    const lightboxNext = galleryLightbox.querySelector('.lightbox-nav.next');
    
    let currentGalleryIndex = 0;
    const galleryImages = Array.from(galleryItems).map(item => {
        const img = item.querySelector('.gallery-thumb');
        return {
            src: img.src,
            alt: img.alt || 'Kegiatan'
        };
    });
    
    const openLightbox = (index) => {
        currentGalleryIndex = index;
        lightboxImg.src = galleryImages[index].src;
        lightboxImg.alt = galleryImages[index].alt;
        lightboxCaption.textContent = galleryImages[index].alt;
        galleryLightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    const closeLightbox = () => {
        galleryLightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    };
    
    const navigateLightbox = (direction) => {
        if (direction === 'next') {
            currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
        } else {
            currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
        }
        lightboxImg.src = galleryImages[currentGalleryIndex].src;
        lightboxImg.alt = galleryImages[currentGalleryIndex].alt;
        lightboxCaption.textContent = galleryImages[currentGalleryIndex].alt;
    };
    
    // Event listeners
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
    lightboxNext.addEventListener('click', () => navigateLightbox('next'));
    
    // Close on backdrop click
    galleryLightbox.addEventListener('click', (e) => {
        if (e.target === galleryLightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!galleryLightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox('prev');
        if (e.key === 'ArrowRight') navigateLightbox('next');
    });
});