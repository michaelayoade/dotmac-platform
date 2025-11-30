/**
 * Universal Map Component
 * Base map component supporting service coverage, network topology, and customer locations
 */
export type MapType = "service_coverage" | "network_topology" | "customer_locations" | "technician_routes";
export interface Coordinates {
    lat: number;
    lng: number;
}
export interface Bounds {
    north: number;
    south: number;
    east: number;
    west: number;
}
export interface MapMarker {
    id: string;
    position: Coordinates;
    type: "customer" | "tower" | "fiber" | "technician" | "issue" | "poi";
    status?: "active" | "inactive" | "maintenance" | "error";
    title: string;
    description?: string;
    metadata?: Record<string, any>;
    onClick?: () => void;
}
export interface ServiceArea {
    id: string;
    name: string;
    type: "fiber" | "wireless" | "hybrid";
    polygon: Coordinates[];
    serviceLevel: "full" | "limited" | "planned";
    maxSpeed: number;
    coverage: number;
    customers?: number;
    color?: string;
}
export interface NetworkNode {
    id: string;
    type: "router" | "switch" | "server" | "tower" | "fiber_node";
    position: Coordinates;
    status: "online" | "offline" | "maintenance" | "error";
    name: string;
    connections?: string[];
    metrics?: {
        uptime: number;
        load: number;
        latency: number;
    };
}
export interface Route {
    id: string;
    name: string;
    waypoints: Coordinates[];
    type: "installation" | "maintenance" | "emergency";
    technician?: string;
    estimatedTime?: number;
    status: "planned" | "in_progress" | "completed";
}
export interface UniversalMapProps {
    type: MapType;
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
    showHeatmap?: boolean;
    showClusters?: boolean;
    onMarkerClick?: (marker: MapMarker) => void;
    onAreaClick?: (area: ServiceArea) => void;
    onNodeClick?: (node: NetworkNode) => void;
    onMapClick?: (coordinates: Coordinates) => void;
    onBoundsChanged?: (bounds: Bounds) => void;
    filters?: {
        markerTypes?: MapMarker["type"][];
        serviceTypes?: ServiceArea["type"][];
        nodeTypes?: NetworkNode["type"][];
        statusFilter?: string[];
    };
    title?: string;
    height?: number | string;
    width?: number | string;
    loading?: boolean;
    error?: string | null;
    className?: string;
}
export declare function UniversalMap({ type, center, zoom, bounds, markers, serviceAreas, networkNodes, routes, variant, showLegend, showControls, showHeatmap, showClusters, onMarkerClick, onAreaClick, onNodeClick, onMapClick, onBoundsChanged, filters, title, height, width, loading, error, className, }: UniversalMapProps): import("react/jsx-runtime").JSX.Element;
export default UniversalMap;
//# sourceMappingURL=UniversalMap.d.ts.map