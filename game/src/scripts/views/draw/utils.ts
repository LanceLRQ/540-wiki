export class DrawBoard {
  // canvas dom
  canvas:HTMLCanvasElement = null

  // canvas context
  ctx: CanvasRenderingContext2D = null;

  // cursor element
  cursorEl:HTMLElement = null;

  // is drawing
  drawing:boolean = false;

  pencilWidth: number = 1;

  pencilColor: string = '#000';

  constructor(c:HTMLCanvasElement, cursor:HTMLElement) {
    this.canvas = c;
    this.ctx = this.canvas.getContext('2d');
    this.cursorEl = cursor;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  init() {
    this.canvas.addEventListener('mousedown', this.onMouseDown);
    this.canvas.addEventListener('mousemove', this.onMouseMove);
    this.canvas.addEventListener('mouseleave', this.onMouseLeave);
    this.canvas.addEventListener('mouseup', this.onMouseUp);
  }

  destory() {
    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('mouseleave', this.onMouseLeave);
    this.canvas.removeEventListener('mouseup', this.onMouseUp);
  }

  setPencilStyle(width:number, color:string) {
    this.pencilWidth = width;
    this.pencilColor = color;
  }

  onMouseDown(ev:MouseEvent) {
    this.drawing = true;
    this.ctx.beginPath();
    console.log(this.pencilWidth, this.pencilColor)
    this.ctx.strokeStyle = this.pencilColor;
    this.ctx.lineWidth = this.pencilWidth;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.moveTo(ev.offsetX, ev.offsetY);
  }

  onMouseMove(ev:MouseEvent) {
    if (this.drawing) {
      this.ctx.lineTo(ev.offsetX, ev.offsetY);
      this.ctx.stroke();
    }
    this.cursorEl.style.display = 'block';
    this.cursorEl.style.left = `${this.canvas.offsetLeft + ev.offsetX - 2}px`;
    this.cursorEl.style.top = `${this.canvas.offsetTop + ev.offsetY - 20}px`;
    document.body.style.cursor = 'none';
  }

  onMouseLeave() {
    this.cursorEl.style.display = 'none';
    document.body.style.cursor = 'default';
    this.ctx.closePath();
    this.drawing = false;
  }

  onMouseUp() {
    this.ctx.closePath();
    this.drawing = false;
  }
}
