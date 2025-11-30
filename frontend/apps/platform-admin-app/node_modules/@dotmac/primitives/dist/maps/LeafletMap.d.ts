/**
 * Leaflet Map Component
 * Real geographic map implementation using Leaflet and React-Leaflet
 */
import React from "react";
import type { Coordinates, Bounds, MapMarker, ServiceArea, NetworkNode, Route } from "./UniversalMap";
export interface LeafletMapProps {
    center?: Coordinates;
    zoom?: number;
    bounds?: Bounds;
    markers?: MapMarker[];
    serviceAreas?: ServiceArea[];
    networkNodes?: NetworkNode[];
    routes?: Route[];
    variant?: "admin" | "customer" | "reseller" | "technician" | "management";
    showLegend?: boolean;
    showControls?: boolean;
    onMarkerClick?: (marker: MapMarker) => void;
    onAreaClick?: (area: ServiceArea) => void;
    onNodeClick?: (node: NetworkNode) => void;
    onMapClick?: (coordinates: Coordinates) => void;
    title?: string;
    height?: number | string;
    className?: string;
    loading?: boolean;
    error?: string | null;
}
export declare const LeafletMap: React.FC<LeafletMapProps>;
export default LeafletMap;
//# sourceMappingURL=LeafletMap.d.ts.map