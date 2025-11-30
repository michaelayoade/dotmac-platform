/**
 * Commission Configuration Manager
 * Allows admins to create and manage flexible commission structures
 */
import React from "react";
interface CommissionConfig {
    id: string;
    name: string;
    description?: string;
    is_active: boolean;
    is_default: boolean;
    reseller_type?: string;
    reseller_tier?: string;
    territory?: string;
    commission_structure: "flat_rate" | "percentage" | "tiered" | "performance_based" | "hybrid";
    rate_config: any;
    effective_from: string;
    effective_until?: string;
    calculate_on: "revenue" | "signup" | "both";
    payment_frequency: "monthly" | "quarterly" | "annual";
    minimum_payout: number;
    settings: any;
    created_at: string;
    updated_at: string;
}
interface CommissionConfigManagerProps {
    apiEndpoint?: string;
    onConfigChange?: (config: CommissionConfig) => void;
}
export declare const CommissionConfigManager: React.FC<CommissionConfigManagerProps>;
export default CommissionConfigManager;
//# sourceMappingURL=CommissionConfigManager.d.ts.map