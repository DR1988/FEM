export class Point {
    constructor(private x: number, private y: number) { }

    get xCoord() {
        return this.x
    }

    get yCoord() {
        return this.y
    }

    isEqual(p: Point) {
        return this.x === p.x && this.y === p.y
    }
}