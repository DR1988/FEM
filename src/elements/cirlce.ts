import { DEFAULT_RADIUS } from "../const"
import { Point } from "./point"

type DrawOptions = { color?: string, outline?: boolean, fill?: boolean }
type ConstructOptions = {
    color?: string
    radius?: number
}


export class Circle {
    center: Point
    radius: number
    options: Omit<ConstructOptions, 'radius'>

    constructor(x: number, y: number, { radius = DEFAULT_RADIUS, color = 'black' }: ConstructOptions = {}) {
        this.center = new Point(x, y)
        this.radius = radius
        this.options = {
            color,
        }
    }

    isEqual(circle: Circle,) {
        return this.center.isEqual(circle.center)
    }

    set setCenter(point: Point) {
        this.center = point
    }

    set setColor(color: string) {
        this.options.color = color
    }

    draw(ctx: CanvasRenderingContext2D, { color = 'black', outline = false, fill = false }: DrawOptions) {
        ctx.beginPath()
        ctx.arc(this.center.xCoord, this.center.yCoord, this.radius, 0, 360)
        ctx.fillStyle = this.options.color || color
        ctx.fill();

        if (outline) {
            ctx.beginPath()
            ctx.lineWidth = this.radius / 2
            ctx.strokeStyle = 'lime'
            ctx.arc(this.center.xCoord, this.center.yCoord, this.radius * 0.6, 0, 360)
            ctx.stroke()
        }
        if (fill) {
            ctx.beginPath()
            ctx.lineWidth = this.radius / 2
            ctx.fillStyle = 'lime'
            ctx.arc(this.center.xCoord, this.center.yCoord, this.radius * 0.6, 0, 360)
            ctx.fill()
        }
    }
}