document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px 80px 0px'
        });

        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('visible');
            } else {
                revealObserver.observe(el);
            }
        });

        if (window.location.hash) {
            try {
                const hashEl = document.querySelector(window.location.hash);
                if (hashEl) {
                    hashEl.classList.add('visible');
                    hashEl.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => el.classList.add('visible'));
                }
            } catch (e) {}
        }
    } else {
        animatedElements.forEach(el => el.classList.add('visible'));
    }

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
            console.error(err);
            prompt("Email :", text);
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

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#' && !this.closest('.dot-nav')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.classList.add('visible');
                    target.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => el.classList.add('visible'));
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    function openLightbox(src, alt) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = alt || 'Aperçu';

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

    const robotSwitch = document.getElementById('theme-toggle');
    const toggle = document.querySelector('#toggle');
    let isAnimating = false;

    if (robotSwitch) {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let currentTheme = document.documentElement.getAttribute('data-theme') || savedTheme || (prefersDark ? 'dark' : 'light');

        if (typeof gsap !== 'undefined') {
            gsap.set('svg', { visibility: 'visible' });

            if (currentTheme === 'light') {
                gsap.set('#toggle', { x: 0 });
            } else {
                gsap.set('#toggle', { x: -150 });
            }

            function playRobotPush() {
                if (isAnimating) return;
                isAnimating = true;

                let tl = gsap.timeline({
                    onComplete: () => {
                        isAnimating = false;
                    }
                });

                tl.add('fingerIn', '+=0.08')
                    .to('#bothHands', {
                        x: 30,
                        duration: 0.35,
                        ease: 'expo.inOut'
                    }, 'fingerIn')
                    .to('#toggle', {
                        x: -140,
                        duration: 0.3,
                        ease: 'elastic(0.3, 0.6)'
                    }, '-=0.15')
                    .add('handIn', '+=0.15')
                    .to('#bothHands', {
                        x: 169,
                        duration: 0.45,
                        ease: 'expo.inOut'
                    }, 'handIn')
                    .to('#toggle', {
                        x: 0,
                        duration: 0.45,
                        ease: 'expo.inOut',
                        onComplete: () => {
                            currentTheme = 'light';
                            document.documentElement.setAttribute('data-theme', 'light');
                            try {
                                localStorage.setItem('theme', 'light');
                            } catch (e) {}
                        }
                    }, 'handIn')
                    .add('thumbsUp', '+=0.25')
                    .to('.robotHand', {
                        duration: 0.116,
                        opacity: gsap.utils.wrap([0, 1])
                    }, 'thumbsUp')
                    .from('#robotThumb', {
                        rotation: 45,
                        duration: 1,
                        transformOrigin: '55% 95%',
                        ease: 'elastic(0.86, 0.3)'
                    }, 'thumbsUp')
                    .to('#bothHands', {
                        x: '+=20',
                        duration: 0.25,
                        ease: 'power2.inOut'
                    }, 'thumbsUp')
                    .to('#bothHands', {
                        rotation: '-=20',
                        duration: 0.2,
                        transformOrigin: '20% 50%',
                        ease: 'power2.inOut'
                    }, 'thumbsUp')
                    .to('#bothHands', {
                        rotation: 0,
                        duration: 0.35,
                        transformOrigin: '20% 50%',
                        ease: 'elastic(0.86, 0.6)'
                    }, 'thumbsUp+=0.15')
                    .add('handOut', '+=0.1')
                    .to('#bothHands', {
                        x: 0,
                        duration: 0.35,
                        ease: 'back.in(1)'
                    }, 'handOut')
                    .to('#robotThumb', {
                        rotation: 23,
                        duration: 0.3,
                        ease: 'power2.in'
                    }, 'handOut')
                    .set('#robotHand2', { opacity: 0 })
                    .set('#robotHand', { opacity: 1 });
            }

            function slideToLeft() {
                if (isAnimating) return;
                isAnimating = true;

                gsap.to('#toggle', {
                    x: -150,
                    duration: 0.35,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        currentTheme = 'dark';
                        document.documentElement.setAttribute('data-theme', 'dark');
                        try {
                            localStorage.setItem('theme', 'dark');
                        } catch (e) {}
                        isAnimating = false;
                    }
                });
            }

            robotSwitch.addEventListener('click', () => {
                if (isAnimating) return;
                currentTheme = document.documentElement.getAttribute('data-theme') || currentTheme;
                if (currentTheme === 'dark') {
                    playRobotPush();
                } else {
                    slideToLeft();
                }
            });
        } else {
            robotSwitch.addEventListener('click', () => {
                const nextTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', nextTheme);
                try {
                    localStorage.setItem('theme', nextTheme);
                } catch (e) {}
            });
        }
    }
});