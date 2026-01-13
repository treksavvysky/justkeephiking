// =========================
// LOAD CONFIG FROM JSON
// =========================
let config = null;

async function loadConfig() {
  try {
    const response = await fetch('data/site.json');
    config = await response.json();
    renderStaticData();
    startCountdown();
  } catch (error) {
    console.error('Failed to load config:', error);
    // Fallback to hardcoded values if fetch fails
    config = {
      mode: "permit",
      permitReleaseUTC: "2026-01-13T18:30:00Z",
      myPermitSlotUTC: "2026-01-13T20:48:07Z",
      startDateISO: "",
      stats: {
        milesDone: 0,
        sectionNow: "Permitting",
        lastCheckin: "Today",
        nextTown: "Campo (soon)"
      },
      liveStatus: {
        state: "Planning / Permit Day",
        area: "Off-trail (ops planning)",
        blurb: "Finalizing my NOBO start date today.",
        next: "After permit is confirmed."
      }
    };
    renderStaticData();
    startCountdown();
  }
}

// =========================
// RENDER STATIC DATA
// =========================
function renderStaticData() {
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("milesDone").textContent = config.stats.milesDone.toLocaleString();
  document.getElementById("sectionNow").textContent = config.stats.sectionNow;
  document.getElementById("lastCheckin").textContent = config.stats.lastCheckin;
  document.getElementById("nextTown").textContent = config.stats.nextTown;

  document.getElementById("statusState").textContent = config.liveStatus.state;
  document.getElementById("statusArea").textContent = config.liveStatus.area;
  document.getElementById("statusBlurb").textContent = config.liveStatus.blurb;
  document.getElementById("statusNext").textContent = config.liveStatus.next;
}

// =========================
// COUNTDOWN ENGINE
// =========================
function pad2(n){ return String(n).padStart(2, "0"); }

function tick(){
  if (!config) return;

  const now = new Date();
  const releaseTime = new Date(config.permitReleaseUTC);
  const mySlotTime = new Date(config.myPermitSlotUTC);
  const startTime = config.startDateISO ? new Date(config.startDateISO) : null;

  let target, label, title, meta, note;

  // Determine which countdown to show
  if (config.mode === "start" && startTime) {
    // Final mode: counting down to trail start
    target = startTime;
    label = "Campo Start";
    title = "Start date locked";
    meta = "Countdown to Campo";
    note = "It begins.";
  } else if (now < releaseTime) {
    // Stage 1: Before Round 2 opens
    target = releaseTime;
    label = "NOBO Permit Release";
    title = "Round 2 opens";
    meta = "Jan 13 · 10:30 AM PT";
    note = "Eagerly waiting for my permit slot at 12:48:07 PM PT to pick my start date. Big day for the hiking community!";
  } else if (now < mySlotTime) {
    // Stage 2: Round 2 is open, waiting for my slot
    target = mySlotTime;
    label = "MY PERMIT SLOT";
    title = "Time to pick my date";
    meta = "Jan 13 · 12:48:07 PM PT";
    note = "Round 2 portal is open. My turn is coming up!";
  } else {
    // After my slot time
    target = mySlotTime;
    label = "PERMIT SLOT";
    title = "Decision time";
    meta = "Jan 13 · 12:48:07 PM PT";
    note = "Portal time. Time to pick the date and commit.";
  }

  // Update labels
  document.getElementById("cdLabel").textContent = label;
  document.getElementById("cdTitle").textContent = title;
  document.getElementById("cdMeta").textContent = meta;
  document.getElementById("cdNote").textContent = note;

  // Calculate time difference
  let diff = target.getTime() - now.getTime();

  if (diff <= 0) diff = 0;

  const s = Math.floor(diff/1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  document.getElementById("dDays").textContent = pad2(days);
  document.getElementById("dHours").textContent = pad2(hours);
  document.getElementById("dMins").textContent = pad2(mins);
  document.getElementById("dSecs").textContent = pad2(secs);
}

function startCountdown() {
  tick();
  setInterval(tick, 250);
}

// Initialize on page load
loadConfig();
