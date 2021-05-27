import { get } from 'lodash';
import { DrawBoardPoint } from './structs/points';

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

  pencilWidth: number = 11;

  pencilColor: string = '#000';

  cursorType: string = 'pencil';

  // 绘图历史栈
  historyStack: ImageData[] = [];

  // 命令栈
  commandStack: any[] = [];

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

  command(action:string, params:any) {
    try {
      switch (action) {
        case 'pencil':
        case 'eraser':
        {
          if (action === 'pencil') {
            // 铅笔画图
            this.ctx.strokeStyle = get(params, 'color', '#000');
          } else {
            // 擦除
            this.ctx.strokeStyle = '#fff';
          }
          this.ctx.lineWidth = get(params, 'witdh', 11);
          this.ctx.lineCap = 'round';
          this.ctx.lineJoin = 'round';
          this.ctx.beginPath();
          const points:any[] = get(params, 'points', []);
          points.forEach((point:DrawBoardPoint) => {
            if (point.act === 1) { // lineTo
              this.ctx.lineTo(point.x, point.y);
            } else {
              this.ctx.moveTo(point.x, point.y);
            }
          });
          this.ctx.closePath();
          break;
        }
        default:
          break;
      }
    } catch (e) {
      console.error(`exec canvas command error: ${e}`);      // eslint-disable-line
      console.error(e);      // eslint-disable-line
    }
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
    this.ctx.strokeStyle = (this.cursorType === 'eraser') ? '#FFF' : this.pencilColor;
    this.ctx.lineWidth = this.pencilWidth;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.beginPath();
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
