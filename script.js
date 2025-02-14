
        // Preloader
        window.addEventListener('load', () => {
            const preloader = document.querySelector('.preloader');
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                // Trigger initial reveal check
                revealOnScroll();
            }, 500);
        });

        // Scroll Progress
        const scrollProgress = document.querySelector('.scroll-progress');
        const scrollToTop = document.querySelector('.scroll-to-top');

        window.addEventListener('scroll', () => {
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / height) * 100;
            scrollProgress.style.width = `${scrolled}%`;
            scrollProgress.setAttribute('aria-valuenow', Math.round(scrolled));

            if (window.scrollY > 500) {
                scrollToTop.classList.add('visible');
            } else {
                scrollToTop.classList.remove('visible');
            }

            // Call reveal function on scroll
            revealOnScroll();
        });

        scrollToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Section Reveal Animation
        const revealElements = document.querySelectorAll('section');
        
        const revealOnScroll = () => {
            revealElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight - 100) {
                    element.classList.add('reveal', 'active');
                }
            });
        };

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.querySelector('.navbar.active')) {
                toggleMenu(false);
            }
        });

        // Image Optimization and Lazy Loading
        document.addEventListener('DOMContentLoaded', () => {
            const images = document.querySelectorAll('img');
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        // Load WebP if supported
                        if ('loading' in HTMLImageElement.prototype) {
                            img.loading = 'lazy';
                        }
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => {
                // Add lazy loading attribute
                img.setAttribute('loading', 'lazy');
                // Add alt text if missing
                if (!img.hasAttribute('alt')) {
                    img.setAttribute('alt', 'Portfolio image');
                }
                imageObserver.observe(img);
            });
        });

        // Initialize all tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    
        // Navigation active state and smooth scroll
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section');

        function setActiveLink() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= (sectionTop - sectionHeight/3)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').slice(1) === current) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', setActiveLink);

        // Smooth scroll
        navLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Mobile menu toggle
        const menuBtn = document.querySelector('.menu-btn');
        const navbar = document.querySelector('.navbar');
        let isMenuOpen = false;

        function toggleMenu(open) {
            isMenuOpen = open;
            navbar.classList.toggle('active', open);
            menuBtn.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            document.body.style.overflow = open ? 'hidden' : '';
            menuBtn.style.transform = open ? 'rotate(180deg)' : '';
        }

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu(!isMenuOpen);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !navbar.contains(e.target) && !menuBtn.contains(e.target)) {
                toggleMenu(false);
            }
        });

        // Prevent clicks inside navbar from closing the menu
        navbar.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) {
                    toggleMenu(false);
                }
            });
        });

        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Check for saved theme preference or use system preference
        let currentTheme = localStorage.getItem('theme');
        if (!currentTheme) {
            currentTheme = prefersDarkScheme.matches ? 'dark' : 'light';
        }
        
        // Apply the theme
        function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            const icon = theme === 'dark' ? 'fa-sun' : 'fa-moon';
            const text = theme === 'dark' ? 'Light' : 'Dark';
            themeToggle.innerHTML = `<i class="fas ${icon}"></i><span>${text}</span>`;
            localStorage.setItem('theme', theme);
        }
        
        // Initial theme application
        applyTheme(currentTheme);
        
        // Theme toggle click handler
        themeToggle.addEventListener('click', () => {
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            currentTheme = newTheme;
            applyTheme(newTheme);
        });

        // Update theme when system preference changes
        prefersDarkScheme.addEventListener('change', (e) => {
            const newTheme = e.matches ? 'dark' : 'light';
            currentTheme = newTheme;
            applyTheme(newTheme);
        });
    