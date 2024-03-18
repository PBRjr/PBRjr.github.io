// Hamburger menu toggle
const burger = document.querySelector('.burger');
const navLinks= document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
});

// Load data from JSON files
const loadData = async (section) => {
    try {
        const response = await fetch(`data/${section}.json`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error loading data:', error);
    }
};

// Show section based on clicked navigation item
const showSection = (sectionId) => {
  const sections = document.querySelectorAll('section');
  sections.forEach((section) => {
      section.classList.remove('active');
      section.classList.add('hidden');
  });

  const selectedSection = document.getElementById(sectionId);
  selectedSection.classList.remove('hidden');
  selectedSection.classList.add('active');
};

// Event listener for navigation menu items
const navMenuItems = document.querySelectorAll('.nav-links a');
navMenuItems.forEach((link) => {
  link.addEventListener('click', (event) => {
      event.preventDefault();
      const sectionId = link.getAttribute('href').substring(1);
      showSection(sectionId);
  });
});

// Render grid items
const renderGridItems = (section, data) => {
    const gridContainer = document.querySelector(`#${section} .grid-container`);
    data.forEach((item) => {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
        `;
        gridItem.addEventListener('click', () => {
            openModal(item.bio);
        });
        gridContainer.appendChild(gridItem);
    });
};

// Render newspaper headlines
const renderHeadlines = (data) => {
    const newspaperContainer = document.querySelector('.newspaper-container');
    data.forEach((headline) => {
        const headlineElement = document.createElement('div');
        headlineElement.classList.add('headline');
        headlineElement.textContent = headline.title;
        headlineElement.addEventListener('click', () => {
            openModal(headline.article);
        });
        newspaperContainer.appendChild(headlineElement);
    });
};

// Render timeline items
const renderTimelineItems = (data) => {
    const timelineContainer = document.querySelector('.timeline-container');
    data.forEach((event) => {
        const timelineItem = document.createElement('div');
        timelineItem.classList.add('timeline-item');
        timelineItem.innerHTML = `
            <img src="${event.image}" alt="${event.title}">
            <h3>${event.title}</h3>
            <p>${event.description}</p>
        `;
        timelineContainer.appendChild(timelineItem);
    });
};

// Open modal
const openModal = (content) => {
    const modal = document.getElementById('modal');
    const modalText = document.querySelector('.modal-text');
    modalText.innerHTML = content;
    modal.style.display = 'block';
    document.body.classList.add('modal-active');
};

// Close modal
const closeModal = () => {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    document.body.classList.remove('modal-active');
};

// Close modal when clicking outside the modal content
window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
});

// Animate timeline items on scroll
const animateTimelineItems = () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item) => {
        const itemPosition = item.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (itemPosition < windowHeight) {
            item.classList.add('show');
        }
    });
};

// Load and render data
const loadAndRenderData = async () => {
    const heroesData = await loadData('heroes');
    const charactersData = await loadData('characters');
    const placesData = await loadData('places');
    const headlinesData = await loadData('headlines');
    const timelineData = await loadData('timeline');

    renderGridItems('heroes', heroesData);
    renderGridItems('characters', charactersData);
    renderGridItems('places', placesData);
    renderHeadlines(headlinesData);
    renderTimelineItems(timelineData);
};

// Event listeners
document.addEventListener('DOMContentLoaded', loadAndRenderData);
window.addEventListener('scroll', animateTimelineItems);