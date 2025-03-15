import { DEFAULT_RADIUS } from "./const";
import { Circle } from "./elements/cirlce";
import { Segment } from "./elements/segment";
import { Vertex } from "./elements/Vertext";
import { Figure } from "./figure";
import { GraphEditor } from "./GraphEditor";
// import { Circle, Point } from "./types";


const canvasElement = document.getElementById('canvas') as (HTMLCanvasElement | null)
const grabDotsBtn = document.getElementById('grabDotsBtn') as (HTMLButtonElement | null)
const triangulateBtn = document.getElementById('triangulate') as (HTMLButtonElement | null)

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


const p1 = new Vertex(206, 128, { color: 'red' })
const p2 = new Vertex(254, 175, { color: 'green' })
const p3 = new Vertex(321, 108, { color: 'blue' })
const p4 = new Vertex(340, 277, { color: 'red' })
const p5 = new Vertex(405, 297)
const p6 = new Vertex(389, 395)
const p7 = new Vertex(286, 364, { color: 'aqua' })
const p8 = new Vertex(304, 481)
const p9 = new Vertex(231, 446)
const p10 = new Vertex(160, 502)
const p11 = new Vertex(91, 426)
const p12 = new Vertex(108, 252)
const p13 = new Vertex(156, 298)
const p14 = new Vertex(180, 233)
const p15 = new Vertex(131, 175)


const s1 = new Segment(p1, p2)
const s2 = new Segment(p2, p3)
const s3 = new Segment(p3, p4)
const s4 = new Segment(p4, p5)
const s5 = new Segment(p5, p6)
const s6 = new Segment(p6, p7)
const s7 = new Segment(p7, p8)
const s8 = new Segment(p8, p9)
const s9 = new Segment(p9, p10)
const s10 = new Segment(p10, p11)
const s11 = new Segment(p11, p12)
const s12 = new Segment(p12, p13)
const s13 = new Segment(p13, p14)
const s14 = new Segment(p14, p15)
const s15 = new Segment(p15, p1)

const figure = new Figure(
    [p1, p2, p3, p4, p5, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15],
    [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15]
)
// const figure = new Figure([p1, p2,p3,p4], [s1])


const graphEditor = new GraphEditor(canvasElement, figure)

if (grabDotsBtn) {
    grabDotsBtn.addEventListener('click', () => {
        console.log(' graphEditor.circles', graphEditor.circles)
    })
}

if (triangulateBtn) {
    triangulateBtn.addEventListener('click', () => {
        graphEditor.triangulate()
    })
}

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
