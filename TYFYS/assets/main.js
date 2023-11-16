document.addEventListener("DOMContentLoaded", function() {
  const articles = document.querySelectorAll(".article-popup");

  let wrapper = document.getElementById("main-wrapper");
  let pageHeading = document.getElementById("page-heading");
  let pageNavMenu = document.getElementById("page-nav-menu");

  
  function showArticle(articleId) {
    // Hides main page and reveals article
    // Hide all main content
    pageHeading.style.display = 'none';
    pageNavMenu.style.display = 'none';

    // Show the specified article
    document.getElementById(articleId).style.display = 'flex';
  }

  function toggleVisibility(contentId, arrow) {
    // Shows/hides content
    let isVisible = document.getElementById(contentId);

    if (isVisible.classList.contains('hidden-drop-down')) {
      isVisible.classList.remove('hidden-drop-down');
      isVisible.classList.add('visible-drop-down');
      arrow.style.transform = 'rotate(90deg)';
    } else {
      isVisible.classList.remove('visible-drop-down');
      isVisible.classList.add('hidden-drop-down');
      arrow.style.transform = 'rotate(0deg)';
    }
  }
  
  function closeArticle() {
    // Closes article and re-displays main page
    articles.forEach(article => article.style.display = 'none');
    pageHeading.style.display = 'block';
    pageNavMenu.style.display = 'flex';
  }

  
  document.getElementById("page-nav-menu").addEventListener('click', function(event) {
    // Event listener for clicks on article links
    if (event.target.classList.contains("button")) {
      // Get the article ID from the data attribute
      const articleId = event.target.getAttribute("data-target");
      showArticle(articleId);
    }
  });

  document.addEventListener('click', function(event) {
    // Waits clicks on 'X' or mainWrapper to close the article
    if (event.target.classList.contains("close") || event.target == wrapper) {
      closeArticle();
    }

    // Waits for clicks on headings to toggle content visibility
    if (event.target.classList.contains("drop-down")) {
      let dTarget = event.target.getAttribute('data-target');
      let arrow = event.target.querySelector('.drop-arrow');

      toggleVisibility(dTarget, arrow);
    }
  });
});
