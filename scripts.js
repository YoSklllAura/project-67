const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const cursorGlow = document.querySelector('.cursor-glow');
const particles = document.getElementById('particles');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  document.querySelectorAll('.feature-card, .template-card').forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.1;
  cursorY += (mouseY - cursorY) * 0.1;
  if (cursorGlow) {
    cursorGlow.style.left = cursorX + 'px';
    cursorGlow.style.top = cursorY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

for (let i = 0; i < 30; i++) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.left = Math.random() * 100 + '%';
  particle.style.top = Math.random() * 100 + '%';
  particle.style.animationDelay = Math.random() * 3 + 's';
  particle.style.animationDuration = (3 + Math.random() * 2) + 's';
  particles.appendChild(particle);
}

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('mobile-open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('mobile-open');
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.navbar-container') && navMenu.classList.contains('mobile-open')) {
    navMenu.classList.remove('mobile-open');
  }
});

const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const title = entry.target.querySelector('.section-title');
      const subtitle = entry.target.querySelector('.section-subtitle');

      if (title) {
        title.style.animation = 'fadeInUp 0.8s ease-out both';
      }

      if (subtitle) {
        subtitle.style.animation = 'fadeInUp 0.8s ease-out 0.2s both';
      }

      const cards = entry.target.querySelectorAll('.feature-card, .template-card, .reason');
      cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.6s ease-out ${0.3 + index * 0.1}s both`;
      });

      const statItems = entry.target.querySelectorAll('.stat-item');
      statItems.forEach((item, index) => {
        item.style.animation = `fadeInScale 0.6s ease-out ${0.3 + index * 0.15}s both`;
      });

      const statFills = entry.target.querySelectorAll('.stat-fill');
      statFills.forEach(fill => {
        const width = fill.dataset.width;
        if (width) {
          setTimeout(() => {
            fill.style.width = width + '%';
          }, 800);
        }
      });

      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.what-we-do, .templates, .why-us').forEach(section => {
  observer.observe(section);
});

const stats = document.querySelectorAll('.hero-stats .stat-value');
stats.forEach(stat => {
  const value = stat.dataset.value;
  if (value !== undefined && value !== '∞') {
    let current = 0;
    const target = parseInt(value);
    const duration = 1500;
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      current = Math.floor(target * easeOut);
      stat.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        stat.textContent = target;
      }
    }

    setTimeout(() => requestAnimationFrame(updateCount), 800);
  }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mouseenter', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.style.setProperty('--x', x + 'px');
    this.style.setProperty('--y', y + 'px');
  });
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.querySelectorAll('.particle').forEach(p => {
      p.style.animationPlayState = 'paused';
    });
  } else {
    document.querySelectorAll('.particle').forEach(p => {
      p.style.animationPlayState = 'running';
    });
  }
});
