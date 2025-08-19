// --- DOM Elements ---
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalBody = document.querySelector('.modal-body');
const closeButton = document.querySelector('.close-button');
const modalContent = document.querySelector('.modal-content');
const loader = document.querySelector('.loader-container');
const navItems = document.querySelectorAll('.nav-link');

// --- State ---
let previousActiveElement;

// --- Config ---
const contentSources = [
    { id: 'landing', path: null, container: 'landing', type: 'static' },
    { id: 'heroes', path: 'data/heroes.json', container: 'heroes-container', type: 'heroes' },
    { id: 'characters', path: 'data/characters.json', container: 'characters-container', type: 'characters' },
    { id: 'factions', path: 'data/factions.json', container: 'factions-container', type: 'factions' },
    { id: 'places', path: 'data/places.json', container: 'places-container', type: 'places' },
    { id: 'headlines', path: 'data/headlines.json', container: 'headlines-container', type: 'headlines' },
    { id: 'world-history', path: 'data/timeline.json', container: 'lore-container', type: 'lore' },
    { id: 'items', path: 'data/items.json', container: 'items-container', type: 'items' },
];

// --- Loader ---
const showLoader = () => loader.classList.add('is-loading');
const hideLoader = () => loader.classList.remove('is-loading');

// --- Hamburger Menu ---
function toggleNav() {
    const isActive = navLinks.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
    burger.setAttribute('aria-expanded', isActive);
    document.body.classList.toggle('nav-open');
}

burger.addEventListener('click', toggleNav);
burger.addEventListener('keypress', (e) => e.key === 'Enter' && burger.click());

// --- Modal ---
function openModal(title, description) {
    previousActiveElement = document.activeElement;
    modalTitle.innerHTML = title;
    modalDescription.innerHTML = marked.parse(description);
    modal.classList.add('visible');
    setTimeout(() => {
        modalBody.scrollTop = 0;
        modal.classList.add('active');
        modalContent.classList.add('active');
    }, 10);
    document.body.classList.add('modal-open');
    closeButton.focus();
    trapFocus(modal);
}

function closeModal() {
    modal.classList.remove('active');
    modalContent.classList.remove('active');
    document.body.classList.remove('modal-open');
    modal.addEventListener('transitionend', () => {
        if (!modal.classList.contains('active')) {
            modal.classList.remove('visible');
        }
    }, { once: true });
    previousActiveElement?.focus();
}

const magnifiedView = document.querySelector('.magnified-view');

closeButton.addEventListener('click', closeModal);
window.addEventListener('click', (e) => e.target === modal && closeModal());
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (modal.classList.contains('active')) closeModal();
        if (magnifiedView.classList.contains('active')) closeMagnifiedView();
    }
});

function trapFocus(element) {
    const focusableEls = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableEl = focusableEls[0];
    const lastFocusableEl = focusableEls[focusableEls.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
            if (document.activeElement === firstFocusableEl) {
                lastFocusableEl.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableEl) {
                firstFocusableEl.focus();
                e.preventDefault();
            }
        }
    });
}

// --- Data Fetching & Content Creation ---
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch ${url}:`, error);
        return null;
    }
}

function createGridItem(item) {
    const button = document.createElement('button');
    button.classList.add('grid-item');
    
    button.dataset.title = item.name;
    button.dataset.description = item.description || '';

    button.innerHTML = item.image 
        ? `<img src="${item.image}" alt="" class="grid-item__image" loading="lazy"><h3 class="grid-item__title">${item.name}</h3>`
        : `<h3 class="grid-item__title">${item.name}</h3>`;
        
    return button;
}

async function populateSection(sectionConfig) {
    if (!sectionConfig?.path) return;
    const container = document.getElementById(sectionConfig.container);
    if (!container || container.dataset.loaded === 'true') return;

    const data = await fetchData(sectionConfig.path);
    if (data) {
        container.innerHTML = '';
        data.forEach(item => container.appendChild(createGridItem(item)));
        container.addEventListener('click', (e) => {
            const gridItem = e.target.closest('.grid-item');
            if (gridItem) openModal(gridItem.dataset.title, gridItem.dataset.description);
        });
    } else {
        container.innerHTML = `<p class="error-message">Could not load content.</p>`;
    }
    container.dataset.loaded = 'true';
}

// --- Navigation & Routing (Hash-based) ---
function updateActiveLink(targetId) {
    navItems.forEach(link => {
        link.classList.toggle('active-link', link.getAttribute('href') === `#${targetId}`);
    });
}

async function handleNavigation() {
    const sectionId = window.location.hash.substring(1) || 'landing';
    const currentSection = document.querySelector('.section.is-active');
    const targetSection = document.getElementById(sectionId);

    if (!targetSection || currentSection?.id === sectionId) return;

    if (currentSection) {
        currentSection.classList.add('is-exiting');
        currentSection.addEventListener('transitionend', () => {
            currentSection.classList.remove('is-active', 'is-exiting');
        }, { once: true });
    }
    
    const sectionConfig = contentSources.find(s => s.id === sectionId);
    if (sectionConfig?.path) {
        showLoader();
        await populateSection(sectionConfig);
        hideLoader();
    }

    targetSection.classList.add('is-active');
    updateActiveLink(sectionId);
    window.scrollTo(0, 0);

    if (navLinks.classList.contains('nav-active')) {
        toggleNav();
    }
}

// --- Banner Slider & Magnified View ---
const banner = document.querySelector('.banner');

if (banner) {
    const bannerContainer = banner.querySelector('.banner-container');
    const bannerImages = banner.querySelectorAll('.banner-image');
    const leftArrow = banner.querySelector('.banner-arrow-left');
    const rightArrow = banner.querySelector('.banner-arrow-right');
    const indicatorDots = banner.querySelectorAll('.indicator-dot');
    
    const magnifiedImage = magnifiedView.querySelector('.magnified-image');
    const magnifiedCaption = magnifiedView.querySelector('.magnified-caption');
    const closeMagnified = magnifiedView.querySelector('.close-magnified');

    let currentIndex = 0;
    const totalImages = bannerImages.length;
    let autoScrollInterval;

    // --- Carousel Logic ---
    const updateIndicators = (index) => {
        currentIndex = index;
        indicatorDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(bannerImages).indexOf(entry.target);
                updateIndicators(index);
            }
        });
    }, { root: bannerContainer, threshold: 0.5 });

    bannerImages.forEach(image => observer.observe(image));

    const scrollToImage = (index) => {
        bannerContainer.scrollTo({ left: bannerContainer.clientWidth * index, behavior: 'smooth' });
        resetAutoScroll();
    };

    leftArrow.addEventListener('click', () => {
        const newIndex = (currentIndex - 1 + totalImages) % totalImages;
        scrollToImage(newIndex);
    });

    rightArrow.addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % totalImages;
        scrollToImage(newIndex);
    });

    indicatorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            scrollToImage(parseInt(dot.dataset.index));
        });
    });

    function resetAutoScroll() {
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(() => {
            const newIndex = (currentIndex + 1) % totalImages;
            scrollToImage(newIndex);
        }, 5000);
    }
    
    resetAutoScroll();
    
    // --- Magnified View Logic ---
    bannerImages.forEach(image => {
        image.addEventListener('click', () => {
            magnifiedImage.src = image.src;
            magnifiedCaption.textContent = image.alt;
            magnifiedView.classList.add('visible');
            setTimeout(() => magnifiedView.classList.add('active'), 10);
            document.body.style.overflow = 'hidden';
        });
    });

    const closeMagnifiedView = () => {
        magnifiedView.classList.remove('active');
        magnifiedView.addEventListener('transitionend', () => {
            if (!magnifiedView.classList.contains('active')) {
                magnifiedView.classList.remove('visible');
            }
        }, { once: true });
        document.body.style.overflow = '';
    };

    closeMagnified.addEventListener('click', closeMagnifiedView);
    magnifiedView.addEventListener('click', (e) => e.target === magnifiedView && closeMagnifiedView());
}


// --- Featured Content ---
async function displayRandomFeaturedContent() {
    const featuredSources = contentSources.filter(s => s.path);
    if (featuredSources.length === 0) return;
    const randomSource = featuredSources[Math.floor(Math.random() * featuredSources.length)];
    const data = await fetchData(randomSource.path);
    if (data?.length) {
        const randomEntry = data[Math.floor(Math.random() * data.length)];
        
        document.getElementById('featured-name').textContent = randomEntry.name;
        document.getElementById('featured-source').textContent = `From ${randomSource.type.charAt(0).toUpperCase() + randomSource.type.slice(1)}`;
        document.getElementById('featured-description').innerHTML = marked.parse(randomEntry.description || ''); // Use marked
    }
}

// --- App Initialization ---
function init() {
    window.addEventListener('hashchange', handleNavigation);

    if (window.location.hash === '') {
        window.location.hash = 'landing';
    } else {
        handleNavigation();
    }
    
    displayRandomFeaturedContent();
    document.getElementById('random-article-button').addEventListener('click', displayRandomFeaturedContent);
}

document.addEventListener('DOMContentLoaded', init);