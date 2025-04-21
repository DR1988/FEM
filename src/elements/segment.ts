import { Circle } from "./cirlce";
import { Vertex } from "./Vertext";
import { Point } from "./point";
import { getIntersection } from "../utils";

type Options = { width?: number, color?: string, dash?: [number, number] | [] }
export class Segment {

    nearestToOrigin: Vertex | null
    furthestToOrigin: Vertex | null
    options: Options = { width: 2, color: 'black', dash: [] }
    originalOptions: Options | null
    hovered: boolean = false

    constructor(private p1: Vertex, private p2: Vertex) {
        this.setPoints()
    }

    get AllPoints() {
        return [this.p1, this.p2]
    }

    equals(seg: Segment) {
        return this.includesPoint(seg.p1) && this.includesPoint(seg.p2)
    }

    includesPoint(point: Vertex) {
        return this.p1.isEqual(point) || this.p2.isEqual(point)
    }

    set Hovered(hovered: boolean) {
        this.hovered = hovered
    }

    set Options(options: Options) {
        Object.entries(options).forEach(([key, value]) => {
            if (value) {
                this.options = {
                    ...this.options,
                    [key]: value
                }
            }
        })
    }


    hasSameEndPoint(segment: Segment) {
        return segment.p1.isEqual(this.p1) || segment.p2.isEqual(this.p2) || segment.p2.isEqual(this.p1) || segment.p1.isEqual(this.p2)
    }

    getCommonVertex(segment: Segment): Vertex | null {
        if (segment.p1.isEqual(this.p1) || segment.p2.isEqual(this.p1)) {
            return this.p1
        }

        if (segment.p2.isEqual(this.p2) || segment.p1.isEqual(this.p2)) {
            return this.p2
        }

        return null
    }

    isPointOnSegment(point: Vertex) {
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

    isPointNearSegment(point: Vertex) {

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

    resetColor() {
        this.options = { ...this.options, color: this.originalOptions.color }
    }

    checkOrientation(circle: Vertex) {
        orientation(this.p1.center, this.p2.center, circle.center)
    }

    doIntersectVect(segment: Segment) {
        const { p1, p2 } = this
        const { p1: q1, p2: q2 } = segment

        const result = getIntersection(p1.center, p2.center, q1.center, q2.center)

        return !!result
    }

    // easy one https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
    doIntersect(segment: Segment) {
        const { p1, p2 } = this
        const { p1: q1, p2: q2 } = segment
        // console.log('--------');

        // console.log('q1.center', this.p1.center, q1.center, this.p2.center);

        const o1 = orientation(p1.center, p2.center, q1.center);
        const o2 = orientation(p1.center, p2.center, q2.center);
        const o3 = orientation(q1.center, q2.center, p1.center);
        const o4 = orientation(q1.center, q2.center, p2.center);

        return o1 != o2 && o3 != o4
        // if (o1 != o2 && o3 != o4) {
        //     return true;
        // }

        // return false;

    }

    get CentralPoint() {
        const { xCoord: x1, yCoord: y1 } = this.p1.center
        const { xCoord: x2, yCoord: y2 } = this.p2.center

        const xCoord = (x1 + x2) / 2
        const yCoord = (y1 + y2) / 2
        return { xCoord, yCoord }
    }

    get Length() {
        const { xCoord: x1, yCoord: y1 } = this.p1.center
        const { xCoord: x2, yCoord: y2 } = this.p2.center

        return Math.hypot(x1 - x2, y1 - y2)
    }

    drawInfo(ctx: CanvasRenderingContext2D) {
        if (!this.hovered) {
            return
        }
        const { xCoord, yCoord } = this.CentralPoint
        ctx.fillStyle = 'black'
        ctx.fillRect(xCoord, yCoord, 140, 50)
        ctx.fillStyle = 'white'
        ctx.font = `${16}px serif`;
        const length = `Legnth: ${this.Length.toFixed(2)}`
        ctx.fillText(length, xCoord + 10, yCoord + 20);
        // ctx.fillText(textX, xCoord + 10, yCoord + 20);
        // ctx.fillText(textY, xCoord + 10, yCoord + 38);
        // ctx.fillText(textLength, xCoord + 10, yCoord + 58);
    }


    draw(ctx: CanvasRenderingContext2D, { width = 2, color = 'black', dash = [] }: Options = {}) {
        if (!this.options) {
            this.options = {
                width, color, dash
            }
            this.originalOptions = structuredClone(this.options)
        }

        this.setPoints()

        ctx.beginPath()
        ctx.lineWidth = this.options.width
        ctx.strokeStyle = this.options.color
        try {
            ctx.setLineDash(this.options.dash)
        } catch (e) {
            console.log('eeee', e);
            console.log('this.options.dash', this.options.dash);

        }
        ctx.moveTo(this.p1.center.xCoord, this.p1.center.yCoord);
        ctx.lineTo(this.p2.center.xCoord, this.p2.center.yCoord);
        ctx.stroke();
        ctx.setLineDash([])

        this.drawInfo(ctx)
    }

}

function orientation(p1: Point, p2: Point, o3: Point) {

    // orientation of an (x, y) triplet
    const val = ((p2.yCoord - p1.yCoord) * (o3.xCoord - p2.xCoord)) -
        ((p2.xCoord - p1.xCoord) * (o3.yCoord - p2.yCoord));

    // console.log('val', val);

    if (val === 0) {
        // console.log("Collinear");
        return 0
    }
    else if (val > 0) {
        // console.log("Clockwise");
        return 1
    }
    // console.log("CounterClockwise");
    return -1
}




const kramersMethod = (firstLine: [number, number, number], secondLine: [number, number, number]) => {
    let x = 0
    let y = 0

    const delta = firstLine[0] * secondLine[1] - firstLine[1] * secondLine[0]
    const deltaX = firstLine[2] * secondLine[1] - firstLine[1] * secondLine[2]
    const deltaY = firstLine[0] * secondLine[2] - firstLine[2] * secondLine[0]

    console.log('delta', delta);
    console.log('deltaX', deltaX);
    console.log('deltaY', deltaY);

    if (delta) {
        x = deltaX / delta
        y = deltaY / delta
    } else {
        return null
    }

    if (x < 0 && y > 1) {
        return null
    }

    console.log('x, y', x, y);

    return [(delta + deltaY) / delta, (delta + deltaX) / delta]

}