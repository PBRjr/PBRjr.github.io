// Hamburger Menu Toggle
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    const isActive = navLinks.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
    burger.setAttribute('aria-expanded', isActive);
});

// Allow toggling menu with Enter key
burger.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        burger.click();
    }
});

// Modal Elements
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalDescription = document.getElementById('modal-description');
const closeButton = document.querySelector('.close-button');
const modalContent = document.querySelector('.modal-content'); // Reference to .modal-content

// Variable to store the previously focused element
let previousActiveElement;

// Function to open modal with specific content and manage focus
function openModal(title, imageSrc, description) {
    modalTitle.innerHTML = title;
    modalDescription.innerHTML = description;

    // Reset scroll position to top
    modalContent.scrollTop = 0;

    modal.style.display = 'block';
    modal.classList.add('active'); // For transitions
    document.body.classList.add('modal-open'); // Disable background scroll

    // Save the currently focused element to restore focus later
    previousActiveElement = document.activeElement;

    // Set focus to the modal (close button)
    closeButton.focus();
}

// Function to close modal and restore focus
function closeModal() {
    modal.style.display = 'none';
    modal.classList.remove('active'); // For transitions
    document.body.classList.remove('modal-open'); // Enable background scroll

    // Restore focus to the previously focused element
    if (previousActiveElement) {
        previousActiveElement.focus();
    }
}

// Event listener for close button
closeButton.addEventListener('click', closeModal);

// Allow closing modal with Enter key on close button
closeButton.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        closeModal();
    }
});

// Event listener for clicks outside the modal content to close the modal
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Function to fetch JSON data
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Function to create grid items
function createGridItem(item, type) {
    const div = document.createElement('div');
    div.classList.add('grid-item');

    // Assign data-title based on type
    if (type === 'headlines' || type === 'lore') {
        div.setAttribute('data-title', item.title);
    } else {
        div.setAttribute('data-title', item.name);
    }

    // Assign data-image
    div.setAttribute('data-image', item.image);

    // Assign data-description based on type
    if (type === 'headlines') {
        div.setAttribute('data-description', item.description || '');
    } else if (type === 'lore') {
        div.setAttribute('data-description', item.description || '');
    } else {
        div.setAttribute('data-description', item.bio || item.article || '');
    }

    // Populate based on type
    if (type === 'headlines') {
        div.innerHTML = `
            <h3>${item.title}</h3>
        `;
    } else if (type === 'lore') {
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <h3>${item.title}</h3>
        `;
    } else {
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
        `;
    }

    return div;
}

// Function to populate section
async function populateSection(jsonPath, containerId, type) {
    const data = await fetchData(jsonPath);
    const container = document.getElementById(containerId);

    data.forEach(item => {
        const gridItem = createGridItem(item, type);
        container.appendChild(gridItem);
    });

    // Add event listeners for modals using event delegation
    addModalListeners(container);
}

// Function to add modal listeners using event delegation
function addModalListeners(container) {
    container.addEventListener('click', (e) => {
        const gridItem = e.target.closest('.grid-item');
        if (!gridItem) return;

        const title = gridItem.getAttribute('data-title');
        const imageSrc = gridItem.getAttribute('data-image');
        const description = gridItem.getAttribute('data-description');

        openModal(title, imageSrc, description);
    });
}

// Populate all sections
populateSection('data/heroes.json', 'heroes-container', 'heroes');
populateSection('data/characters.json', 'characters-container', 'characters');
populateSection('data/places.json', 'places-container', 'places');
populateSection('data/headlines.json', 'headlines-container', 'headlines');
populateSection('data/timeline.json', 'lore-container', 'lore');

// Navigation Items
const navItems = document.querySelectorAll('.nav-link');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = item.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        const currentSection = document.querySelector('.section.active');

        if (currentSection === targetSection) return;

        // Remove active link from all nav links
        navItems.forEach(link => link.classList.remove('active-link'));
        // Add active link to the clicked link
        item.classList.add('active-link');

        // Slide-out current section
        currentSection.classList.remove('active');
        currentSection.style.transform = 'translateX(-100%)';
        currentSection.style.opacity = '0';

        // Hide current section after transition
        setTimeout(() => {
            currentSection.style.display = 'none';
            // Reset scroll to top
            window.scrollTo(0, 0);
        }, 500); // Match with CSS transition duration

        // Show target section with slide-in animation
        targetSection.style.display = 'block';
        setTimeout(() => {
            targetSection.classList.add('active');
            targetSection.style.transform = 'translateX(0)';
            targetSection.style.opacity = '1';
        }, 20); // Slight delay to trigger transition

        // Close the hamburger menu if it's open
        if (navLinks.classList.contains('nav-active')) {
            navLinks.classList.remove('nav-active');
            burger.classList.remove('toggle');
            burger.setAttribute('aria-expanded', false);
        }
    });
});

// Banner Slider
const bannerSlider = document.querySelector('.banner-slider');
const bannerImages = document.querySelectorAll('.banner-image');
const leftArrow = document.querySelector('.banner-arrow-left');
const rightArrow = document.querySelector('.banner-arrow-right');

let currentIndex = 0;
const totalImages = bannerImages.length;

function updateSlider() {
    bannerSlider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalImages;
    updateSlider();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;
    updateSlider();
}

// Auto-scroll
let autoScrollInterval = setInterval(nextSlide, 5000); // Change image every 5 seconds

// Manual navigation
leftArrow.addEventListener('click', () => {
    clearInterval(autoScrollInterval);
    prevSlide();
    autoScrollInterval = setInterval(nextSlide, 5000);
});

rightArrow.addEventListener('click', () => {
    clearInterval(autoScrollInterval);
    nextSlide();
    autoScrollInterval = setInterval(nextSlide, 5000);
});

// Initialize slider
updateSlider();

// Magnified View
const magnifiedView = document.querySelector('.magnified-view');
const magnifiedImage = document.querySelector('.magnified-image');
const closeMagnified = document.querySelector('.close-magnified');

// Add click event to banner images
bannerImages.forEach(image => {
    image.addEventListener('click', () => {
        magnifiedImage.src = image.src;
        magnifiedView.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
});

// Close magnified view
closeMagnified.addEventListener('click', () => {
    magnifiedView.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
});

// Close magnified view when clicking outside the image
magnifiedView.addEventListener('click', (e) => {
    if (e.target === magnifiedView) {
        magnifiedView.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
});