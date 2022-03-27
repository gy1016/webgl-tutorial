import Cuboid from './Cuboid';

export default class Terrain {
  public col: number;
  public row: number;
  public verticesColors: Float32Array | null;
  public cuboid: Cuboid | null;

  constructor(col = 0, row = 0) {
    this.col = col;
    this.row = row;
    this.verticesColors = null;
    this.cuboid = null;
  }

  setWH(col: number, row: number) {
    this.col = col;
    this.row = row;
  }
}
