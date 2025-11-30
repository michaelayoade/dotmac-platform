import React from "react";
import { type VirtualizedDataTableProps } from "./VirtualizedDataTable";
export interface VirtualizedTableProps<T = Record<string, unknown>> extends Omit<VirtualizedDataTableProps<T>, "forwardedScrollRef"> {
}
export interface VirtualizedTableRef {
    scrollTo: (index: number) => void;
    scrollToTop: () => void;
    scrollToBottom: () => void;
}
export declare const VirtualizedTable: React.ForwardRefExoticComponent<VirtualizedTableProps<any> & React.RefAttributes<VirtualizedTableRef>>;
export default VirtualizedTable;
//# sourceMappingURL=VirtualizedTable.d.ts.map