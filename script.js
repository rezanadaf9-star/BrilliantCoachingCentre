const slides = [...document.querySelectorAll(".hero-slide")];
const dots = [...document.querySelectorAll(".dot")];
let current = 0;
let timer;

function showSlide(next) {
  next = (next + slides.length) % slides.length;
  if (next === current) return;

  const old = slides[current];
  const incoming = slides[next];

  old.classList.remove("active");
  old.classList.add("prev");
  incoming.classList.add("active");
  incoming.classList.remove("prev");

  setTimeout(() => old.classList.remove("prev"), 900);

  dots.forEach((dot, i) => dot.classList.toggle("active", i === next));
  current = next;
}

function nextSlide() { showSlide(current + 1); }

function restartAutoPlay() {
  clearInterval(timer);
  timer = setInterval(nextSlide, 5000); // 5 seconds
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
    restartAutoPlay();
  });
});

const hero = document.querySelector(".hero");
let pointerStart = null;

hero.addEventListener("pointerdown", e => {
  pointerStart = e.clientX;
  hero.setPointerCapture?.(e.pointerId);
});

hero.addEventListener("pointerup", e => {
  if (pointerStart === null) return;
  const distance = e.clientX - pointerStart;
  if (Math.abs(distance) > 45) {
    // Drag/swipe left = next; drag/swipe right = previous.
    showSlide(distance < 0 ? current + 1 : current - 1);
    restartAutoPlay();
  }
  pointerStart = null;
});

document.querySelectorAll(".portal-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    // All portal buttons intentionally navigate to login.html
  });
});

const menu = document.querySelector(".main-nav");
const toggle = document.querySelector(".menu-toggle");
toggle?.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".main-nav a").forEach(link => {
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

restartAutoPlay();

const moreFacultyButton = document.querySelector('.more-faculty');
const moreFacultyList = document.querySelector('#more-faculty-list');
moreFacultyButton?.addEventListener('click', () => {
  const isOpen = moreFacultyButton.getAttribute('aria-expanded') === 'true';
  moreFacultyButton.setAttribute('aria-expanded', String(!isOpen));
  if (moreFacultyList) moreFacultyList.hidden = isOpen;
  const icon = moreFacultyButton.querySelector('i');
  if (icon) icon.className = isOpen ? 'fa-solid fa-plus' : 'fa-solid fa-minus';
});



/* =========================================================
   EXTRACTED LIQUID-GLASS LOGIN LOGIC
   ========================================================= */
/* =========================================================
   WELCOME PUBLIC SCHOOL
   LIQUID GLASS LOGIN
   ========================================================= */

/* =========================================================
   ELEMENTS
   ========================================================= */

const loginForm = document.getElementById("loginForm");

const loginButton = document.getElementById("loginButton");

const passwordInput = document.getElementById("password");

const passwordToggle = document.getElementById("passwordToggle");

const userIdInput = document.getElementById("userId");

const studentButton = document.getElementById("studentButton");

const teacherButton = document.getElementById("teacherButton");

const portalStatus = document.getElementById("portalStatus");

const portalName = document.getElementById("portalName");

const statusIcon = document.getElementById("statusIcon");

const idLabel = document.getElementById("idLabel");

const passwordLabel = document.getElementById("passwordLabel");

const idError = document.getElementById("idError");

const passwordError = document.getElementById("passwordError");

const loginMessage = document.getElementById("loginMessage");

const loginCard = document.querySelector(".login-card");
const loginStyleToggle = document.getElementById("loginStyleToggle");

/* Toggle the login card between the original liquid-glass style and
   the solid BCC theme. This affects only the login card. */
loginStyleToggle?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();

  const solid = loginCard.classList.toggle("solid-mode");
  loginStyleToggle.setAttribute("aria-pressed", String(solid));
  loginStyleToggle.setAttribute(
    "aria-label",
    solid ? "Switch to liquid glass login card" : "Switch to solid login card"
  );
  loginStyleToggle.setAttribute(
    "title",
    solid ? "Switch to liquid glass" : "Switch to solid card"
  );
});

/* =========================================================
   PORTAL STATE
   ========================================================= */

let currentPortal = "student";

/* =========================================================
   PORTAL DATA
   ========================================================= */

const portalData = {
  student: {
    name: "Student Portal",

    idLabel: "Student ID",

    passwordLabel: "Password",

    idPlaceholder: "Enter Student ID",

    passwordPlaceholder: "Enter Student Password",
  },

  teacher: {
    name: "Teacher Portal",

    idLabel: "Teacher ID",

    passwordLabel: "Password",

    idPlaceholder: "Enter Teacher ID",

    passwordPlaceholder: "Enter Teacher Password",
  },
};

/* =========================================================
   SWITCH PORTAL
   ========================================================= */

function switchPortal(portal) {
  currentPortal = portal;

  const data = portalData[portal];

  /* -----------------------------------------
       Buttons
       ----------------------------------------- */

  studentButton.classList.remove("active");

  teacherButton.classList.remove("active");

  if (portal === "student") {
    studentButton.classList.add("active");

    loginCard.classList.remove("teacher-mode");
  } else {
    teacherButton.classList.add("active");

    loginCard.classList.add("teacher-mode");
  }

  /* -----------------------------------------
       Portal status
       ----------------------------------------- */

  portalName.textContent = data.name;

  /* -----------------------------------------
       Labels
       ----------------------------------------- */

  idLabel.textContent = data.idLabel;

  passwordLabel.textContent = data.passwordLabel;

  /* -----------------------------------------
       Placeholders
       ----------------------------------------- */

  userIdInput.placeholder = data.idPlaceholder;

  passwordInput.placeholder = data.passwordPlaceholder;

  /* -----------------------------------------
       Clear previous errors
       ----------------------------------------- */

  clearErrors();

  loginMessage.textContent = "";

  loginMessage.className = "login-message";

  /* -----------------------------------------
       Status animation
       ----------------------------------------- */

  portalStatus.style.transform = "scale(0.97)";

  setTimeout(() => {
    portalStatus.style.transform = "scale(1)";
  }, 120);
}

/* =========================================================
   STUDENT PORTAL
   ========================================================= */

studentButton.addEventListener("click", function () {
  switchPortal("student");
});

/* =========================================================
   TEACHER PORTAL
   ========================================================= */

teacherButton.addEventListener("click", function () {
  switchPortal("teacher");
});

/* =========================================================
   ALLOW CREDENTIAL SUGGESTIONS ONLY AFTER USER INTERACTION
   ========================================================= */

[userIdInput, passwordInput].forEach((input) => {
  input.addEventListener("pointerdown", function () {
    this.removeAttribute("readonly");
  }, { once: true });

  input.addEventListener("keydown", function () {
    this.removeAttribute("readonly");
  }, { once: true });
});

/* =========================================================
   SHOW / HIDE PASSWORD
   ========================================================= */

passwordToggle.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";

    this.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';

    this.setAttribute("aria-label", "Hide password");
  } else {
    passwordInput.type = "password";

    this.innerHTML = '<i class="fa-regular fa-eye"></i>';

    this.setAttribute("aria-label", "Show password");
  }
});

/* =========================================================
   VALIDATION
   ========================================================= */

function validateForm() {
  let valid = true;

  clearErrors();

  /* -----------------------------------------
       ID
       ----------------------------------------- */

  if (userIdInput.value.trim() === "") {
    idError.textContent = `Please enter your ${currentPortal} ID.`;

    userIdInput.classList.add("invalid");

    valid = false;
  }

  /* -----------------------------------------
       Password
       ----------------------------------------- */

  if (passwordInput.value.trim() === "") {
    passwordError.textContent = "Please enter your password.";

    passwordInput.classList.add("invalid");

    valid = false;
  }

  return valid;
}

/* =========================================================
   CLEAR ERRORS
   ========================================================= */

function clearErrors() {
  idError.textContent = "";

  passwordError.textContent = "";

  userIdInput.classList.remove("invalid");

  passwordInput.classList.remove("invalid");
}

/* This can be remove and replace the Login from here till before Clear Error While Typing okkk
replace this with this*/
/* =========================================================
   LOGIN & REDIRECT LOGIC
   ========================================================= */

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  loginMessage.textContent = "";

  loginMessage.className = "login-message";

  /* -------------------------------------
           Validate
           ------------------------------------- */

  if (!validateForm()) {
    return;
  }

  /* -------------------------------------
           Loading
           ------------------------------------- */

  loginButton.classList.add("loading");

  loginButton.disabled = true;

  /*
   * FRONT-END DEMO CREDENTIALS
   */

  setTimeout(function () {
    loginButton.classList.remove("loading");

    loginButton.disabled = false;

    // 1. Capture what the user typed
    const enteredId = userIdInput.value.trim();
    const enteredPassword = passwordInput.value;

    // 2. Define your target demo credentials
    const demoStudentId = "26BCC1001";
    const demoStudentPassword = "admin@bcc2009";

    // 3. Run validation check for student portal
    if (
      currentPortal === "student" &&
      enteredId === demoStudentId &&
      enteredPassword === demoStudentPassword
    ) {
      /*
       * Save the student session locally so protected frontend pages
       * such as Super 15 can know which student is logged in.
       *
       * Production authentication should be moved to the backend.
       */
      localStorage.setItem(
        "bccStudentSession",
        JSON.stringify({
          studentId: enteredId,
          name: enteredId,
          role: "student",
          loggedIn: true,
          loggedInAt: new Date().toISOString()
        })
      );

      loginMessage.textContent = "Login Successful! Redirecting...";
      loginMessage.classList.add("success");

      window.location.replace("dashboard.html");
    } else if (currentPortal === "teacher") {
      loginMessage.textContent =
        "Teacher validation is not configured for this demo.";
      loginMessage.classList.add("error");
    } else {
      // Triggers if student credentials don't match your exact strings
      loginMessage.textContent = "Access Denied. Invalid Credentials.";
      loginMessage.classList.add("error");
    }
  }, 1000);
});

/* =========================================================
   CLEAR ERROR WHILE TYPING
   ========================================================= */

userIdInput.addEventListener("input", function () {
  this.classList.remove("invalid");

  idError.textContent = "";
});

passwordInput.addEventListener("input", function () {
  this.classList.remove("invalid");

  passwordError.textContent = "";
});

/* =========================================================
   ENTER KEY
   ========================================================= */

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && document.activeElement !== loginButton) {
    loginForm.requestSubmit();
  }
});

/* =========================================================
   INITIAL STATE
   ========================================================= */

switchPortal("student");


/* =========================================================
   LOGIN MODAL BEHAVIOR
   ========================================================= */

const loginModal = document.getElementById("loginModal");
const loginModalPosition = document.getElementById("loginModalPosition");
const loginModalTriggers = document.querySelectorAll('[data-open-login="true"]');

function openLoginModal(event) {
  if (event) event.preventDefault();

  loginModal.classList.add("open");
  loginModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("login-modal-open");

  // Always open in the exact center unless the user has already dragged it.
  if (!loginModalPosition.dataset.moved) {
    loginModalPosition.style.left = "50%";
    loginModalPosition.style.top = "50%";
    loginModalPosition.style.transform = "translate(-50%, -50%)";
  }

}

function closeLoginModal() {
  loginModal.classList.remove("open");
  loginModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("login-modal-open");
}

loginModalTriggers.forEach((button) => {
  button.addEventListener("click", openLoginModal);
});

loginModal?.addEventListener("click", (event) => {
  if (event.target === loginModal) closeLoginModal();
});

/* ---------------------------------------------------------
   DRAG THE LOGIN CARD AROUND THE SCREEN
   --------------------------------------------------------- */
let dragState = null;

loginModalPosition?.addEventListener("pointerdown", (event) => {
  if (event.button !== undefined && event.button !== 0) return;

  const interactive = event.target.closest("input, textarea, select, button, a, label");
  if (interactive) return;

  const rect = loginModalPosition.getBoundingClientRect();
  dragState = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    startLeft: rect.left,
    startTop: rect.top,
    width: rect.width,
    height: rect.height
  };

  loginModalPosition.setPointerCapture?.(event.pointerId);
  loginModal.classList.add("dragging");
  event.preventDefault();
});

loginModalPosition?.addEventListener("pointermove", (event) => {
  if (!dragState || event.pointerId !== dragState.pointerId) return;

  const dx = event.clientX - dragState.startX;
  const dy = event.clientY - dragState.startY;

  const margin = 8;
  const maxLeft = window.innerWidth - dragState.width - margin;
  const maxTop = window.innerHeight - dragState.height - margin;

  const left = Math.min(Math.max(margin, dragState.startLeft + dx), Math.max(margin, maxLeft));
  const top = Math.min(Math.max(margin, dragState.startTop + dy), Math.max(margin, maxTop));

  loginModalPosition.style.left = `${left}px`;
  loginModalPosition.style.top = `${top}px`;
  loginModalPosition.style.transform = "none";
  loginModalPosition.dataset.moved = "true";
});

function finishDrag(event) {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  loginModalPosition.releasePointerCapture?.(event.pointerId);
  dragState = null;
  loginModal.classList.remove("dragging");
}

loginModalPosition?.addEventListener("pointerup", finishDrag);
loginModalPosition?.addEventListener("pointercancel", finishDrag);

// If the viewport changes, keep a dragged card inside the visible screen.
window.addEventListener("resize", () => {
  if (!loginModal?.classList.contains("open") || !loginModalPosition?.dataset.moved) return;

  const rect = loginModalPosition.getBoundingClientRect();
  const margin = 8;
  const left = Math.min(Math.max(margin, rect.left), Math.max(margin, window.innerWidth - rect.width - margin));
  const top = Math.min(Math.max(margin, rect.top), Math.max(margin, window.innerHeight - rect.height - margin));

  loginModalPosition.style.left = `${left}px`;
  loginModalPosition.style.top = `${top}px`;
  loginModalPosition.style.transform = "none";
});


/* =========================================================
   PUBLIC SECTION NAVIGATION + RESULTS
   ========================================================= */
const publicSections = [...document.querySelectorAll('.public-section[id]')];
const publicNavLinks = [...document.querySelectorAll('.main-nav a')];
function setPublicActive(id) {
  publicNavLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + id));
}
publicNavLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (!id || id === '#login-modal') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setPublicActive(target.id);
    }
    menu?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});
if (publicSections.length) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(x => x.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setPublicActive(visible.target.id);
  }, { root: null, rootMargin: '-20% 0px -65% 0px', threshold: [0.15, 0.35, 0.6] });
  publicSections.forEach(s => observer.observe(s));
}
const homeTarget = document.querySelector('#home');
if (homeTarget) {
  const homeObserver = new IntersectionObserver(entries => {
    if (entries[0]?.isIntersecting) setPublicActive('home');
  }, { root: null, rootMargin: '-10% 0px -70% 0px', threshold: [0.1, 0.4] });
  homeObserver.observe(homeTarget);
}

const matricToppers = [
  ['Nadaf Reza', 462, '2100394', '2021', 'Topper1.png'], ['Md Akram Nazmi', 451, '2200040', '2022', 'topper2.jpg'], ['Noor Afroz', 450, '0000000', '2022', 'topper3.jpg'], ['Ikram Mohsin', 448, '0000000', '2021', 'topper4.jpg'], ['Zamarrud Fatmi', 443, '2600019', '2026', 'topper5.jpg'], ['Tansique Reza', 444, '0000000', '2025', 'topper6.jpg', 'HS BISHANPUR'], ['Md Usama', 437, '0000000', '2021', 'topper7.jpg'], ['Adnan Alam', 437, '0000000', '2025', 'topper8.jpg', 'HS ASURA'], ['Asdak', 436, '0000000', '2025', 'topper9.jpg'], ['Raghib Noor', 435, '1900219', '2019', 'topper10.jpg']
];
const intermediateToppers = [
  ['Aliya Firdous', 450, '26030057', '2026', '12topper1.jpg'], ['Zafia', 416, '0000000', '2022', '12topper2.jpg'], ['Nishar Ashraf', 414, '0000000', '2021', '12topper3.jpg'], ['Sania Perween', 413, '25030018', '2025', '12topper4.jpg'], ['Nujhat Perween', 407, '0000000', '0000', '12topper5.jpg'], ['Ritu Kumari', 402, '0000000', '2021', '12topper6.jpg'], ['Muzaiyan Sara', 401, '0000000', '2022', '12topper7.jpg'], ['Alquama Samar', 398, '0000000', '2021', '12topper8.jpg'], ['Gulsanower Shahi', 396, '0000000', '2021', '12topper9.jpg'], ['Kahkasa', 387, '0000000', '2022', '12topper10.jpg']
];
function renderToppers(id, data) { const el = document.getElementById(id); if (!el) return; el.innerHTML = data.map((s, i) => { const [name, score, roll, batch, photo, extra] = s; return `<article class="topper-card"><span class="rank-badge">#${i + 1}</span><div class="topper-photo"><img src="assets/${photo}" alt="${name}" loading="lazy"></div><h4>${name}</h4><div class="score"><i class="fa-solid fa-star"></i>${score} / 500</div><div class="topper-meta">BSEB Roll No: <strong>${roll}</strong></div><div class="batch">BATCH: <strong>${batch}</strong></div>${extra ? `<div class="topper-extra">Topper - ${extra}</div>` : ''}</article>` }).join(''); }
renderToppers('matricToppers', matricToppers); renderToppers('interToppers', intermediateToppers);


