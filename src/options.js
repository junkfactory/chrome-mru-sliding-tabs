// Saves options to localStorage.
//save options
document.getElementById('option_form').addEventListener("submit", function () {
    var delay = parseFloat(document.getElementById("delay").value);
    if (isNaN(delay) || (delay < 0)) {
        delay = chrome.extension.getBackgroundPage().defaultDelay;
    }

    if (delay == chrome.extension.getBackgroundPage().defaultDelay) {
        delete localStorage["delay"];
    }
    else {
        localStorage["delay"] = delay;
    }
});

// Restores select box state to saved value from localStorage.
window.onload = function () {
    var delay = localStorage["delay"];
    if (!delay) {
        delay = chrome.extension.getBackgroundPage().defaultDelay;
    }
    document.getElementById("delay").value = delay;
}