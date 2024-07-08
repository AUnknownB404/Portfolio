'strict mode';

function toggleNavbar() {
  const navbarLinks = document.querySelector('.navbar-links');
  if (navbarLinks.style.display === 'flex') {
    navbarLinks.style.display = 'none';
  } else {
    navbarLinks.style.display = 'flex';
  }
}
