/* =============================================
   NAVIGATION TOGGLE
   ============================================= */

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

/* =============================================
   ACTIVE NAV LINK
   ============================================= */

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

setActiveNavLink();

/* =============================================
   CONTACT FORM HANDLING
   ============================================= */

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();
        const formNote = document.getElementById('formNote');

        // Validation
        if (!name || !email || !subject || !message) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Create mailto link
        const mailtoLink = `mailto:monolitharchaeology@gmail.com?subject=${encodeURIComponent(`Contact Form: ${subject} - From ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`)}`;

        // Try to open the mailto link
        try {
            window.location.href = mailtoLink;
            showFormMessage('Opening email client... If it doesn\'t open, please copy your message and email us at monolitharchaeology@gmail.com', 'success');
            
            // Reset form after brief delay
            setTimeout(() => {
                contactForm.reset();
                formNote.textContent = '';
            }, 1000);
        } catch (error) {
            showFormMessage('There was an error. Please email us directly at monolitharchaeology@gmail.com', 'error');
        }
    });
}

function showFormMessage(message, type) {
    const formNote = document.getElementById('formNote');
    if (formNote) {
        formNote.textContent = message;
        formNote.className = `form-note ${type}`;
        
        // Auto-clear error messages after 5 seconds
        if (type === 'error') {
            setTimeout(() => {
                formNote.textContent = '';
            }, 5000);
        }
    }
}

/* =============================================
   SMOOTH SCROLL ENHANCEMENT
   ============================================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

/* =============================================
   TEAM BIO LOADING
   ============================================= */

const bioElements = document.querySelectorAll('.bio[data-bio-key]');

async function loadTeamBios(lang = document.documentElement.lang || 'en') {
    if (!bioElements.length) return;

    const fileSuffix = lang === 'cy' ? '-cy' : '';
    const bioRequests = Array.from(bioElements).map(async element => {
        const bioKey = element.getAttribute('data-bio-key');
        element.textContent = 'Loading biography...';
        element.setAttribute('aria-busy', 'true');

        try {
            const response = await fetch(`Content/bios/${bioKey}${fileSuffix}.txt`);

            if (!response.ok) {
                throw new Error(`Unable to load biography: ${response.url}`);
            }

            const text = (await response.text()).trim();
            if (document.documentElement.lang === lang) {
                element.textContent = text || 'Biography unavailable.';
            }
        } catch (error) {
            console.error(error);
            if (document.documentElement.lang === lang) {
                element.textContent = 'Biography unavailable.';
            }
        } finally {
            element.removeAttribute('aria-busy');
        }
    });

    await Promise.all(bioRequests);
}

document.addEventListener('DOMContentLoaded', () => {
    loadTeamBios();
});

window.addEventListener('languageChanged', event => {
    loadTeamBios(event.detail.lang);
});

/* =============================================
   PAGE LOAD ANIMATIONS
   ============================================= */

window.addEventListener('load', () => {
    // Fade in page content
    document.body.style.opacity = '1';
    
    // Animate elements on scroll
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

    // Observe feature cards, team cards, etc.
    document.querySelectorAll('.feature-card, .team-card, .partner-card, .faq-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

/* =============================================
   UTILITY FUNCTIONS
   ============================================= */

// Scroll to top button (optional enhancement)
window.addEventListener('scroll', () => {
    // Add any scroll-based behaviors here
});

// Log page analytics (optional)
console.log('Monolith website loaded successfully');
