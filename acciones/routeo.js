document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentHash = window.location.hash || '#home';
  
    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentHash) {
        link.classList.add('active');
      }
  
      link.addEventListener('click', () => {
        navLinks.forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');
      });
    });
  });
  