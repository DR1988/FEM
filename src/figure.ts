import { Circle } from "./elements/cirlce";
import { Segment } from "./elements/segment";

export class Figure {
    constructor(private circles: Circle[], private segments: Segment[]) { 
        if (segments.length >= 2) {

            
            const result = segments[0].isIntersectSegment(segments[1])

            if (result) {
                const newCirlce = new Circle(result[0], result[1], 6)
                this.circles.push(newCirlce)
            }
        }
    }


    get allCircles() {
        return this.circles
    }

    get allSegments() {
        return this.segments
    }

    addPoint(circle: Circle) {
        this.circles.push(circle)
    }

    removePoint(circle: Circle) {
        const segs = this.getSegmentsWithPoint(circle)

        for (const seg of segs) {
            this.removeSegment(seg)
        }

        this.circles = this.circles.filter(c => c !== circle)
    }

    // segments

    containeSegments(seg: Segment) {
        return this.allSegments.find(s => s.equals(seg))
    }

    addSegment(seg: Segment) {
        const hasSegment = this.containeSegments(seg)

        if (hasSegment) {
            return
        }
        this.segments.push(seg)
    }

    removeSegment(seg: Segment) {
        this.segments = this.segments.filter(s => s !== seg)
    }

    getSegmentsWithPoint(point: Circle) {
        const segs = []
        for (const seg of this.allSegments) {
            if (seg.includesPoint(point)) {
                segs.push(seg)
            }
        }

        return segs
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (const segment of this.segments) {
            segment.draw(ctx)
        }

        for (const circle of this.circles) {
            circle.draw(ctx, {})
        }
    }
}