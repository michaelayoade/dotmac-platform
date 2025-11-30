/**
 * Partner Management Dashboard
 * Configurable commission structures - no hardcoded rates
 */
import React from "react";
interface Partner {
    id: string;
    company_name: string;
    partner_code: string;
    contact_name: string;
    contact_email: string;
    territory: string;
    tier: "bronze" | "silver" | "gold" | "platinum";
    status: "active" | "inactive" | "suspended" | "pending";
    commission_config_id?: string;
    total_revenue: number;
    customers_count: number;
    created_at: string;
}
interface PartnerDashboardProps {
    apiEndpoint?: string;
    onPartnerSelect?: (partner: Partner) => void;
    showCommissionConfig?: boolean;
}
export declare const PartnerDashboard: React.FC<PartnerDashboardProps>;
export default PartnerDashboard;
//# sourceMappingURL=PartnerDashboard.d.ts.map