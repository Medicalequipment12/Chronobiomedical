document.addEventListener('DOMContentLoaded', function () {
  

  // --- Dropdown logic ---
  const navItem = document.querySelector(".our-services");
  const dropdown = document.getElementById('dropdown');

  if (navItem && dropdown) {
    navItem.addEventListener('mouseenter', () => dropdown.style.display = 'flex');
    dropdown.addEventListener('mouseenter', () => dropdown.style.display = 'flex');
    navItem.addEventListener('mouseleave', () => dropdown.style.display = 'none');
    dropdown.addEventListener('mouseleave', () => dropdown.style.display = 'none');
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

  // --- Contact Us button ---
  const contactBtn = document.getElementById('contactBtn');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      window.location.href = 'contact.html';
    });
  }

  // --- Social icons ---
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

  // --- Contact form + inline message ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const successBox = document.createElement('div');
    successBox.id = 'form-success';
    successBox.style.display = 'none';
    successBox.style.padding = '10px';
    successBox.style.marginTop = '10px';
    successBox.style.backgroundColor = '#d4edda';
    successBox.style.color = '#155724';
    successBox.style.border = '1px solid #c3e6cb';
    successBox.style.borderRadius = '5px';
    contactForm.appendChild(successBox);

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.querySelector('#name').value;
      const email = document.querySelector('#email').value;
      const subject = document.querySelector('#subject').value;
      const message = document.querySelector('#message').value;
      const website = document.querySelector('#website')?.value || '';

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
        successBox.textContent = '✅ Thank you! Your message has been sent.';
        successBox.style.display = 'block';
        contactForm.reset();
        setTimeout(() => successBox.style.display = 'none', 5000);
      })
      .catch(err => {
        console.error('Error:', err);
        successBox.textContent = '❌ There was an error sending your message.';
        successBox.style.display = 'block';
        successBox.style.backgroundColor = '#f8d7da';
        successBox.style.color = '#721c24';
        successBox.style.border = '1px solid #f5c6cb';
        setTimeout(() => successBox.style.display = 'none', 6000);
      });
    });
  }

  // --- Burger menu ---
  const burger = document.getElementById("burger");
  const navContainer = document.getElementById("nav-container");

  if (burger && navContainer) {
    burger.addEventListener("click", function () {
      navContainer.classList.toggle("show");
      burger.classList.toggle("rotate");
    });
  }

  // --- Cookie banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookies = document.getElementById('accept-cookies');

  if (cookieBanner && acceptCookies) {
    if (!localStorage.getItem('cookiesAccepted')) {
      cookieBanner.style.display = 'block';
    }

    acceptCookies.addEventListener('click', function () {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.style.display = 'none';
    });
  }
});