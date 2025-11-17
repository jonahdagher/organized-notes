// bulletPoints.js
import { canvasWrapper, overlay, canvas, shadow } from "./canvasSetup.js";
import { renderStrokes } from "./strokes.js";
import { drawBBox, drawBottom, clearBottom } from "./bbox.js";
import { appState } from "./state.js";
import { rectContains } from "./utils.js";

export class BulletPoint {
  static id = 0;

  constructor(x, y, pointEnv, titleHeight = 70) {
    this.bbox = {min_x: x, min_y: y, left: x, top: y, width: 500, height: 100 };
    this.originalHeight = this.height
    this.pointEnv = pointEnv;
    //#region btn creation
    //create html buttom
    this.btn = document.createElement("button");
    this.id = BulletPoint.id++;
    this.btn.id = `btn-${this.id}`;
    //position and style button
    this.btn.style.position = "absolute";
    this.btn.style.left = `${this.bbox.left}px`;
    this.btn.style.top = `${this.bbox.top}px`;
    this.btn.className = "bullet-button";
    //Define button behavior
    this.btn.onclick = () => this.toggle();
    //add button to DOM
    canvasWrapper.append(this.btn);
    //set button symbol
    this.icon = document.createElement("span");
    this.icon.className = "material-symbols-outlined";
    this.icon.textContent = "arrow_drop_down";
    this.btn.append(this.icon);
    //#endregion

    //Button state (expanded or collapsed)
    this.opened = true;
    this.titleHeight = titleHeight;
  }

  //move the bulletpoint box AND button
  setHeight(y) {
    this.bbox.top = y;
    this.bbox.min_y = y;

    this.btn.style.top = `${y}px`;
  }

  //calculate a bulletpoints height based on the other bulletpoints in its enviornment
  getRelativeY() {
    const bullets = Object.values(this.pointEnv);
    if (bullets.length === 0) return this.bbox.top;
    //if a bulletpoint is expanded, add its height, otherwise, only add it's title height
    let y = bullets[0].bbox.top;
    for (const bp of bullets) {
      if (bp === this) break;

      if (bp.opened) {
        y += bp.bbox.height;
      } else {
        y += bp.titleHeight;
      }
    }

    return y;
  }

  


  toggle() {
    if (this.opened){
      this.opened = false
      this.icon.textContent = "arrow_right";
      clearBottom(this.bbox)
      this.originalHeight = this.bbox.height
      this.bbox.height = this.titleHeight
    }
    else {
      this.opened = true
      this.icon.textContent = "arrow_drop_down";
      this.bbox.height = this.originalHeight
      drawBottom(this.bbox)
    }
    updateYpos(this.pointEnv)
    renderStrokes();
  }
}

export function createNewEnv(globalEnviornment){
  const EnvNum = Object.keys(globalEnviornment).length
  console.log(`Created New Bullet Point Enviornment ${EnvNum}`)
  globalEnviornment[EnvNum] = {}
  return EnvNum
}

export function getMaxBounding(env){
  let maxWidth = 0
  let maxHeight = 0
  for (const bp of Object.values(env)){
    const {min_x, min_y, left, top, width, height} = bp.expandedBBox
    maxHeight = Math.max(maxHeight, height)
    maxWidth = Math.max(maxWidth, width)
  }

  return {width: maxWidth, height: maxHeight}
}

export function getBulletPoint(allEnv, x, y){
  for (const i of Object.keys(allEnv)){
    // console.log(allEnv[i])
    let bulletGroup = allEnv[i]
    for (const j of Object.keys(bulletGroup)){
      let bp = bulletGroup[j]
      if (rectContains(bp.bbox, x, y)){
        return {groupID: i, bulletID: j}
      }
    }}
  return null
}

export function drawAllBulletPointBBoxes(allEnvs) {
  overlay.clearRect(0, 0, canvas.width, canvas.height);

  for (const envNum in allEnvs) {
    const env = allEnvs[envNum];
    for (const bpId in env) {
      const bp = env[bpId];
      if (bp && bp.bbox) {
        drawBBox(bp.bbox);
      }
    }
  }
}

function updateYpos(pointEnv){
  for (const bp of Object.values(pointEnv)){
    clearBottom(bp.bbox)
    let yPos = bp.getRelativeY()
    bp.setHeight(yPos)
    if (bp.opened) drawBottom(bp.bbox)
  }
}