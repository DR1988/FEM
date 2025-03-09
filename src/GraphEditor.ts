import { DEFAULT_RADIUS } from "./const";
import { Circle } from "./elements/cirlce";
import { Segment } from "./elements/segment";
import { Figure } from "./figure";
import { throttle } from 'lodash'

export class GraphEditor {
    ctx: CanvasRenderingContext2D
    selected: Circle | null
    hovered: Circle | null
    hoveredSegment: Segment | null
    mouse: Circle | null
    dragging: boolean
    draggable: boolean

    constructor(private canvas: HTMLCanvasElement, private figure: Figure) {

        this.ctx = canvas.getContext('2d')
        this.selected = null
        this.hovered = null
        this.dragging = false
        this.draggable = false
        this.addListners()
    }

    isNearDot(point1: Circle, point2: Circle) {

        return this.isInCircle(point1, point2)
    }

    isInCircle(center: Circle, point: Circle) {
        const radius = center.radius + point.radius

        return Math.hypot(center.center.xCoord - point.center.xCoord, center.center.yCoord - point.center.yCoord) < radius
    }

    private handleMouseDown = (event: MouseEvent) => {
        if (event.button === 2) { // right click
            if (this.selected) {
                this.selected = null
            } else if (this.hovered) {
                this.removePoint(this.hovered)
            }

            if (this.hoveredSegment) {
                this.figure.removeSegment(this.hoveredSegment)
                this.hoveredSegment = null
            }
        }

        if (event.button === 0) { // left click

            if (this.hovered) {
                this.selectPoint(this.hovered)
                this.draggable = true
                return
            }

            this.figure.addPoint(this.mouse)
            this.selectPoint(this.mouse)
            this.hovered = this.mouse

        }
    }

    private selectPoint(circle: Circle) {
        if (this.selected) {
            const newSegment = new Segment(this.selected, circle)
            // this.figure.allSegments.find(seg => seg.isIntersectSegment(newSegment))
            this.figure.addSegment(newSegment)
        }
        this.selected = circle
    }

    private handleMousemove = (event: MouseEvent) => {
        this.mouse = new Circle(event.offsetX, event.offsetY, DEFAULT_RADIUS)

        this.hovered = this.figure.allCircles.find(c => this.isNearDot(c, this.mouse))
        if (this.draggable && this.selected) {
            this.dragging = true
            const point = this.mouse.center
            this.selected.setCenter = point
        }

        this.hoverOverSegment(event)
    }

    private mouseUp = () => {
        if (this.dragging) {
            this.selected = null
        }
        this.draggable = false
        this.dragging = false
    }

    private throttleHoverOverSegment = throttle((event: MouseEvent) => {
        // console.log(event.offsetX, event.offsetY)
        const circle = new Circle(event.offsetX, event.offsetY, DEFAULT_RADIUS)
        const hoveredSegment = this.figure.allSegments.find(seg => {
            return seg.isPointNearSegment(circle)
        })

        if (hoveredSegment && !this.hovered /*don't want to show in same time colored dot and segment */) {
            this.hoveredSegment?.setSegmentColor('black') // cause could be 'hovered' (e.g. colored in 'hovered' color) two elements in same time 
            this.hoveredSegment = hoveredSegment
            this.hoveredSegment.setSegmentColor('lime')
        } else {
            this.hoveredSegment?.setSegmentColor('black')
            this.hoveredSegment = null
        }

        if (this.selected) {
            console.log('--------------');
            
            console.log('this.selected', this.selected);
            console.log('circle', circle);
            
            
            const segment = new Segment(this.selected, circle)
            const foundIntersectSegment = this.figure.allSegments.find(s => s.doIntersect(segment))
            console.log('foundIntersectSegment', foundIntersectSegment);
        }
        

    }, 50)

    private hoverOverSegment = (event: MouseEvent) => {
        this.throttleHoverOverSegment(event)
    }

    private removePoint(circle: Circle) {
        this.figure.removePoint(circle)
        if (circle === this.selected) {
            this.selected = null
        }
        this.hovered = null
    }

    private addListners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown)
        this.canvas.addEventListener('mousemove', this.handleMousemove)
        this.canvas.addEventListener('mouseup', this.mouseUp)
    }

    display() {

        this.figure.draw(this.ctx)

        if (this.selected) {
            const intent = this.hovered ?? this.mouse
            const segment = new Segment(intent, this.selected)


            const foundSegment = this.figure.allSegments.find(s => s.equals(segment))
            // const foundIntersectSegment = this.figure.allSegments.find(s => s.doIntersect(segment))

            // console.log('foundIntersectSegment', foundIntersectSegment);
            
            if (foundSegment) {
                segment.draw(this.ctx, { width: 3, color: 'red' })
            } else {
                segment.draw(this.ctx, { dash: [3, 3] })
            }

            this.selected.draw(this.ctx, { outline: true })
        }
        if (this.hovered) {
            this.hovered.draw(this.ctx, { fill: true })
        }

        if (this.selected === this.hovered && this.selected && this.hovered) {
            this.hovered.draw(this.ctx, { outline: true, fill: true })
        }

        if (this.hoveredSegment) {
            this.hoveredSegment.setSegmentColor('lime')
        }
    }
}