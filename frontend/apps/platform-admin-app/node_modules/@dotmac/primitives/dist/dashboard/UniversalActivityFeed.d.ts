/**
 * Universal Activity Feed Component
 * Real-time activity streams with timestamps, user actions, and status indicators
 */
import React from "react";
export interface ActivityItem {
    id: string;
    type: "user_action" | "system_event" | "error" | "success" | "info" | "warning";
    title: string;
    description?: string;
    timestamp: Date | string;
    user?: {
        id: string;
        name: string;
        avatar?: string;
        role?: string;
    };
    icon?: React.ComponentType<{
        className?: string;
    }>;
    color?: string;
    metadata?: Record<string, any>;
    category?: string;
    priority?: "low" | "medium" | "high" | "urgent";
    onClick?: () => void;
    href?: string;
    actions?: ActivityAction[];
}
export interface ActivityAction {
    id: string;
    label: string;
    icon?: React.ComponentType<{
        className?: string;
    }>;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger";
}
export interface UniversalActivityFeedProps {
    activities: ActivityItem[];
    title?: string;
    maxItems?: number;
    showTimestamps?: boolean;
    showAvatars?: boolean;
    showCategories?: boolean;
    groupByDate?: boolean;
    allowFiltering?: boolean;
    categories?: string[];
    priorityFilter?: ActivityItem["priority"][];
    typeFilter?: ActivityItem["type"][];
    isLive?: boolean;
    onRefresh?: () => void;
    refreshInterval?: number;
    variant?: "default" | "compact" | "detailed";
    className?: string;
    itemClassName?: string;
    loading?: boolean;
    emptyMessage?: string;
    onItemClick?: (item: ActivityItem) => void;
}
export declare function UniversalActivityFeed({ activities, title, maxItems, showTimestamps, showAvatars, showCategories, groupByDate, allowFiltering, categories, priorityFilter, typeFilter, isLive, onRefresh, refreshInterval, variant, className, itemClassName, loading, emptyMessage, onItemClick, }: UniversalActivityFeedProps): import("react/jsx-runtime").JSX.Element;
export default UniversalActivityFeed;
//# sourceMappingURL=UniversalActivityFeed.d.ts.map