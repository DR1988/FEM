import { Point } from "./elements/point";
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
    arc: { center: Point, arc: number }
    maxLength = 10
    sortedSegments: Segment[] = []
    centralVert: Vertex
    centralSegment: Segment
    connectionSegment: Segment
    commontVertexCenter: Point

    boundarySegment: Segment
    vertexCrossMap: Map<Vertex,
        {
            // segments: [Segment, Segment],
            angle: number,
            angleVertex: Vertex
            centralVertex: Vertex
        }> = new Map()

    constructor(public figure: Figure, public helperFigure: Figure) {

        this.sortSegmentsInRow()
    }

    get Vertexes() {
        return this.vertexes
    }

    async sortSegmentsInRow() {
        // console.log('this.figure.allSegments,', this.figure.allSegments.map(s => s.AllPoints.map(p => p.center)))
        const segmentsSet = new Set<Segment>()

        let nextVertext = this.getHighestVertext()

        // show how segments was added initialy
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
                // await this.colorSegment([seg], 500)
                nextVertext = seg.AllPoints[0].isEqual(nextVertext) ? seg.AllPoints[1] : seg.AllPoints[0]
            }
        }
        const segments: Segment[] = [...segmentsSet]
        this.sortedSegments = [...segmentsSet]
        console.log('END', segments);

        // console.log('segments', segments);
        // this.getVertexesFromSegemnts(segments)
        return segments
    }

    * calcVertextType() {
        let firstSegment: Segment = this.sortedSegments.pop()
        let seg1: Segment = firstSegment
        console.log('this.sortedSegments length', this.sortedSegments.length);
        let count = 1
        this.sortedSegments.push(firstSegment)
        let coloredVertexes: [Vertex, Vertex, Vertex] = [] as unknown as [Vertex, Vertex, Vertex]
        let coloredSegments: Segment[] = []

        for (const segment of this.sortedSegments) {
            this.setDefaultVertex(coloredVertexes)
            this.setDefaultSegments(coloredSegments)

            coloredVertexes = this.getVertexesFromSegments(seg1, segment)
            // this.getCos(vertexes)
            // console.log('vertexes', coloredVertexes);
            coloredSegments = [seg1, segment]
            this.colorVertexesYield(coloredVertexes)
            this.colorSegmentYield(coloredSegments)
            this.getCos(coloredVertexes)
            yield segment
            seg1 = segment
        }

    }

    async getVertexesFromSegemnts(segments: Segment[]) {
        let firstSegment: Segment = segments.pop()
        let seg1: Segment = firstSegment
        let process = true
        let count = 0
        while (process) {
            let lastSegment = segments.pop()
            if (!lastSegment) {
                console.log('NO SEG');

                lastSegment = firstSegment
                process = false
            }

            const vertexes = this.getVertexesFromSegments(seg1, lastSegment)

            if (count < 5) {
                count++
                const angle = this.getCos(vertexes)
            }

            this.colorVertexes(vertexes, 500)
            await this.colorSegment([seg1, lastSegment], 500)

            seg1 = lastSegment
        }
    }

    async getCos(vertexes: [Vertex, Vertex, Vertex]) {
        const { center: { xCoord: x0, yCoord: y0 } } = vertexes[0]
        const { center: { xCoord: x1, yCoord: y1 } } = vertexes[1]
        const { center: { xCoord: x2, yCoord: y2 } } = vertexes[2]

        // const addXCoord = x1 + 50
        // const vertAdd = new Vertex(addXCoord, y1, { color: 'red', shape: 'square' })
        // const addSegm1 = new Segment(vertAdd, vertexes[0])
        // const addSegm2 = new Segment(vertAdd, vertexes[2])
        // this.helperFigure.addPoint(vertAdd)
        // this.figure.addSegment(addSegm1)
        // this.figure.addSegment(addSegm2)

        // const ox = Math.hypot(x1 - (x1 + 50), 0) // additionl x-axis line or segment to calculate relative angle
        // const firstDiag = Math.hypot(x0 - addXCoord, y1 - y0)

        // const secondDiag = Math.hypot(x2 - addXCoord, y2 - y1)


        if (this.centralVert) {
            this.helperFigure.removePoint(this.centralVert)
        }
        if (this.centralSegment) {
            this.helperFigure.removeSegment(this.centralSegment)
        }
        if (this.connectionSegment) {
            this.helperFigure.removeSegment(this.connectionSegment)
        }

        if (this.boundarySegment) {
            this.sortedSegments.forEach(s => {
                if (s.doIntersect(this.boundarySegment)) {
                    s.setSegmentColor('black')
                }
            })
        }

        this.connectionSegment = new Segment(vertexes[2], vertexes[0])
        this.centralVert = new Vertex(this.connectionSegment.CentralPoint.xCoord, this.connectionSegment.CentralPoint.yCoord)
        this.helperFigure.addSegment(this.connectionSegment)
        this.centralSegment = new Segment(this.centralVert, vertexes[1])
        this.helperFigure.addSegment(this.centralSegment)
        this.helperFigure.addPoint(this.centralVert)

        let boundaryVertex = new Vertex(0, this.centralVert.center.yCoord)
        this.boundarySegment = new Segment(boundaryVertex, this.centralVert)
        this.helperFigure.addSegment(this.boundarySegment)


        const intersectArray: { vertex: Vertex, segments: [Segment, Segment] }[] = []

        const a = Math.hypot(x0 - x1, y0 - y1)
        const b = Math.hypot(x1 - x2, y1 - y2)
        const c = Math.hypot(x0 - x2, y0 - y2)

        // quite simple math https://en.wikipedia.org/wiki/Law_of_cosines
        const arccosArg = this.getArccos(a, b, c) // just arccos argument to calculate angle
        console.log('arccosArg', arccosArg, Math.acos(arccosArg) * 180 / Math.PI);

        let crossCount = 0
        let prevSegment: Segment
        const accountedSegments = new Set<Segment>()
        let prevCrossedInd = -2
        let prevCrossedSegment: Segment = null
        let shouldCalcAngle = true
        let commonVertext: Vertex
        this.sortedSegments.forEach((s, ind) => {
            if (s.doIntersect(this.boundarySegment)) {
                console.log('in');
                this.figure.allCircles.forEach(vert => {
                    console.log('this.boundarySegment.isPointOnSegment(vert) ', this.boundarySegment.isPointOnSegment(vert), vert);

                })

                commonVertext = prevCrossedSegment?.getCommonVertex(s)
                if (commonVertext && this.boundarySegment.isPointOnSegment(commonVertext)) {
                    console.log('COMMON');
                    this.vertexCrossMap.set(vertexes[1], {
                        angleVertex: vertexes[1],
                        centralVertex: commonVertext,
                        angle: 0
                    })
                    shouldCalcAngle = false
                }
                // if (ind - prevCrossedInd === 1) {
                //     const commonVertext = prevCrossedSegment.getCommonVertex(s)
                //     console.log('commonVertext', commonVertext);

                //     this.vertexCrossMap.set(vertexes[1], {
                //         angleVertex: vertexes[1],
                //         centralVertex: this.centralVert,
                //         angle: 0
                //     })
                // }

                prevCrossedInd = ind
                crossCount++
            }
            console.log('out');

            prevCrossedSegment = s

        })
        if (shouldCalcAngle) {
            if (crossCount % 2 !== 0) {
                this.vertexCrossMap.set(vertexes[1], {
                    angleVertex: vertexes[1],
                    centralVertex: commonVertext,
                    angle: Math.acos(arccosArg) * 180 / Math.PI
                })
            } else {
                this.vertexCrossMap.set(vertexes[1], {
                    angleVertex: vertexes[1],
                    centralVertex: commonVertext,
                    angle: 360 - Math.acos(arccosArg) * 180 / Math.PI
                })
            }
        }
        console.log('crossCount ----------', crossCount);
        console.log('this.vertexCrossMap', this.vertexCrossMap);





        // const arccosArgFirst = this.getArccos(ox, a, firstDiag)

        // const arccosArgSecond = this.getArccos(ox, b, secondDiag)
        // return (a * a + b * b - c * c) / (2 * a * b)
        // console.log('cosinus', arccosArgFirst, Math.acos(arccosArgFirst) * 180 / Math.PI);
        // console.log('cosinus', arccosArgSecond, Math.acos(arccosArgSecond) * 180 / Math.PI);

        // console.log(x0, y0);
        // console.log(x1, y1);
        // console.log(x2, y2);


        // console.log('result', a, Math.acos(arccosArg) * 180 / Math.PI);
        // console.log('Math.cos(Math.acos(result) / 2', Math.acos(arccosArg) / 2 * 180 / Math.PI);
        const angle = 90
        let xn = x1 + this.maxLength / Math.cos(Math.acos(arccosArg) / 2)
        let yn = y1 - this.maxLength / Math.sin(Math.acos(arccosArg) / 2)

        // console.log('x', a, xn);
        // console.log('y', a, yn);

        // this.arc = { center: vertexes[1].center, arc: Math.acos(arccosArg) / 2 }
        let v = new Vertex(xn, yn)
        let t = new Vertex(0, yn)
        let s = new Segment(vertexes[1], v)
        let st = new Segment(t, v)

        // this.helperFigure.addPoint(v)
        // this.helperFigure.addSegment(s)
        // this.helperFigure.addSegment(st)

        let count = 0
        // this.figure.allSegments.forEach(s => {
        //     if (s.doIntersect(st)) {
        //         s.setSegmentColor('red')
        //         count++
        //     }
        // })

        // await timer(1000)
        // if (count % 2 === 0) {
        //     console.log('OUT');
        //     this.helperFigure.removeSegment(st)
        //     this.helperFigure.removePoint(v)
        //     this.helperFigure.removePoint(t)
        //     this.arc = null

        //     xn = x1 - this.maxLength / Math.cos(Math.acos(result) / 2)
        //     yn = y1 + this.maxLength / Math.sin(Math.acos(result) / 2)
        //     v = new Vertex(xn, yn)
        //     t = new Vertex(0, yn)
        //     s = new Segment(vertexes[1], v)
        //     st = new Segment(t, v)
        //     this.helperFigure.addPoint(v)
        //     this.helperFigure.addSegment(s)
        //     this.helperFigure.addSegment(st)
        //     count = 0
        //     this.figure.allSegments.forEach(s => {
        //         if (s.doIntersect(st)) {
        //             s.setSegmentColor('red')
        //             count++
        //         }
        //     })
        //     await timer(1000)
        //     this.helperFigure.removeSegment(st)
        //     this.helperFigure.removePoint(v)
        //     this.helperFigure.removePoint(t)
        //     this.arc = null
        // }

        // console.log('count', count)
        return Math.acos(arccosArg)
    }

    private getArccos(a: number, b: number, c: number) {
        return (a * a + b * b - c * c) / (2 * a * b)
    }

    async colorSegmentYield(segs: Segment[]) {
        // segs.forEach((s, ind) => {
        //     s.Options = { width: 4, color: ind === 0 ? 'red' : 'green' }
        // });
    }

    private setDefaultSegments(segs: Segment[]) {
        segs.forEach(s => {
            s.Options = { width: 2, color: 'black' }
        });
    }

    private async colorVertexesYield(vertexes: Vertex[]) {
        vertexes.forEach((v, i) => v.Options = { shape: 'square' })
    }

    private setDefaultVertex(vertexes: Vertex[]) {
        vertexes.forEach((v, i) => v.setOriginanlOptions())
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

        const commonVertex = seg1.includesPoint(seg2.AllPoints[0]) ? seg2.AllPoints[0] : seg2.AllPoints[1]
        const firstVertex = seg1.AllPoints[0].isEqual(commonVertex) ? seg1.AllPoints[1] : seg1.AllPoints[0]
        const lastVertex = seg2.AllPoints[0].isEqual(commonVertex) ? seg2.AllPoints[1] : seg2.AllPoints[0]

        return [firstVertex, commonVertex, lastVertex]
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

    private addArc(ctx: CanvasRenderingContext2D, center: Point, arc: number) { // can be removed
        const radius = 20

        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.strokeStyle = 'red'
        ctx.arc(center.xCoord, center.yCoord, radius, -Math.PI / 2, -arc)
        ctx.stroke()
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

        for (const vertex of this.helperFigure.allCircles) {
            vertex.draw(ctx)
        }

        for (const segment of this.helperFigure.allSegments) {
            segment.draw(ctx)
        }

        if (this.arc) {
            this.addArc(ctx, this.arc.center, this.arc.arc)
        }
    }
}