// --- Dropdown logic ---
console.log("🔥 JS is connected!");
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

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      observer.unobserve(section);
    }
  });
}, { threshold: 0.5 });

observer.observe(section);

//contact us button logic 
document.getElementById('contactBtn').addEventListener('click', function () {
  window.location.href = 'contact.html'; 
});

// Social media links
document.querySelectorAll('.linkedin-icon').forEach(function(icon) {
  icon.addEventListener('click', function () {
    window.open('https://www.linkedin.com/in/chrono-biomedical-6aa5a0360/', '_blank');
  });
});

document.querySelectorAll('.whatsapp-icon').forEach(function(icon) {
  icon.addEventListener('click', function () {
    window.open('https://wa.me/16465009154', '_blank'); // Replace with your number
  });
});