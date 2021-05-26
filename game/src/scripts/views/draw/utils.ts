/***
 * 数据格式说明
 *
 * ==============
 * 类型 | 操作名 | 参数
 * ==============
 *
 * 类型： 0 - canvas函数， 1 - canvas属性，2 - 画板操作
 *
*/

const CANVAS_ACTIONS_MAPPING = {
  0: 'beginPath',
  1: 'closePath',

  2: 'strokeStyle',
  3: 'lineWidth',
  4: 'lineCap',
  5: 'lineJoin',

  6: 'lineTo',
  7: 'moveTo',
};

export class DrawBoard {
  // canvas dom
  canvas:HTMLCanvasElement = null

  // canvas context
  ctx: CanvasRenderingContext2D = null;

  // cursor element
  cursorEl:HTMLElement = null;

  // is drawing
  drawing:boolean = false;

  // readonly mode
  readonly :boolean = false;

  pencilWidth: number = 1;

  pencilColor: string = '#000';

  cursorType: string = 'pencil';

  historyStack: ImageData[] = [];

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
    this.clearCanvas();
  }

  destory() {
    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('mouseleave', this.onMouseLeave);
    this.canvas.removeEventListener('mouseup', this.onMouseUp);
  }

  clearCanvas() {
    this.historyStack = [];
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(-1, -1, this.canvas.width, this.canvas.height);
  }

  setPencilStyle(width:number, color:string) {
    this.pencilWidth = width;
    this.pencilColor = color;
  }

  setCursorType(type:string) {
    this.cursorType = type;
  }

  onMouseDown(ev:MouseEvent) {
    if (this.readonly) return;
    // 把图像数据写入到栈上
    this.historyStack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
    // 启动画图
    this.drawing = true;
    this.ctx.beginPath();
    this.ctx.strokeStyle = (this.cursorType === 'eraser') ? '#FFF' : this.pencilColor;
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
    this.cursorEl.style.left = `${this.canvas.offsetLeft + ev.offsetX - this.pencilWidth}px`;
    this.cursorEl.style.top = `${this.canvas.offsetTop + ev.offsetY - this.pencilWidth}px`;
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

  undo() {
    if (this.historyStack.length > 0) {
      this.ctx.putImageData(this.historyStack.pop(), 0, 0);
    }
  }
}
