/* =========================================================
   MOTIVATIONAL SESSION
   ========================================================= */

let motivationalApi = null;
let currentSession = null;

const meetingWindow = document.getElementById("motivationalMeetingWindow");
const jitsiContainer = document.getElementById("motivationalJitsiContainer");
const placeholder = document.getElementById("motivationalPlaceholder");
const joinBtn = document.getElementById("joinMotivationalBtn");
const fullscreenBtn = document.getElementById("motivationalFullscreenBtn");
const closeBtn = document.getElementById("motivationalCloseBtn");
const meetingStatus = document.getElementById("meetingStatus");
const title = document.getElementById("motivationalTitle");
const meetingTitle = document.getElementById("meetingTitle");
const meetingSpeaker = document.getElementById("meetingSpeaker");
const description = document.getElementById("motivationalDescription");
const badge = document.getElementById("motivationalBadge");
const studentName = document.getElementById("studentNameMini");

studentName.textContent = getBCCStudentName();

function parseDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function isActive(session) {
    if (!session || session.active === false) return false;
    const now = Date.now();
    const start = parseDate(session.startAt);
    const end = parseDate(session.endAt);
    if (start && now < start.getTime()) return false;
    if (end && now > end.getTime()) return false;
    return true;
}

async function loadSession() {
    if (typeof motivationalConfig !== "undefined" && motivationalConfig.useBackend && motivationalConfig.backendEndpoint) {
        const response = await fetch(motivationalConfig.backendEndpoint);
        if (!response.ok) throw new Error("Unable to load session.");
        const data = await response.json();
        return data.session || data.data || data || null;
    }
    return typeof motivationalConfig !== "undefined" ? motivationalConfig.demoSession : null;
}

function renderSession(session) {
    currentSession = session;

    if (!session) {
        title.textContent = "No Motivational Session";
        meetingTitle.textContent = "No Live Session";
        meetingSpeaker.textContent = "A new session will appear when scheduled.";
        description.textContent = "There is no motivational session available right now.";
        badge.innerHTML = "<span></span>OFFLINE";
        joinBtn.disabled = true;
        placeholder.querySelector("h3").textContent = "No live session right now";
        placeholder.querySelector("p").textContent = "Please return when a session is scheduled.";
        return;
    }

    title.textContent = session.title || "Motivational Session";
    meetingTitle.textContent = session.title || "Motivational Session";
    meetingSpeaker.textContent = session.speaker || "Teacher / Speaker";

    if (isActive(session)) {
        description.textContent = "The live motivational session is active. Join directly from this page.";
        badge.innerHTML = "<span></span>LIVE";
        badge.classList.add("live");
        joinBtn.disabled = false;
        placeholder.querySelector("h3").textContent = "Ready to join the session?";
        placeholder.querySelector("p").textContent = "Your camera and microphone can be controlled after joining.";
    } else {
        description.textContent = "The session is scheduled and will become available at its start time.";
        badge.innerHTML = "<span></span>SCHEDULED";
        badge.classList.remove("live");
        joinBtn.disabled = true;
        placeholder.querySelector("h3").textContent = "Session is not live yet";
        placeholder.querySelector("p").textContent = "The Join button will become available when the scheduled time begins.";
    }
}

function joinSession() {
    if (!currentSession || !isActive(currentSession) || motivationalApi) return;

    try {
        motivationalApi = createBCCMeeting({
            roomName: currentSession.roomName || "BCC-MOTIVATIONAL-DEMO",
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
    if (motivationalApi) {
        const api = motivationalApi;
        motivationalApi = null;
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

(async function init() {
    try {
        renderSession(await loadSession());
    } catch (error) {
        console.error(error);
        renderSession(null);
    }
})();
