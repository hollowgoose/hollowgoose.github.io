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
    console.log("Loading and playing track:", track);
    console.log("Current track index:", currentTrackIndex);

    document.getElementById("track-time").innerText = "Loading...";

    clearSelection();

    loadTrack(track);

    const currentNavItem = document.querySelector(
        `.nav-item[index="${currentTrackIndex}"]`
    );
    currentNavItem.classList.add("selected");

    document.getElementById("track-name").innerText = track;

    audioPlayer.load(); // This ensures that the new source is loaded

    audioPlayer.addEventListener("canplaythrough", () => {
        document.getElementById("track-time").innerText = "";
        audioPlayer
            .play()
            .then(() => {
                // Ensure the play button icon is updated
                iconUpdater();
            })
            .catch((error) => {
                console.error("Error playing audio:", error);
            });
    });
}

// POPULATE NAVIGATOR
export function populateTracks(tracks) {
    const navItems = document.getElementById("nav-items");

    tracks.forEach((track, index) => {
        const navItem = document.createElement("div");
        navItem.classList.add("nav-item");
        navItem.setAttribute("index", index);
        navItem.setAttribute("role", "button");
        navItem.setAttribute("tabindex", "0");
        navItem.setAttribute("aria-label", `Select Track: ${track}`);

        const itemText = document.createElement("p");
        itemText.innerHTML = track;

        navItem.appendChild(itemText);

        navItem.addEventListener("click", async (event) => {
            const clickedIndex = parseInt(
                event.currentTarget.getAttribute("index"),
                10
            );
            currentTrackIndex = clickedIndex;

            clearSelection(); // Remove "selected" class from all navigation items

            navItems.querySelectorAll(".nav-item").forEach((item) => {
                item.setAttribute("aria-selected", "false");
            });

            // Select the clicked item
            event.currentTarget.classList.add("selected");

            // Wait for loadAndPlayTrack to complete before setting aria-selected
            await loadAndPlayTrack(tracklist[currentTrackIndex]);

            // Set aria-selected for the clicked item
            event.currentTarget.setAttribute("aria-selected", "true");
        });

        navItems.appendChild(navItem);

        // Add "selected" class to the first navigation item
        if (index === 0) {
            navItem.classList.add("selected");
            navItem.setAttribute("aria-selected", "true");
        }
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

// Clear 'Selected' Class
function clearSelection() {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
        item.classList.remove("selected");
        item.setAttribute("aria-selected", "false");
    });
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

    const newCurrentNavItem = document.querySelector(
        `.nav-item[index="${currentTrackIndex}"]`
    );
    newCurrentNavItem.classList.add("selected");
    newCurrentNavItem.setAttribute("aria-selected", "true");
});

// FORWARD BUTTON FUNCTION
forwardTrack.addEventListener("click", () => {
    clearSelection();
    currentTrackIndex = (currentTrackIndex + 1) % tracklist.length;
    console.log(
        "Loading and Playing Next Track:",
        tracklist[currentTrackIndex]
    );
    loadAndPlayTrack(tracklist[currentTrackIndex]);
    progress.value = 0;

    // Set "aria-selected" for the new current track
    const newCurrentNavItem = document.querySelector(
        `.nav-item[index="${currentTrackIndex}"]`
    );
    newCurrentNavItem.classList.add("selected");
    newCurrentNavItem.setAttribute("aria-selected", "true");
});

// UPDATE TRACKBAR TIME
function updateProgressBar() {
    if (audioPlayer.readyState === 4) {
        // Check if the track is fully loaded
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
    } else {
        // Track is still loading, skip updating the trackbar
        console.log("Track is still loading, skipping progress update");
    }
}

audioPlayer.addEventListener("timeupdate", () => {
    updateProgressBar();

    // Update the currentTrackIndex when the track is finished
    if (audioPlayer.currentTime === audioPlayer.duration && !isTrackChanging) {
        isTrackChanging = true; // Set the flag to true to avoid multiple executions

        console.log("Track finished. Current track index:", currentTrackIndex);

        if (manualTrackChange) {
            // Handle logic for manual track change
            console.log("Manual track change");
            manualTrackChange = false; // Reset the flag
        } else {
            // Handle logic for natural track end
            console.log("Natural track end");
            currentTrackIndex = (currentTrackIndex + 1) % tracklist.length;
            loadAndPlayTrack(tracklist[currentTrackIndex], () => {
                isTrackChanging = false; // Reset the flag when the track is successfully changed
            });
            progress.value = 0;

            const newCurrentNavItem = document.querySelector(
                `.nav-item[index="${currentTrackIndex}"]`
            );
            newCurrentNavItem.classList.add("selected");
            newCurrentNavItem.setAttribute("aria-selected", "true");
        }
    }
});

// MOVE PLAYHEAD FUNCTION
progress.addEventListener("input", () => {
    const seekTime = (progress.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
});
