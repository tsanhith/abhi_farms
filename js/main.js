/* ============================================
   Abhi FARMS — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Header Scroll Effect ───
  const header = document.querySelector('.header');
  const heroSection = document.querySelector('.hero');

  function updateHeader() {
    if (!header) return;
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      header.classList.remove('header--transparent');
      header.classList.add('header--solid');
    } else {
      header.classList.add('header--transparent');
      header.classList.remove('header--solid');
    }
  }

  // For inner pages without hero, always use solid header
  if (!heroSection) {
    header?.classList.remove('header--transparent');
    header?.classList.add('header--solid');
  } else {
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  // ─── Mobile Nav Toggle ───
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const navOverlay = document.querySelector('.nav-overlay');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      nav.classList.toggle('open');
      navOverlay?.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    navOverlay?.addEventListener('click', () => {
      navToggle.classList.remove('active');
      nav.classList.remove('open');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    // Close nav on link click
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        nav.classList.remove('open');
        navOverlay?.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── Scroll Animations ───
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  animatedElements.forEach(el => observer.observe(el));

  // ─── Testimonial Carousel ───
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  let currentSlide = 0;
  const totalSlides = dots.length;

  function goToSlide(index) {
    if (!track || totalSlides === 0) return;
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });

  // Auto-play testimonials
  if (totalSlides > 0) {
    setInterval(() => {
      goToSlide((currentSlide + 1) % totalSlides);
    }, 5000);
  }

  // ─── FAQ Accordion ───
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('active');
        const a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = null;
      });

      // Open clicked
      if (!isActive) {
        item.classList.add('active');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ─── Area Checker ───
  const areaForm = document.getElementById('area-form');
  const areaResult = document.getElementById('area-result');

  const serviceableAreas = [
    '500001', '500002', '500003', '500004', '500005',
    '500006', '500007', '500008', '500009', '500010',
    '500011', '500012', '500013', '500014', '500015',
    '500016', '500017', '500018', '500019', '500020',
    '500025', '500028', '500029', '500030', '500032',
    '500033', '500034', '500035', '500036', '500038',
  ];

  areaForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pincode = document.getElementById('pincode-input')?.value.trim();
    if (!pincode || pincode.length !== 6) {
      areaResult.className = 'area-result expanding';
      areaResult.textContent = 'Please enter a valid 6-digit pin code.';
      areaResult.style.display = 'block';
      return;
    }

    if (serviceableAreas.includes(pincode)) {
      areaResult.className = 'area-result success';
      areaResult.innerHTML = '🎉 Great news! We deliver to your area. <a href="contact.html" style="color: inherit; text-decoration: underline; font-weight: 700;">Order now →</a>';
      areaResult.style.display = 'block';
    } else {
      areaResult.className = 'area-result expanding';
      areaResult.innerHTML = '📍 We\'re expanding! Leave your details and we\'ll notify you. <a href="contact.html" style="color: inherit; text-decoration: underline; font-weight: 700;">Contact us →</a>';
      areaResult.style.display = 'block';
    }
  });

  // ─── Contact Form ───
  const contactForm = document.getElementById('contact-form');
  const formContainer = document.getElementById('form-container');
  const formSuccess = document.getElementById('form-success');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple honeypot check
    const honeypot = contactForm.querySelector('[name="website"]');
    if (honeypot && honeypot.value) return;

    // Show success
    if (formContainer) formContainer.style.display = 'none';
    if (formSuccess) formSuccess.classList.add('show');

    // Reset form
    contactForm.reset();
  });

  // ─── Counter Animation (Trust Bar) ───
  const counters = document.querySelectorAll('.trust-number[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-count'));
        const suffix = counter.getAttribute('data-suffix') || '';
        let current = 0;
        const increment = target / 60;
        const duration = 2000;
        const stepTime = duration / 60;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.floor(current) + suffix;
            setTimeout(updateCounter, stepTime);
          } else {
            counter.textContent = target + suffix;
          }
        };

        updateCounter();
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // ─── Active Nav Link ───
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

});
