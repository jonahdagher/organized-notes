// modes.js
import { ctx, overlay } from "./canvasSetup.js";
import { appState } from "./state.js";
import { getXY } from "./canvasSetup.js";
import { rectContains, pointInRect, newSelection, updateSelection } from "./utils.js";
import { Stroke, strokes, drawStroke, renderStrokes } from "./strokes.js";
import { updateBBox, drawBBox } from "./bbox.js";
import { BulletPoint, createNewEnv } from "./bulletPoints.js";

export class Mode {
  constructor(context = ctx) {
    this.ctx = context;
  }
  mouseDown(e) {}
  mouseMove(e) {}
  mouseUp(e) {}
}

// PEN MODE
export class PenMode extends Mode {
  mouseDown(e) {
    appState.drawing = true;
    const { x, y } = getXY(e);

    appState.currentStroke = new Stroke(appState.color, appState.size);

    for (const bp of bulletPoints) {
      if (rectContains(bp.bbox, x, y, appState.currentStroke.size)) {
        overlay.clearRect(0, 0, overlay.canvas.width, overlay.canvas.height);
        overlay.strokeRect(bp.bbox.left, bp.bbox.top, bp.bbox.width, bp.bbox.height);
        appState.currentStroke.startingBP = bp;
        appState.currentStroke.bpID = bp.id;
        break;
      }
    }

    if (appState.currentStroke.startingBP) {
      if (rectContains(appState.currentStroke.startingBP.bbox, x, y, appState.currentStroke.size)) {
        appState.currentStroke.addPoint(x, y, appState.currentStroke.startingBP.getMaxY());
      }
    } else {
      appState.currentStroke.addPoint(x, y);
    }

    updateBBox(appState.currentStroke.bbox, x, y);
  }

  mouseMove(e) {
    if (!appState.drawing) return;
    const { x, y } = getXY(e);

    if (appState.currentStroke.startingBP) {
      if (rectContains(appState.currentStroke.startingBP.bbox, x, y, appState.currentStroke.size)) {
        appState.currentStroke.addPoint(x, y, appState.currentStroke.startingBP.getMaxY());
        updateBBox(appState.currentStroke.bbox, x, y);
        drawStroke(appState.currentStroke, appState.showBBox);
      }
    } else {
      appState.currentStroke.addPoint(x, y);
      updateBBox(appState.currentStroke.bbox, x, y);
      drawStroke(appState.currentStroke, appState.showBBox);
    }
  }

  mouseUp(e) {
    appState.drawing = false;
    strokes.push(appState.currentStroke);
    drawStroke(appState.currentStroke, appState.showBBox);
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
      for (let i = strokes.length - 1; i >= 0; i--) {
        const s = strokes[i];
        if (ctx.isPointInStroke(s.getPath(), x, y)) {
          strokes.splice(i, 1);
          renderStrokes(bulletPoints);
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

    if (appState.shiftDown) createNewEnv(appState.allBulletPointEnviornments)
  }

  mouseMove(e) {

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

    console.log("All strokes:", strokes);

    strokes.forEach((s, i) => {
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
