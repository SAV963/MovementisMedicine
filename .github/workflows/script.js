const generatePlanButton = document.getElementById("generatePlan");
const eventTypeInput = document.getElementById("eventType");
const raceDateInput = document.getElementById("raceDate");
const planResult = document.getElementById("planResult");
const countdownValue = document.getElementById("countdownValue");

const saveRaceButton = document.getElementById("saveRace");
const raceNameInput = document.getElementById("raceName");
const raceDistanceInput = document.getElementById("raceDistance");
const raceLogDateInput = document.getElementById("raceLogDate");
const raceTimeInput = document.getElementById("raceTime");
const raceList = document.getElementById("raceList");

const trainingGuidance = {
  "Sprint Triathlon": "Focus on balanced swim, bike, and run consistency with one weekly brick workout.",
  "Olympic Triathlon": "Build steady aerobic volume, threshold work, and race-specific brick sessions.",
  "70.3 Triathlon": "Prioritize long rides, strong fueling practice, and durable long-run progression.",
  "Ironman": "Emphasize long aerobic training, race nutrition, recovery discipline, and pacing control.",
  "5K": "Train for speed with intervals, tempo work, and steady easy mileage.",
  "10K": "Blend speed and threshold work with moderate weekly volume.",
  "Half Marathon": "Prioritize threshold sessions, long runs, and race-pace durability.",
  "Marathon": "Build long-run strength, fueling practice, and marathon-pace efficiency.",
  "Ultramarathon": "Focus on time-on-feet, terrain-specific prep, durability, and fueling strategy."
};

function daysUntil(dateString) {
  if (!dateString) return null;
  const today = new Date();
  const raceDate = new Date(dateString + "T00:00:00");
  const ms = raceDate - new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function updateCountdown(dateString, eventName) {
  const days = daysUntil(dateString);

  if (!dateString || Number.isNaN(days)) {
    countdownValue.textContent = "No race selected yet";
    return;
  }

  if (days < 0) {
    countdownValue.textContent = `${eventName} was ${Math.abs(days)} day(s) ago`;
    return;
  }

  if (days === 0) {
    countdownValue.textContent = `${eventName} is today`;
    return;
  }

  countdownValue.textContent = `${days} day(s) until ${eventName}`;
}

generatePlanButton.addEventListener("click", () => {
  const eventName = eventTypeInput.value;
  const raceDate = raceDateInput.value;
  const days = daysUntil(raceDate);

  let timingText = "Set a race date to see your countdown.";
  if (raceDate && !Number.isNaN(days)) {
    if (days > 0) {
      timingText = `You have ${days} day(s) to prepare.`;
    } else if (days === 0) {
      timingText = "Race day is here.";
    } else {
      timingText = "That race date has already passed.";
    }
  }

  planResult.innerHTML = `
    <h3>${eventName} Plan</h3>
    <p><strong>Primary focus:</strong> ${trainingGuidance[eventName]}</p>
    <p><strong>Countdown:</strong> ${timingText}</p>
    <p><strong>Weekly reminder:</strong> Stay consistent, recover well, and build gradually.</p>
  `;

  updateCountdown(raceDate, eventName);
});

function loadRaces() {
  const races = JSON.parse(localStorage.getItem("moveRaces") || "[]");
  raceList.innerHTML = "";

  if (races.length === 0) {
    raceList.innerHTML = "<li>No races logged yet.</li>";
    return;
  }

  races.forEach((race) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${race.name}</strong> • ${race.distance} • ${race.date} • ${race.time}`;
    raceList.appendChild(li);
  });
}

saveRaceButton.addEventListener("click", () => {
  const name = raceNameInput.value.trim();
  const distance = raceDistanceInput.value.trim();
  const date = raceLogDateInput.value;
  const time = raceTimeInput.value.trim();

  if (!name || !distance || !date || !time) {
    alert("Please fill out all race fields.");
    return;
  }

  const races = JSON.parse(localStorage.getItem("moveRaces") || "[]");
  races.unshift({ name, distance, date, time });
  localStorage.setItem("moveRaces", JSON.stringify(races));

  raceNameInput.value = "";
  raceDistanceInput.value = "";
  raceLogDateInput.value = "";
  raceTimeInput.value = "";

  loadRaces();
});

loadRaces();
