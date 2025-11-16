// bbox.js
import { overlay, overlayCanvas, clearCanvas, shadow} from "./canvasSetup.js";

export function updateBBox(bbox, x, y) {
  if (bbox.min_x === null) {
    bbox.min_x = bbox.max_x = x;
    bbox.min_y = bbox.max_y = y;
  } else {
    if (x < bbox.min_x) bbox.min_x = x;
    if (x > bbox.max_x) bbox.max_x = x;
    if (y < bbox.min_y) bbox.min_y = y;
    if (y > bbox.max_y) bbox.max_y = y;
  }

  bbox.left = bbox.min_x;
  bbox.top = bbox.min_y;
  bbox.width = bbox.max_x - bbox.left;
  bbox.height = bbox.max_y - bbox.top;
}

export function drawBBox(bbox) {
  if (bbox){
    overlay.fillStyle = "rgba(0, 100, 255, 0.4)";
    overlay.fillRect(bbox.left, bbox.top, bbox.width, bbox.height);

    overlay.strokeStyle = "rgba(0, 100, 255, 1)";
    overlay.strokeRect(bbox.left, bbox.top, bbox.width, bbox.height);
  }
}

export function drawBottom(bbox) {
  shadow.beginPath();
  shadow.strokeStyle = "black";
  shadow.moveTo(bbox.left, bbox.top + bbox.height);
  shadow.lineTo(bbox.left + bbox.width, bbox.top + bbox.height);
  shadow.stroke();
}

export function clearBottom(bbox, thickness = 2) {
  shadow.clearRect(
    bbox.left,
    bbox.top + bbox.height - thickness / 2,
    bbox.width,
    thickness
  );
}


