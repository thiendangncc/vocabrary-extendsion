/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from "react";
// import ReactDOM from "react-dom/client";
// import "../index.css"; //commented to prevent tailwind styles leaking into the webpage
// but if you want to use tailwind in content app, import the index.css file
// import "./content.css";
// import ContentApp from "./ContentApp";
import highlight from "./highlight";
import { contentListener } from "./handler";
import { scrollHandler } from "./scrollHandler";
// window.addEventListener("load", function () {

// Run the functions to highlight keywords
highlight.autoMark();
let flagRetry = 0;
const intervalId = setInterval(async function () {
  flagRetry++;
  const el = document.querySelector(".highlighted-keyword");
  if (!el) await highlight.autoMark(); // retry
  if (flagRetry === 10) {
    clearInterval(intervalId);
  }
}, 1000);
contentListener.init();

setTimeout(() => {
  scrollHandler.init();
}, 300);
// });
// const root = document.createElement("div");
// root.id = "crx-root";
// document.body.appendChild(root);

// ReactDOM.createRoot(root).render(
//   <React.StrictMode>
//     <ContentApp />
//   </React.StrictMode>
// );
