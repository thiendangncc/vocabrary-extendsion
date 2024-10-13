import highlight from "./highlight";

export const contentListener = {
  init() {
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
      if (request.action === "highlight") {
        // Call the highlightKeywords function with the keywords passed from the background script
        highlight.mark(request.data);
        sendResponse({ status: "Keywords highlighted!" });
      }
    });
  },
};
