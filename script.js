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
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    const toggleMenu = () => {
        mobileMenuOverlay.classList.toggle('active');
        document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : 'auto';
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });


    // --- Carousel Logic ---
    const carouselContainer = document.querySelector('.carousel-container');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (carouselContainer && prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
            const cardWidth = carouselContainer.querySelector('.project-card').offsetWidth;
            const gap = 32; // 2rem gap
            carouselContainer.scrollBy({
                left: cardWidth + gap,
                behavior: 'smooth'
            });
        });

        prevBtn.addEventListener('click', () => {
            const cardWidth = carouselContainer.querySelector('.project-card').offsetWidth;
            const gap = 32; // 2rem gap
            carouselContainer.scrollBy({
                left: -(cardWidth + gap),
                behavior: 'smooth'
            });
        });
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