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
document.querySelectorAll('.feature-card, .step, .support-card').forEach(el => {
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
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
