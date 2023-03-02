const navbar = document.getElementById('navbar')
const navbarDiv = document.getElementById('navbarSupportedContent')
document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('fixed-top', 'navbar-fixed')
    } else {
      navbar.classList.remove('fixed-top', 'navbar-fixed')
    }
  })
})