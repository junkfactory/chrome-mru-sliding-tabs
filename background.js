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

const ALARM_ID = "mru-sliding-tabs";
let activeTabId = null;
// Add listener for when the selected tab in a window changes.
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.storage.local.get("delay").then((s) => {
    const delay = s.delay || 1;
    activeTabId = activeInfo.tabId;
    chrome.alarms.clear(ALARM_ID).then(() => {
      chrome.alarms.create(ALARM_ID, {
        when: Date.now() + delay * 1000,
      });
    });
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name == ALARM_ID && activeTabId) {
    slideTabs(activeTabId);
  }
});

function slideTabs(oldTabId) {
  // Get the selected tab after the timeout
  chrome.tabs.query({ active: true }).then(([tabInfo]) => {
    if (tabInfo.id == oldTabId) {
      // pinned tab will always be left most
      if (tabInfo.pinned)
        chrome.tabs.move(oldTabId, {
          index: 0,
        });
      else {
        // move after all pinned tabs
        chrome.tabs.query({ windowId: tabInfo.windowId }).then((tabs) => {
          let pinnedCount = 0;
          while (tabs[pinnedCount].pinned) ++pinnedCount;
          chrome.tabs.move(oldTabId, { index: pinnedCount });
        });
      }
    }
  });
}
