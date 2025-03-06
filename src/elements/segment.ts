import { Circle } from "./cirlce";

type Options = { width?: number, color?: string, dash?: [number, number] | [] }
export class Segment {
    width: number = 0
    constructor(private p1: Circle, private p2: Circle) { }

    equals(seg: Segment) {
        return this.includesPoint(seg.p1) && this.includesPoint(seg.p2)
    }

    includesPoint(point: Circle) {
        return this.p1.isEqual(point) || this.p2.isEqual(point)
    }

    isPointOnSegment(point: Circle) {
        const { xCoord: x, yCoord: y } = point.center
        const res = (this.p2.center.yCoord - this.p1.center.yCoord) * (x - this.p1.center.xCoord) - (y - this.p1.center.yCoord) * (this.p2.center.xCoord - this.p1.center.xCoord)
        return res === 0
    }

    isPointNearSegment(point: Circle) {
        const { xCoord: x, yCoord: y } = point.center
        const { xCoord: x1, yCoord: y1 } = this.p1.center
        const { xCoord: x2, yCoord: y2 } = this.p2.center

        const A = y2 - y1


        const B = x1 - x2
        const C = -x1 * y2 + y1 * x1 + x2 * y2 - x1 * y1
        console.log('A', A);
        console.log('B', B);
        console.log('C', C);
        console.log('Math.abs(A * x + B * y + C)', Math.abs(A * x + B * y + C));

        const dist = Math.abs(A * x + B * y + C) / (Math.hypot(x, y))
        if (dist < 10) {
            console.log('dist', dist, this.p1, this.p2);
        }
    }


    draw(ctx: CanvasRenderingContext2D, { width = 2, color = 'black', dash = [] }: Options = {}) {
        this.width = width
        if (this.p1.center.xCoord === 50) {
            // console.log('this.p1.xCoord', this.p1.xCoord)
        }

        ctx.beginPath()
        ctx.lineWidth = width
        ctx.strokeStyle = color
        ctx.setLineDash(dash)
        ctx.moveTo(this.p1.center.xCoord, this.p1.center.yCoord);
        ctx.lineTo(this.p2.center.xCoord, this.p2.center.yCoord);
        ctx.stroke();
        ctx.setLineDash([])

    }

}