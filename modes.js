// modes.js
import { clearCanvas, ctx, overlay, overlayCanvas } from "./canvasSetup.js";
import { appState } from "./state.js";
import { getXY } from "./canvasSetup.js";
import { rectContains, pointInRect, newSelection, updateSelection, getLargestKey } from "./utils.js";
import { Stroke, drawStroke, renderStrokes } from "./strokes.js";
import { updateBBox, drawBBox } from "./bbox.js";
import { BulletPoint, createNewEnv, drawAllBulletPointBBoxes } from "./bulletPoints.js";

export class Mode {
  constructor(context = ctx) {
    this.ctx = context;
    clearCanvas(overlayCanvas)
  }
  mouseDown(e) {}
  mouseMove(e) {}
  mouseUp(e) {}
}

// PEN MODE
export class PenMode extends Mode {
  constructor(){
    super()
  }
  mouseDown(e) {
    appState.drawing = true;
    const { x, y } = getXY(e);

    appState.currentStroke = new Stroke(appState.color, appState.size);
    console.log(appState.currentStroke)
    appState.currentStroke.addPoint(x, y);
  }

  mouseMove(e) {
    if (!appState.drawing) return;
    const { x, y } = getXY(e);
    appState.currentStroke.addPoint(x, y);
    updateBBox(appState.currentStroke.bbox, x, y);
    drawStroke(appState.currentStroke);
  }

  mouseUp(e) {
    appState.drawing = false;
    appState.strokes[appState.currentStroke.id] = appState.currentStroke;
    console.log(appState.strokes)
    drawStroke(appState.currentStroke);
    appState.currentStroke = null;
  }
}

// ERASER MODE
export class EraserMode extends Mode {
  mouseDown(e) {
    appState.drawing = true;
    console.log("ERASER");
  }

  mouseMove(e) {
    const { x, y } = getXY(e);
    if (appState.drawing) {
      for (const i of Object.keys(appState.strokes)){
        let s = appState.strokes[i]
        if (ctx.isPointInStroke(s.getPath(), x, y)){
          delete appState.strokes[i]
          renderStrokes()
          break
        }
      }
    }
  }

  mouseUp(e) {
    appState.drawing = false;
  }
}

// SELECT MODE
export class SelectMode extends Mode {
  mouseDown(e) {
    const { x, y } = getXY(e);
    if (appState.currentSelection && !pointInRect(x, y, appState.currentSelection?.bbox)) {
      appState.selecting = false;
      appState.currentSelection = null;
      drawBBox(appState.currentSelection)
    }

    appState.selecting = true;
    appState.currentSelection = newSelection();
    updateSelection(appState.currentSelection, x, y);
  }

  mouseMove(e) {
    if (!appState.selecting) return;
    const { x, y } = getXY(e);
    updateSelection(appState.currentSelection, x, y);
    clearCanvas(overlayCanvas)
    drawBBox(appState.currentSelection.bbox);
  }

  mouseUp(e) {
    appState.selecting = false;
  }
}

// ADD MODE
export class AddMode extends Mode {
  constructor(context = ctx) {
    super(context);
    this.currentBulletPoint = null;
  }

  mouseDown(e) {
    const {x,y} = getXY(e);
    if (appState.selectingBP){
      appState.selectingBP = false
      appState.currentBulletPoint = null
      clearCanvas(overlayCanvas)
      return
    }

    //shift click to create new group
    if (appState.shiftDown) createNewEnv(appState.allBulletPointEnviornments)
    //find the current group of bullet points
    const largestKey = getLargestKey(appState.allBulletPointEnviornments)
    const currentEnviornment = appState.allBulletPointEnviornments[largestKey]

    //keep bullet points in the same environment in a line
    let topY = y
    let initializingX = x
    let initializingY = y
    if (Object.keys(currentEnviornment).length > 0){
      const lastBulletPoint = currentEnviornment[getLargestKey(currentEnviornment)]
      initializingX = lastBulletPoint.bbox.left
    }
    if (Object.keys(currentEnviornment).length > 0){
      const lastBulletPoint = currentEnviornment[getLargestKey(currentEnviornment)]
      initializingY = lastBulletPoint.bbox.top + lastBulletPoint.bbox.height
    }
    //Create a new bulletpoint alligned with the bottom right corner of the previous. Only createif the cursor is below the end of the previous
    if (y >= initializingY){ //greater means lower on the canvas in context
    const newBulletPoint = new BulletPoint(initializingX, initializingY, currentEnviornment)
    updateSelection(newBulletPoint, initializingX, initializingY)
    appState.currentBulletPoint = newBulletPoint
    currentEnviornment[newBulletPoint.id] = appState.currentBulletPoint
    //start bulletpoint bounding process
    appState.selectingBP = true}
  }

  mouseMove(e) {
    const {x,y} = getXY(e);
    drawAllBulletPointBBoxes(appState.allBulletPointEnviornments)
    if (appState.selectingBP){
      updateSelection(appState.currentBulletPoint, x, y)
      clearCanvas(overlayCanvas)
      drawBBox(appState.currentBulletPoint.bbox)
    }
  }

  mouseUp(e) {
  }
}

// DEBUG MODE
export class DebugMode extends Mode {
  mouseDown(e) {
    console.log("---------------------------");
    const { x, y } = getXY(e);
    console.log("Click at:", { x, y });

    console.log("All strokes:", appState.strokes);

    Object.values(appState.strokes).forEach((s, i) => {
      console.group(`Stroke #${i}`);
      console.log("bpID:", s.bpID);
      console.log("points:", s.points);
      console.log("initialPoints:", s.initialPoints);
      console.log("startingPoint:", s.initialPoints.x[0], s.initialPoints.y[0]);
      console.log("renderingPoint:", s.points.x[0], s.points.y[0]);
      console.log("bbox:", s.bbox);
      console.groupEnd();
    });
  }
}

// function debugLoop() {
//   console.log(appState.selectingBP, appState.currentBulletPoint?.bbox || null); 
//   requestAnimationFrame(debugLoop);
// }

// debugLoop(); // start loop

