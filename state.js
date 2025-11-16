// state.js
export const appState = {
  size: 4,
  color: "#000000",
  showBBox: false,

  drawing: false,
  selecting: false,
  selectingBP: false,
  shiftDown: false,

  currentStroke: null,
  currentSelection: null,
  currentMode: null,

  strokes : {},
  
  allBulletPointEnviornments: {"0": {}},
  currentBulletPoint: null
};
