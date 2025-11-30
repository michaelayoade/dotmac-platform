import React from "react";
interface WorkflowStep {
    id: string;
    title: string;
    description?: string;
    component: React.ComponentType<any>;
    validation?: () => boolean | Promise<boolean>;
    required?: boolean;
}
interface WorkflowTemplateProps {
    steps: WorkflowStep[];
    onComplete: (data: Record<string, any>) => void;
    onCancel?: () => void;
    title: string;
    subtitle?: string;
    showProgress?: boolean;
    className?: string;
}
export declare const WorkflowTemplate: React.FC<WorkflowTemplateProps>;
export interface WorkflowStepProps {
    data: any;
    onChange: (data: any) => void;
    onNext?: () => void;
    onPrevious?: () => void;
    isFirst?: boolean;
    isLast?: boolean;
}
export {};
//# sourceMappingURL=WorkflowTemplate.d.ts.map