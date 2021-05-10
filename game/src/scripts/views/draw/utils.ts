export class DrawBoard {
  canvas:HTMLCanvasElement = null;

  cursorEl:HTMLElement = null;

  constructor(c:HTMLCanvasElement, cursor:HTMLElement) {
    this.canvas = c;
    this.cursorEl = cursor;
  }

  init() {
    this.bindListener();
  }

  bindListener() {
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseleave', this.onMouseLeave.bind(this));
  }

  onMouseMove(ev:MouseEvent) {
    this.cursorEl.style.display = 'block';
    this.cursorEl.style.left = `${this.canvas.offsetLeft + ev.offsetX - 2}px`;
    this.cursorEl.style.top = `${this.canvas.offsetTop + ev.offsetY - 20}px`;
    document.body.style.cursor = 'none';
  }

  onMouseLeave() {
    this.cursorEl.style.display = 'none';
    document.body.style.cursor = 'default';
  }
}
