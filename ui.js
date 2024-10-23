const toggleMenu = () => {
  const menu = document.getElementById('menu').classList.toggle('open');
  const map = document.getElementById('map');

  if (window.innerWidth <= 768) {
      if (menu.classList.contains('open')) {
          map.style.marginLeft = '100%';
      } else {
          map.style.marginLeft = '0';
      }
  }
}

const showSidebar = () => {
  document.getElementById('sidebar').classList.add('open');
}

const closeSidebar = () => {
  document.getElementById('sidebar').classList.remove('open');
}

function handleResize() {
  const menu = document.getElementById('menu');
  const map = document.getElementById('map');
  if (window.innerWidth > 768) {
      menu.classList.add('open');
      map.style.marginLeft = '250px';
  } else {
      menu.classList.remove('open');
      map.style.marginLeft = '0';
  }
}

// Add event listener for window resize
window.addEventListener('resize', handleResize);

function closeMenu() {
  const menu = document.getElementById('menu');
  const map = document.getElementById('map');
  menu.classList.remove('open');
  if (window.innerWidth <= 768) {
      map.style.marginLeft = '0';
  }
}