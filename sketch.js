class SketchPad {
  constructor(container, size = 400) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = size;
    this.canvas.height = size;
    this.canvas.style = `
            background-color:white;
            box-shadow:0px 0px 10px 2px black;
        `;
    container.appendChild(this.canvas);

    const lineBreak = document.createElement("br");
    container.appendChild(lineBreak);

    this.undoButton = document.createElement("button");
    this.undoButton.innerHTML = "UNDO";
    this.undoButton.style = `

    `;
    container.appendChild(this.undoButton);

    this.ctx = this.canvas.getContext("2d");
    this.isDrawing = false;
    this.paths = [];
    this.#redraw();
    this.#addEventListeners();
  }

  #addEventListeners() {
    this.canvas.onmousedown = (evt) => {
      const mouse = this.#getMouse(evt);
      this.paths.push([mouse]);
      this.isDrawing = true;
    };
    this.canvas.onmousemove = (evt) => {
      if (this.isDrawing) {
        const mouse = this.#getMouse(evt);
        const lastPath = this.paths[this.paths.length - 1];
        lastPath.push(mouse);
        this.#redraw();
      }
    };
    this.canvas.onmouseup = () => {
      this.isDrawing = false;
    };
    this.canvas.ontouchstart = (evt) => {
      const loc = evt.touches[0];
      this.canvas.onmousedown(loc);
    };
    this.canvas.ontouchmove = (evt) => {
      const loc = evt.touches[0];
      this.canvas.onmousemove(loc);
    };
    this.canvas.ontouchend = () => {
      this.canvas.onmouseup();
    };
    this.undoButton.onclick = () => {
      this.paths.pop();
      this.#redraw();
    };
  }
  #getMouse = (evt) => {
    const rect = this.canvas.getBoundingClientRect();
    return [
      Math.round(evt.clientX - rect.left),
      Math.round(evt.clientY - rect.top),
    ];
  };
  #redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    draw.paths(this.ctx, this.paths);
    if (this.paths.length > 0) {
      this.undoButton.disabled = false;
    } else {
      this.undoButton.disabled = true;
    }
  }
}
const draw = {};

draw.path = (ctx, path, color = "black") => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(...path[0]);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(...path[i]);
  }
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
};

draw.paths = (ctx, paths, color = "black") => {
  for (const path of paths) {
    draw.path(ctx, path, color);
  }
};
