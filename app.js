// Hamburger menu toggle
const burger = document.querySelector('.burger');
const navLinks= document.querySelector('.nav-links');

burger.addEventListener('click', () => {
  if (navLinks.classList.contains('nav-active')) {
    navLinks.classList.add('nav-inactive');
    setTimeout(() => {
      navLinks.classList.remove('nav-active');
      navLinks.style.display = 'none';
    }, 500); // Delay should match the animation duration
  } else {
    navLinks.style.display = 'flex';
      navLinks.classList.add('nav-active');
      navLinks.classList.remove('nav-inactive')
  }
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
  const timelineItems = document.querySelector('.timeline-items');
  data.forEach((event, index) => {
      const timelineItem = document.createElement('div');
      timelineItem.classList.add('timeline-item');
      timelineItem.classList.add(index % 2 === 0 ? 'even' : 'odd');
      timelineItem.innerHTML = `
          <img src="${event.image}" alt="${event.title}">
          <h3>${event.title}</h3>
      `;
      timelineItem.querySelector('img').addEventListener('click', () => {
          openModal(event.description);
      });
      timelineItem.querySelector('h3').addEventListener('click', () => {
          openModal(event.description);
      });
      timelineItems.appendChild(timelineItem);
  });
};

// Animate timeline items on scroll
const animateTimelineItems = () => {
  const loreSection = document.getElementById('lore');
  if (!loreSection.classList.contains('active')) return; // Check if Lore section is active

  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item) => {
      const itemPosition = item.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (itemPosition < windowHeight * 0.4) {
          item.classList.add('show');
      }
  });
}

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

// Close modal when clicking the close button
const closeButton = document.querySelector('.close');
closeButton.addEventListener('click', closeModal);

// Event listener for navigation menu items
const navMenuItems = document.querySelectorAll('.nav-links a');
navMenuItems.forEach((link) => {
  link.addEventListener('click', (event) => {
      event.preventDefault();
      const sectionId = link.getAttribute('href').substring(1);
      showSection(sectionId);
  });
});

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
document.addEventListener('DOMContentLoaded', () => {
  loadAndRenderData();
});

window.addEventListener('scroll', animateTimelineItems);