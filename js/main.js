document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileNav.classList.toggle('active');
        this.classList.toggle('fa-times');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileMenuBtn.classList.remove('fa-times');
        });
    });

    // Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#contact') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    mobileMenuBtn.classList.remove('fa-times');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form Submission with Formspree
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            try {
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
                
                // Prepare form data
                const formData = new FormData(this);
                
                // Send to Formspree
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Show success message
                    const successDiv = document.createElement('div');
                    successDiv.className = 'form-success';
                    successDiv.innerHTML = 'Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.';
                    contactForm.appendChild(successDiv);
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        successDiv.style.opacity = '0';
                        setTimeout(() => successDiv.remove(), 300);
                    }, 5000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                alert('Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi atau hubungi kami melalui WhatsApp.');
                console.error('Form submission error:', error);
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    // WhatsApp Click Tracking
    document.querySelectorAll('[href*="whatsapp"]').forEach(btn => {
        btn.addEventListener('click', function() {
            // You can add analytics tracking here
            console.log('WhatsApp clicked:', this.href);
            
            // For Google Analytics (if available)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-XXXXXX/YYYYYYYY',
                    'event_callback': function() {
                        window.location.href = btn.href;
                    }
                });
            }
        });
    });

    // Auto-set reply-to email
    const emailInput = document.querySelector('input[name="email"]');
    const replyToInput = document.querySelector('input[name="_replyto"]');
    if (emailInput && replyToInput) {
        emailInput.addEventListener('input', function() {
            replyToInput.value = this.value;
        });
    }

    // Animate Elements on Scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll(
            '.service-card, .vision, .mission, ' +
            '.portfolio-item, .contact-info, ' +
            '.contact-form, .about-content'
        );
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state for animated elements
    document.querySelectorAll(
        '.service-card, .vision, .mission, ' +
        '.portfolio-item, .contact-info, ' +
        '.contact-form, .about-content'
    ).forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Run animations once on load
    setTimeout(animateOnScroll, 300);

    // Run on scroll with throttle
    let isScrolling;
    window.addEventListener('scroll', function() {
        clearTimeout(isScrolling);
        isScrolling = setTimeout(animateOnScroll, 50);
    }, false);
});
