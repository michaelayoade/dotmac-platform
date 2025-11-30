import React from "react";
export type NotificationType = "success" | "error" | "warning" | "info" | "system";
export type NotificationPriority = "low" | "medium" | "high" | "critical";
export type NotificationChannel = "browser" | "websocket" | "email" | "sms" | "push";
export interface Notification {
    id: string;
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    channel: NotificationChannel[];
    timestamp: Date;
    read: boolean;
    persistent: boolean;
    actions?: NotificationAction[];
    metadata?: Record<string, any>;
    expiresAt?: Date;
    userId?: string;
    tenantId?: string;
}
export interface NotificationAction {
    id: string;
    label: string;
    type: "primary" | "secondary" | "danger";
    handler: (notification: Notification) => void | Promise<void>;
}
export interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isConnected: boolean;
    settings: NotificationSettings;
}
export interface NotificationSettings {
    enableBrowser: boolean;
    enableWebSocket: boolean;
    enableEmail: boolean;
    enableSMS: boolean;
    enablePush: boolean;
    soundEnabled: boolean;
    maxNotifications: number;
    autoHideDelay: number;
    priorities: Record<NotificationPriority, boolean>;
    channels: Record<NotificationChannel, boolean>;
}
interface NotificationContextType {
    state: NotificationState;
    addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
    removeNotification: (id: string) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
    clearNotifications: () => void;
    updateSettings: (settings: Partial<NotificationSettings>) => void;
    connect: () => void;
    disconnect: () => void;
}
export interface NotificationProviderProps {
    children: React.ReactNode;
    websocketUrl?: string;
    apiKey?: string;
    userId?: string;
    tenantId?: string;
    onError?: (error: Error) => void;
    maxNotifications?: number;
    defaultDuration?: number;
}
export declare function NotificationProvider({ children, websocketUrl, apiKey, userId, tenantId, onError, maxNotifications, defaultDuration, }: NotificationProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useNotifications(): NotificationContextType;
export interface NotificationListProps {
    className?: string;
    maxVisible?: number;
    position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
    showActions?: boolean;
    onNotificationClick?: (notification: Notification) => void;
}
export declare function NotificationList({ className, maxVisible, position, showActions, onNotificationClick, }: NotificationListProps): import("react/jsx-runtime").JSX.Element;
export interface NotificationBadgeProps {
    className?: string;
    showCount?: boolean;
    maxCount?: number;
}
export declare function NotificationBadge({ className, showCount, maxCount, }: NotificationBadgeProps): import("react/jsx-runtime").JSX.Element | null;
export interface NotificationSystemProps {
    children: React.ReactNode;
    maxNotifications?: number;
    defaultDuration?: number;
    position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}
declare function NotificationSystem({ children, maxNotifications, defaultDuration, position, }: NotificationSystemProps): import("react/jsx-runtime").JSX.Element;
export declare function useToast(): {
    toast: (message: string, options?: Partial<Omit<Notification, "id" | "timestamp" | "read">>) => void;
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
    dismiss: (id: string) => void;
    clear: () => void;
};
export default NotificationSystem;
//# sourceMappingURL=NotificationSystem.d.ts.map