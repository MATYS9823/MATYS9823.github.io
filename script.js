document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       1. EFFET MACHINE À ÉCRIRE (TYPEWRITER)
       ========================================================================== */
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const phrases = [
            "BUT Informatique — IUT 2 Grenoble",
            "Développeur Full-Stack & Logiciel",
            "Conception Java & Architecture MVC",
            "Passionné de nouvelles technologies"
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 65;
        const deletingSpeed = 35;
        const pauseAfterComplete = 2000;
        const pauseAfterDelete = 400;

        function type() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }

            let delta = isDeleting ? deletingSpeed : typingSpeed;

            if (!isDeleting && charIndex === currentPhrase.length) {
                delta = pauseAfterComplete;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                delta = pauseAfterDelete;
            }

            setTimeout(type, delta);
        }

        // Lancer l'effet après un court délai
        setTimeout(type, 500);
    }

    /* ==========================================================================
       3. NAVIGATION PAR POINTS (DOT-NAV)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.dot-nav a');

    if (sections.length > 0 && navLinks.length > 0) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === `#${id}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, {
            rootMargin: '-30% 0px -40% 0px',
            threshold: 0
        });

        sections.forEach(section => navObserver.observe(section));

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        e.preventDefault();
                        targetEl.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    /* ==========================================================================
       4. COPIE DES ADRESSES EMAIL DANS LE PRESSE-PAPIER
       ========================================================================== */
    function setupCopyButton(buttonId, textToCopy) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        button.addEventListener('click', () => {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showCopiedFeedback(button);
                }).catch(() => {
                    fallbackCopyText(textToCopy, button);
                });
            } else {
                fallbackCopyText(textToCopy, button);
            }
        });
    }

    function fallbackCopyText(text, button) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showCopiedFeedback(button);
        } catch (err) {
            console.error('Erreur copie:', err);
            prompt("Copiez l'email ci-dessous :", text);
        }
        document.body.removeChild(textArea);
    }

    function showCopiedFeedback(button) {
        const originalText = button.innerHTML;
        button.innerHTML = 'Email copié !';
        button.classList.add('copied');

        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2200);
    }

    setupCopyButton('copy-email-gmail', 'matys0pro@gmail.com');
    setupCopyButton('copy-email-univ', 'matys.lefranc@etu.univ-grenoble-alpes.fr');

    /* ==========================================================================
       5. DÉFILEMENT FLUIDE POUR LES ANCRES (SMOOTH SCROLL)
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#' && !this.closest('.dot-nav')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    /* ==========================================================================
       6. LIGHTBOX / APERÇU AGRANDI DES IMAGES & DIAGRAMMES
       ========================================================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    function openLightbox(src, alt) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = alt || 'Aperçu en grand';

        // Pour les diagrammes SVG, activer le fond blanc pour contraster parfaitement les flèches et écritures noires
        const isDiagram = src.toLowerCase().endsWith('.svg') || src.toLowerCase().includes('diagramme') || src.toLowerCase().includes('diagram');
        if (isDiagram) {
            lightboxImg.classList.add('diagram-mode');
        } else {
            lightboxImg.classList.remove('diagram-mode');
        }

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

    document.body.addEventListener('click', (e) => {
        const target = e.target;
        if (target && target.classList.contains('screenshot-thumb')) {
            const fullSrc = target.getAttribute('data-full') || target.src;
            openLightbox(fullSrc, target.alt);
        }
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
            closeLightbox();
        }
    });

    /* ==========================================================================
       7. BASCULE DU THÈME (LIGHT / DARK THEME TOGGLE)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            let newTheme;
            
            if (currentTheme === 'dark') {
                newTheme = 'light';
            } else if (currentTheme === 'light') {
                newTheme = 'dark';
            } else {
                // Si non défini, on inverse la détection système
                const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                newTheme = prefersDark ? 'light' : 'dark';
            }
            
            document.documentElement.setAttribute('data-theme', newTheme);
            try {
                localStorage.setItem('theme', newTheme);
            } catch (err) {
                console.warn('Impossible de sauvegarder le thème dans localStorage:', err);
            }
        });
    }
});
