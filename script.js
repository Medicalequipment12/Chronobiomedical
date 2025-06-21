document.addEventListener('DOMContentLoaded', function () {
  console.log("🔥 JS is connected!");

  // --- Dropdown logic ---
  const navItem = document.querySelector(".our-services");
  const dropdown = document.getElementById('dropdown');

  if (navItem && dropdown) {
    navItem.addEventListener('mouseenter', () => {
      dropdown.style.display = 'flex';
    });

    dropdown.addEventListener('mouseenter', () => {
      dropdown.style.display = 'flex';
    });

    navItem.addEventListener('mouseleave', () => {
      dropdown.style.display = 'none';
    });

    dropdown.addEventListener('mouseleave', () => {
      dropdown.style.display = 'none';
    });
  } else {
    console.warn("Dropdown or navItem not found — skipping dropdown logic");
  }

  // --- Counter animation ---
  const section = document.querySelector("#why-choose-us");
  const counters = document.querySelectorAll(".number");

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute("data-target");
      let count = 0;
      const step = Math.ceil(target / 100);

      const update = () => {
        count += step;
        if (count < target) {
          counter.textContent = count;
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      };

      update();
    });
  };

  if (section && counters.length > 0) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(section);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(section);
  }

  // --- Contact Us button logic ---
  const contactBtn = document.getElementById('contactBtn');
  if (contactBtn) {
    contactBtn.addEventListener('click', function () {
      window.location.href = 'contact.html';
    });
  }

  // --- Social media icons ---
  document.querySelectorAll('.linkedin-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      window.open('https://www.linkedin.com/in/chrono-biomedical-6aa5a0360/', '_blank');
    });
  });

  document.querySelectorAll('.instagram-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      window.open('https://www.instagram.com/chronobiomedical/', '_blank');
    });
  });

  document.querySelectorAll('.whatsapp-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      window.open('https://wa.me/16465009154', '_blank');
    });
  });

  // --- Contact form with honeypot logic ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.querySelector('#name').value;
      const email = document.querySelector('#email').value;
      const subject = document.querySelector('#subject').value;
      const message = document.querySelector('#message').value;
      const website = document.querySelector('#website')?.value || ''; // 🛡️ Honeypot

      if (website.trim() !== '') {
        console.warn('Bot detected — honeypot triggered!');
        return;
      }

      fetch('http://localhost:3001/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, website })
      })
      .then(res => res.json())
      .then(data => {
        alert(data.message || 'Message sent!');
        contactForm.reset();
      })
      .catch(err => {
        console.error('Error:', err);
        alert('There was an error sending your message.');
      });
    });
  }

  // --- Burger menu logic ---
  const burger = document.getElementById("burger");
  const navContainer = document.getElementById("nav-container");

  if (burger && navContainer) {
    burger.addEventListener("click", function () {
      navContainer.classList.toggle("show");
      burger.classList.toggle("rotate");
    });
  }

  // --- Cookies popup logic ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookies = document.getElementById('accept-cookies');

  if (cookieBanner && acceptCookies && !localStorage.getItem('cookiesAccepted')) {
    cookieBanner.style.display = 'flex';

    acceptCookies.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.style.display = 'none';
    });
  }
});
