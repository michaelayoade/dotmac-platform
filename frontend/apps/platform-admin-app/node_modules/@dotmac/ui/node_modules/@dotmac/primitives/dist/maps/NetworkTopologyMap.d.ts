import type { LatLng } from "./types";
export interface NetworkNode {
    id: string;
    name: string;
    type: "router" | "switch" | "server" | "tower" | "fiber_node" | string;
    coordinates: LatLng;
    status: "online" | "offline" | "degraded" | "maintenance" | string;
    metadata?: Record<string, unknown>;
}
export interface NetworkTopologyMapProps {
    nodes?: NetworkNode[];
    networkNodes?: NetworkNode[];
    center?: LatLng;
    zoom?: number;
    height?: number;
    onNodeClick?: (node: NetworkNode) => void;
    variant?: "admin" | "customer" | "reseller" | "technician" | "management";
    onNodeSelect?: (node: NetworkNode) => void;
    showLegend?: boolean;
}
export declare function NetworkTopologyMap({ nodes, networkNodes, height, onNodeClick, variant, onNodeSelect, showLegend, }: NetworkTopologyMapProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=NetworkTopologyMap.d.ts.map