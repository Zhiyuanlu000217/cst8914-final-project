//Template Function that can be used to run JavaScript on the page
//Note: This can be changed to whatever JavaScript formatting you would like
function knowledgeRunner(){

}
knowledgeRunner()

// Modal functionality
const modal = document.getElementById('community-modal');
const openModalBtn = document.getElementById('meet-community-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalContent = modal.querySelector('.modal-content');
let previousFocus = null;

function openModal() {
    previousFocus = document.activeElement;
    modal.removeAttribute('hidden');
    modal.setAttribute('aria-hidden', 'false');

    // Set initial focus to the modal title
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) {
        modalTitle.setAttribute('tabindex', '-1');
        modalTitle.focus();
    }

    // Add event listeners
    document.addEventListener('keydown', handleModalKeydown);
}

function closeModal() {
    modal.setAttribute('hidden', 'true');
    modal.setAttribute('aria-hidden', 'true');

    // Restore focus
    if (previousFocus) {
        previousFocus.focus();
    }

    // Remove event listener
    document.removeEventListener('keydown', handleModalKeydown);
}

function handleModalKeydown(e) {
    if (e.key === 'Escape') {
        closeModal();
        return;
    }    

    // Trap focus inside modal
    if (e.key === 'Tab') {
        // Get all focusable elements in the modal
        const focusableElements = modalContent.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // If shift+tab and focus is on first element, move to last element
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
        // If tab and focus is on last element, move to first element
        else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}

openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);

// Close modal if clicking outside of content
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
    closeModal();
    }
});


// Control the active section of the page
document.addEventListener('DOMContentLoaded', () => {
    // Get all navigation links
    const navLinks = document.querySelectorAll('#main-nav a');
    
    // Make all external links open in a new tab
    const externalLinks = document.querySelectorAll('a[href^="http"], a.learn-more');
    externalLinks.forEach(link => {
        if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener');
            
            // For accessibility, indicate that link opens in a new tab
            if (!link.getAttribute('aria-label')) {
                const linkText = link.textContent.trim();
                link.setAttribute('aria-label', `${linkText} (opens in a new tab)`);
            }
        }
    });
    
    // Function to update active section
    const updateActiveSection = (targetId) => {
        // Remove active class from all sections and links
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
            section.setAttribute('aria-hidden', 'true');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });

        // Add active class to target section and link
        const targetSection = document.querySelector(targetId);
        const targetLink = document.querySelector(`a[href="${targetId}"]`);
        
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.removeAttribute('aria-hidden');
            
            // Update page title based on section
            const sectionName = targetId.replace('#', '').charAt(0).toUpperCase() + targetId.slice(2);
            document.title = `Empower Ability Labs - ${sectionName}`;

            // Update skip link href to point to the active section
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                skipLink.href = targetId;
            }

            // Focus on the section's h1 heading
            const sectionHeading = targetSection.querySelector('h1');
            if (sectionHeading) {
                sectionHeading.focus();
            }
        }
        if (targetLink) {
            targetLink.classList.add('active');
            targetLink.setAttribute('aria-current', 'page');
        }
    };

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            updateActiveSection(targetId);
            // Update URL without page reload
            history.pushState(null, '', targetId);
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const currentHash = window.location.hash || '#home';
        updateActiveSection(currentHash);
    });

    // Set initial active section based on URL or default to home
    const initialHash = window.location.hash || '#home';
    updateActiveSection(initialHash);
    
    // Show/hide event details when speaker checkbox is checked
    const speakerCheckbox = document.getElementById('speaker');
    const eventDetailsGroup = document.getElementById('event-details-group');
    
    if (speakerCheckbox && eventDetailsGroup) {
        // Initial check in case the checkbox is already checked
        eventDetailsGroup.hidden = !speakerCheckbox.checked;
        
        speakerCheckbox.addEventListener('change', () => {
            eventDetailsGroup.hidden = !speakerCheckbox.checked;
        });
    }

    // Form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formMessage = document.getElementById('form-message');
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const phoneInput = document.getElementById('phone');
        const phoneError = document.getElementById('phone-error');
        const eventDetails = document.getElementById('event-details');
        const eventDetailsError = document.getElementById('event-details-error');

        // Email validation
        const validateEmail = (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        };

        // Phone validation
        const validatePhone = (phone) => {
            // Allow empty phone (not required)
            if (phone === '') return true;
            
            // Accept both formats: xxx-xxx-xxxx or xxxxxxxxxx
            const reWithDashes = /^\d{3}-\d{3}-\d{4}$/;
            const reWithoutDashes = /^\d{10}$/;
            return reWithDashes.test(phone) || reWithoutDashes.test(phone);
        };

        // Function to show error
        const showError = (input, errorElement, message) => {
            input.classList.add('error');
            errorElement.textContent = message;
            errorElement.classList.add('visible');
            // Set aria-invalid on the input
            input.setAttribute('aria-invalid', 'true');
            // Make the error message live and assertive
            errorElement.setAttribute('aria-live', 'assertive');
            // Focus the input with error
            input.focus();
            return false;
        };

        // Function to hide error
        const hideError = (input, errorElement) => {
            input.classList.remove('error');
            errorElement.textContent = '';
            errorElement.classList.remove('visible');
            // Remove aria-invalid
            input.removeAttribute('aria-invalid');
            return true;
        };

        // Form submission
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            let firstError = null;

            // Validate email (required)
            if (!emailInput.value.trim()) {
                isValid = false;
                if (!firstError) firstError = emailInput;
                showError(emailInput, emailError, 'Email is required.');
            } else if (!validateEmail(emailInput.value.trim())) {
                isValid = false;
                if (!firstError) firstError = emailInput;
                showError(emailInput, emailError, 'Please enter a valid email address.');
            } else {
                hideError(emailInput, emailError);
            }

            // Validate phone (if provided)
            if (phoneInput.value.trim() && !validatePhone(phoneInput.value.trim())) {
                isValid = false;
                if (!firstError) firstError = phoneInput;
                showError(phoneInput, phoneError, 'Please enter a valid phone number (xxx-xxx-xxxx or xxxxxxxxxx).');
            } else {
                hideError(phoneInput, phoneError);
            }

            // Validate event details if speaker is checked
            if (speakerCheckbox && speakerCheckbox.checked && (!eventDetails.value.trim())) {
                isValid = false;
                if (!firstError) firstError = eventDetails;
                showError(eventDetails, eventDetailsError, 'Please provide details about your event.');
            } else if (eventDetails) {
                hideError(eventDetails, eventDetailsError);
            }

            // If valid, show success message
            if (isValid) {
                formMessage.textContent = 'Thank you for contacting Empower Ability Labs! We will get back to you soon.';
                formMessage.className = 'success';
                formMessage.setAttribute('aria-live', 'assertive');
                contactForm.reset();
            } else {
                // Focus the first error field
                if (firstError) {
                    firstError.focus();
                }
                formMessage.textContent = 'Please correct the errors in the form.';
                formMessage.className = 'error';
                formMessage.setAttribute('aria-live', 'assertive');
            }
        });

        // Live validation for email
        emailInput.addEventListener('blur', () => {
            if (!emailInput.value.trim()) {
                showError(emailInput, emailError, 'Email is required.');
            } else if (!validateEmail(emailInput.value.trim())) {
                showError(emailInput, emailError, 'Please enter a valid email address.');
            } else {
                hideError(emailInput, emailError);
            }
        });

        // Live validation for phone
        phoneInput.addEventListener('blur', () => {
            if (phoneInput.value.trim() && !validatePhone(phoneInput.value.trim())) {
                showError(phoneInput, phoneError, 'Please enter a valid phone number (xxx-xxx-xxxx or xxxxxxxxxx).');
            } else {
                hideError(phoneInput, phoneError);
            }
        });
    }

    // Update toggle switch accessibility
    const emailUpdatesToggle = document.getElementById('email-updates');
    if (emailUpdatesToggle) {
        emailUpdatesToggle.addEventListener('change', function() {
            this.setAttribute('aria-checked', this.checked.toString());
        });
    }
});








