// strokes.js
import { ctx, canvas } from "./canvasSetup.js";
import { updateBBox, drawBBox } from "./bbox.js";
import { appState } from "./state.js";

export class Stroke {
  static id = 0;
  constructor(c, s, bpID = null) {

    this.id = Stroke.id++

    this.color = c;
    this.size = Number(s) || 4;
    this.cap = "round";
    this.join = "round";
    this.dash = [];

    this.points = { x: [], y: [] };
    this.initialPoints = { x: [], y: [] };
    this.path = new Path2D();

    this.bbox = {
      min_x: null,
      max_x: null,
      min_y: null,
      max_y: null,
      left: null,
      top: null,
      width: null,
      height: null,
    };

    this.bpID = bpID;
    this.startingBP = null;
  }

  getPath() {
    this.path = new Path2D();
    if (!this.points || this.points.x.length === 0) return this.path;
    this.path.moveTo(this.points.x[0], this.points.y[0]);
    for (let i = 1; i < this.points.x.length; i++) {
      this.path.lineTo(this.points.x[i], this.points.y[i]);
    }
    return this.path;
  }

  addPoint(x, y, relative = 0) {
    this.points.x.push(x);
    this.points.y.push(y);

    this.initialPoints.x.push(x);
    this.initialPoints.y.push(y + relative);
  }

  translateStroke(dx, dy) {
    for (let i = 0; i < this.points.x.length; i++) {
      this.points.x[i] = this.initialPoints.x[i] + dx;
      this.points.y[i] = this.initialPoints.y[i] + dy;
    }

    this.bbox = {
      min_x: null,
      max_x: null,
      min_y: null,
      max_y: null,
      left: null,
      top: null,
      width: null,
      height: null,
    };

    for (let i = 0; i < this.points.x.length; i++) {
      updateBBox(this.bbox, this.points.x[i], this.points.y[i]);
    }
  }
}


export function drawStroke(s, showBounding = false) {
  ctx.lineWidth = s.size;
  ctx.lineCap = s.cap;
  ctx.lineJoin = s.join;
  ctx.strokeStyle = s.color;
  ctx.stroke(s.getPath());
  if (showBounding) drawBBox(s.bbox);
}

/**
 * bulletPoints is passed in to avoid circular imports.
 */
export function renderStrokes(bulletPoints = []) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const bpInfoDict = {};
  for (const bp of bulletPoints) {
    bpInfoDict[bp.id] = { opened: bp.opened, changeY: bp.bbox.top - bp.startingY };
  }

  for (const s of Object.values(appState.strokes)) {
    if (s.bpID == null) {
      drawStroke(s, appState.showBBox);
    } else if (bpInfoDict[s.bpID]?.opened) {
      s.translateStroke(0, bpInfoDict[s.bpID].changeY);
      drawStroke(s, appState.showBBox);
    }
  }
}
