/* eslint-disable @typescript-eslint/no-unused-vars */
import Mark from "mark.js";
import { IPageWordCount } from "../utils/type";
import { ChromeRuntime } from "../utils/chrome";
// import { uuidv4 } from "../utils/helper";
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
  markElements: { [key: string]: HTMLElement } = {};
  wordsCount: Record<string, IPageWordCount> = {};
  private get instance() {
    const context = document.querySelectorAll("div");
    return new Mark(context);
  }
  constructor() {}
  private markKeywords(keywords: string[], data: any[]) {
    let index = 0; // Initialize index
    const markNext = () => {
      if (index < keywords.length) {
        // Mark the current keyword
        this.instance.markRegExp(new RegExp(`${keywords[index]}`, "gi"), {
          element: "span",
          className: "highlighted-keyword",
          each: (element: HTMLElement) => {
            // hidden element
            if (element.offsetParent === null) return;
            setTimeout(() => {
              const item = (data || []).find(
                (f) =>
                  f.keyword.toLowerCase() ===
                  element.innerText.toLowerCase().trim()
              );
              if (!item) {
                return;
              }
              // element.setAttribute("data-uuid", uuidv4());
              element.setAttribute("data-text", item.keyword);
              element.setAttribute("data-notes", item.notes);
              this.addKeywordClickListener(element);
              // keyword count
              const wordCount = this.wordsCount[item.keyword];
              if (!wordCount) {
                this.wordsCount[item.keyword] = {
                  url: window.location.href,
                  count: 0,
                  countAt: new Date().getTime(),
                  word: item.keyword,
                };
              }
              ++this.wordsCount[item.keyword].count;
            }, 0);
          },
          filter: (
            _textNode: Text,
            _term: string,
            _marksSoFar: number,
            _marksTotal: number
          ) => {
            // console.log("markNext", {
            //   textNode,
            //   term,
            //   marksSoFar,
            //   marksTotal,
            // });
            return true;
          },
          done: function () {
            index++; // Move to the next keyword
            // Request the next animation frame
            requestAnimationFrame(markNext);
          },
        });
      }
    };

    // Start marking from the first keyword
    requestAnimationFrame(markNext);
  }
  // Function to highlight the keywords in text nodes
  public mark(data: any[]) {
    const keywords = (data || [])
      .map((m: any) => m.keyword)
      .filter((k) => k != "");
    if (!data || !data.length || !keywords.length) return;

    // Highlight the keywords
    this.addHighlightStyles();
    this.markKeywords(keywords, data);
    // for (const keyword of keywords) {
    //   setTimeout(() => {
    //     // next tick
    //     this.instance.markRegExp(new RegExp(`${keyword}`, "gi"), {
    //       element: "span",
    //       className: "highlighted-keyword",
    //       // separateWordSearch: false,
    //       // diacritics: false,
    //       // acrossElements: false,
    //       // debug: true,
    //       each: (element: HTMLElement) => {
    //         // hidden element
    //         if (element.offsetParent === null) return;
    //         console.log("element", element, element.dataset);
    //         const item = (data || []).find(
    //           (f) =>
    //             f.keyword.toLowerCase() ===
    //             element.innerText.toLowerCase().trim()
    //         );
    //         // element.setAttribute("data-uuid", uuidv4());
    //         element.setAttribute("data-text", item.keyword);
    //         element.setAttribute("data-notes", item.notes);
    //         this.addKeywordClickListener(element);
    //         // keyword count
    //         const wordCount = wordsCount[item.keyword];
    //         if (!wordCount) {
    //           wordsCount[item.keyword] = {
    //             url: window.location.href,
    //             count: 0,
    //             countAt: new Date().getTime(),
    //             word: item.keyword,
    //           };
    //         }
    //         ++wordsCount[item.keyword].count;
    //       },
    //     });
    //   }, 100);
    // }

    // clearTextSelection();
    // this.addKeywordClickListeners();

    return this.wordsCount;
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
    const response = await ChromeRuntime.sendMessage({
      action: "get_vocabulary",
    });
    this.mark(response);
    setTimeout(() => {
      ChromeRuntime.sendMessage({
        action: "update_vocabulary_count",
        data: this.wordsCount,
      });
    }, 2000);
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
            ChromeRuntime.sendMessage({
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
  private addKeywordClickListener(element: HTMLElement) {
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
      tooltip.querySelector(".delete-keyword").addEventListener("click", () => {
        // event.target.replaceWith(event.target.textContent); // Remove the span but keep the text
        tooltip.remove(); // Remove the tooltip after deletion
        this.unmark(keyword);
        ChromeRuntime.sendMessage({
          action: "remove_vocabulary",
          data: keyword,
        });
      });
      tooltip.querySelector(".close-keyword").addEventListener("click", () => {
        tooltip.remove(); // Remove the tooltip after deletion
      });
    });
  }
}

const highlight = new Highlight();
(window as any).highlight = highlight;

export default highlight;
