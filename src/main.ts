import { DEFAULT_RADIUS } from "./const";
import { Circle } from "./elements/cirlce";
import { Segment } from "./elements/segment";
import { Figure } from "./figure";
import { GraphEditor } from "./GraphEditor";
// import { Circle, Point } from "./types";


const canvasElement = document.getElementById('canvas') as (HTMLCanvasElement | null)

// const dots: Circle[] = []

// const drawDot = (ctx: CanvasRenderingContext2D, c: Circle) => {
//     const { x, y } = c.center
//     ctx.beginPath()
//     ctx.arc(x, y, c.radius, 0, 360)
//     ctx.fillStyle = 'black'
//     ctx.fill();

// }

// function isInCircle(center: Point, radius: number, point: Point) {
//     return Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2)) < radius
// }

// function isNearDot(point1: Circle, point2: Circle) {
//     const { center: center1 } = point1
//     const { center: center2 } = point2

//     const radius = point1.radius + point2.radius
//     return isInCircle(center1, radius, center2)
// }

// function setDot(this: HTMLCanvasElement, event: MouseEvent) {

//     const ctx = this.getContext('2d')
//     const circle: Circle = { center: { x: event.offsetX, y: event.offsetY }, radius: DEFAULT_RADIUS }
//     const isClickedOnDot = dots.some(d => isNearDot(d, circle))

//     if (!isClickedOnDot) {
//         drawDot(ctx, circle)
//         dots.push(circle)
//     }
// }

// function drawLine(ctx: CanvasRenderingContext2D, point1: Point, point2: Point) {
//     ctx.beginPath()
//     ctx.moveTo(point1.x, point1.y);
//     ctx.lineTo(point2.x, point2.y);
//     ctx.fillStyle = 'black'
//     ctx.stroke();
// }

const p1 = new Circle(50, 50, DEFAULT_RADIUS)
const p2 = new Circle(200, 100, DEFAULT_RADIUS)
// const p3 = new Circle(200, 200, DEFAULT_RADIUS)
// const p4 = new Circle(100, 200, DEFAULT_RADIUS)

const s1 = new Segment(p1, p2)
// const s2 = new Segment(p2, p3)
// const s3 = new Segment(p3, p4)
// const s4 = new Segment(p4, p1)

// const figure = new Figure([p1, p2, p3, p4], [s1, s2, s3, s4])
const figure = new Figure([p1, p2], [s1])

const graphEditor = new GraphEditor(canvasElement, figure)

if (canvasElement) {
    const ctx = canvasElement.getContext('2d')
    draw()

    function draw() {

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        graphEditor.display()
        requestAnimationFrame(draw);
    }

    // canvasElement.addEventListener('mousedown', setDot)

}
