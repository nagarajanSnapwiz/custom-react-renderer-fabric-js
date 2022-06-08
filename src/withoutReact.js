import { fabric } from "fabric";
const canvas = new fabric.Canvas("canvas");
fabric.Object.prototype.selectable = false;
const rect = new fabric.Rect({
  top: 30,
  left: 35,
  height: 80,
  width: 80,
  fill: "green",
});
const rect2 = new fabric.Rect({
  top: 30,
  left: 135,
  height: 80,
  width: 80,
  fill: "yellow",
});

canvas.add(rect);
canvas.add(rect2);
rect.on("mousedown", () => {
  rect2.set({ fill: rect2.fill == "blue" ? "yellow" : "blue" });
  canvas.requestRenderAll();
});