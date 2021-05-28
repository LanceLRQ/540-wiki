import { DrawBoardPoint } from './points';

export class DrawBoardPencilAction {
  color: string = '#000';

  width: number = 11;

  points: DrawBoardPoint[] = [];

  constructor(color:string, width:number, points:DrawBoardPoint[]) {
    this.color = color;
    this.width = width;
    this.points = points;
  }
}
