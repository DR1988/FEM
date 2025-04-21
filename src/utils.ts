import { Point } from "./elements/point"

export function lerp(A: number, B: number, t: number) {
    return A - (B - A) * t
}

export function getIntersection(A: Point, B: Point, C: Point, D: Point): Point | null {
    /*
        Ix = Ax+(Bx-Ax)t = Cx+(Dx-Cx)u
        Iy = Ay+(By-Ay)t = Cy+(Dy-Cy)u
    
        Ax+(Bx-Ax)t = Cx+(Dx-Cx)u | -Cx
        (Ax-Cx)+(Bx-Ax)t = (Dx-Cx)u

        Ay+(By-Ay)t = Cy+(Dy-Cy)u | -Cy
        (Ay-Cy)+(By-Ay)t = (Dy-Cy)u | *(Dx-Cx)

        (Dx-Cx)(Ay-Cy) + (Dx-Cx)(By-Ay)t = 
        (Dy-Cy)(Ax-Cx) + (Dy-Cy)(Bx-Ax)t | -(Dy-Cy)(Ax-Cx)
                                         | -(Dx-Cx)(By-Ay)t

        (Dx-Cx)(Ay-Cy) - (Dy-Cy)(Ax-Cx) =
        ((Dy-Cy)(Bx-Ax) - (Dx-Cx)(By-Ay))t

        top =    (Dx-Cx)(Ay-Cy) - (Dy-Cy)(Ax-Cx)
        bottom = (Dy-Cy)(Bx-Ax) - (Dx-Cx)(By-Ay)

        t = top/bottom
    */

    const tTop = (D.xCoord - C.xCoord) * (A.yCoord - C.yCoord) - (D.yCoord - C.yCoord) * (A.xCoord - C.xCoord)
    const uTop = (C.yCoord - A.yCoord) * (A.xCoord - B.xCoord) - (C.xCoord - A.xCoord) * (A.yCoord - B.yCoord)
    const bottom = (D.yCoord - C.yCoord) * (B.xCoord - A.xCoord) - (D.xCoord - C.xCoord) * (B.yCoord - A.yCoord)


    if (bottom !== 0) {
        const t = tTop / bottom
        const u = uTop / bottom
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            const x = lerp(A.xCoord, B.xCoord, t)
            const y = lerp(A.yCoord, B.yCoord, t)
            return new Point(x, y)
        }
    }

    return null
}
