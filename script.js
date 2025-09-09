document.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENT SELECTORS ---
    const pageLoader = document.querySelector('.page-loader');
    const scrollProgress = document.querySelector('.scroll-progress');
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('theme-toggle');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    const contactForm = document.querySelector('.contact-form');

    // --- 1. PAGE LOAD ---
    // Hide the loader once the page and its resources are fully loaded.
    window.addEventListener('load', () => {
        setTimeout(() => {
            pageLoader.classList.add('hide');
        }, 300); // A small delay to prevent jarring transitions
    });

    // --- 2. TYPING ANIMATION ---
    if (typeof Typed !== 'undefined') {
        new Typed('#typed-text', {
            strings: ['Student Developer', 'Backend Enthusiast', 'Problem Solver'],
            typeSpeed: 70,
            backSpeed: 50,
            backDelay: 2000,
            loop: true
        });
    }

    // --- 3. THEME TOGGLER ---
    const themeIcon = themeToggle.querySelector('i');
    const currentTheme = localStorage.getItem('theme') || 'light';

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            document.body.removeAttribute('data-theme');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    }
    applyTheme(currentTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = document.body.getAttribute('data-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // --- 4. SCROLL-BASED ACTIONS (PERFORMANCE OPTIMIZED) ---
    let ticking = false;
    let lastScrollY = window.scrollY;

    function handleScroll() {
        const currentScrollY = window.scrollY;

        // A. Navbar Effects (scrolled background + hide/show)
        if (currentScrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');

        if (currentScrollY > lastScrollY && currentScrollY > 150) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollY = currentScrollY;

        // B. Scroll Progress Bar
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (currentScrollY / scrollHeight) * 100;
        scrollProgress.style.width = `${scrollPercentage}%`;

        // C. Show/Hide Scroll-to-Top Button
        if (currentScrollY > 300) scrollToTopBtn.classList.add('show');
        else scrollToTopBtn.classList.remove('show');
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // --- 5. SCROLL-TO-TOP BUTTON CLICK ---
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- 6. HAMBURGER MENU ---
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- 7. SCROLL-TRIGGERED ANIMATIONS (EFFICIENT OBSERVER) ---
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Observe all elements that need this animation
    document.querySelectorAll('.section-title, .about-text, .skills, .skill-item, .project-card, .contact-info, .contact-form')
        .forEach(el => animationObserver.observe(el));

    // --- 8. ACTIVE NAV LINK ON SCROLL ---
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-40% 0px -60% 0px' }); // Activates when section is in the middle 40% of the screen

    document.querySelectorAll('section[id]').forEach(section => navObserver.observe(section));

    // --- 9. CONTACT FORM SUBMISSION UX ---
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            setTimeout(() => { // Simulate API call
                submitButton.textContent = 'Message Sent!';
                submitButton.style.backgroundColor = 'var(--success-color)';
                submitButton.style.borderColor = 'var(--success-color)';

                setTimeout(() => { // Revert button to original state
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    submitButton.style.backgroundColor = '';
                    submitButton.style.borderColor = '';
                    this.reset();
                }, 2000);
            }, 1500);
        });
    }
});