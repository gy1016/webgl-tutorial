export default class Cuboid {
  public minX: number;
  public maxX: number;
  public minY: number;
  public maxY: number;
  public minZ: number;
  public maxZ: number;

  constructor(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number) {
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.minZ = minZ;
    this.maxZ = maxZ;
  }

  CenterX() {
    return (this.minX + this.maxX) / 2.0;
  }
  CenterY() {
    return (this.minY + this.maxY) / 2.0;
  }
  CenterZ() {
    return (this.minZ + this.maxZ) / 2.0;
  }
  LengthX() {
    return this.maxX - this.minX;
  }
  LengthY() {
    return this.maxY - this.minY;
  }
}
