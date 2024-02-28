var defaultDelay = 1;

// Add listener for when the selected tab in a window changes.
chrome.tabs.onActivated.addListener(function (activeInfo) {
    // Only move the tab if the user keeps that tab visible for some period
    // of time
    var delay = localStorage["delay"];
    if (!delay) {
        delay = defaultDelay;
    }
    window.setTimeout(function () {
        tabTimeout(activeInfo.tabId)
    }, delay * 1000);
});

function tabTimeout(oldTabId) {
    // Get the selected tab after the timeout
    chrome.tabs.getSelected(null, function (newTab) {
        // Move the selected tab to the front only if it has been selected
        // for the appropriate period of time
        if (newTab.id == oldTabId) {
            if (newTab.pinned)
                chrome.tabs.move(oldTabId, {
                    index: 0
                });
            else {
                chrome.tabs.getAllInWindow(null, function (tabs) {
                    var pinnedCount = 0;
                    while (tabs[pinnedCount].pinned)
                        ++pinnedCount;
                    chrome.tabs.move(oldTabId, {
                        index: pinnedCount
                    });
                });
            }
        }
    });
}
