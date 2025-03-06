import { Point } from "./point"

type DrawOptions = { color?: string, outline?: boolean, fill?: boolean }

export class Circle {
    center: Point
    radius: number

    constructor(x: number, y: number, radius: number) {
        this.center = new Point(x, y)
        this.radius = radius
    }

    isEqual(circle: Circle,) {
        return this.center.isEqual(circle.center)
    }

    set setCenter(point: Point) {
        this.center = point
    }

    draw(ctx: CanvasRenderingContext2D, { color = 'black', outline = false, fill = false }: DrawOptions) {
        ctx.beginPath()
        ctx.arc(this.center.xCoord, this.center.yCoord, this.radius, 0, 360)
        ctx.fillStyle = color
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