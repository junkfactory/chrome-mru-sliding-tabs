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
const options = {};

document.getElementById("option_form").addEventListener("submit", function () {
  const delay = parseFloat(document.getElementById("delay").value);
  if (isNaN(delay) || delay < 0) {
    delay = 1;
  }
  options.delay = delay;

  const reOrderPinnedTabs = document.getElementById("order_pinned").checked;
  options.reOrderPinnedTabs = reOrderPinnedTabs;

  chrome.storage.local.set({ options });
  window.close();
});

// Restores select box state to saved value from localStorage.
const data = await chrome.storage.local.get("options");
Object.assign(options, data.options);
const delay = options.delay || 1;
document.getElementById("delay").value = delay;
document.getElementById("order_pinned").checked =
  options.reOrderPinnedTabs ?? true;
