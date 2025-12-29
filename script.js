// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
});

closeMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
});

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
}

// Download Tracking
const downloadBtn = document.getElementById('downloadBtn');
const downloadModal = document.getElementById('downloadModal');
const directDownloadLink = document.getElementById('directDownloadLink');

downloadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Track download in Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download', {
            'event_category': 'engagement',
            'event_label': 'apk_download',
            'value': 1
        });
    }
    
    // Show download modal
    downloadModal.classList.add('active');
    
    // Start download after a short delay
    setTimeout(() => {
        window.location.href = downloadBtn.href;
    }, 1500);
});

// Close modal
function closeModal() {
    downloadModal.classList.remove('active');
}

function viewInstallation() {
    closeModal();
    window.location.hash = '#instructions';
    closeMobileMenu();
}

// Copy checksum
function copyChecksum() {
    const checksum = document.getElementById('checksum').textContent;
    navigator.clipboard.writeText(checksum).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = 'var(--primary-dark)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
        }, 2000);
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
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .step, .support-card, .carousel-container').forEach(el => {
    observer.observe(el);
});

// Add animation classes
const style = document.createElement('style');
style.textContent = `
    .feature-card, .step, .support-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .feature-card.animate-in, 
    .step.animate-in, 
    .support-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Update download count
function updateDownloadCount() {
    const countElement = document.querySelector('.stat-item h4');
    if (countElement) {
        let currentCount = parseInt(countElement.textContent.replace(/,/g, ''));
        currentCount += Math.floor(Math.random() * 10) + 1; // Simulate new downloads
        countElement.textContent = currentCount.toLocaleString();
    }
}

// Update count every hour
setInterval(updateDownloadCount, 3600000);



// Hero Carousel Functionality
function initHeroCarousel() {
    const heroCarouselTrack = document.querySelector('.hero-carousel-track');
    const heroSlides = document.querySelectorAll('.hero-carousel-slide');
    const heroDots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.querySelector('.hero-carousel-nav.prev');
    const nextBtn = document.querySelector('.hero-carousel-nav.next');
    
    if (!heroCarouselTrack || heroSlides.length === 0) return;
    
    let currentSlide = 0;
    let autoSlideInterval;
    const totalSlides = heroSlides.length;
    const slideDuration = 4000; // 4 seconds per slide
    
    // Initialize carousel
    updateHeroCarousel();
    startAutoSlide();
    
    // Previous button
    prevBtn.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
        resetAutoSlide();
    });
    
    // Next button
    nextBtn.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
        resetAutoSlide();
    });
    
    // Dot navigation
    heroDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index !== currentSlide) {
                goToSlide(index);
                resetAutoSlide();
            }
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToSlide(currentSlide - 1);
            resetAutoSlide();
        } else if (e.key === 'ArrowRight') {
            goToSlide(currentSlide + 1);
            resetAutoSlide();
        }
    });
    
    // Touch swipe for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;
    
    heroCarouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    heroCarouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next
            goToSlide(currentSlide + 1);
            resetAutoSlide();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous
            goToSlide(currentSlide - 1);
            resetAutoSlide();
        }
    }
    
    // Pause auto-slide on hover
    heroCarouselTrack.addEventListener('mouseenter', () => {
        stopAutoSlide();
    });
    
    heroCarouselTrack.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
    
    // Pause auto-slide when window is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoSlide();
        } else {
            startAutoSlide();
        }
    });
    
    function goToSlide(slideIndex) {
        // Handle wrap-around
        if (slideIndex < 0) {
            slideIndex = totalSlides - 1;
        } else if (slideIndex >= totalSlides) {
            slideIndex = 0;
        }
        
        currentSlide = slideIndex;
        updateHeroCarousel();
    }
    
    function updateHeroCarousel() {
        // Update slides
        heroSlides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentSlide) {
                slide.classList.add('active');
            }
        });
        
        // Update dots
        heroDots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentSlide) {
                dot.classList.add('active');
            }
        });
        
        // Move track
        heroCarouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update button states
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }
    
    function startAutoSlide() {
        stopAutoSlide(); // Clear any existing interval
        autoSlideInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, slideDuration);
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }
    
    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }
    
    // Preload hero images for better performance
    function preloadHeroImages() {
        const imagePaths = [
            'assets/screenshots/app-preview1.png',
            'assets/screenshots/app-preview2.png',
            'assets/screenshots/app-preview3.png',
            'assets/screenshots/app-preview4.png',
            'assets/screenshots/app-preview5.png'
        ];
        
        imagePaths.forEach(path => {
            const img = new Image();
            img.src = path;
        });
    }
    
    preloadHeroImages();
}




// QR Code Generator Function
function generateQRCode() {
    const qrContainer = document.getElementById('qrcode-container');
    if (!qrContainer) return;
    
    const downloadUrl = 'https://github.com/uzketle-cmd/Solar-Partner-apk/releases/download/Solar_Partner/app-release.apk';
    
    // Create QR code using a simple API (no library needed)
    const qrSize = 200;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(downloadUrl)}&format=png`;
    
    // Create QR code image
    const qrImage = document.createElement('img');
    qrImage.src = qrCodeUrl;
    qrImage.alt = 'Download QR Code';
    qrImage.width = qrSize;
    qrImage.height = qrSize;
    qrImage.loading = 'lazy';
    
    // Add loading state
    qrImage.style.opacity = '0';
    qrImage.style.transition = 'opacity 0.3s ease';
    
    qrImage.onload = function() {
        qrImage.style.opacity = '1';
    };
    
    qrImage.onerror = function() {
        // Fallback if QR code API fails
        qrContainer.innerHTML = `
            <div class="qr-fallback">
                <i class="fas fa-qrcode"></i>
                <p>QR Code Failed to Load</p>
                <small>Download link: ${downloadUrl}</small>
            </div>
        `;
    };
    
    // Clear container and add QR code
    qrContainer.innerHTML = '';
    qrContainer.appendChild(qrImage);
}






// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel
    initCarousel();

    // Initialize hero carousel
    initHeroCarousel();

    // Generate QR code
    generateQRCode();
    
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            e.target !== mobileMenuBtn) {
            closeMobileMenu();
        }
    });
    
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (downloadModal.classList.contains('active') && 
            e.target === downloadModal) {
            closeModal();
        }
    });
    
    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeMobileMenu();
        }
    });
});

// Carousel functionality
function initCarousel() {
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    const currentStepSpan = document.querySelector('.current-step');
    const totalStepsSpan = document.querySelector('.total-steps');
    
    if (!carouselTrack || slides.length === 0) return; // Exit if carousel doesn't exist
    
    let currentStep = 1;
    const totalSteps = slides.length;
    
    // Set total steps
    totalStepsSpan.textContent = totalSteps;
    
    // Initialize carousel
    updateCarousel();
    
    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const step = parseInt(this.dataset.step);
            if (step !== currentStep) {
                currentStep = step;
                updateCarousel();
            }
        });
    });
    
    // Previous button
    prevBtn.addEventListener('click', function() {
        if (currentStep > 1) {
            currentStep--;
            updateCarousel();
        }
    });
    
    // Next button
    nextBtn.addEventListener('click', function() {
        if (currentStep < totalSteps) {
            currentStep++;
            updateCarousel();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            if (currentStep > 1) {
                currentStep--;
                updateCarousel();
            }
        } else if (e.key === 'ArrowRight') {
            if (currentStep < totalSteps) {
                currentStep++;
                updateCarousel();
            }
        }
    });
    
    // Mouse wheel navigation
    let isScrolling = false;
    if (carouselTrack) {
        carouselTrack.addEventListener('wheel', function(e) {
            if (isScrolling) return;
            
            isScrolling = true;
            
            if (e.deltaY > 0) {
                // Scroll down/right
                if (currentStep < totalSteps) {
                    currentStep++;
                    updateCarousel();
                }
            } else {
                // Scroll up/left
                if (currentStep > 1) {
                    currentStep--;
                    updateCarousel();
                }
            }
            
            setTimeout(() => {
                isScrolling = false;
            }, 800);
        });
    }
    
    // Touch swipe for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (carouselTrack) {
        carouselTrack.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carouselTrack.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next
            if (currentStep < totalSteps) {
                currentStep++;
                updateCarousel();
            }
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous
            if (currentStep > 1) {
                currentStep--;
                updateCarousel();
            }
        }
    }
    
    // Auto-rotate (optional)
    let autoRotateInterval;
    function startAutoRotate() {
        autoRotateInterval = setInterval(() => {
            if (currentStep < totalSteps) {
                currentStep++;
            } else {
                currentStep = 1;
            }
            updateCarousel();
        }, 5000);
    }
    
    function stopAutoRotate() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
        }
    }
    
    // Pause auto-rotate on hover
    if (carouselTrack) {
        carouselTrack.addEventListener('mouseenter', stopAutoRotate);
        carouselTrack.addEventListener('mouseleave', startAutoRotate);
    }
    
    // Start auto-rotate
    startAutoRotate();
    
    // Update carousel function
    function updateCarousel() {
        // Update active class on slides
        slides.forEach(slide => {
            slide.classList.remove('active');
            const step = parseInt(slide.dataset.step);
            
            if (step === currentStep) {
                slide.classList.add('active');
            }
        });
        
        // Update dots
        dots.forEach(dot => {
            dot.classList.remove('active');
            const step = parseInt(dot.dataset.step);
            
            if (step === currentStep) {
                dot.classList.add('active');
            }
        });
        
        // Update current step indicator
        currentStepSpan.textContent = currentStep;
        
        // Update button states
        if (prevBtn && nextBtn) {
            prevBtn.disabled = currentStep === 1;
            nextBtn.disabled = currentStep === totalSteps;
        }
        
        // Update slide positions based on current step
        updateSlidePositions();
    }
    
    function updateSlidePositions() {
        slides.forEach(slide => {
            const step = parseInt(slide.dataset.step);
            const position = step - currentStep;
            
            // Remove any existing position classes
            slide.classList.remove('left-2', 'left-1', 'center', 'right-1', 'right-2');
            
            // Add position class based on relative position
            switch(position) {
                case -2:
                    slide.classList.add('left-2');
                    break;
                case -1:
                    slide.classList.add('left-1');
                    break;
                case 0:
                    slide.classList.add('center');
                    break;
                case 1:
                    slide.classList.add('right-1');
                    break;
                case 2:
                    slide.classList.add('right-2');
                    break;
            }
            
            // Apply transforms based on position
            switch(position) {
                case -2: // Left most
                    slide.style.transform = 'translateX(-250%) translateZ(-200px) rotateY(15deg)';
                    slide.style.opacity = '0.4';
                    slide.style.filter = 'blur(2px) brightness(0.8)';
                    slide.style.zIndex = '1';
                    break;
                    
                case -1: // Left
                    slide.style.transform = 'translateX(-150%) translateZ(-100px) rotateY(10deg)';
                    slide.style.opacity = '0.6';
                    slide.style.filter = 'blur(1px) brightness(0.9)';
                    slide.style.zIndex = '2';
                    break;
                    
                case 0: // Center (active)
                    slide.style.transform = 'translateX(-50%) translateZ(0px) rotateY(0deg)';
                    slide.style.opacity = '1';
                    slide.style.filter = 'none';
                    slide.style.zIndex = '5';
                    break;
                    
                case 1: // Right
                    slide.style.transform = 'translateX(50%) translateZ(-100px) rotateY(-10deg)';
                    slide.style.opacity = '0.6';
                    slide.style.filter = 'blur(1px) brightness(0.9)';
                    slide.style.zIndex = '2';
                    break;
                    
                case 2: // Right most
                    slide.style.transform = 'translateX(150%) translateZ(-200px) rotateY(-15deg)';
                    slide.style.opacity = '0.4';
                    slide.style.filter = 'blur(2px) brightness(0.8)';
                    slide.style.zIndex = '1';
                    break;
                    
                default:
                    // For slides that are further away
                    slide.style.opacity = '0';
                    slide.style.filter = 'blur(3px) brightness(0.6)';
                    slide.style.zIndex = '0';
                    break;
            }
        });
    }
    
    // Add CSS for smooth transitions
    const carouselStyle = document.createElement('style');
    carouselStyle.textContent = `
        .carousel-slide {
            transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        
        .carousel-slide.left-2 {
            transform: translateX(-250%) translateZ(-200px) rotateY(15deg) !important;
            opacity: 0.4 !important;
            filter: blur(2px) brightness(0.8) !important;
            z-index: 1 !important;
        }
        
        .carousel-slide.left-1 {
            transform: translateX(-150%) translateZ(-100px) rotateY(10deg) !important;
            opacity: 0.6 !important;
            filter: blur(1px) brightness(0.9) !important;
            z-index: 2 !important;
        }
        
        .carousel-slide.center {
            transform: translateX(-50%) translateZ(0px) rotateY(0deg) !important;
            opacity: 1 !important;
            filter: none !important;
            z-index: 5 !important;
        }
        
        .carousel-slide.right-1 {
            transform: translateX(50%) translateZ(-100px) rotateY(-10deg) !important;
            opacity: 0.6 !important;
            filter: blur(1px) brightness(0.9) !important;
            z-index: 2 !important;
        }
        
        .carousel-slide.right-2 {
            transform: translateX(150%) translateZ(-200px) rotateY(-15deg) !important;
            opacity: 0.4 !important;
            filter: blur(2px) brightness(0.8) !important;
            z-index: 1 !important;
        }
        
        .carousel-slide.active {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }
    `;
    document.head.appendChild(carouselStyle);
    
    // Initialize positions
    updateSlidePositions();
    
    // Add smooth scroll behavior to carousel
    document.querySelectorAll('a[href="#instructions"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // If coming from download section, show step 2
            if (this.getAttribute('href') === '#instructions' && 
                window.location.hash !== '#instructions') {
                currentStep = 2; // Show download step
                updateCarousel();
            }
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}
