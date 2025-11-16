// main.js

import { appState } from "./state.js";
import { PenMode, EraserMode, SelectMode, AddMode, DebugMode } from "./modes.js";
import { clearCanvas } from "./canvasSetup.js";
import { drawAllBulletPointBBoxes } from "./bulletPoints.js";

const canvasWrapper = document.getElementById("canvas-wrapper");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const overlayCanvas = document.getElementById("overlay");
const overlay = overlayCanvas.getContext("2d");

 function getXY(e) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function inDrawingArea(e) {
  return e.target === canvas || e.target === overlayCanvas;
}

// UI elements
const pen_btn = document.getElementById("pen");
const eraser_btn = document.getElementById("eraser");
const select_btn = document.getElementById("select");
const search_btn = document.getElementById("search");
const undo_btn = document.getElementById("undo");
const redo_btn = document.getElementById("redo");
const add_btn = document.getElementById("add");

const size_slider = document.getElementById("size");
const color_selector = document.getElementById("color");
const showBBox_check = document.getElementById("showBBox");

// default state
appState.size = Number(size_slider.value) || 4;
appState.color = color_selector.value || "#000000";
appState.showBBox = showBBox_check.checked || false;

// tool selection styling
const tool_buttons = document.querySelectorAll(".tool");
tool_buttons.forEach(tool => {
  tool.addEventListener("click", () => {
    tool_buttons.forEach(btn => btn.classList.remove("selected"));
    tool.classList.add("selected");
  });
});

// sliders/options
size_slider.addEventListener("input", () => {
  appState.size = Number(size_slider.value) || 4;
});

color_selector.addEventListener("input", () => {
  appState.color = color_selector.value;
});

showBBox_check.addEventListener("input", () => {
  appState.showBBox = showBBox_check.checked;

  clearCanvas(overlayCanvas);
  if (appState.showBBox) {
    drawAllBulletPointBBoxes(appState.allBulletPointEnviornments);
  }
});

// set initial mode
appState.currentMode = new PenMode();

// tool buttons
pen_btn.onclick = () => { appState.currentMode = new PenMode(); };
eraser_btn.onclick = () => { appState.currentMode = new EraserMode(); };
select_btn.onclick = () => { appState.currentMode = new SelectMode(); };
search_btn.onclick = () => { appState.currentMode = new DebugMode(); };
add_btn.onclick = () => { appState.currentMode = new AddMode(); };

// canvas events
document.addEventListener("mousedown", (e) => {
  if (!inDrawingArea(e)) return;
  appState.currentMode?.mouseDown(e);
});

document.addEventListener("mousemove", (e) => {
  if (!inDrawingArea(e)) return;
  appState.currentMode?.mouseMove(e);
});

document.addEventListener("mouseup", (e) => {
  if (!inDrawingArea(e)) return;
  appState.currentMode?.mouseUp(e);
});

// keyboard events

document.addEventListener("keydown", (e) => {
  if (e.key === "Shift"){
    appState.shiftDown = true
  }
})

document.addEventListener("keyup", (e) => {
  if (e.key === "Shift"){
    appState.shiftDown = false
  }
})


