/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth/web-extension";
import { auth } from "../utils/firebase";
import VocabularyModel from "../database/VocabularyModel";
import { translateVn } from "../utils/translate";
import { ExtensionPersistence } from "./storage";

chrome.runtime.onInstalled.addListener(() => {
  // Create a new context menu item
  chrome.contextMenus.create({
    id: "add_vocabulary",
    title: "Add Vocabulary",
    contexts: ["selection"], // Only show the menu when some text is selected
  });
});

// Function to send a message to the content script
function sendHighlightMessage(tabId: any, keywords: any) {
  chrome.tabs.sendMessage(tabId, {
    action: "highlight",
    data: keywords,
  });
}

// Handle clicks on the context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const keyword = (info.selectionText || "").trim();
  if (
    info.menuItemId === "add_vocabulary" &&
    keyword &&
    tab?.id &&
    auth.currentUser?.uid
  ) {
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        func: (selectedText) => {
          const selection = window.getSelection();
          if (!selection) return;
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          // Get the position of the selected text (coordinates)
          const position = {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
          };
          // Return the URL, selected text, and position
          return {
            url: window.location.href,
            selectedText: selectedText,
            position: position,
          };
        },
        args: [keyword],
      })
      .then(async (results) => {
        const result = results[0].result;
        const vnKeyword = await translateVn(keyword);
        auth.currentUser?.uid &&
          result &&
          keyword &&
          VocabularyModel.addVocabulary(auth.currentUser?.uid, {
            keyword: keyword,
            notes: vnKeyword,
            ...result,
          });
        keyword &&
          sendHighlightMessage(tab.id, [
            {
              keyword: keyword,
              notes: vnKeyword,
              ...result,
            },
          ]);
      });
  }
});

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "add_vocabulary" && tab.id) {
    // Perform your action, e.g., open a popup or trigger something in the extension.
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        func: () => {
          function getSelectedText(window: any) {
            let selectedText = "";
            if (window.getSelection) {
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                selectedText = range.toString();
              }
            }
            return selectedText;
          }
          const selection = window.getSelection();
          const selectedText = getSelectedText(window).trim();

          if (!selection) return;
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          // Get the position of the selected text (coordinates)
          const position = {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
          };
          // Return the URL, selected text, and position
          return {
            url: window.location.href,
            selectedText: selectedText,
            position: position,
          };
        },
        args: [],
      })
      .then(async (results) => {
        const result = results[0].result;
        const keyword = result?.selectedText || "";
        const vnKeyword = await translateVn(keyword);
        auth.currentUser?.uid &&
          result &&
          keyword &&
          VocabularyModel.addVocabulary(auth.currentUser?.uid, {
            keyword: keyword,
            notes: vnKeyword,
            ...result,
          });
        keyword &&
          sendHighlightMessage(tab.id, [
            {
              keyword: keyword,
              notes: vnKeyword,
              ...result,
            },
          ]);
      });
  }
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "login") {
    setPersistence(auth, ExtensionPersistence).then(() => {
      // Handle Firebase authentication using a popup
      signInWithEmailAndPassword(auth, message.email, message.password);
    });
  }
  if (message.action === "logout") {
    auth.signOut();
  }
  if (message.action === "get_vocabulary") {
    if (auth.currentUser?.uid) {
      VocabularyModel.read(auth.currentUser?.uid).then((data: any) =>
        sendResponse(Object.values(data))
      );
    } else {
      sendResponse([]);
    }
  }
  if (message.action === "remove_vocabulary") {
    if (auth.currentUser?.uid) {
      VocabularyModel.deleteVocabularyByKeyword(
        auth.currentUser?.uid,
        message.data
      );
    }
  }
  if (message.action === "update_vocabulary_count") {
    if (auth.currentUser?.uid) {
      VocabularyModel.updateWordsCount(auth.currentUser?.uid, message.data);
    }
  }
  return true;
});
