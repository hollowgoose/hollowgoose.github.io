import { tracklist } from "./tracklist.js";
import { populateTracks } from "./audio_functions.js";

document.addEventListener("DOMContentLoaded", () => {
    populateTracks(tracklist);
});
