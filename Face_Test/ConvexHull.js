    /**
     * 計算 2D 點的凸包 (Convex Hull) - 使用 Graham Scan 演算法
     */
    function convexHull(points) {
        if (points.length < 3) return points; // 少於 3 個點無法計算凸包

        // **步驟 1：找出 Y 軸最小（最下方）的點**
        points.sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y);
        let pivot = points[0];

        // **步驟 2：根據角度排序**
        points.sort((a, b) => {
            let angleA = Math.atan2(a.y - pivot.y, a.x - pivot.x);
            let angleB = Math.atan2(b.y - pivot.y, b.x - pivot.x);
            return angleA - angleB;
        });

        // **步驟 3：使用 Graham Scan 構建凸包**
        let hull = [];
        for (let p of points) {
            while (hull.length >= 2 && crossProduct(hull[hull.length - 2], hull[hull.length - 1], p) <= 0) {
                hull.pop();
            }
            hull.push(p);
        }
        return hull;
    }

    /**
     * 計算向量的叉積（Cross Product）
     */
    function crossProduct(a, b, c) {
        return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    }