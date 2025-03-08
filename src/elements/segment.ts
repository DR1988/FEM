import { Circle } from "./cirlce";
import { Point } from "./point";

type Options = { width?: number, color?: string, dash?: [number, number] | [] }
export class Segment {
    width: number = 0
    nearestToOrigin: Circle | null
    furthestToOrigin: Circle | null
    options: Options | null

    constructor(private p1: Circle, private p2: Circle) {
        this.setPoints()
    }

    equals(seg: Segment) {
        return this.includesPoint(seg.p1) && this.includesPoint(seg.p2)
    }

    includesPoint(point: Circle) {
        return this.p1.isEqual(point) || this.p2.isEqual(point)
    }

    isPointOnSegment(point: Circle) {
        const { xCoord: x, yCoord: y } = point.center
        // line equasion https://en.wikipedia.org/wiki/Linear_equation
        const res = (this.p2.center.yCoord - this.p1.center.yCoord) * (x - this.p1.center.xCoord) - (y - this.p1.center.yCoord) * (this.p2.center.xCoord - this.p1.center.xCoord)
        return res === 0
    }

    private setPoints() {
        const { xCoord: x1, yCoord: y1 } = this.p1.center
        const { xCoord: x2, yCoord: y2 } = this.p2.center

        this.nearestToOrigin = Math.hypot(x1, y1) < Math.hypot(x2, y2) ? this.p1 : this.p2
        this.furthestToOrigin = Math.hypot(x1, y1) > Math.hypot(x2, y2) ? this.p1 : this.p2
    }


    isPointNearSegment(point: Circle) {

        const { xCoord: x, yCoord: y } = point.center
        const { center: { xCoord: x1, yCoord: y1 } } = this.nearestToOrigin
        const { center: { xCoord: x2, yCoord: y2 } } = this.furthestToOrigin

        const a = Math.hypot(x1 - x2, y1 - y2)
        const c = Math.hypot(x1 - x, y1 - y)
        const b = Math.hypot(x - x2, y - y2)

        // quite simple math https://en.wikipedia.org/wiki/Law_of_cosines
        const result = (a * a + b * b - c * c) / (2 * a * b) // just arccos argument to calculate angle

        const distance = b * Math.sqrt(1 - Math.pow(result, 2)) // distance from point to a segment

        const isSegmentLessOthers = (a < c || a < b) // checking if segment's length less than other sides of triangle
        if (distance < 4 && !isSegmentLessOthers) {
            // this.setSegmentColor('lime')
            return true
        }

        return false

    }

    setSegmentColor(color: string) {
        this.options = { ...this.options, color }
    }


    draw(ctx: CanvasRenderingContext2D, { width = 2, color = 'black', dash = [] }: Options = {}) {
        if (!this.options) {
            this.options = {
                width, color, dash
            }
        }

        this.setPoints()

        ctx.beginPath()
        ctx.lineWidth = this.options.width
        ctx.strokeStyle = this.options.color
        ctx.setLineDash(this.options.dash)
        ctx.moveTo(this.p1.center.xCoord, this.p1.center.yCoord);
        ctx.lineTo(this.p2.center.xCoord, this.p2.center.yCoord);
        ctx.stroke();
        ctx.setLineDash([])

    }

}