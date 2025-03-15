import { DEFAULT_RADIUS } from "../const"
import { Circle } from "./cirlce"
import { Point } from "./point"

type VertexShape = 'trinalge' | 'circle' | 'square'
type VertexType = 'start' | 'end' | 'split' | 'merge' | 'regular'

type ConstructOptions = {
    color?: string
    size?: number
    shape?: VertexShape
}

export class Vertex extends Circle {
    center: Point
    options: {
        shape: VertexShape
        size: number
        color: string
    }
    type: VertexType

    constructor(x: number, y: number, { shape = 'circle', color = 'black', size = DEFAULT_RADIUS }: ConstructOptions = {}) {
        super(x, y)
        this.center = new Point(x, y)
        this.options = {
            ...this.options,
            shape,
            size,
            color,
        }
    }

    set Options(options: ConstructOptions) {
        Object.entries(options).forEach(([key, value]) => {
            if (value) {
                this.options = {
                    ...this.options,
                    [key]: value
                }
            }
        })
    }

    draw(ctx: CanvasRenderingContext2D) {
        switch (this.options.shape) {
            case "trinalge":
                ctx.beginPath();
                ctx.moveTo(this.center.xCoord, this.center.yCoord - this.options.size);
                ctx.lineTo(this.center.xCoord - this.options.size, this.center.yCoord + this.options.size);
                ctx.lineTo(this.center.xCoord + this.options.size, this.center.yCoord + this.options.size);
                ctx.fillStyle = this.options.color
                ctx.fill();
                break;
            case "circle":
                ctx.beginPath()
                ctx.arc(this.center.xCoord, this.center.yCoord, this.options.size, 0, 360)
                ctx.fillStyle = this.options.color
                ctx.fill();
                break;
            case "square":
                ctx.beginPath()
                ctx.fillStyle = this.options.color
                ctx.fillRect(this.center.xCoord - 1.5 * this.options.size / 2, this.center.yCoord - 1.5 * this.options.size / 2, 1.5 * this.options.size, 1.5 * this.options.size)
                break;
        }
    }
}
