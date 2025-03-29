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

    // Trap focus inside modal
    closeModalBtn.focus();

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
    
    // Function to update active section
    const updateActiveSection = (targetId) => {
        // Remove active class from all sections and links
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
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
});