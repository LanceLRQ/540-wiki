import { noop } from 'lodash';
import { DrawBoardPoint } from './structs/points';
import { DrawBoardMessage } from './structs/message';
import { DrawBoardPencilAction } from './structs/actions';

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

  // 光标类型
  cursorType: string = 'pencil';

  // 绘图历史栈
  historyStack: ImageData[] = [];

  // 命令栈
  commandStack: any[] = [];

  // 监听变更事件
  onChange: Function = noop;

  constructor(c:HTMLCanvasElement, cursor:HTMLElement) {
    this.canvas = c;
    this.ctx = this.canvas.getContext('2d');
    this.cursorEl = cursor;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  init() {
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
    this.clean();
  }

  destory() {
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
    this.canvas.removeEventListener('mouseup', this.handleMouseUp);
  }

  command(msg:DrawBoardMessage) {
    try {
      switch (msg.action) {
        case 'pencil':
        {
          this.historyStack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
          const params:DrawBoardPencilAction = <DrawBoardPencilAction>msg.params;
          this.ctx.strokeStyle = params.color;
          this.ctx.lineWidth = params.width;
          this.ctx.lineCap = 'round';
          this.ctx.lineJoin = 'round';
          this.ctx.beginPath();
          params.points.forEach((point:DrawBoardPoint) => {
            if (point.a === 1) { // lineTo
              this.ctx.lineTo(point.x, point.y);
              this.ctx.stroke();
            } else {
              this.ctx.moveTo(point.x, point.y);
            }
          });
          this.ctx.closePath();

          break;
        }
        case 'clean':
          this.clean();
          break;
        case 'undo':
          this.undo();
          break;
        default:
          break;
      }
    } catch (e) {
      console.error(`exec canvas command error: ${e}`);      // eslint-disable-line
      console.error(e);      // eslint-disable-line
    }
  }

  undo() {
    if (this.historyStack.length > 0) {
      this.ctx.putImageData(this.historyStack.pop(), 0, 0);
    }
  }

  clean() {
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

  handleMouseDown(ev:MouseEvent) {
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
    this.commandStack.push(new DrawBoardPoint(0, ev.offsetX, ev.offsetY));
  }

  handleMouseMove(ev:MouseEvent) {
    if (this.drawing) {
      this.ctx.lineTo(ev.offsetX, ev.offsetY);
      this.ctx.stroke();
      this.commandStack.push(new DrawBoardPoint(1, ev.offsetX, ev.offsetY));
    }
    this.cursorEl.style.display = 'block';
    this.cursorEl.style.left = `${this.canvas.offsetLeft + ev.offsetX - this.pencilWidth}px`;
    this.cursorEl.style.top = `${this.canvas.offsetTop + ev.offsetY - this.pencilWidth}px`;
    document.body.style.cursor = 'none';
  }

  handleMouseLeave() {
    this.cursorEl.style.display = 'none';
    document.body.style.cursor = 'default';
    this.closeDrawing();
  }

  handleMouseUp() {
    this.closeDrawing();
  }

  closeDrawing() {
    if (this.drawing) {
      this.ctx.closePath();
      this.drawing = false;
      if (this.commandStack.length > 1) {
        this.onChange(new DrawBoardMessage(
          'pencil',
          new DrawBoardPencilAction((this.cursorType === 'eraser') ? '#FFF' : this.pencilColor, this.pencilWidth, [...this.commandStack]))
        );
      }
      this.commandStack = [];
    }
  }
}
