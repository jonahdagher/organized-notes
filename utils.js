import { shadow } from "./canvasSetup.js";

// utils.js
export function normalizeRect({ left, top, width, height }) {
  const x1 = Math.min(left, left + width);
  const y1 = Math.min(top, top + height);
  const x2 = Math.max(left, left + width);
  const y2 = Math.max(top, top + height);
  return { left: x1, top: y1, width: x2 - x1, height: y2 - y1 };
}

export function pointInRect(x, y, rect) {
  const r = normalizeRect(rect);
  return x >= r.left && x <= r.left + r.width &&
         y >= r.top  && y <= r.top  + r.height;
}

export function rectsIntersect(a, b) {
  const r1 = normalizeRect(a), r2 = normalizeRect(b);
  return !(
    r2.left > r1.left + r1.width  ||
    r2.left + r2.width < r1.left  ||
    r2.top  > r1.top  + r1.height ||
    r2.top  + r2.height < r1.top
  );
}

export function rectContains(rect, x, y, size = 0) {
  return (
    x - size / 2 >= rect.left &&
    x + size / 2 <= rect.left + rect.width &&
    y - size / 2 >= rect.top &&
    y + size / 2 <= rect.top + rect.height
  );
}

export function shadowRect(rect){
}

// selection helpers
export function newSelection() {
  return {
    bbox: { start_x: null, start_y: null, left: null, top: null, width: null, height: null },
  };
}

export function updateSelection(selection, x, y, includeStart = true) {
  if (selection.bbox.start_x == null) {
    if (includeStart) {
      selection.bbox.start_x = x;
      selection.bbox.start_y = y;
    } else {
      selection.bbox.start_x = null;
      selection.bbox.start_y = null;
    }
  } else {
    if (x < selection.bbox.start_x) selection.bbox.left = x;
    else selection.bbox.left = selection.bbox.start_x;
    selection.bbox.width = Math.abs(x - selection.bbox.start_x);

    if (y < selection.bbox.start_y) selection.bbox.top = y;
    else selection.bbox.top = selection.bbox.start_y;
    selection.bbox.height = Math.abs(y - selection.bbox.start_y);
  }
}

// dictionary helpers

export function getLargestKey(dict){
  let largestKey = Math.max(...Object.keys(dict).map(Number))
  return String(largestKey)
}