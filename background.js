// The MIT License (MIT)
//
// Copyright © 2024 junkfactory@gmail.com
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the “Software”), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
// PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
// BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// Add listener for when the selected tab in a window changes.

const LAST_TID = "pid";

chrome.tabs.onActivated.addListener(async function (activeInfo) {
  await chrome.storage.local.get(LAST_TID).then((d) => {
    console.debug("prev tid", d);
    const pid = d.pid;
    if (pid !== undefined) {
      console.debug("cleear timeout", pid);
      clearTimeout(pid);
      chrome.storage.local.remove(LAST_TID);
    }
  });
  await chrome.storage.local.get("delay").then((d) => {
    console.debug("delay:", d);
    const latestTimeoutId = setTimeout(
      () => {
        slideTab(activeInfo.tabId);
      },
      (d?.delay || 1) * 1000,
    );
    chrome.storage.local.set({ pid: latestTimeoutId });
  });
});

function slideTab(selectedTabId) {
  console.debug("moving", selectedTabId);
  // Get the selected tab after the timeout
  chrome.tabs.query({ active: true }).then(([tabInfo]) => {
    console.debug("active tab:", tabInfo);
    if (tabInfo.id == selectedTabId) {
      // pinned tab will always be left most
      if (tabInfo.pinned) {
        movePinnedTab(selectedTabId);
      } else {
        moveUnpinnedTab(selectedTabId, tabInfo);
      }
    }
  });
}

function movePinnedTab(selectedTabId) {
  chrome.tabs.move(selectedTabId, {
    index: 0,
  });
}

function moveUnpinnedTab(selectedTabId, tabInfo) {
  // move after all pinned tabs
  chrome.tabs
    .query({ windowId: tabInfo.windowId, pinned: true })
    .then((tabs) => {
      const pinnedCount = tabs.length;
      if (tabInfo.groupId > 0) {
        //move the tab group
        chrome.tabGroups.move(tabInfo.groupId, { index: pinnedCount });
      }
      chrome.tabs.move(selectedTabId, { index: pinnedCount });
    });
}
