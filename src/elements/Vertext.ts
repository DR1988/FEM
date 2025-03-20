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

const HOVERED_COLOR = 'red'

export class Vertex extends Circle {
    center: Point
    options: {
        shape: VertexShape
        size: number
        color: string
    }
    hovered: boolean = false
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

    set Hovered(hoverd: boolean) {
        this.hovered = hoverd
    }

    private drawData(ctx: CanvasRenderingContext2D) {
        const fontHeight = 18
        const xCoord = this.center.xCoord + 1.5 * this.options.size / 2
        const yCoord = this.center.yCoord + 1.5 * this.options.size / 2
        const textX = `x: ${this.center.xCoord}`
        const textY = `y: ${this.center.yCoord}`

        const textXwidth = ctx.measureText(textX).width
        const textYwidth = ctx.measureText(textY).width

        const width = textXwidth > textYwidth ? textXwidth : textYwidth
        ctx.font = `${fontHeight}px serif`;

        ctx.fillStyle = 'black'
        ctx.fillRect(xCoord, yCoord, width + 20, 2 * fontHeight + 20)
        ctx.fillStyle = 'white'
        ctx.fillText(textX, xCoord + 10, yCoord + 20);
        ctx.fillText(textY, xCoord + 10, yCoord + 38);
    }

    draw(ctx: CanvasRenderingContext2D) {
        switch (this.options.shape) {
            case "trinalge":
                ctx.beginPath();
                ctx.moveTo(this.center.xCoord, this.center.yCoord - this.options.size);
                ctx.lineTo(this.center.xCoord - this.options.size, this.center.yCoord + this.options.size);
                ctx.lineTo(this.center.xCoord + this.options.size, this.center.yCoord + this.options.size);
                ctx.fillStyle = this.hovered ? HOVERED_COLOR : this.options.color
                this.hovered && this.drawData(ctx)
                ctx.fill();
                break;
            case "circle":
                ctx.beginPath()
                ctx.arc(this.center.xCoord, this.center.yCoord, this.options.size, 0, 360)
                ctx.fillStyle = this.hovered ? HOVERED_COLOR : this.options.color
                ctx.fill();
                this.hovered && this.drawData(ctx)

                break;
            case "square":
                ctx.beginPath()
                ctx.fillStyle = this.hovered ? HOVERED_COLOR : this.options.color
                ctx.fillRect(this.center.xCoord - 1.5 * this.options.size / 2, this.center.yCoord - 1.5 * this.options.size / 2, 1.5 * this.options.size, 1.5 * this.options.size)
                this.hovered && this.drawData(ctx)

                break;
        }
    }
}
