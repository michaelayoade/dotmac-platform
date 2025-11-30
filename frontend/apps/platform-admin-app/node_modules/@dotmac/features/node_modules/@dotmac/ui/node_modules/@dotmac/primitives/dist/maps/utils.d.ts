import type { LatLng } from "./types";
export declare function projectPoint(point: LatLng, bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
}): {
    x: number;
    y: number;
};
export declare function calculateBounds(points: LatLng[]): {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
};
export declare function flattenCoordinates(input: Array<LatLng[] | LatLng>): LatLng[];
//# sourceMappingURL=utils.d.ts.map