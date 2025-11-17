// strokes.js
import { ctx, canvas } from "./canvasSetup.js";
import { updateBBox, drawBBox } from "./bbox.js";
import { appState } from "./state.js";
import { rectContains } from "./utils.js";

export class Stroke {
  static id = 0;
  constructor(c, s, bpID = null, bpGroupID=null) {
    //Give every stroke a unique ID
    this.id = Stroke.id++
    //stroke style
    this.color = c;
    this.size = Number(s) || 4;
    this.cap = "round";
    this.join = "round";
    this.dash = [];
    //initalize points 
    this.points = { x: [], y: [] };
    this.relativePoints = { x: [], y: [] };
    this.path = new Path2D();
    //initalize bbox
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
    //Link to a bulletpoint if applicable
    this.bpGroupID = bpGroupID;
    this.bpID = bpID;
  }

  getPath() {
    this.path = new Path2D();
    if (!this.points || this.points.x.length === 0) return this.path;
    //create a non-bulletpoint path from the stored points 
    if (!this.bpID){
      this.path.moveTo(this.points.x[0], this.points.y[0]);
      for (let i = 1; i < this.points.x.length; i++) {
        this.path.lineTo(this.points.x[i], this.points.y[i]);
    }}
    //if the stroke is in a bulletpoint, position the path relative to the bulletpoints current location.
    else {
      //find the top and left of the bulletpoint the stroke is within
      let associaitedBP = appState.allBulletPointEnviornments[this.bpGroupID][this.bpID]
      let left = associaitedBP.bbox.left
      let top = associaitedBP.bbox.top
      //construct the path using the top and left as an offset
      this.path.moveTo(this.relativePoints.x[0]+left, this.relativePoints.y[0]+top);
      for (let i = 1; i < this.relativePoints.x.length; i++) {
      this.path.lineTo(this.relativePoints.x[i]+left, this.relativePoints.y[i]+top);
      }
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


export function drawStroke(s) {
  ctx.lineWidth = s.size;
  ctx.lineCap = s.cap;
  ctx.lineJoin = s.join;
  ctx.strokeStyle = s.color;
  ctx.stroke(s.getPath());
  }

export function renderStrokes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of Object.values(appState.strokes)){
        //if stroke is in a bullet point, only render if the bulletpoint is opened or if its in the title part
        if (s.bpGroupID != null){
          let associaitedBulletPoint = appState.allBulletPointEnviornments[s.bpGroupID][s.bpID]
          if (associaitedBulletPoint.opened){
            drawStroke(s)
          }
          //render if in title
          else if (s.bbox){

          }
        }
        else {
          drawStroke(s)
        }
      }

    }
