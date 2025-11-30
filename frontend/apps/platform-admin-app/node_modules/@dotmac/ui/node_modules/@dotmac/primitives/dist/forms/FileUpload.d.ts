import { type VariantProps } from "class-variance-authority";
import type React from "react";
declare const uploadVariants: (props?: ({
    variant?: "default" | "minimal" | "outlined" | "filled" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
    state?: "error" | "disabled" | "success" | "dragover" | "idle" | "uploading" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface FileValidation {
    maxSize?: number;
    minSize?: number;
    acceptedTypes?: string[];
    maxFiles?: number;
    required?: boolean;
}
export interface SimpleFile {
    id: string;
    file: File;
    status: "pending" | "uploading" | "success" | "error";
    progress?: number;
    error?: string;
}
export interface BaseFileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onError">, VariantProps<typeof uploadVariants> {
    multiple?: boolean;
    disabled?: boolean;
    accept?: string;
    validation?: FileValidation;
    onFileSelect?: (files: File[]) => void;
    onError?: (error: string) => void;
}
export declare const FileValidationUtils: {
    validateFile: (file: File, validation?: FileValidation) => string | null;
    validateFileList: (files: File[], validation?: FileValidation) => string | null;
    formatSize: (bytes: number) => string;
    isImageFile: (file: File) => boolean;
    getFileIcon: (file: File) => string;
};
export declare const useDragAndDrop: (onFileDrop: (files: File[]) => void, disabled?: boolean) => {
    isDragOver: boolean;
    dragHandlers: {
        onDragEnter: (e: React.DragEvent) => void;
        onDragOver: (e: React.DragEvent) => void;
        onDragLeave: (e: React.DragEvent) => void;
        onDrop: (e: React.DragEvent) => void;
    };
};
export declare const useFileInput: (onFileSelect: (files: File[]) => void, multiple?: boolean, accept?: string) => {
    inputRef: React.RefObject<HTMLInputElement>;
    inputProps: {
        ref: React.RefObject<HTMLInputElement>;
        type: "file";
        multiple: boolean | undefined;
        accept: string | undefined;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        style: {
            display: string;
        };
        "aria-hidden": boolean;
    };
    openFileDialog: () => void;
};
export interface UploadAreaProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick" | "onKeyDown"> {
    isDragOver?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
    onClick?: () => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    className?: string;
}
export declare const UploadArea: React.ForwardRefExoticComponent<UploadAreaProps & React.RefAttributes<HTMLDivElement>>;
export interface UploadContentProps {
    icon?: React.ReactNode;
    primaryText?: string;
    secondaryText?: string;
    className?: string;
}
export declare const UploadContent: React.FC<UploadContentProps>;
export interface FilePreviewProps {
    file: File;
    onRemove?: () => void;
    className?: string;
}
export declare const FilePreview: React.FC<FilePreviewProps>;
export declare const FileUpload: React.ForwardRefExoticComponent<BaseFileUploadProps & React.RefAttributes<HTMLDivElement>>;
export {};
//# sourceMappingURL=FileUpload.d.ts.map