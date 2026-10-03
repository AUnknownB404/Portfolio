// 1. Dark mode button
var themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', function () {
  document.documentElement.classList.toggle('dark');
  if (document.documentElement.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// 2. Mobile menu button
var menuBtn = document.getElementById('menu-toggle');
var mobileMenu = document.getElementById('mobile-menu');
menuBtn.addEventListener('click', function () {
  mobileMenu.classList.toggle('hidden');
  menuBtn.setAttribute(
    'aria-expanded',
    !mobileMenu.classList.contains('hidden')
  );
});
// close the menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    mobileMenu.classList.add('hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

// 3. Project rows: click to show/hide details (only one open at a time)
var projectRows = document.querySelectorAll('.project-row');
projectRows.forEach(function (row) {
  row.addEventListener('click', function (event) {
    // the "View case study" button opens the case study page instead
    var caseButton = event.target.closest('.feature-link');
    if (caseButton) {
      openCaseStudy(row);
      return;
    }
    var details = row.querySelector('.project-details');
    var wasOpen = !details.classList.contains('hidden');
    // close every row first
    projectRows.forEach(closeRow);
    // open this one (unless it was already open)
    if (!wasOpen) {
      openRow(row);
    } else {
      // the user closed it, so at least one must stay open: open project one
      openRow(projectRows[0]);
    }
  });
});

// small helper functions to open / close a row
function openRow(row) {
  var d = row.querySelector('.project-details');
  d.classList.remove('hidden');
  d.classList.add('grid');
}
function closeRow(row) {
  var d = row.querySelector('.project-details');
  d.classList.add('hidden');
  d.classList.remove('grid');
}

// project one is open when the page loads
openRow(projectRows[0]);

// 3b. Case study page: fill the dialog with the info from the clicked row
var modal = document.getElementById('case-study-modal');
var currentProject = 0; // number of the project shown in the case study (0 = first)
var chipClass =
  'px-3 py-1 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400';

function openCaseStudy(row) {
  var details = row.querySelector('.project-details');
  var title = details.querySelector('h3').textContent.trim();
  var category = details.querySelector('span').textContent.trim();
  var description = details.querySelector('p').textContent.trim();
  var image = details.querySelector('img');
  var index = Array.prototype.indexOf.call(projectRows, row) + 1;
  currentProject = index - 1;

  document.getElementById('case-current').textContent = '0' + index;
  document.getElementById('case-total').textContent = '0' + projectRows.length;
  document.getElementById('case-category').textContent = category;
  document.getElementById('case-study-title').textContent = title;
  document.getElementById('case-description').textContent = description;
  document.getElementById('case-about').textContent = description;
  document.getElementById('case-image').src = image.src;
  document.getElementById('case-image').alt = title + ' screenshot';
  document.getElementById('case-gallery-label').textContent =
    'Project screenshot';

  // tags (from the row's tag list)
  var chips = document.getElementById('case-chips');
  var tags = row.querySelector('ul').querySelectorAll('li');
  var tagNames = [];
  chips.innerHTML = '';
  tags.forEach(function (tag) {
    var li = document.createElement('li');
    li.className = chipClass;
    li.textContent = tag.textContent.trim();
    chips.appendChild(li);
    tagNames.push(tag.textContent.trim());
  });

  // key features (split the data-features text at "|")
  var featureList = document.getElementById('case-features');
  featureList.innerHTML = '';
  details.dataset.features.split('|').forEach(function (text) {
    var li = document.createElement('li');
    li.className =
      'flex gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm';
    li.innerHTML =
      '<span class="w-5 h-5 shrink-0 flex items-center justify-center rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs">+</span>' +
      text;
    featureList.appendChild(li);
  });

  // project details list
  document.getElementById('case-details').innerHTML =
    '<dt>Project Type</dt><dd>' +
    category +
    '</dd><dt>Tech Stack</dt><dd>' +
    tagNames.join(', ') +
    '</dd>';

  // screenshot gallery
  document.getElementById('case-gallery').innerHTML =
    '<figure class="m-0 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700"><img class="w-full" src="' +
    image.src +
    '" alt="' +
    title +
    ' project screenshot" /><figcaption class="p-2 text-xs text-slate-500">' +
    title +
    ' project screenshot</figcaption></figure>';

  // grey out the arrows at the first / last project
  document.getElementById('case-prev').disabled = currentProject === 0;
  document.getElementById('case-next').disabled =
    currentProject === projectRows.length - 1;

  // open the dialog only if it is not open yet (this lets us change project inside it)
  if (!modal.open) {
    modal.showModal();
  }
  modal.scrollTop = 0;
}

// previous / next buttons (pagination)
document.getElementById('case-prev').addEventListener('click', function () {
  if (currentProject > 0) {
    openCaseStudy(projectRows[currentProject - 1]);
  }
});
document.getElementById('case-next').addEventListener('click', function () {
  if (currentProject < projectRows.length - 1) {
    openCaseStudy(projectRows[currentProject + 1]);
  }
});
// left / right arrow keys also change the project
document.addEventListener('keydown', function (event) {
  if (!modal.open) {
    return;
  }
  if (event.key === 'ArrowLeft') {
    document.getElementById('case-prev').click();
  }
  if (event.key === 'ArrowRight') {
    document.getElementById('case-next').click();
  }
});

// close button, Esc key (built in) and clicking the dark area
document.getElementById('case-close').addEventListener('click', function () {
  modal.close();
});
modal.addEventListener('click', function (event) {
  if (event.target === modal) {
    modal.close();
  }
});

// 4. Marquee: copy the logo list once so the loop looks endless
var logoList = document.getElementById('logo-list');
var copy = logoList.cloneNode(true);
copy.removeAttribute('id');
copy.setAttribute('aria-hidden', 'true');
logoList.parentNode.appendChild(copy);

// 5. Contact form: simple check, then a message
var form = document.getElementById('contactForm');
var status = document.getElementById('formStatus');
form.addEventListener('submit', function (event) {
  event.preventDefault();
  if (
    form.name.value === '' ||
    form.email.value === '' ||
    form.message.value === ''
  ) {
    status.textContent = 'Please fill in your name, email and message.';
    return;
  }
  status.textContent =
    'Thanks, ' +
    form.name.value +
    '! Your message is ready to send (connect a backend to deliver it).';
  form.reset();
});

// 6. Navbar becomes a pill when you scroll
var navbar = document.getElementById('navbar');
function checkScroll() {
  if (window.scrollY > 24) {
    navbar.classList.add('is-scrolled');
  } else {
    navbar.classList.remove('is-scrolled');
  }
}
window.addEventListener('scroll', checkScroll);
checkScroll();

// 7. Scroll reveal: add the "reveal" class now, show it when it enters the screen
var revealItems = document.querySelectorAll(
  'section h2, section .rounded-3xl, section .rounded-2xl, .project-row'
);
revealItems.forEach(function (item) {
  item.classList.add('reveal');
});

function startScrollReveal() {
  var watcher = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          watcher.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealItems.forEach(function (item) {
    watcher.observe(item);
  });
}

// 8. Cinematic intro: one word at a time, changing quickly
var body = document.body;
var intro = document.getElementById('portfolio-intro');
var introBox = document.getElementById('intro-lines');

// The words that appear one after another. Change or add words here!
// "time" is how long each word stays on the screen (in milliseconds)
var introWords = [
  {
    html: 'Md. Akash <span class="outline-text">Hossen</span>',
    css: 'font-display font-black text-5xl md:text-8xl',
    time: 300,
  },
  {
    html: 'Full-Stack Developer',
    css: 'font-display italic text-3xl md:text-6xl',
    time: 300,
  },
  /*{
          html: 'Laravel',
          css: 'font-display font-semibold text-5xl md:text-8xl',
          time: 500,
        },
        {
          html: 'Vue.js',
          css: 'font-display font-semibold text-5xl md:text-8xl',
          time: 500,
        },
        {
          html: 'PHP',
          css: 'font-display font-semibold text-5xl md:text-8xl',
          time: 500,
        },
        {
          html: 'MySQL',
          css: 'font-display font-semibold text-5xl md:text-8xl',
          time: 500,
        },
        {
          html: 'JavaScript',
          css: 'font-display font-semibold text-5xl md:text-8xl',
          time: 500,
        },
        {
          html: 'Tailwind CSS',
          css: 'font-display font-semibold text-5xl md:text-8xl',
          time: 500,
        }, */
  {
    html: 'Welcome',
    css: 'font-display italic font-black text-6xl md:text-9xl',
    time: 300,
  },
];
var exitTime = 450; // intro fades out (ms)

// show the real page and remove the intro
function showPortfolio() {
  body.classList.add('portfolio-ready');
  intro.classList.add('is-closing');
  setTimeout(function () {
    intro.style.display = 'none';
    body.classList.remove('intro-active');
  }, 800);
  startScrollReveal();
}

// show word number "i", then call itself for the next word
function showWord(i) {
  // all words shown? then exit and show the page
  if (i >= introWords.length) {
    intro.classList.add('is-exiting');
    setTimeout(showPortfolio, exitTime);
    return;
  }
  var word = introWords[i];
  introBox.innerHTML = '';
  var p = document.createElement('p');
  p.className = 'intro-line ' + word.css;
  p.innerHTML = word.html;
  introBox.appendChild(p);
  // small wait so the fade-in animation can start
  setTimeout(function () {
    p.classList.add('show');
  }, 20);
  // go to the next word after this word's time
  setTimeout(function () {
    showWord(i + 1);
  }, word.time);
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  showPortfolio(); // no animation for people who turned it off
} else {
  showWord(0); // start right away
}
