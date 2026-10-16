// ======================================
// STUDENT PROFILE JAVASCRIPT
// BCC
// ======================================

// Welcome Message
window.addEventListener("load", () => {

    const hour = new Date().getHours();
    let greeting = "Good Morning";

    if (hour >= 12 && hour < 17) {
        greeting = "Good Afternoon";
    } else if (hour >= 17) {
        greeting = "Good Evening";
    }

    console.log(greeting + ", Meezan Alam");
});

// ======================================
// EDIT PROFILE BUTTON
// ======================================

const editBtn = document.querySelector(".left-profile button");

if (editBtn) {

    editBtn.addEventListener("click", () => {

        alert(
`Edit Profile

This feature will be available after connecting the backend.

Students will be able to edit:
• Phone Number
• Email
• Address
• Profile Photo

Only the Admin can edit:
• Student Name
• Roll Number
• Admission Number
• Class
• Section`
        );

    });

}

// ======================================
// CHANGE PASSWORD
// ======================================

const changePassword = document.querySelector(".blue");

if (changePassword) {

    changePassword.addEventListener("click", () => {

        alert(
`Change Password

Backend is not connected yet.

Soon students will be able to change their password securely.`
        );

    });

}

// ======================================
// DOWNLOAD PROFILE
// ======================================

const downloadBtn = document.querySelector(".green");

if (downloadBtn) {

    downloadBtn.addEventListener("click", () => {

        alert(
`Download Profile

PDF download will be available after backend integration.`
        );

    });

}

// ======================================
// PROFILE CARD ANIMATION
// ======================================

const cards = document.querySelectorAll(".section");

cards.forEach((card, index) => {

    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";

    setTimeout(() => {

        card.style.transition = "0.5s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0px)";

    }, index * 150);

});

// ======================================
// ACTIVE SIDEBAR
// ======================================

const menuItems = document.querySelectorAll(".sidebar ul li");

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        menuItems.forEach(menu => menu.classList.remove("active"));

        item.classList.add("active");

    });

});

// ======================================
// IMAGE HOVER EFFECT
// ======================================

const studentImage = document.querySelector(".left-profile img");

if (studentImage) {

    studentImage.addEventListener("mouseenter", () => {

        studentImage.style.transform = "scale(1.05)";
        studentImage.style.transition = "0.3s";

    });

    studentImage.addEventListener("mouseleave", () => {

        studentImage.style.transform = "scale(1)";

    });

}

// ======================================
// END
// ======================================

console.log("Student Profile Loaded Successfully");

// ======================================
// RESPONSIVE HAMBURGER SIDEBAR
// ======================================

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

function openSidebar() {
    if (!sidebar || !menuToggle) return;

    sidebar.classList.add("open");
    document.body.classList.add("sidebar-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");

    const icon = menuToggle.querySelector("i");
    if (icon) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    }
}

function closeSidebar() {
    if (!sidebar || !menuToggle) return;

    sidebar.classList.remove("open");
    document.body.classList.remove("sidebar-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    const icon = menuToggle.querySelector("i");
    if (icon) {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
}

if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
        if (sidebar.classList.contains("open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
}

// Close the sidebar after selecting a page on tablet/mobile.
if (sidebar) {
    sidebar.querySelectorAll("li").forEach(item => {
        item.addEventListener("click", () => {
            if (window.innerWidth <= 1050) {
                closeSidebar();
            }
        });
    });
}

// ESC closes the mobile menu.
document.addEventListener("keydown", event => {
    if (
        event.key === "Escape" &&
        sidebar &&
        sidebar.classList.contains("open")
    ) {
        closeSidebar();
    }
});

// If the browser is resized back to desktop, restore desktop state.
window.addEventListener("resize", () => {
    if (window.innerWidth > 1050) {
        closeSidebar();
    }
});

// Save the signed-in student's public dedication locally (frontend demo).
document.addEventListener('DOMContentLoaded', () => {
 const field=document.getElementById('dedicationText'), save=document.getElementById('saveDedication'), count=document.getElementById('dedicationCount'), status=document.getElementById('dedicationStatus');
 if(!field||!window.BCCStudents)return;
 const student=window.BCCStudents.currentStudent();
 field.value=window.BCCStudents.getMessage(student.id);
 const update=()=>count.textContent=`${field.value.length} / 280`;
 field.addEventListener('input',update);update();
 save.addEventListener('click',()=>{
   const value=field.value.trim();
   if(/(?:\+?\d[\d\s-]{8,}\d)|(?:[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})|(?:https?:\/\/)/i.test(value)){status.textContent='Please remove phone numbers, email addresses and links before saving.';return;}
   try{window.BCCStudents.saveMessage(student.id,value);status.textContent='Saved on this browser. Your message appears in the class directory here.';}
   catch(e){status.textContent='Could not save. Check browser storage settings.';}
 });
});
