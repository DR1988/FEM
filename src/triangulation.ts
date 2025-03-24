import { Segment } from "./elements/segment";
import { Vertex } from "./elements/Vertext";
import { Figure } from "./figure";

const timer = async (time: number = 1000) => {
    return new Promise((res) => {
        setTimeout(() => {
            res(true)
        }, time);
    })
}
export class Triangulation {
    vertexes: Vertex[]

    constructor(public figure: Figure) {
        this.sortSegmentsInRow()
    }

    get Vertexes() {
        return this.vertexes
    }

    async sortSegmentsInRow() {
        // console.log('this.figure.allSegments,', this.figure.allSegments.map(s => s.AllPoints.map(p => p.center)))
        const segmentsSet = new Set<Segment>()

        let nextVertext = this.getHighestVertext()

        // show hot segments was added initialy
        // for (const item of this.figure.allSegments) {
        //     item.setSegmentColor('red')
        //     item.Options = { width: 4 }
        //     await timer(300)
        //     item.setSegmentColor('lime')
        // }

        while (segmentsSet.size !== this.figure.allSegments.length) {
            const seg = this.figure.allSegments.find(s => s.includesPoint(nextVertext) && !segmentsSet.has(s))
            if (!segmentsSet.has(seg)) {
                segmentsSet.add(seg)
                // await this.colorSegment([seg])
                nextVertext = seg.AllPoints[0].isEqual(nextVertext) ? seg.AllPoints[1] : seg.AllPoints[0]
            }
        }
        const segments: Segment[] = [...segmentsSet]
        console.log('END', segments);

        // console.log('segments', segments);
        this.getVertexesFromSegemnts(segments)
        return segments
    }

    async getVertexesFromSegemnts(segments: Segment[]) {
        const vertexSet = new Set<Vertex>()
        let firstSegment: Segment = segments.pop()
        let seg1: Segment = firstSegment
        let process = true
        let put = true
        while (process) {
            let lastSegment = segments.pop()
            if (!lastSegment) {
                console.log('NO SEG');

                lastSegment = firstSegment
                process = false
            }

            // let seg2 = segments.pop()
            // if (!seg2) {
            //     seg2 = firstSegment
            // }

            const vertexes = this.getVertexesFromSegments(seg1, lastSegment)

            console.log('vertexes', vertexes);
            if (put) {
                put = false
                const angle = this.getCos(vertexes)

                console.log('angle', angle * 180 / Math.PI)
            }

            const { xCoord: x1, yCoord: y1 } = vertexes[0].center
            const { xCoord: x2, yCoord: y2 } = vertexes[1].center
            const { xCoord: x3, yCoord: y3 } = vertexes[2].center

            // const area = this.triangleArea(x1, y1, x2, y2, x3, y3)
            this.colorVertexes(vertexes, 1500)
            await this.colorSegment([seg1, lastSegment], 1500)

            seg1 = lastSegment
        }
    }

    getCos(vertexes: [Vertex, Vertex, Vertex]) {
        const { center: { xCoord: x0, yCoord: y0 } } = vertexes[0]
        const { center: { xCoord: x1, yCoord: y1 } } = vertexes[1]
        const { center: { xCoord: x2, yCoord: y2 } } = vertexes[2]

        const a = Math.hypot(x0 - x1, y0 - y1)
        const b = Math.hypot(x1 - x2, y1 - y2)
        const c = Math.hypot(x0 - x2, y0 - y2)

        const result = (a * a + b * b - c * c) / (2 * a * b)
        console.log('result', a, a / Math.cos(Math.acos(result) / 2));
        const xn = x2 + c / Math.cos(Math.acos(result) / 2)
        const yn = y2 + c / Math.sin(Math.acos(result) / 2)
        console.log('x', a, xn);
        console.log('y', a, yn);
        const v = new Vertex(xn, yn)
        const s = new Segment(vertexes[1], v)
        this.figure.addPoint(v)
        this.figure.addSegment(s)
        return Math.acos(result)
    }

    async colorSegment(segs: Segment[], time?: number) {
        segs.forEach((s, ind) => {
            s.Options = { width: 4, color: ind === 0 ? 'red' : 'green' }
        });

        // // console.log(seg);
        time && await timer(time)
        segs.forEach(s => {
            s.Options = { width: 2, color: 'black' }
        });
    }

    private async colorVertexes(vertexes: Vertex[], time?: number) {
        vertexes.forEach((v, i) => v.Options = { shape: 'square' })
        time && await timer(time)
        vertexes.forEach(v => v.setOriginanlOptions())
    }

    private getHighestVertext() {
        let currentVertex: Vertex | null = null // start from highest one
        let hightes = Number.MAX_SAFE_INTEGER
        this.figure.allCircles.forEach(vertex => {
            if (vertex.center.yCoord < hightes) {
                hightes = vertex.center.yCoord
                currentVertex = vertex
            }
        })

        return currentVertex
    }

    private triangleArea2(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        return (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
    }

    private triangleArea(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        return Math.abs(this.triangleArea2(x1, y1, x2, y2, x3, y3)) / 2;
    }

    private clockwise(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        return this.triangleArea2(x1, y1, x2, y2, x3, y3) < 0;
    }

    private counterClockwise(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        return this.triangleArea2(x1, y1, x2, y2, x3, y3) > 0;
    }

    private getVertexesFromSegments(seg1: Segment, seg2: Segment): [Vertex, Vertex, Vertex] {
        const vertex2 = seg1.includesPoint(seg2.AllPoints[0]) ? seg2.AllPoints[1] : seg2.AllPoints[0]
        return [seg1.AllPoints[0], seg1.AllPoints[1], vertex2]
    }

    private getCommonVertexFromSegments(seg1: Segment, seg2: Segment): Vertex | null {
        const testVert1 = seg1.includesPoint(seg2.AllPoints[0])
        const testVert2 = seg1.includesPoint(seg2.AllPoints[1])

        if (testVert1) {
            return seg2.AllPoints[0]
        }

        if (testVert2) {
            return seg2.AllPoints[1]
        }

        return null
    }

    sortByClockWise() {
        const sortArray: Vertex[] = []
        let currentVertex: Vertex | null = this.getHighestVertext()
        // console.log('highestVertex', currentVertex)
        sortArray.push(currentVertex)


        while (sortArray.length < this.figure.allSegments.length) {

            const segments = this.figure.allSegments.filter(segment => segment.includesPoint(currentVertex))

            const checkingVertex = segments.map(segm => {
                return segm.AllPoints.find(p => !p.isEqual(currentVertex))
            })

            const nextVertex = checkingVertex.reduce((acc, current, ind) => {
                // if (sortArray.includes(current)) {
                //     return current
                // }
                if (currentVertex.options.color === 'lime') {
                    // console.log('acc', acc,);

                    // console.log('checkingVertex', checkingVertex);

                    // console.log('current', ind, current);
                    // console.log('---------------------');

                }
                if (sortArray.find(v => v === current)) {
                    return acc
                }
                if (!acc) {
                    return current
                } else if ((acc.center.xCoord > current.center.xCoord && acc.center.yCoord >= current.center.yCoord) ||
                    (acc.center.xCoord < current.center.xCoord && acc.center.yCoord < current.center.yCoord)
                ) {
                    return current
                }

                return acc
            })

            currentVertex = nextVertex
            sortArray.push(nextVertex)
        }

        // console.log('sortArraysortArray', sortArray)

    }

    sortByHighestPont() {
        // const sorted = this.figure.allCircles.toSorted((a, b) => {
        //     if (a.center.yCoord <= b.center.yCoord) {
        //         return -1
        //     }

        //     return 1
        // })

        // this.figure.allCircles.sort((a, b) => {
        //     if (a.center.yCoord <= b.center.yCoord) {
        //         return -1
        //     }

        //     return 1
        // })

        const len = this.figure.allCircles.length

        this.figure.allCircles.forEach((vertex, ind) => {
            if (ind === 0) {
                var previous = this.figure.allCircles[(ind + len - 1) % len];
                var next = this.figure.allCircles[(ind + 1) % len];

                const { xCoord: x1, yCoord: y1 } = vertex.center
                const { xCoord: x2, yCoord: y2 } = next.center
                const { xCoord: x3, yCoord: y3 } = previous.center
                const fi = (Math.atan2(y3 - y1, x3 - x1) - Math.atan2(y2 - y1, x2 - x1)) * 180 / Math.PI
                console.log('prepeprwpe', vertex, fi);
            }
            if (ind === 1) {
                var previous = this.figure.allCircles[(ind + len - 1) % len];
                var next = this.figure.allCircles[(ind + 1) % len];

                const { xCoord: x1, yCoord: y1 } = vertex.center
                const { xCoord: x2, yCoord: y2 } = next.center
                const { xCoord: x3, yCoord: y3 } = previous.center
                const fi = (Math.atan2(y3 - y1, x3 - x1) - Math.atan2(y2 - y1, x2 - x1)) * 180 / Math.PI
                console.log('prepeprwpe', vertex, fi);
            }

            if (ind === 6) {
                var previous = this.figure.allCircles[(ind + len - 1) % len];
                var next = this.figure.allCircles[(ind + 1) % len];

                const { xCoord: x1, yCoord: y1 } = vertex.center
                const { xCoord: x2, yCoord: y2 } = next.center
                const { xCoord: x3, yCoord: y3 } = previous.center
                const fi = (Math.atan2(y3 - y1, x3 - x1) - Math.atan2(y2 - y1, x2 - x1)) * 180 / Math.PI
                console.log('prepeprwpe', vertex, fi);
            }
        })

        // this.figure.allCircles.forEach(s =>  s.Options = {shape: 't'})
    }


    draw(ctx: CanvasRenderingContext2D) {
        for (const vertex of this.figure.allCircles) {
            vertex.draw(ctx)
        }
    }
}