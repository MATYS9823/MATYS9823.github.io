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
});