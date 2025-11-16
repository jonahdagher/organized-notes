// strokes.js
import { ctx, canvas } from "./canvasSetup.js";
import { updateBBox, drawBBox } from "./bbox.js";
import { appState } from "./state.js";
import { rectContains } from "./utils.js";

export class Stroke {
  static id = 0;
  constructor(c, s, bpID = null, bpGroupID=null) {

    this.id = Stroke.id++

    this.color = c;
    this.size = Number(s) || 4;
    this.cap = "round";
    this.join = "round";
    this.dash = [];

    this.points = { x: [], y: [] };
    this.relativePoints = { x: [], y: [] };
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

    this.bpGroupID = bpGroupID;
    this.bpID = bpID;
  }

  getPath() {
    this.path = new Path2D();
    if (!this.points || this.points.x.length === 0) return this.path;

    if (!this.bpID){
      this.path.moveTo(this.points.x[0], this.points.y[0]);
      for (let i = 1; i < this.points.x.length; i++) {
        this.path.lineTo(this.points.x[i], this.points.y[i]);
    }}
    else {
      
      let associaitedBP = appState.allBulletPointEnviornments[this.bpGroupID][this.bpID]
      let left = associaitedBP.bbox.left
      let top = associaitedBP.bbox.top
      console.log(associaitedBP)
      console.log(top)
      this.path.moveTo(this.relativePoints.x[0]+left, this.relativePoints.y[0]+top);
      for (let i = 1; i < this.relativePoints.x.length; i++) {
      this.path.lineTo(this.relativePoints.x[i]+left, this.relativePoints.y[i]+top);
      }
    }

    return this.path;
  }

  getRelativePath(bbox){
    this.path = new Path2D();
    left = bbox.left
    top = bbox.top
    if (!this.relativePoints || this.relativePoints.x.length === 0) return this.path;
    this.path.moveTo(this.relativePoints.x[0]+left, this.relativePoints.y[0]+top);
    for (let i = 1; i < this.relativePoints.x.length; i++) {
      this.path.lineTo(this.relativePoints.x[i]+left, this.relativePoints.y[i]+top);
    }
    return this.path;
  }

  addPoint(x, y, bbox=null, size=4) {
    //probably should add some insurance these lengths stay the same
    //and you itd be probably be better to derive the bullet point bbox from the bpID associated with the stroke(this.bpID and this.bpGroupID)

    if (bbox && !rectContains(bbox, x, y, size)) return

    this.points.x.push(x);
    this.points.y.push(y);

    if (bbox){
      const relative_x = x - bbox.left
      const relative_y = y - bbox.top

      this.relativePoints.x.push(relative_x)
      this.relativePoints.y.push(relative_y)
    }
  }

}


export function drawStroke(s, bbox=null) {
  if (!s.bbox){
  ctx.lineWidth = s.size;
  ctx.lineCap = s.cap;
  ctx.lineJoin = s.join;
  ctx.strokeStyle = s.color;
  ctx.stroke(s.getPath());
  }
  else{
    ctx.lineWidth = s.size;
    ctx.lineCap = s.cap;
    ctx.lineJoin = s.join;
    ctx.strokeStyle = s.color;
    ctx.stroke(s.getPath());

  }
}

/**
 * bulletPoints is passed in to avoid circular imports.
 */
export function renderStrokes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of Object.values(appState.strokes)){
        //if stroke is in a bullet point, only render if the bulletpoint is opened
        if (s.bpGroupID != null){
          let associaitedBulletPoint = appState.allBulletPointEnviornments[s.bpGroupID][s.bpID]
          if (associaitedBulletPoint.opened){
            drawStroke(s)
          }
        }
        else {
          drawStroke(s)
        }
      }

    }
