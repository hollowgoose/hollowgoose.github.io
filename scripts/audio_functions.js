import { tracklist } from "./tracklist.js";

const playButton = document.getElementById("ctrlIcon");
const audioPlayer = document.getElementById("track");
const progress = document.getElementById("progress");
const backTrack = document.getElementById("back-track");
const forwardTrack = document.getElementById("forward-track");

let currentTrackIndex = 0;

// LOAD TRACK
export function loadTrack(track) {
    const source = document.createElement("source");

    source.src = `../media/${track}.mp3`;
    source.type = "audio/mpeg";

    audioPlayer.innerHTML = "";
    audioPlayer.appendChild(source);

    audioPlayer.play();
}

// Function to load and play a track
function loadAndPlayTrack(track) {
    loadTrack(track);

    document.getElementById("track-name").innerText = track;

    audioPlayer.load(); // This ensures that the new source is loaded
    audioPlayer.play().then(() => {
        // Ensure the play button icon is updated
        iconUpdater();
    });
}

// POPULATE NAVIGATOR
export function populateTracks(tracks) {
    const navItems = document.getElementById("nav-items");

    tracks.forEach((track, index) => {
        const navItem = document.createElement("div");
        navItem.classList.add("nav-item");
        navItem.setAttribute("index", index);
        const itemText = document.createElement("p");
        itemText.innerHTML = track;

        navItem.appendChild(itemText);

        navItem.addEventListener("click", () => {
            loadAndPlayTrack(track);
        });

        navItems.appendChild(navItem);
    });
}

// ICON UPDATER
function iconUpdater() {
    const playIcon = document.querySelector("#ctrlIcon i");
    if (audioPlayer.paused) {
        playIcon.classList.remove("fa-pause");
        playIcon.classList.add("fa-play");
    } else {
        playIcon.classList.remove("fa-play");
        playIcon.classList.add("fa-pause");
    }
}

// UPDATE TRACK TIME
function updateTrackTime() {
    const currentTime = audioPlayer.currentTime;
    let trackDuration = audioPlayer.duration;

    if (isNaN(trackDuration)) {
        // Duration might not be available yet, especially right after loading a new track
        // You can use a fallback value or wait for a more accurate duration
        trackDuration = 0;
    }

    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    const formattedCurrentTime = `${String(minutes).padStart(2, "0")}:${String(
        seconds
    ).padStart(2, "0")}`;

    const totalMinutes = Math.floor(trackDuration / 60);
    const totalSeconds = Math.floor(trackDuration % 60);
    const formattedTotalTime = `${String(totalMinutes).padStart(
        2,
        "0"
    )}:${String(totalSeconds).padStart(2, "0")}`;

    document.getElementById(
        "track-time"
    ).innerText = `${formattedCurrentTime} / ${formattedTotalTime}`;

    requestAnimationFrame(updateTrackTime);
}

// Call the function to start updating the track time
updateTrackTime();

// PLAY BUTTON FUNCTION
playButton.addEventListener("click", () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
    iconUpdater();
});

// BACK BUTTON FUNCTION
backTrack.addEventListener("click", () => {
    if (audioPlayer.currentTime <= 3 && currentTrackIndex > 0) {
        console.log("Going to Previous Track");
        currentTrackIndex--;
        loadAndPlayTrack(tracklist[currentTrackIndex]);
    } else {
        console.log("Rewinding Current Track");
        audioPlayer.currentTime = 0;
    }
});

// FORWARD BUTTON FUNCTION
forwardTrack.addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracklist.length;
    console.log(
        "Loading and Playing Next Track:",
        tracklist[currentTrackIndex]
    );
    loadAndPlayTrack(tracklist[currentTrackIndex]);
    progress.value = 0;
});

// UPDATE TRACKBAR TIME
function updateProgressBar() {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    const progressPercentage = (currentTime / duration) * 100;

    progress.value = progressPercentage;

    // Check if the track has reached its end
    if (currentTime === duration) {
        // Automatically load and play the next track
        currentTrackIndex = (currentTrackIndex + 1) % tracklist.length;
        loadAndPlayTrack(tracklist[currentTrackIndex]);
        progress.value = 0;
    }

    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(updateProgressBar);
}

audioPlayer.addEventListener("timeupdate", updateProgressBar);

// MOVE PLAYHEAD FUNCTION
progress.addEventListener("input", () => {
    const seekTime = (progress.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
});
