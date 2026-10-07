BCC Welcome + Login Modal

Replace your current public index.html, style.css and script.js with these three files.

The old separate login page is no longer needed for the user flow. Both the header Login button and the footer Enter BCC Portal button open the liquid-glass login card as a draggable modal over index.html.

The existing bccStudentSession localStorage login state is preserved. Successful login redirects to dashboard.html.

Logout must remove bccStudentSession and redirect to index.html:

localStorage.removeItem("bccStudentSession");
window.location.replace("index.html");

The modal can be closed by clicking anywhere outside the login card. There is no corner X button and no Escape-key close behavior.

SECTION POSITIONING NOTE (v3)
----------------------------
The original Home page styles/layout are intentionally untouched.
The final section-positioning patch only affects .public-section content.
Desktop/tablet/mobile content is lifted by responsive amounts so that
About Us, Our Faculty, Facilities, Results and Contact sit higher below
the fixed header without changing the Home page.
