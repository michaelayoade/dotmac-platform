/**
 * BottomSheet - A modal that slides up from the bottom
 */
import * as React from "react";
export interface BottomSheetProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}
export declare const BottomSheet: React.ForwardRefExoticComponent<BottomSheetProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=BottomSheet.d.ts.map