document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.2)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    // ==========================================
    // HERO CAROUSEL
    // ==========================================
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevArrow = document.getElementById('prevArrow');
    const nextArrow = document.getElementById('nextArrow');
    const heroSection = document.querySelector('.hero');
    let currentSlide = 0;
    let autoSlideInterval;
    const AUTO_SLIDE_DELAY = 3000; // 3 seconds
    let isDragging = false;
    let startX = 0;
    let endX = 0;

    // Show specific slide
    function showSlide(index, direction = 'next') {
        // Ensure index is within bounds (infinite loop)
        if (index >= slides.length) {
            index = 0;
        } else if (index < 0) {
            index = slides.length - 1;
        }
        
        // Remove all classes first
        slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });
        
        // Set the previous slide
        if (direction === 'next') {
            slides[currentSlide].classList.add('prev');
        } else {
            // For prev direction, set the new slide to come from left
            slides[index].style.transform = 'translateX(-100%)';
            // Force reflow
            slides[index].offsetHeight;
            slides[index].style.transform = '';
        }
        
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
        });
        dots[currentSlide].classList.add('active');
    }
    
    // Next slide (left to right)
    function nextSlide() {
        showSlide(currentSlide + 1, 'next');
    }
    
    // Previous slide (right to left)
    function prevSlide() {
        showSlide(currentSlide - 1, 'prev');
    }
    
    // Start auto slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, AUTO_SLIDE_DELAY);
    }
    
    // Stop auto slide
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Reset auto slide (for when user interacts)
    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }
    
    // Event listeners for arrows
    prevArrow.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });
    
    nextArrow.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoSlide();
        });
    });
    
    // Pause auto slide on hover
    heroSection.addEventListener('mouseenter', stopAutoSlide);
    heroSection.addEventListener('mouseleave', startAutoSlide);
    
    // Touch/Swipe event handlers
    heroSection.addEventListener('touchstart', handleDragStart, { passive: true });
    heroSection.addEventListener('touchmove', handleDragMove, { passive: true });
    heroSection.addEventListener('touchend', handleDragEnd);
    
    // Mouse drag event handlers
    heroSection.addEventListener('mousedown', handleDragStart);
    heroSection.addEventListener('mousemove', handleDragMove);
    heroSection.addEventListener('mouseup', handleDragEnd);
    heroSection.addEventListener('mouseleave', handleDragEnd);
    
    function handleDragStart(e) {
        isDragging = true;
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }
    
    function handleDragMove(e) {
        if (!isDragging) return;
        endX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }
    
    function handleDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        const diffX = endX - startX;
        const dragThreshold = 50; // Minimum distance to register a swipe
        
        if (Math.abs(diffX) > dragThreshold) {
            if (diffX > 0) {
                // Swipe right - previous slide (right to left)
                prevSlide();
            } else {
                // Swipe left - next slide (left to right)
                nextSlide();
            }
            resetAutoSlide();
        }
    }
    
    // Start the carousel
    startAutoSlide();
    
    // ==========================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==========================================
    // NAVIGATION ACTIVE STATE
    // ==========================================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    function updateActiveNav() {
        let current = '';
        const scrollPosition = window.pageYOffset + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    
    // ==========================================
    // SCROLL ANIMATIONS
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.about-text, .about-image, .service-card, .contact-cta-content, .footer-col');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
    
    // ==========================================
    // MOBILE MENU TOGGLE
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    const desktopDropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
            
            // Close desktop dropdowns when clicking outside
            desktopDropdownToggles.forEach(toggle => {
                const parentDropdown = toggle.closest('.dropdown');
                if (!parentDropdown.contains(e.target)) {
                    parentDropdown.classList.remove('active');
                }
            });
        });
        
        // Close menu when clicking a link
        const mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }
    
    // Mobile dropdown toggle
    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parentDropdown = toggle.closest('.mobile-dropdown');
            parentDropdown.classList.toggle('active');
        });
    });
    
    // Desktop dropdown toggle (click support)
    desktopDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const parentDropdown = toggle.closest('.dropdown');
            // Close other open dropdowns
            desktopDropdownToggles.forEach(otherToggle => {
                const otherDropdown = otherToggle.closest('.dropdown');
                if (otherDropdown !== parentDropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            parentDropdown.classList.toggle('active');
        });
    });

    // ==========================================
    // ELV CAROUSELS
    // ==========================================
    const elvCarousels = document.querySelectorAll('.elv-carousel');
    
    elvCarousels.forEach(carousel => {
        const track = carousel.querySelector('.elv-carousel-track');
        const slides = carousel.querySelectorAll('.elv-carousel-slide');
        const prevBtn = carousel.querySelector('.elv-carousel-prev');
        const nextBtn = carousel.querySelector('.elv-carousel-next');
        const dotsContainer = carousel.querySelector('.elv-carousel-dots');
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        let autoSlideInterval;
        const AUTO_SLIDE_DELAY = 3000; // 3 seconds
        
        // Create dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('elv-carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                resetAutoSlide();
                goToSlide(i);
            });
            dotsContainer.appendChild(dot);
        }
        
        const dots = carousel.querySelectorAll('.elv-carousel-dot');
        
        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        function goToSlide(index) {
            if (index >= totalSlides) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = totalSlides - 1;
            } else {
                currentIndex = index;
            }
            updateCarousel();
        }
        
        function nextSlide() {
            goToSlide(currentIndex + 1);
        }
        
        function prevSlide() {
            goToSlide(currentIndex - 1);
        }
        
        function startAutoSlide() {
            if (autoSlideInterval) clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, AUTO_SLIDE_DELAY);
        }
        
        function resetAutoSlide() {
            startAutoSlide();
        }
        
        prevBtn.addEventListener('click', () => {
            resetAutoSlide();
            prevSlide();
        });
        
        nextBtn.addEventListener('click', () => {
            resetAutoSlide();
            nextSlide();
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                resetAutoSlide();
                nextSlide();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                resetAutoSlide();
                prevSlide();
            }
        }
        
        // Mouse drag support
        let isMouseDragging = false;
        let mouseStartX = 0;
        
        carousel.addEventListener('mousedown', (e) => {
            isMouseDragging = true;
            mouseStartX = e.screenX;
        });
        
        carousel.addEventListener('mouseup', (e) => {
            if (isMouseDragging) {
                const mouseEndX = e.screenX;
                const dragThreshold = 50;
                if (mouseEndX < mouseStartX - dragThreshold) {
                    resetAutoSlide();
                    nextSlide();
                } else if (mouseEndX > mouseStartX + dragThreshold) {
                    resetAutoSlide();
                    prevSlide();
                }
            }
            isMouseDragging = false;
        });
        
        carousel.addEventListener('mouseleave', () => {
            isMouseDragging = false;
        });
        
        // Start auto sliding
        if (totalSlides > 1) {
            startAutoSlide();
        }
    });
});