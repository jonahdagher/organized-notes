// canvasSetup.js
export const canvasWrapper = document.getElementById("canvas-wrapper");

export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export const overlayCanvas = document.getElementById("overlay");
export const overlay = overlayCanvas.getContext("2d");

export const shadowCanvas = document.getElementById("shadow")
export const shadow = shadowCanvas.getContext("2d")

export function getXY(e) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

export function inDrawingArea(e) {
  return e.target === canvas || e.target === overlayCanvas;
}

export function clearCanvas(canvas){
  canvas.getContext("2d").clearRect(0,0,canvas.width, canvas.height)
}
