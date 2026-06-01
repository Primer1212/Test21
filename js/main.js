document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const menuIconPath = document.getElementById('menu-icon-path');

    if (btn && menu) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent closing immediately
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    function openMenu() {
        btn.setAttribute('aria-expanded', 'true');
        menu.classList.remove('opacity-0', 'invisible', '-translate-y-4');
        menu.classList.add('opacity-100', 'visible', 'translate-y-0');
        // Change icon to close (X)
        if (menuIconPath) menuIconPath.setAttribute('d', 'M6 18L18 6M6 6l12 12');
    }

    function closeMenu() {
        btn.setAttribute('aria-expanded', 'false');
        menu.classList.remove('opacity-100', 'visible', 'translate-y-0');
        menu.classList.add('opacity-0', 'invisible', '-translate-y-4');
        // Change icon back to hamburger
        if (menuIconPath) menuIconPath.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
    }

    // Close mobile menu on link click or click outside
    document.addEventListener('click', (e) => {
        if (menu && !menu.contains(e.target) && !btn.contains(e.target)) {
            if (btn.getAttribute('aria-expanded') === 'true') {
                closeMenu();
            }
        }
    });

    const menuLinks = menu ? menu.querySelectorAll('a') : [];
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Header scroll effect with requestAnimationFrame for performance
    const header = document.getElementById('header');
    let ticking = false;

    if (header) {
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 20) {
                        header.classList.add('shadow-sm');
                        header.classList.replace('bg-white/60', 'bg-white/90');
                        header.classList.replace('border-white/20', 'border-gray-100');
                    } else {
                        header.classList.remove('shadow-sm');
                        header.classList.replace('bg-white/90', 'bg-white/60');
                        header.classList.replace('border-gray-100', 'border-white/20');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // Fallback for Intersection Observer if animation-timeline is not supported
    if (!CSS.supports('animation-timeline: view()')) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('js-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        document.querySelectorAll('.fade-in-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for fixed header
                const headerHeight = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});