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
        this.sortBySegments()
    }

    get Vertexes() {
        return this.vertexes
    }

    async sortBySegments() {
        // console.log('this.figure.allSegments,', this.figure.allSegments.map(s => s.AllPoints.map(p => p.center)))
        const segmentsSet = new Set<Segment>()

        let nextVertext = this.getHighestVertext()

        for (const item of this.figure.allSegments) {
            item.setSegmentColor('red')
            item.Options = { width: 4 }
            await timer(300)
            item.setSegmentColor('lime')
        }
        while (segmentsSet.size !== this.figure.allSegments.length) {
            const seg = this.figure.allSegments.find(s => s.includesPoint(nextVertext) && !segmentsSet.has(s))
            if (!segmentsSet.has(seg)) {
                segmentsSet.add(seg)
                seg.Options = { width: 4, color: 'red' }
                console.log(seg);
                await timer(300)
                seg.Options = { width: 2, color: 'black' }

                nextVertext = seg.AllPoints[0].isEqual(nextVertext) ? seg.AllPoints[1] : seg.AllPoints[0]
            }
        }
        const segments: Segment[] = [...segmentsSet]
        console.log('END', segments);

        // console.log('segments', segments);

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
                    if (currentVertex.options.color === 'lime') {
                        console.log(';sdcsdc');
                    }
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