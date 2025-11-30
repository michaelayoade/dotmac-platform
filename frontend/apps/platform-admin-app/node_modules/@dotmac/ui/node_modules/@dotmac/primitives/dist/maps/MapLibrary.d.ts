/**
 * Universal Map Library
 * Pre-configured map templates for common ISP use cases
 */
import type { UniversalMapProps, ServiceArea, NetworkNode, Route } from "./UniversalMap";
export interface ServiceCoverageMapProps extends Omit<UniversalMapProps, "type" | "serviceAreas"> {
    serviceAreas: ServiceArea[];
    showCoverageHeatmap?: boolean;
    showCustomerDensity?: boolean;
    onServiceAreaSelect?: (area: ServiceArea) => void;
}
export declare function ServiceCoverageMap({ serviceAreas, showCoverageHeatmap, showCustomerDensity, onServiceAreaSelect, ...props }: ServiceCoverageMapProps): import("react/jsx-runtime").JSX.Element;
export interface NetworkTopologyMapProps extends Omit<UniversalMapProps, "type" | "networkNodes"> {
    networkNodes: NetworkNode[];
    showConnections?: boolean;
    showMetrics?: boolean;
    onNodeSelect?: (node: NetworkNode) => void;
}
export declare function NetworkTopologyMap({ networkNodes, showConnections, showMetrics, onNodeSelect, ...props }: NetworkTopologyMapProps): import("react/jsx-runtime").JSX.Element;
export interface CustomerLocationMapProps extends Omit<UniversalMapProps, "type" | "markers"> {
    customers: Array<{
        id: string;
        name: string;
        location: {
            lat: number;
            lng: number;
        };
        plan: string;
        status: "active" | "inactive" | "suspended";
        revenue?: number;
    }>;
    showClusters?: boolean;
    filterByPlan?: string[];
    onCustomerSelect?: (customer: any) => void;
}
export declare function CustomerLocationMap({ customers, showClusters, filterByPlan, onCustomerSelect, ...props }: CustomerLocationMapProps): import("react/jsx-runtime").JSX.Element;
export interface TechnicianRouteMapProps extends Omit<UniversalMapProps, "type" | "routes" | "markers"> {
    routes: Route[];
    technicians: Array<{
        id: string;
        name: string;
        location: {
            lat: number;
            lng: number;
        };
        status: "available" | "busy" | "offline";
        currentJob?: string;
    }>;
    workOrders?: Array<{
        id: string;
        location: {
            lat: number;
            lng: number;
        };
        type: "installation" | "repair" | "maintenance";
        priority: "low" | "medium" | "high" | "urgent";
        assignedTechnician?: string;
    }>;
    onRouteSelect?: (route: Route) => void;
    onTechnicianSelect?: (technician: any) => void;
}
export declare function TechnicianRouteMap({ routes, technicians, workOrders, onRouteSelect, onTechnicianSelect, ...props }: TechnicianRouteMapProps): import("react/jsx-runtime").JSX.Element;
export interface NetworkOutageMapProps extends Omit<UniversalMapProps, "type"> {
    outages: Array<{
        id: string;
        location: {
            lat: number;
            lng: number;
        };
        severity: "minor" | "major" | "critical";
        affectedCustomers: number;
        estimatedResolution?: Date;
        description: string;
    }>;
    onOutageSelect?: (outage: any) => void;
}
export declare function NetworkOutageMap({ outages, onOutageSelect, ...props }: NetworkOutageMapProps): import("react/jsx-runtime").JSX.Element;
export interface SignalStrengthMapProps extends Omit<UniversalMapProps, "type"> {
    signalData: Array<{
        location: {
            lat: number;
            lng: number;
        };
        strength: number;
        frequency: number;
        technology: "4G" | "5G" | "WiFi";
    }>;
    technologyFilter?: ("4G" | "5G" | "WiFi")[];
}
export declare function SignalStrengthMap({ signalData, technologyFilter, ...props }: SignalStrengthMapProps): import("react/jsx-runtime").JSX.Element;
declare const _default: {
    ServiceCoverageMap: typeof ServiceCoverageMap;
    NetworkTopologyMap: typeof NetworkTopologyMap;
    CustomerLocationMap: typeof CustomerLocationMap;
    TechnicianRouteMap: typeof TechnicianRouteMap;
    NetworkOutageMap: typeof NetworkOutageMap;
    SignalStrengthMap: typeof SignalStrengthMap;
};
export default _default;
//# sourceMappingURL=MapLibrary.d.ts.map