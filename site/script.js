// =========================
// QUICK CONFIG (edit these)
// =========================

// Permit release: Jan 13, 2026 @ 10:30 AM PT (PST, UTC-8) => 18:30Z
const permitReleaseUTC = "2026-01-13T18:30:00Z";

// After you finalize, set your start date here (local date okay) and flip mode to "start"
// Example: "2026-04-17T07:00:00-07:00" (Campo morning PT)
const startDateISO = ""; // <-- fill later
const mode = "permit";   // "permit" or "start"

// Quick stats (manual MVP)
const stats = {
  milesDone: 0,
  sectionNow: "Permitting",
  lastCheckin: "Today",
  nextTown: "Campo (soon)"
};

// Live status (manual MVP)
const liveStatus = {
  state: "Planning / Permit Day",
  area: "Off-trail (ops planning)",
  blurb: "Finalizing my NOBO start date today.",
  next: "After permit is confirmed."
};

// =========================
// RENDER STATIC DATA
// =========================
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("milesDone").textContent = stats.milesDone.toLocaleString();
document.getElementById("sectionNow").textContent = stats.sectionNow;
document.getElementById("lastCheckin").textContent = stats.lastCheckin;
document.getElementById("nextTown").textContent = stats.nextTown;

document.getElementById("statusState").textContent = liveStatus.state;
document.getElementById("statusArea").textContent = liveStatus.area;
document.getElementById("statusBlurb").textContent = liveStatus.blurb;
document.getElementById("statusNext").textContent = liveStatus.next;

// =========================
// COUNTDOWN ENGINE
// =========================
const target = (mode === "start" && startDateISO)
  ? new Date(startDateISO)
  : new Date(permitReleaseUTC);

const label = (mode === "start" && startDateISO) ? "Campo Start" : "NOBO Permit Release";
const title = (mode === "start" && startDateISO) ? "Start date locked" : "Round 2 opens";
const meta  = (mode === "start" && startDateISO) ? "Countdown to Campo" : "Jan 13 · 10:30 AM PT / 12:30 PM CT";

document.getElementById("cdLabel").textContent = label;
document.getElementById("cdTitle").textContent = title;
document.getElementById("cdMeta").textContent = meta;

function pad2(n){ return String(n).padStart(2, "0"); }

function tick(){
  const now = new Date();
  let diff = target.getTime() - now.getTime();

  if (diff <= 0){
    document.getElementById("dDays").textContent = "00";
    document.getElementById("dHours").textContent = "00";
    document.getElementById("dMins").textContent = "00";
    document.getElementById("dSecs").textContent = "00";
    document.getElementById("cdNote").textContent =
      (mode === "permit")
        ? "Portal time. Time to pick the date and commit."
        : "It begins.";
    return;
  }

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

tick();
setInterval(tick, 250);
