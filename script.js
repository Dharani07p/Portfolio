/* ============================================================
   DHARANI P — PORTFOLIO SCRIPT
   Includes: Loader, Cursor, Particles, Typed Text,
             Scroll Reveal, Counter, Nav Highlight, Form
   ============================================================ */

// ===== PAGE LOADER =====
window.addEventListener('load', () => {
  const loader     = document.getElementById('loader');
  const loaderFill = document.getElementById('loaderFill');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        startTyped();
        startCounters();
      }, 300);
    }
    loaderFill.style.width = progress + '%';
  }, 60);
});

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = (mx - 5) + 'px';
  cursor.style.top  = (my - 5) + 'px';
});

(function animateRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = (rx - 19) + 'px';
  ring.style.top  = (ry - 19) + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .project-card, .skill-group').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'scale(2.8)';
    cursor.style.background = 'rgba(94,234,212,0.5)';
    ring.style.opacity = '0.25';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'scale(1)';
    cursor.style.background = 'var(--accent)';
    ring.style.opacity = '1';
  });
});

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.size  = Math.random() * 1.5 + 0.3;
    this.speedX= (Math.random() - 0.5) * 0.4;
    this.speedY= (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.4 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(94,234,212,${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(94,234,212,${0.06 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== TYPED TEXT =====
const roles = [
  'Software Engineer',
  'Full Stack Developer',
  'Java Backend Developer',
  'React Frontend Developer',
  'Spring Boot Developer'
];
let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
const typedEl  = document.getElementById('typed-role');

function typeRole() {
  if (!typedEl) return;
  const current = roles[roleIndex];

  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === current.length) {
    setTimeout(() => { isDeleting = true; typeRole(); }, 2200);
    return;
  }
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex  = (roleIndex + 1) % roles.length;
  }

  setTimeout(typeRole, isDeleting ? 55 : 95);
}

function startTyped() {
  setTimeout(typeRole, 600);
}

// ===== COUNTER ANIMATION =====
function animateCounter(el, target) {
  let current   = 0;
  const duration = 1500;
  const step     = target / (duration / 16);

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + (target > 10 ? '+' : '');
  }, 16);
}

function startCounters() {
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    animateCounter(el, target);
  });
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Trigger counters when about section is visible
      if (entry.target.closest('#about')) {
        startCounters();
      }
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 140) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 60) {
    navbar.style.borderBottomColor = 'rgba(94,234,212,0.1)';
    navbar.style.background = 'rgba(6,9,16,0.95)';
  } else {
    navbar.style.borderBottomColor = 'rgba(255,255,255,0.07)';
    navbar.style.background = 'rgba(6,9,16,0.8)';
  }
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== CONTACT FORM =====
const form = document.querySelector('.form');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.form-btn');
    const original = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = '#22c55e';
        form.reset();
      } else {
        throw new Error();
      }
    } catch {
      btn.textContent = 'Failed — Try Again';
      btn.style.background = '#ef4444';
    }

    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 3500);
  });
}

// ===== PROJECT CARD TILT =====
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width / 2;
    const cy     = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -4;
    const rotateY = ((x - cx) / cx) * 4;
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateX(0) rotateY(0)';
  });
});
