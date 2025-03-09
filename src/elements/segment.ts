import { Circle } from "./cirlce";
import { Point } from "./point";

type Options = { width?: number, color?: string, dash?: [number, number] | [] }
export class Segment {

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

    checkOrientation(circle: Circle) {
        orientation(this.p1.center, this.p2.center, circle.center)
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

    isIntersectSegment(segment: Segment) {
        const {xCoord: x1, yCoord: y1} = this.p1.center
        const {xCoord: x2, yCoord: y2} = this.p2.center

        const {xCoord: x3, yCoord: y3} = segment.p1.center
        const {xCoord: x4, yCoord: y4} = segment.p2.center

        const sCoeff1 = x2 - x1
        const tCoeff1 = -(x4 - x3)
        const freeCoeff1 = x3-x1

        const sCoeff2 = y2 - y1 
        const tCoeff2 = -(y4 - y3)
        const freeCoeff2 = y3-y1

        console.log('sCoeff1,tCoeff1,freeCoeff1', sCoeff1,tCoeff1,freeCoeff1);
        console.log('sCoeff2, tCoeff2, freeCoeff2]', sCoeff2, tCoeff2, freeCoeff2);
        
        const result = kramersMethod([sCoeff1,tCoeff1,freeCoeff1], [sCoeff2, tCoeff2, freeCoeff2])
        // const result = kramersMethod([3,-2,6], [5, 4, 32])
        console.log('result', result);
        
        return result
    }

    setSegmentColor(color: string) {
        this.options = { ...this.options, color }
    }

    doIntersect(segment: Segment ) {
        const {p1, p2} = this
        const {p1: q1, p2:q2} = segment
        // console.log('--------');
        
        // console.log('q1.center', this.p1.center, q1.center, this.p2.center);
        
        const o1 = orientation(p1.center, p2.center, q1.center); 
        const o2 = orientation(p1.center, q2.center, q1.center); 
        const o3 = orientation(p2.center, p1.center, q2.center); 
        const o4 = orientation(p2.center, q1.center, q2.center);
        
        if (o1 != o2 && o3 != o4) {
            console.log(12312312);
            
            return true; 
        }

        return false;

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

function orientation(p1:Point, p2: Point, o3: Point) {

    // orientation of an (x, y) triplet
    const val = ((p2.yCoord - p1.yCoord) * (o3.xCoord - p2.xCoord)) -
                ((p2.xCoord - p1.xCoord) * (o3.yCoord - p2.yCoord));

                // console.log('val', val);
                
    if (val === 0) {
        // console.log("Collinear");
        return 0
    }
    else if (val > 0){
        // console.log("Clockwise");
        return 1
    }
        // console.log("CounterClockwise");
        return -1
}




const kramersMethod = (firstLine: [number,number,number], secondLine: [number,number,number]) => {
    let x = 0
    let y = 0

    const delta = firstLine[0] * secondLine[1] - firstLine[1]*secondLine[0]
    const deltaX = firstLine[2] * secondLine[1] - firstLine[1]*secondLine[2]
    const deltaY = firstLine[0] * secondLine[2] - firstLine[2]*secondLine[0]

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

    return [(delta+deltaY)/delta, (delta+deltaX)/delta ]
    
}