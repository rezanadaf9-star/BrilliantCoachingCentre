/* =========================================================
   SUPER 15 TEACHER MOTIVATION MEETING
   ========================================================= */

let super15Api = null;
let currentSession = null;

const meetingWindow = document.getElementById("super15MeetingWindow");
const jitsiContainer = document.getElementById("super15JitsiContainer");
const placeholder = document.getElementById("super15Placeholder");
const joinBtn = document.getElementById("joinSuper15Btn");
const fullscreenBtn = document.getElementById("super15FullscreenBtn");
const closeBtn = document.getElementById("super15CloseBtn");
const meetingStatus = document.getElementById("super15MeetingStatus");
const meetingTitle = document.getElementById("super15MeetingTitle");
const teacher = document.getElementById("super15Teacher");
const badge = document.getElementById("super15Badge");
const studentName = document.getElementById("studentNameMini");

studentName.textContent = getBCCStudentName();

function parseDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function isActive(session) {
    if (!session) return false;
    const now = Date.now();
    const start = parseDate(session.startAt);
    const end = parseDate(session.endAt);
    if (start && now < start.getTime()) return false;
    if (end && now > end.getTime()) return false;
    return true;
}

function getSession() {
    if (typeof super15Config !== "undefined" && Array.isArray(super15Config.demoSessions)) {
        return super15Config.demoSessions[0] || null;
    }
    return null;
}

function renderSession(session) {
    currentSession = session;

    if (!session) {
        meetingTitle.textContent = "No Live Teacher Session";
        teacher.textContent = "A teacher session will appear when scheduled.";
        badge.innerHTML = "<span></span>OFFLINE";
        joinBtn.disabled = true;
        placeholder.querySelector("h3").textContent = "No live session right now";
        placeholder.querySelector("p").textContent = "Please return when your teacher schedules a session.";
        return;
    }

    meetingTitle.textContent = session.title || "Super 15 Teacher Session";
    teacher.textContent = session.teacher || "Teacher";

    if (isActive(session)) {
        badge.innerHTML = "<span></span>LIVE";
        badge.classList.add("live");
        joinBtn.disabled = false;
        placeholder.querySelector("h3").textContent = "Ready to join your teacher?";
        placeholder.querySelector("p").textContent = "Join the live teacher-led motivation session now.";
    } else {
        badge.innerHTML = "<span></span>SCHEDULED";
        badge.classList.remove("live");
        joinBtn.disabled = true;
        placeholder.querySelector("h3").textContent = "Session is not live yet";
        placeholder.querySelector("p").textContent = "The Join button will become available at the scheduled time.";
    }
}

function joinSession() {
    if (!currentSession || !isActive(currentSession) || super15Api) return;

    try {
        super15Api = createBCCMeeting({
            roomName: currentSession.roomName || "BCC-SUPER15-TEACHER",
            container: jitsiContainer,
            displayName: getBCCStudentName(),
            onJoined: () => meetingStatus.textContent = "Connected",
            onLeft: closeMeeting,
            onReadyToClose: closeMeeting
        });

        placeholder.style.display = "none";
        jitsiContainer.style.display = "block";
        meetingStatus.textContent = "Joining...";
    } catch (error) {
        console.error(error);
        meetingStatus.textContent = "Meeting service unavailable";
    }
}

function closeMeeting() {
    if (super15Api) {
        const api = super15Api;
        super15Api = null;
        try { api.dispose(); } catch (error) { console.warn("Jitsi cleanup:", error); }
    }
    jitsiContainer.innerHTML = "";
    jitsiContainer.style.display = "none";
    placeholder.style.display = "flex";
    meetingStatus.textContent = "Not joined";

    if (meetingWindow.classList.contains("ptm-fullscreen")) {
        setMeetingFullscreen(false);
        fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
        fullscreenBtn.title = "Full screen";
    }
}

function setMeetingFullscreen(active) {
    const sidebar = document.querySelector(".sidebar");

    meetingWindow.classList.toggle("ptm-fullscreen", active);
    document.body.classList.toggle("bcc-meeting-fullscreen", active);
    document.body.style.overflow = active ? "hidden" : "";

    // The sidebar belongs to the dashboard layout, so explicitly remove it
    // from the fullscreen stacking context instead of relying only on z-index.
    if (sidebar) {
        if (active) {
            if (!sidebar.dataset.bccPreviousDisplay) {
                sidebar.dataset.bccPreviousDisplay = sidebar.style.display || "";
            }
            sidebar.style.display = "none";
            sidebar.style.pointerEvents = "none";
        } else {
            sidebar.style.display = sidebar.dataset.bccPreviousDisplay || "";
            sidebar.style.pointerEvents = "";
            delete sidebar.dataset.bccPreviousDisplay;
        }
    }
}

function toggleFullscreen() {
    const active = !meetingWindow.classList.contains("ptm-fullscreen");
    setMeetingFullscreen(active);
    fullscreenBtn.innerHTML = active
        ? '<i class="fa-solid fa-compress"></i>'
        : '<i class="fa-solid fa-expand"></i>';
    fullscreenBtn.title = active ? "Exit full screen" : "Full screen";
}

joinBtn.addEventListener("click", joinSession);
closeBtn.addEventListener("click", closeMeeting);
fullscreenBtn.addEventListener("click", toggleFullscreen);
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && meetingWindow.classList.contains("ptm-fullscreen")) toggleFullscreen();
});

renderSession(getSession());
