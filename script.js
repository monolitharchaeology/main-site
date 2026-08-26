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

const teamMembers = [
    {
        bioKey: 'bridge',
        name: 'Matt "Bridge" Bainbridge',
        image: 'images/profiles/bridge-profile new.png',
        roleKey: 'team.bridge.pos'
    },
    {
        bioKey: 'tom-blackburn',
        name: 'Tom Blackburn',
        image: 'images/profiles/Tom New.png',
        roleKey: 'team.tom.pos'
    },
    {
        bioKey: 'callum-humphreys-thornton',
        name: 'Callum Humphreys Thornton',
        image: 'images/profiles/Callum new.png',
        roleKey: 'team.callum.pos'
    },
    {
        bioKey: 'mike-woods',
        name: 'Dr. Mike Woods',
        image: 'images/profiles/Mike New.png',
        roleKey: 'team.mike.pos'
    }
];

const teamMemberByBioKey = new Map(teamMembers.map(member => [member.bioKey, member]));
const bioElements = document.querySelectorAll('.bio[data-bio-key]');
const readMoreButtons = document.querySelectorAll('.read-more-btn[data-bio-key]');
const bioModal = document.getElementById('bioModal');
const bioModalClose = document.querySelector('.bio-modal-close');
const bioModalImage = document.querySelector('.bio-modal-image');
const bioModalName = document.querySelector('.bio-modal-name');
const bioModalRole = document.querySelector('.bio-modal-role');
const bioModalText = document.querySelector('.bio-modal-text');
const bioCache = new Map();
let lastFocusedBioButton = null;
let previousBodyOverflow = null;
let previousBackgroundAccessibilityState = null;

document.querySelectorAll('.team-card').forEach(card => {
    const bioElement = card.querySelector('.bio[data-bio-key]');
    const bioKey = bioElement ? bioElement.getAttribute('data-bio-key') : null;
    const member = teamMemberByBioKey.get(bioKey);
    if (member) card.dataset.memberId = member.bioKey;
});

function truncateBio(text, maxLength = 320) {
    if (text.length <= maxLength) return text;

    const contentLength = maxLength - 3;
    const preview = text.slice(0, contentLength).trimEnd();
    const wordBoundary = preview.lastIndexOf(' ');
    return `${preview.slice(0, wordBoundary > 0 ? wordBoundary : contentLength)}...`;
}

function getBioModalFocusableElements() {
    if (!bioModal) return [];

    return Array.from(bioModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]'
    )).filter(element => !element.disabled && element.tabIndex >= 0);
}

function isolateBioModalBackground() {
    if (!bioModal || previousBackgroundAccessibilityState) return;

    previousBackgroundAccessibilityState = Array.from(document.body.children)
        .filter(element => element !== bioModal)
        .map(element => ({
            element,
            ariaHidden: element.getAttribute('aria-hidden'),
            inert: element.inert
        }));

    previousBackgroundAccessibilityState.forEach(({ element }) => {
        element.setAttribute('aria-hidden', 'true');
        element.inert = true;
    });
}

function restoreBioModalBackground() {
    if (!previousBackgroundAccessibilityState) return;

    previousBackgroundAccessibilityState.forEach(({ element, ariaHidden, inert }) => {
        if (ariaHidden === null) {
            element.removeAttribute('aria-hidden');
        } else {
            element.setAttribute('aria-hidden', ariaHidden);
        }
        element.inert = inert;
    });

    previousBackgroundAccessibilityState = null;
}

async function loadTeamBios(lang = document.documentElement.lang || 'en') {
    if (!bioElements.length) return;

    const fileSuffix = lang === 'cy' ? '-cy' : '';
    const bioRequests = Array.from(bioElements).map(async element => {
        const bioKey = element.getAttribute('data-bio-key');
        const cacheKey = `${lang}:${bioKey}`;
        element.textContent = 'Loading biography...';
        element.setAttribute('aria-busy', 'true');

        try {
            let text = bioCache.get(cacheKey);
            if (!text) {
                const response = await fetch(`Content/bios/${bioKey}${fileSuffix}.txt`);

                if (!response.ok) {
                    throw new Error(`Unable to load biography: ${response.url}`);
                }

                text = (await response.text()).trim();
                bioCache.set(cacheKey, text);
            }

            if (document.documentElement.lang === lang) {
                element.textContent = text ? truncateBio(text) : 'Biography unavailable.';
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

function openBioModal(button) {
    const card = button.closest('.team-card');
    const member = card ? teamMemberByBioKey.get(card.dataset.memberId) : null;
    const lang = document.documentElement.lang || 'en';
    const fullBio = member && bioCache.get(`${lang}:${member.bioKey}`);

    if (!bioModal || !card || !member || !fullBio) return;

    const role = card.querySelector(`[data-i18n="${member.roleKey}"]`);
    bioModalImage.src = member.image;
    bioModalImage.alt = member.name;
    bioModalName.textContent = member.name;
    bioModalRole.textContent = role.textContent;
    bioModalText.textContent = fullBio;
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    isolateBioModalBackground();
    bioModal.classList.add('is-open');
    bioModal.setAttribute('aria-hidden', 'false');
    bioModal.inert = false;
    lastFocusedBioButton = button;
    if (bioModalClose) bioModalClose.focus();
}

function closeBioModal() {
    if (!bioModal) return;

    bioModal.classList.remove('is-open');
    bioModal.setAttribute('aria-hidden', 'true');
    bioModal.inert = true;
    restoreBioModalBackground();
    if (previousBodyOverflow !== null) {
        document.body.style.overflow = previousBodyOverflow;
        previousBodyOverflow = null;
    }

    const originatingButton = lastFocusedBioButton;
    lastFocusedBioButton = null;
    if (originatingButton && originatingButton.isConnected && !originatingButton.disabled) {
        originatingButton.focus();
    }
}

readMoreButtons.forEach(button => {
    button.addEventListener('click', () => openBioModal(button));
});

if (bioModalClose) {
    bioModalClose.addEventListener('click', closeBioModal);
}

if (bioModal) {
    bioModal.addEventListener('click', event => {
        if (event.target === bioModal) closeBioModal();
    });

    bioModal.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            closeBioModal();
            return;
        }

        if (event.key !== 'Tab') return;

        const focusableElements = getBioModalFocusableElements();
        if (!focusableElements.length) {
            event.preventDefault();
            if (bioModalClose) bioModalClose.focus();
            return;
        }

        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstFocusableElement) {
            event.preventDefault();
            lastFocusableElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
            event.preventDefault();
            firstFocusableElement.focus();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadTeamBios();
});

window.addEventListener('languageChanged', event => {
    closeBioModal();
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
