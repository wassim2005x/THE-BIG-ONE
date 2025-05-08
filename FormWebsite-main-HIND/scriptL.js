document.addEventListener('DOMContentLoaded', function() {
    // Theme switching
    const themeToggle = document.getElementById('themeToggle');
    const body = document.documentElement;

    // Check for saved theme preference or use default
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    if (themeToggle) { // Add check for element existence
        themeToggle.checked = currentTheme === 'dark';
    }

    // Toggle theme when switch is clicked
    if (themeToggle) { // Add check for element existence
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // --- Cookie Consent Logic START ---
    const cookieBanner = document.getElementById('cookieConsentBanner');
    const acceptButton = document.getElementById('acceptCookies');

    // Check if consent has already been given
   if (cookieBanner) { // Check only if the banner element exists
    // Show the banner after a short delay
    setTimeout(() => {
        cookieBanner.classList.add('visible');
    }, 500); // Wait 500ms before showing
}

// Add event listener to the accept button (still hides it on click for the current session)
if (acceptButton && cookieBanner) {
    acceptButton.addEventListener('click', () => {
        // OPTIONAL: You can keep this line so the click still *seems* to save something,
        // or remove it. It won't prevent showing next time either way now.
        localStorage.setItem('cookieConsentGiven', 'true'); // This line now has no effect on showing the banner next time

        // Hide the banner for this session after clicking accept
        cookieBanner.classList.remove('visible');
    });
} 
    // --- Cookie Consent Logic END ---


    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburger && mobileMenu) { // Add checks for elements
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !mobileMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });

        // Close mobile menu when clicking on a mobile menu item
        const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
        mobileMenuItems.forEach(item => {
            item.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }


    // FAQ Accordions
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length > 0) { // Check if FAQ items exist
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) { // Check if question element exists
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');

                    // Close all FAQs
                    faqItems.forEach(faq => {
                        faq.classList.remove('active');
                        const icon = faq.querySelector('.faq-icon i');
                        if (icon) { // Check if icon exists
                           icon.className = 'fas fa-plus';
                        }
                    });

                    // If the clicked one wasn't active, make it active
                    if (!isActive) {
                        item.classList.add('active');
                        const icon = item.querySelector('.faq-icon i');
                         if (icon) { // Check if icon exists
                            icon.className = 'fas fa-minus';
                        }
                    }
                });
            }
        });
    }


    // Testimonial Slider
    const testimonialList = document.getElementById('testimonial-list');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    let testimonialInterval; // To manage the interval

    if (testimonialList && dots.length > 0 && prevBtn && nextBtn) { // Check elements exist
        let currentSlide = 0;
        const slideWidth = 100; // percentage

        function updateSlider() {
            if (testimonialList && dots.length > 0) { // Check again inside function
                testimonialList.style.transform = `translateX(-${currentSlide * slideWidth}%)`;

                // Update dots
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
            }
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % dots.length;
            updateSlider();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + dots.length) % dots.length;
            updateSlider();
        }

        // Initialize
        updateSlider();

        // Next button
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval(); // Reset timer on manual navigation
        });

        // Previous button
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval(); // Reset timer on manual navigation
        });

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateSlider();
                resetInterval(); // Reset timer on manual navigation
            });
        });

        // Function to reset the auto slide interval
        function resetInterval() {
            clearInterval(testimonialInterval);
            testimonialInterval = setInterval(nextSlide, 5000);
        }

        // Start auto slide
        resetInterval();

    } // End if check for testimonial elements


    // Scroll animations (Original simplified one - keeping observer below)
    // const animateOnScroll = function() {
    //     const elements = document.querySelectorAll('.animate-on-scroll');
    //     elements.forEach(element => {
    //         const elementPosition = element.getBoundingClientRect().top;
    //         const windowHeight = window.innerHeight;
    //         if (elementPosition < windowHeight - 50) {
    //             element.classList.add('animate');
    //         }
    //     });
    // };
    // window.addEventListener('scroll', animateOnScroll);
    // window.addEventListener('load', animateOnScroll);


    // Parallax and scroll effects for big title section
    const parallaxBackground = document.querySelector('.parallax-background');
    const starsLayer = document.querySelector('.stars-layer');
    const glowLayer = document.querySelector('.glow-layer');
    const titleContainer = document.querySelector('.title-container');
    const bigTitle = document.querySelector('.big-title');
    const bigTitleSection = document.querySelector('.big-title-section'); // Get the section element

    if (bigTitle) { // Check if element exists
        // Activate title on page load
        setTimeout(() => {
            bigTitle.classList.add('active');
        }, 500);
    }

    if (parallaxBackground && starsLayer && glowLayer && titleContainer && bigTitle && bigTitleSection) { // Check all elements exist
        // Improved parallax scroll effect
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const sectionTop = bigTitleSection.offsetTop;
            const sectionHeight = bigTitleSection.offsetHeight;

            // Only apply parallax when the section is in view
            if (scrollPosition >= sectionTop - window.innerHeight &&
                scrollPosition <= sectionTop + sectionHeight) {

                // Calculate how far we've scrolled into the section
                const relativeScroll = scrollPosition - (sectionTop - window.innerHeight);

                // Apply different parallax speeds
                starsLayer.style.transform = `translateZ(-2px) scale(3) translateY(${relativeScroll * 0.1}px)`;
                glowLayer.style.transform = `translateZ(-1px) scale(2) translateY(${relativeScroll * 0.05}px)`;

                // Subtle title movement
                titleContainer.style.transform = `translateY(${relativeScroll * -0.02}px)`;

                // Fade in the title as we scroll
                const opacity = Math.min(1, relativeScroll / (window.innerHeight * 0.5));
                bigTitle.style.opacity = opacity;
                bigTitle.classList.toggle('active', opacity > 0.5);
            }
        });
    }

    // Smooth scroll for "Let's Go" button
    const letsGoBtn = document.querySelector('.lets-go-btn');
    if (letsGoBtn) {
        letsGoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop, // Adjust offset if needed
                    behavior: 'smooth'
                });
            }
        });
    }

    // Initialize scroll effects (handled by IntersectionObserver below)
    // animateOnScroll(); // Removed this, using observer

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) { // Check if header exists
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('header-scrolled'); // Add scrolled class immediately
                if (window.scrollY > lastScrollY) {
                    // Scrolling down
                    header.classList.add('header-hidden');
                } else {
                    // Scrolling up
                    header.classList.remove('header-hidden');
                }
            } else {
                header.classList.remove('header-scrolled');
                header.classList.remove('header-hidden');
            }

            lastScrollY = window.scrollY <= 0 ? 0 : window.scrollY; // For Mobile or negative scrolling
        });
    }


    // Integration Hub Connection Lines
    const connectionsContainer = document.querySelector('.connections-container');
    const integrationCenter = document.querySelector('.integration-center');
    const integrationItems = document.querySelectorAll('.integration-item');

    if (connectionsContainer && integrationCenter && integrationItems.length > 0) {
        // Create SVG for connection lines
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.style.zIndex = "2";
        svg.style.pointerEvents = "none";

        // Create defs for gradient and filters
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

        // Gradient
        const linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        linearGradient.id = "line-gradient";
        linearGradient.setAttribute("x1", "0%");
        linearGradient.setAttribute("y1", "0%");
        linearGradient.setAttribute("x2", "100%");
        linearGradient.setAttribute("y2", "100%");

        const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", "var(--primary-color, #6a0dad)"); // Use CSS variable
        stop1.setAttribute("stop-opacity", "0.7");

        const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop2.setAttribute("offset", "100%");
        stop2.setAttribute("stop-color", "var(--secondary-color, #8b5cf6)"); // Use another theme variable or adjust
        stop2.setAttribute("stop-opacity", "0.7");

        linearGradient.appendChild(stop1);
        linearGradient.appendChild(stop2);
        defs.appendChild(linearGradient);
        svg.appendChild(defs);

        // Function to create a connection line
        function createConnectionLine(item, index) {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
            line.setAttribute("stroke", "url(#line-gradient)");
            line.setAttribute("stroke-width", "2");
            line.setAttribute("fill", "none");
            line.setAttribute("stroke-dasharray", "4,4");
            line.setAttribute("opacity", "0");
            line.classList.add("integration-line");

            // Add glow effect filter
            const filterId = `glow-${index}`; // Use index for unique ID
            let glow = defs.querySelector(`#${filterId}`);
            if (!glow) { // Only create filter if it doesn't exist
                glow = document.createElementNS("http://www.w3.org/2000/svg", "filter");
                glow.id = filterId;

                const feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
                feGaussianBlur.setAttribute("stdDeviation", "2.5");
                feGaussianBlur.setAttribute("result", "coloredBlur");
                glow.appendChild(feGaussianBlur);

                const feMerge = document.createElementNS("http://www.w3.org/2000/svg", "feMerge");
                const feMergeNode1 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
                feMergeNode1.setAttribute("in", "coloredBlur");
                const feMergeNode2 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
                feMergeNode2.setAttribute("in", "SourceGraphic");
                feMerge.appendChild(feMergeNode1);
                feMerge.appendChild(feMergeNode2);
                glow.appendChild(feMerge);
                defs.appendChild(glow);
            }
            line.setAttribute("filter", `url(#${filterId})`);

            svg.appendChild(line);
            return line;
        }

        // Store lines in an array
        const lines = [];

        // Update connection lines positions
        function updateConnectionLines() {
            if (!integrationCenter || !connectionsContainer) return; // Guard clause

            const centerRect = integrationCenter.getBoundingClientRect();
            const containerRect = connectionsContainer.getBoundingClientRect();

            if (containerRect.width === 0 || containerRect.height === 0) return; // Don't update if container not visible

            const centerX = centerRect.left + centerRect.width / 2 - containerRect.left;
            const centerY = centerRect.top + centerRect.height / 2 - containerRect.top;

            integrationItems.forEach((item, index) => {
                if (!item.lineElement) {
                    item.lineElement = createConnectionLine(item, index);
                    lines.push(item.lineElement); // Add to lines array
                }

                const itemRect = item.getBoundingClientRect();
                const itemX = itemRect.left + itemRect.width / 2 - containerRect.left;
                const itemY = itemRect.top + itemRect.height / 2 - containerRect.top;

                // Create a curved path using Q (quadratic Bezier)
                // Control point slightly offset towards center for curvature
                const controlX = (centerX + itemX) / 2;
                const controlY = (centerY + itemY) / 2 - Math.abs(centerY - itemY) * 0.1; // Adjust curve amount
                const path = `M ${centerX} ${centerY} Q ${controlX} ${controlY} ${itemX} ${itemY}`;

                item.lineElement.setAttribute("d", path);

                // Re-trigger animation if needed (e.g., on resize after initial load)
                if (item.lineElement.style.opacity === "1") { // Only if already visible
                    const length = item.lineElement.getTotalLength();
                    if(length > 0) { // Check if length is valid
                        item.lineElement.style.transition = 'none'; // Temporarily remove transition for reset
                        item.lineElement.setAttribute("stroke-dasharray", `${length} ${length}`);
                        item.lineElement.setAttribute("stroke-dashoffset", length);
                         // Force reflow to apply reset immediately
                        item.lineElement.getBoundingClientRect();
                         item.lineElement.style.transition = "stroke-dashoffset 1.5s ease-in-out 0.5s, opacity 0.5s ease"; // Restore transition
                        item.lineElement.setAttribute("stroke-dashoffset", "0");
                    }
                }
            });
        }

        // Function to animate lines initially
        function animateLinesInitially() {
            lines.forEach((line, index) => {
                 const length = line.getTotalLength();
                 if(length > 0) { // Ensure length is calculated
                    line.setAttribute("stroke-dasharray", `${length} ${length}`);
                    line.setAttribute("stroke-dashoffset", length);
                    line.style.transition = "stroke-dashoffset 1.5s ease-in-out 0.5s, opacity 0.5s ease"; // Add transition here
                    line.style.opacity = "1"; // Set opacity before animating dashoffset
                    setTimeout(() => {
                        line.setAttribute("stroke-dashoffset", "0");
                    }, index * 150 + 500); // Stagger animation start
                 }

                 // Animate the corresponding item
                 const item = integrationItems[index];
                 if (item) {
                    setTimeout(() => {
                        item.style.opacity = "1";
                        item.style.transform = "scale(1)";
                    }, index * 150 + 300); // Stagger item animation slightly before line completes
                 }
            });
        }

        // Add the SVG to the container
        connectionsContainer.appendChild(svg);

        // Use Intersection Observer to trigger initial animation
        const integrationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => { // Delay calculation slightly
                        updateConnectionLines(); // Calculate positions first
                        animateLinesInitially(); // Then animate
                        integrationObserver.unobserve(entry.target); // Only run once
                    }, 200);
                }
            });
        }, { threshold: 0.3 }); // Trigger when 30% visible

        integrationObserver.observe(connectionsContainer);

        // Update positions on resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateConnectionLines, 150); // Debounce resize updates
        });

        // Add pulse animation to center hub
        const hubIcon = document.querySelector('.hub-icon');
        if (hubIcon) {
            hubIcon.classList.add('pulse-animation');
        }

         // Add 3D tilt effect on hover for integration items
        integrationItems.forEach(item => {
            item.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) - 0.5; // Center origin
                const y = ((e.clientY - rect.top) / rect.height) - 0.5; // Center origin

                // Apply more subtle rotation
                const rotateX = y * -10; // Invert Y for natural feel, reduce intensity
                const rotateY = x * 10; // Reduce intensity

                this.style.transform = `perspective(1000px) scale(1.1) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                this.style.transition = 'transform 0.1s ease-out'; // Faster transition during move
            });

            item.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)';
                this.style.transition = 'transform 0.4s ease-out'; // Slower transition back
            });
        });

    } // End if check for Integration Hub elements


    // Hero Section Animations
    const hero = document.querySelector('.hero-dark');
    if (hero) {
        // Create circuit nodes
        const circuitContainer = document.querySelector('.circuit-lines');
        if (circuitContainer) {
             // Clear existing nodes if any (e.g., during HMR in dev)
            circuitContainer.innerHTML = '';
            for (let i = 0; i < 25; i++) { // Increased node count slightly
                const node = document.createElement('div');
                node.classList.add('circuit-node');
                node.style.top = `${Math.random() * 100}%`;
                node.style.left = `${Math.random() * 100}%`;
                node.style.animationDelay = `${Math.random() * 6}s`; // Slightly longer random delay
                const size = Math.random() * 2 + 1.5; // Smaller size range
                node.style.width = `${size}px`;
                node.style.height = node.style.width;
                circuitContainer.appendChild(node);
            }
        }

        // Add animated outline to CTA button
        const ctaButton = hero.querySelector('.cta-button.animated'); // Target the specific animated button
        if (ctaButton && !ctaButton.querySelector('.button-outline')) { // Check if outline exists
            const buttonOutline = document.createElement('span');
            buttonOutline.classList.add('button-outline');
            ctaButton.appendChild(buttonOutline);
            ctaButton.style.position = 'relative'; // Ensure button has relative positioning
            ctaButton.style.zIndex = '1'; // Ensure button is above outline
        }
    }


    // Smooth scroll for anchor links (Improved)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Exclude buttons or links not meant for scrolling (like Let's Go handled separately)
            if (href === '#' || this.classList.contains('lets-go-btn') || this.closest('.mobile-menu')) {
                // Let mobile menu links handle closing separately
                 if (this.closest('.mobile-menu') && hamburger && mobileMenu) {
                    hamburger.classList.remove('active');
                    mobileMenu.classList.remove('active');
                }
                // Don't prevent default for basic '#' or already handled buttons
                if(href !== '#') e.preventDefault();
                // If it's the Let's Go button, its specific handler will run
                if(this.classList.contains('lets-go-btn')) return;
            }

            try { // Use try-catch for invalid selectors
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault(); // Prevent default only if target exists
                    const headerOffset = header ? header.offsetHeight + 20 : 100; // Dynamic offset + buffer
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (hamburger && mobileMenu && mobileMenu.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        mobileMenu.classList.remove('active');
                    }
                }
            } catch (error) {
                console.warn("Smooth scroll failed for selector:", href, error);
            }
        });
    });


    // Animation on scroll (Using Intersection Observer)
    const animatedElements = document.querySelectorAll('[data-scroll]'); // Target elements with data-scroll attribute

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observerInstance.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, { threshold: 0.15 }); // Trigger when 15% visible

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for older browsers (optional: could add simple scroll check)
        console.warn("IntersectionObserver not supported. Scroll animations may not work.");
        animatedElements.forEach(el => el.classList.add('visible')); // Show elements immediately
    }


    // Create 3D Sphere Animation
    const createSphere = () => {
        const sphereParticles = document.querySelector('.sphere-particles');
        if (!sphereParticles) return;

        // Check if sphere already exists to avoid duplicates on resize
        if (sphereParticles.children.length > 0 && window.innerWidth === sphereParticles.dataset.lastWidth) return;
        sphereParticles.dataset.lastWidth = window.innerWidth; // Store current width


        // Clear any existing particles
        sphereParticles.innerHTML = '';

        const PARTICLE_COUNT = window.innerWidth < 768 ? 150 : 300; // Fewer particles on mobile
        const COLORS = [
            'rgba(99, 102, 241, 0.8)',  // Indigo
            'rgba(139, 92, 246, 0.8)',  // Purple
            'rgba(147, 51, 234, 0.7)',  // Violet
            'rgba(59, 130, 246, 0.6)',  // Blue
            'rgba(79, 70, 229, 0.7)'    // Indigo-blue
        ];

        // Radius of the sphere, responsive
        const radius = window.innerWidth < 768 ? 150 : 250;

        // Create particles in a spherical formation
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Fibonacci lattice for more even distribution
            const goldenRatio = (1 + Math.sqrt(5)) / 2;
            const theta = 2 * Math.PI * i / goldenRatio;
            const phi = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT);

            // Convert to Cartesian coordinates
            const x = Math.cos(theta) * Math.sin(phi);
            const y = Math.sin(theta) * Math.sin(phi);
            const z = Math.cos(phi);

            // Create particle element
            const particle = document.createElement('div');
            particle.classList.add('sphere-particle');

            // Random size
            const size = Math.random() * 2.5 + 1.5; // Adjusted size range

            // Random color from our palette
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];

            // Set CSS variables for positioning and animation
            particle.style.setProperty('--x', `${x * radius}px`);
            particle.style.setProperty('--y', `${y * radius}px`);
            particle.style.setProperty('--z', `${z * radius}px`);
            particle.style.setProperty('--delay', `${Math.random() * 4}s`); // Random animation delay
            particle.style.setProperty('--duration', `${4 + Math.random() * 3}s`); // Random duration

            // Apply styles inline for direct control
            particle.style.cssText = `
                position: absolute;
                left: 50%;
                top: 50%;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                transform: translate(-50%, -50%) translate3d(var(--x), var(--y), var(--z));
                box-shadow: 0 0 ${size + 2}px ${color};
                opacity: 0; /* Start hidden */
                animation: float var(--duration) ease-in-out var(--delay) infinite alternate, fadeIn 0.5s ease var(--delay) forwards;
            `;

            sphereParticles.appendChild(particle);
        }
    };

    // Create floating animation keyframes if they don't exist
    if (!document.getElementById('sphere-keyframes')) {
        const style = document.createElement('style');
        style.id = 'sphere-keyframes';
        style.textContent = `
            @keyframes float {
                0% {
                    transform: translate(-50%, -50%) translate3d(var(--x), var(--y), var(--z)) scale(1);
                }
                100% {
                    /* Adjust float distance based on particle position slightly */
                    transform: translate(-50%, -50%) translate3d(calc(var(--x) + ${Math.random() * 10 - 5}px), calc(var(--y) + ${Math.random() * 10 - 5}px), calc(var(--z) + ${Math.random() * 5 - 2.5}px)) scale(1.05);
                }
            }
             @keyframes fadeIn {
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize sphere
    createSphere();

    // Recreate sphere on window resize (debounced)
    let sphereResizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(sphereResizeTimeout);
        sphereResizeTimeout = setTimeout(createSphere, 250); // Debounce resize
    });

    // Scroll down icon functionality
    const scrollDownIcon = document.querySelector('.scroll-down-container');
    if (scrollDownIcon) {
        scrollDownIcon.addEventListener('click', function() {
            const companiesSection = document.getElementById('companies');
            if (companiesSection) {
                companiesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Scroll reveal animations
    function revealOnScroll() {
        const revealElements = document.querySelectorAll('.section-header, .step-item, .featured-section, .testimonial, .faq-item, .profile-card, .integration-item');
        
        revealElements.forEach((element, index) => {
            // Add reveal class if not already present
            if (!element.classList.contains('reveal')) {
                element.classList.add('reveal');
                // Add different delays for a staggered effect
                element.classList.add(`delay-${index % 5 + 1}`);
            }
            
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
        
        // Add left/right reveal for specific sections
        const leftRevealElements = document.querySelectorAll('.step-item:nth-child(odd), .faq-item:nth-child(odd)');
        const rightRevealElements = document.querySelectorAll('.step-item:nth-child(even), .faq-item:nth-child(even)');
        
        leftRevealElements.forEach(element => {
            if (!element.classList.contains('reveal-left')) {
                element.classList.add('reveal-left');
            }
            
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
        
        rightRevealElements.forEach(element => {
            if (!element.classList.contains('reveal-right')) {
                element.classList.add('reveal-right');
            }
            
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
    }

    // Header scroll effect
    function headerScrollEffect() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    // Run on page load and scroll
    window.addEventListener('scroll', function() {
        revealOnScroll();
        headerScrollEffect();
    });

    window.addEventListener('load', function() {
        revealOnScroll();
        headerScrollEffect();
    });

    // Run once on page load to initialize animations
    setTimeout(revealOnScroll, 500);

}); // End DOMContentLoaded
