// bulletPoints.js
import { canvasWrapper, overlay, canvas } from "./canvasSetup.js";
import { renderStrokes } from "./strokes.js";
import { drawBBox } from "./bbox.js";
import { appState } from "./state.js";

export class BulletPoint {
  static id = 0;

  constructor(x, y, pointEnv, titleHeight = 70) {
    this.bbox = {min_x: x, min_y: y, left: x, top: y, width: 500, height: 100 };
    this.expandedBBox = structuredClone(this.bbox)
    this.pointEnv = pointEnv;

    //#region btn creation
    this.btn = document.createElement("button");
    this.id = BulletPoint.id++;
    this.btn.id = `btn-${this.id}`;

    this.btn.style.position = "absolute";
    this.btn.style.left = `${this.bbox.left}px`;
    this.btn.style.top = `${this.bbox.top}px`;
    this.btn.className = "bullet-button";

    this.btn.onclick = () => this.toggle();
    canvasWrapper.append(this.btn);

    this.icon = document.createElement("span");
    this.icon.className = "material-symbols-outlined";
    this.icon.textContent = "arrow_drop_down";
    this.btn.append(this.icon);
    //#endregion

    this.opened = true;
    this.titleHeight = titleHeight;
  }

  getRelativeY() {
    let y = this.pointEnv[0].startingY;
    for (const bp of this.pointEnv) {
      if (bp === this) break;
      y = y + bp.titleHeight;
      if (bp.opened) {
        y += (bp.bbox.height - bp.titleHeight);
      }
    }
    return y;
  }

  getMaxY() {
    let y = this.pointEnv[0].startingY;
    for (const bp of this.pointEnv) {
      if (bp === this) break;
      y += bp.bbox.height;
    }
    return y;
  }

  updateYPos() {
    const relY = this.getRelativeY();
    this.bbox.top = relY;
    this.btn.style.top = `${relY}px`;
  }

  updateXpos(x) {
    this.bbox.left = x;
    this.btn.style.left = `${this.bbox.left}px`;
  }

  toggle() {
    if (this.opened) {
      this.originalHeight = this.bbox.height;
      this.bbox.height = this.titleHeight;
      this.opened = false;
      this.icon.textContent = "arrow_right";
    } else {
      this.bbox.height = this.originalHeight;
      this.opened = true;
      this.icon.textContent = "arrow_drop_down";
    }

    for (const bp of this.pointEnv) {
      bp.updateYPos();
    }

    renderStrokes(this.pointEnv);
  }

  setBBox(l, t, w, h) {
    this.bbox = { left: l, top: t, width: w, height: h };
    this.updateYPos();
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

