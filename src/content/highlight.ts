import Mark from "mark.js";
import { IPageWordCount } from "../utils/type";
/* eslint-disable @typescript-eslint/no-explicit-any */

// Function to clear the current text selection
// function clearTextSelection() {
//   const selection = window.getSelection();
//   if (selection) {
//     selection.removeAllRanges(); // This will clear any selected text
//   }
// }

// Function to close the tooltip if clicked outside
function closeTooltipOnClickOutside(tooltip: any, event: any) {
  if (!tooltip.contains(event.target)) {
    tooltip.remove(); // Remove the tooltip if click is outside
  }
}
// Function to recursively walk through the text nodes of the document
class Highlight {
  private get instance() {
    const context = document.body;
    return new Mark(context);
  }
  constructor() {}
  // Function to highlight the keywords in text nodes
  public mark(data: any[]) {
    const keywords = (data || [])
      .map((m: any) => m.keyword)
      .filter((k) => k != "");
    if (!data || !data.length || !keywords.length) return;
    // Highlight the keywords
    this.addHighlightStyles();
    const wordsCount: Record<string, IPageWordCount> = {};
    this.instance.mark(keywords, {
      element: "span",
      className: "highlighted-keyword",
      separateWordSearch: false,
      acrossElements: true,
      each: (element: HTMLElement) => {
        // hidden element
        if (element.offsetParent === null) return;
        const item = (data || []).find(
          (f) =>
            f.keyword.toLowerCase() === element.innerText.toLowerCase().trim()
        );
        element.setAttribute("data-text", item.keyword);
        element.setAttribute("data-notes", item.notes);
        // keyword count
        const wordCount = wordsCount[item.keyword];
        if (!wordCount) {
          wordsCount[item.keyword] = {
            url: window.location.href,
            count: 0,
            countAt: new Date().getTime(),
            word: item.keyword,
          };
        }
        ++wordsCount[item.keyword].count;
      },
    });

    // clearTextSelection();
    this.addKeywordClickListeners();

    return wordsCount;
  }
  public unmark(keyword: string) {
    this.instance.unmark({
      element: `span[data-text="${keyword}"]`,
      //   element: event.target.textContent,
      separateWordSearch: false,
    });
  }
  // Add styles for the highlight class
  public addHighlightStyles() {
    const el = document.querySelector("style[data-style='1']");
    el && el.remove();
    const style = document.createElement("style");
    style.setAttribute("data-style", "1");
    style.innerHTML = `
        .highlighted-keyword {
            background-color: yellow;
            font-weight: bold;
            color: black;
            cursor: pointer;
        }
        .tooltip-keyword {
            position: absolute;
            background-color: #333;
            color: #fff;
            padding: 10px;
            border-radius: 5px;
            max-width: 250px;
            z-index: 9999;
        }
        .tooltip-keyword p {
            margin: 0;
        }
        .tooltip-keyword button {
            margin-top: 10px;
            background-color: red;
            color: white;
            border: none;
            padding: 5px;
            cursor: pointer;
        }
        .tooltip-keyword button:hover {
            background-color: darkred;
        }
    `;
    document.head.appendChild(style);
  }

  public async autoMark() {
    const response = await chrome.runtime.sendMessage({
      action: "get_vocabulary",
    });
    const wordsCount = this.mark(response);

    await chrome.runtime.sendMessage({
      action: "update_vocabulary_count",
      data: wordsCount,
    });
  }
  // Function to remove any existing tooltips
  public removeExistingTooltips() {
    const existingTooltips = document.querySelectorAll(".tooltip-keyword");
    existingTooltips.forEach((tooltip) => tooltip.remove());
  }

  // Function to handle click on a highlighted keyword
  public addKeywordClickListeners() {
    const highlightedKeywords = document.querySelectorAll(
      ".highlighted-keyword"
    );

    highlightedKeywords.forEach((element) => {
      element.addEventListener("click", (event: any) => {
        const element = event.target;
        const keyword = element.textContent;
        // Remove any existing tooltips
        this.removeExistingTooltips();

        // Create tooltip
        const tooltip: any = document.createElement("div");
        tooltip.classList.add("tooltip-keyword");
        tooltip.innerHTML = `
            <p>${element.dataset.text}: ${element.dataset.notes}</p>
            <button class="delete-keyword">Delete Keyword</button>
            <button class="close-keyword">Close</button>
        `;

        // Add tooltip to the DOM
        document.body.appendChild(tooltip);
        setTimeout(() => {
          document.addEventListener(
            "click",
            closeTooltipOnClickOutside.bind(null, tooltip, event.target),
            { once: true }
          );
        }, 0); // next tick render
        // Position the tooltip near the clicked element
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.top + rect.height + window.scrollY}px`;

        // Add event listener to delete the keyword when delete button is clicked
        tooltip
          .querySelector(".delete-keyword")
          .addEventListener("click", () => {
            // event.target.replaceWith(event.target.textContent); // Remove the span but keep the text
            tooltip.remove(); // Remove the tooltip after deletion
            this.unmark(keyword);
            chrome.runtime.sendMessage({
              action: "remove_vocabulary",
              data: keyword,
            });
          });
        tooltip
          .querySelector(".close-keyword")
          .addEventListener("click", () => {
            tooltip.remove(); // Remove the tooltip after deletion
          });
      });
    });
  }
}

const highlight = new Highlight();
(window as any).highlight = highlight;

export default highlight;
