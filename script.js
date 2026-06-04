document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.dot-nav a');

    // Ligne de détection au milieu de l'écran
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', 
        threshold: 0 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                if (!activeId) return; 

                // Éteint tout
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Allume le bouton ciblé
                const activeLink = document.querySelector(`.dot-nav a[href="#${activeId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section.id) {
            observer.observe(section);
        }
    });

    // Clic manuel
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // COPIER EMAIL FUNCTION
    const copyEmailBtn = document.getElementById('copy-email');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', function() {
            const email = 'matys0pro@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                // Feedback visuel
                const originalText = this.textContent;
                this.textContent = '✓ Email copié !';
                this.classList.add('copied');
                
                // Restaurer après 2 secondes
                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Erreur lors de la copie:', err);
                alert('Email: matys0pro@gmail.com');
            });
        });
    }

    // SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // LIGHTBOX / IMAGE PREVIEW
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    function openLightbox(src, alt) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox || !lightboxImg) return;
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImg.src = '';
        document.body.style.overflow = '';
    }

    document.body.addEventListener('click', function(e) {
        const t = e.target;
        if (t.classList && t.classList.contains('screenshot-thumb')) {
            const full = t.getAttribute('data-full') || t.src;
            openLightbox(full, t.alt || '');
        }
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeLightbox();
    });
});