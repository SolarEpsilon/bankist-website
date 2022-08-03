'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST WEBSITE

/////////////////////////////////////////////////
// Page Elements
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');

/////////////////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// For each button that opens the modal (our "open account" buttons), create a click event listener that opens the modal window:
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// Add "closeModal" event listener to modal close button and to modal overlay:
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// Fancy code to make the "escape" key also close the modal. If a key is pressed, the 'keydown' event triggers. If this is the esc key AND the modal is NOT hidden, then also close the modal:
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////////////////////////
// Button scrolling:

// "Learn more" button at the top of the page. When clicked, takes the user to the "features" section:
btnScrollTo.addEventListener('click', function () {
  // Scroll to the "features" section:
  section1.scrollIntoView({ behavior: 'smooth' });
});

/////////////////////////////////////////////////
// Event delegation:

// When navigation header links are clicked, run fuction:
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // If the item clicked in a navigation link, run conditional:
  if (e.target.classList.contains('nav__link')) {
    // Create ID for the smooth scrolling to target:
    const id = e.target.getAttribute('href');
    // If the ID of the item clicked on the heading has an ID (a link), scroll to that link. If the heading has no ID (namely the "open account" button), don't do anything:
    if (id !== '#')
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component:
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause that ends function early (since clicking outside the box returns "null", which is falsy):
  if (!clicked) return;

  // Remove highlight from other "operations" tabs:
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  // Remove box info from other "operations" tabs:
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Highlight clicked "operations" tab:
  clicked.classList.add('operations__tab--active');

  // Activate and display content area of clicked "operations" tab:
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/////////////////////////////////////////////////
// Header and menu

// Menu fade animation:
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    // Select hovered link:
    const link = e.target;
    // Select siblings elements (all other links):
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    // Select logo:
    const logo = link.closest('.nav').querySelector('img');

    // Select each sibling link. If not the hovered link, then add opacity:
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    // Add opacity to logo:
    logo.style.opacity = this;
  }
};

// Add event listeners and bind a value to "this". When the mouse hovers over an element in the nav menu, make the opacity of the other links lighter via our code above. When the mouse leaves, turn the opacity back to normal:
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// /////////////////////////////////////////////
// Sticky header navigation:
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  // Unpack single entry from "entries" array:
  const [entry] = entries;

  // If header is not intersecting the top of the page, make it sticky. This is achieved using the intersectionOberver API and its "inIntersecting" property:
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

// Observe header with our new intersectionObserver "header Observer" function:
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  // Destructure entry from entries:
  const [entry] = entries;

  // Guard clause: if not intersecting, stop:
  if (!entry.isIntersecting) return;

  // Reveal section:
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

/////////////////////////////////////////////////
// Image loading

// lazy loading images (great for slow connections):
const imgTargets = document.querySelectorAll('img[data-src]');

// Load images function:
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replaces "src" with "data-src". "entry.target" is the element currently being intersected:
  entry.target.src = entry.target.dataset.src;

  // Once image loads, remove blur:
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  // Image has loaded, so stop observing:
  observer.unobserve(entry.target);
};

// Lazy load images using IntersectionObserver. This new function checks if the image is in view, the "threshold: 0". If it is in view, load the image:
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

// Observe each image in imgTargets using forEach method:
imgTargets.forEach(img => imgObserver.observe(img));

/////////////////////////////////////////////////
// "Testimonials" slider

// Huge "slider" functon housing all our data on the slider:
const slider = function () {
  // Create slider variables:
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  // Used to determine which slide the user is at:
  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    // For each slide, create a dot button:
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    // Remove active class for each dot:
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    // Add active class for dot of current slide:
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // Create each slide using translateX function to position each slide side by side instead of stacked on top of each other:
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Go to next slide by changing value of the transform property:
  const nextSlide = function () {
    // If slide is at last element, go back to first slide:
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    // Inside nextSlide function, go to the current slide and activate its dot:
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Similar to nextSlide, go to previous slide by changing value of the transform property:
  const prevSlide = function () {
    // If slide is at first element, go back to last slide:
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    // As with nextSlide, go to the current slide and activate its dot:
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Create "init" function that starts at the first slide:
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  // Run the newly created "init" to have it as the default when the site first loads:
  init();

  // Event handlers:
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Create ability to move slider with left and right arrow keys:
  document.addEventListener('keydown', function (e) {
    // Same outcome, one using if/else and one using short circuiting:
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  // Create clickable dots for each slide:
  dotContainer.addEventListener('click', function (e) {
    // If element clicked is a dot:
    if (e.target.classList.contains('dots__dot')) {
      // Unpack dataset of the targeted element (the current slide):
      const { slide } = e.target.dataset;
      // Set "curSlide" to the current slide, and change it from a string to a number:
      curSlide = Number(slide);
      // Go to the current slide and update the dot:
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
// Run "slider" function:
slider();
/////////////////////////////////////////////////
