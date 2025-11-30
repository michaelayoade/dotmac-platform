"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Alert: () => Alert,
  AlertDescription: () => AlertDescription,
  AlertDialog: () => AlertDialog,
  AlertDialogAction: () => AlertDialogAction,
  AlertDialogCancel: () => AlertDialogCancel,
  AlertDialogContent: () => AlertDialogContent,
  AlertDialogDescription: () => AlertDialogDescription,
  AlertDialogFooter: () => AlertDialogFooter,
  AlertDialogHeader: () => AlertDialogHeader,
  AlertDialogOverlay: () => AlertDialogOverlay,
  AlertDialogPortal: () => AlertDialogPortal,
  AlertDialogTitle: () => AlertDialogTitle,
  AlertDialogTrigger: () => AlertDialogTrigger,
  AlertTitle: () => AlertTitle,
  AsyncState: () => AsyncState,
  Avatar: () => Avatar,
  AvatarFallback: () => AvatarFallback,
  AvatarImage: () => AvatarImage,
  Badge: () => Badge,
  Breadcrumb: () => Breadcrumb,
  Button: () => Button,
  ButtonLoading: () => ButtonLoading,
  Calendar: () => Calendar,
  Card: () => Card,
  CardContent: () => CardContent,
  CardDescription: () => CardDescription,
  CardFooter: () => CardFooter,
  CardHeader: () => CardHeader,
  CardTitle: () => CardTitle,
  Checkbox: () => Checkbox,
  Combobox: () => Combobox,
  Command: () => Command,
  CommandDialog: () => CommandDialog,
  CommandEmpty: () => CommandEmpty,
  CommandGroup: () => CommandGroup,
  CommandInput: () => CommandInput,
  CommandItem: () => CommandItem,
  CommandList: () => CommandList,
  CommandSeparator: () => CommandSeparator,
  CommandShortcut: () => CommandShortcut,
  ConfirmDialog: () => ConfirmDialog,
  ConfirmDialogProvider: () => ConfirmDialogProvider,
  DataTable: () => DataTable,
  DataTableUtils: () => DataTableUtils,
  DatePicker: () => DatePicker,
  DateRangePicker: () => DateRangePicker,
  Dialog: () => Dialog,
  DialogClose: () => DialogClose,
  DialogContent: () => DialogContent,
  DialogDescription: () => DialogDescription,
  DialogFooter: () => DialogFooter,
  DialogHeader: () => DialogHeader,
  DialogOverlay: () => DialogOverlay,
  DialogPortal: () => DialogPortal,
  DialogTitle: () => DialogTitle,
  DialogTrigger: () => DialogTrigger,
  DropdownMenu: () => DropdownMenu,
  DropdownMenuCheckboxItem: () => DropdownMenuCheckboxItem,
  DropdownMenuContent: () => DropdownMenuContent,
  DropdownMenuGroup: () => DropdownMenuGroup,
  DropdownMenuItem: () => DropdownMenuItem,
  DropdownMenuLabel: () => DropdownMenuLabel,
  DropdownMenuPortal: () => DropdownMenuPortal,
  DropdownMenuRadioGroup: () => DropdownMenuRadioGroup,
  DropdownMenuRadioItem: () => DropdownMenuRadioItem,
  DropdownMenuSeparator: () => DropdownMenuSeparator,
  DropdownMenuShortcut: () => DropdownMenuShortcut,
  DropdownMenuSub: () => DropdownMenuSub,
  DropdownMenuSubContent: () => DropdownMenuSubContent,
  DropdownMenuSubTrigger: () => DropdownMenuSubTrigger,
  DropdownMenuTrigger: () => DropdownMenuTrigger,
  EmptyState: () => EmptyState,
  EnhancedDataTable: () => EnhancedDataTable,
  ErrorBoundaryFallback: () => ErrorBoundaryFallback,
  ErrorState: () => ErrorState,
  Form: () => Form,
  FormControl: () => FormControl,
  FormDescription: () => FormDescription,
  FormError: () => FormError,
  FormField: () => FormField,
  FormItem: () => FormItem,
  FormLabel: () => FormLabel,
  FormMessage: () => FormMessage,
  InlineLoader: () => InlineLoader,
  Input: () => Input,
  Label: () => Label2,
  LiveIndicator: () => LiveIndicator,
  LoadingCard: () => LoadingCard,
  LoadingGrid: () => LoadingGrid,
  LoadingOverlay: () => LoadingOverlay,
  LoadingSpinner: () => LoadingSpinner,
  LoadingState: () => LoadingState,
  LoadingTable: () => LoadingTable,
  MetricCardEnhanced: () => MetricCardEnhanced,
  MultiCombobox: () => MultiCombobox,
  PageHeader: () => PageHeader,
  Popover: () => Popover,
  PopoverAnchor: () => PopoverAnchor,
  PopoverContent: () => PopoverContent,
  PopoverTrigger: () => PopoverTrigger,
  PortalBadge: () => PortalBadge,
  PortalBadgeCompact: () => PortalBadgeCompact,
  PortalButton: () => PortalButton,
  PortalCard: () => PortalCard,
  PortalCardContent: () => PortalCardContent,
  PortalCardDescription: () => PortalCardDescription,
  PortalCardFooter: () => PortalCardFooter,
  PortalCardHeader: () => PortalCardHeader,
  PortalCardTitle: () => PortalCardTitle,
  PortalIndicatorDot: () => PortalIndicatorDot,
  PortalThemeProvider: () => PortalThemeProvider,
  PortalUserTypeBadge: () => PortalUserTypeBadge,
  Progress: () => Progress,
  ProgressIndicator: () => ProgressIndicator,
  RadioGroup: () => RadioGroup2,
  RadioGroupItem: () => RadioGroupItem,
  ScrollArea: () => ScrollArea,
  ScrollBar: () => ScrollBar,
  Select: () => Select,
  SelectContent: () => SelectContent,
  SelectGroup: () => SelectGroup,
  SelectItem: () => SelectItem,
  SelectLabel: () => SelectLabel,
  SelectScrollDownButton: () => SelectScrollDownButton,
  SelectScrollUpButton: () => SelectScrollUpButton,
  SelectSeparator: () => SelectSeparator,
  SelectTrigger: () => SelectTrigger,
  SelectValue: () => SelectValue,
  Separator: () => Separator3,
  Sheet: () => Sheet,
  SheetClose: () => SheetClose,
  SheetContent: () => SheetContent,
  SheetDescription: () => SheetDescription,
  SheetFooter: () => SheetFooter,
  SheetHeader: () => SheetHeader,
  SheetOverlay: () => SheetOverlay,
  SheetPortal: () => SheetPortal,
  SheetTitle: () => SheetTitle,
  SheetTrigger: () => SheetTrigger,
  Skeleton: () => Skeleton,
  SkeletonCard: () => SkeletonCard,
  SkeletonMetricCard: () => SkeletonMetricCard,
  SkeletonTable: () => SkeletonTable,
  SkipLink: () => SkipLink,
  StatusBadge: () => StatusBadge,
  Switch: () => Switch,
  Table: () => Table,
  TableBody: () => TableBody,
  TableCaption: () => TableCaption,
  TableCell: () => TableCell,
  TableFooter: () => TableFooter,
  TableHead: () => TableHead,
  TableHeader: () => TableHeader,
  TablePagination: () => TablePagination,
  TableRow: () => TableRow,
  Tabs: () => Tabs,
  TabsContent: () => TabsContent,
  TabsList: () => TabsList,
  TabsTrigger: () => TabsTrigger,
  Textarea: () => Textarea,
  ThemeToggle: () => ThemeToggle,
  ThemeToggleButton: () => ThemeToggleButton,
  ToastContainer: () => ToastContainer,
  Tooltip: () => Tooltip,
  TooltipContent: () => TooltipContent,
  TooltipProvider: () => TooltipProvider,
  TooltipTrigger: () => TooltipTrigger,
  alertVariants: () => alertVariants,
  badgeVariants: () => badgeVariants,
  buttonVariants: () => buttonVariants,
  cardVariants: () => cardVariants,
  cn: () => cn,
  colorTokens: () => colorTokens,
  createSortableHeader: () => createSortableHeader,
  detectPortalFromRoute: () => detectPortalFromRoute,
  duration: () => duration,
  easing: () => easing,
  fontFamily: () => fontFamily,
  fontWeight: () => fontWeight,
  generatePortalCSSVariables: () => generatePortalCSSVariables,
  getPortalColors: () => getPortalColors,
  getPortalConfig: () => getPortalConfig,
  getPortalThemeClass: () => getPortalThemeClass,
  getStatusVariant: () => getStatusVariant,
  keyframes: () => keyframes,
  portalAnimations: () => portalAnimations,
  portalButtonVariants: () => portalButtonVariants,
  portalFontSizes: () => portalFontSizes,
  portalMetadata: () => portalMetadata,
  portalRoutes: () => portalRoutes,
  portalSpacing: () => portalSpacing,
  spacing: () => spacing,
  toast: () => toast,
  touchTargets: () => touchTargets,
  useConfirmDialog: () => useConfirmDialog,
  useFormField: () => useFormField,
  usePagination: () => usePagination,
  usePortalTheme: () => usePortalTheme,
  useToast: () => useToast
});
module.exports = __toCommonJS(index_exports);

// src/components/EnhancedDataTable.tsx
var import_react_table = require("@tanstack/react-table");
var import_lucide_react2 = require("lucide-react");
var React7 = __toESM(require("react"));

// src/lib/utils.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
var portalConfigs = {
  admin: {
    primary: "#3b82f6",
    secondary: "#1e40af",
    accent: "#60a5fa",
    background: "#f8fafc",
    text: "#1e293b"
  },
  customer: {
    primary: "#10b981",
    secondary: "#059669",
    accent: "#34d399",
    background: "#f0fdf4",
    text: "#064e3b"
  },
  reseller: {
    primary: "#8b5cf6",
    secondary: "#6d28d9",
    accent: "#a78bfa",
    background: "#faf5ff",
    text: "#4c1d95"
  },
  technician: {
    primary: "#f59e0b",
    secondary: "#d97706",
    accent: "#fbbf24",
    background: "#fffbeb",
    text: "#78350f"
  },
  management: {
    primary: "#6366f1",
    secondary: "#4f46e5",
    accent: "#818cf8",
    background: "#eef2ff",
    text: "#312e81"
  }
};
function getPortalConfig(portal) {
  return portalConfigs[portal];
}
function generatePortalCSSVariables(portal) {
  const config = getPortalConfig(portal);
  return {
    "--portal-primary": config.primary,
    "--portal-secondary": config.secondary,
    "--portal-accent": config.accent,
    "--portal-background": config.background,
    "--portal-text": config.text
  };
}
function getPortalThemeClass(portal) {
  return `portal-theme-${portal}`;
}
function cn(...classNames) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(classNames));
}

// src/components/button.tsx
var import_class_variance_authority = require("class-variance-authority");
var React = __toESM(require("react"));
var import_jsx_runtime = require("react/jsx-runtime");
var buttonVariants = (0, import_class_variance_authority.cva)(
  // Base styles - applied to all buttons
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2 min-h-[44px]",
        sm: "h-9 rounded-md px-3 min-h-[36px]",
        lg: "h-11 rounded-md px-8 min-h-[44px]",
        icon: "h-10 w-10 min-h-[44px] min-w-[44px]"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Button = React.forwardRef(
  ({ className, variant, size, children, type = "button", ...props }, ref) => {
    if (process.env["NODE_ENV"] !== "production") {
      const hasTextContent = typeof children === "string" || React.Children.count(children) > 0 && React.Children.toArray(children).some(
        (child) => typeof child === "string" && child.trim().length > 0
      );
      const hasAriaLabel = props["aria-label"] || props["aria-labelledby"];
      const hasTitle = props.title;
      if (!hasTextContent && !hasAriaLabel && !hasTitle) {
        console.warn(
          "Button: Buttons should have accessible labels. Add text content, aria-label, or aria-labelledby.",
          props
        );
      }
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "button",
      {
        type,
        className: cn(buttonVariants({ variant, size }), className),
        ref,
        ...props,
        children
      }
    );
  }
);
Button.displayName = "Button";

// src/components/checkbox.tsx
var React2 = __toESM(require("react"));
var import_jsx_runtime2 = require("react/jsx-runtime");
var Checkbox = React2.forwardRef(
  ({ className = "", ...props }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "input",
      {
        type: "checkbox",
        className: `h-4 w-4 rounded border-border text-sky-500 focus:ring-sky-500 ${className}`,
        ref,
        ...props
      }
    );
  }
);
Checkbox.displayName = "Checkbox";

// src/components/confirm-dialog-provider.tsx
var import_react = require("react");

// src/components/alert-dialog.tsx
var AlertDialogPrimitive = __toESM(require("@radix-ui/react-alert-dialog"));
var React3 = __toESM(require("react"));
var import_jsx_runtime3 = require("react/jsx-runtime");
var AlertDialog = AlertDialogPrimitive.Root;
var AlertDialogTrigger = AlertDialogPrimitive.Trigger;
var AlertDialogPortal = AlertDialogPrimitive.Portal;
var AlertDialogOverlay = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
  AlertDialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
var AlertDialogContent = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(AlertDialogOverlay, {}),
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    AlertDialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
  AlertDialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
var AlertDialogDescription = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
  AlertDialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
var AlertDialogAction = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(AlertDialogPrimitive.Action, { ref, className: cn(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
var AlertDialogCancel = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
  AlertDialogPrimitive.Cancel,
  {
    ref,
    className: cn(buttonVariants({ variant: "outline" }), "mt-2 border-input sm:mt-0", className),
    ...props
  }
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

// src/components/confirm-dialog.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  isLoading = false
}) {
  const handleConfirm = async () => {
    await onConfirm();
  };
  const handleCancel = () => {
    onCancel?.();
  };
  const buttonVariants2 = {
    default: "",
    destructive: "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800",
    warning: "bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AlertDialog, { open, onOpenChange, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(AlertDialogContent, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(AlertDialogHeader, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AlertDialogTitle, { children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AlertDialogDescription, { children: description })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(AlertDialogFooter, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AlertDialogCancel, { onClick: handleCancel, disabled: isLoading, children: cancelText }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        AlertDialogAction,
        {
          onClick: handleConfirm,
          disabled: isLoading,
          className: cn(buttonVariants2[variant], isLoading && "opacity-50 cursor-not-allowed"),
          children: isLoading ? "Processing..." : confirmText
        }
      )
    ] })
  ] }) });
}

// src/components/confirm-dialog-provider.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var ConfirmDialogContext = (0, import_react.createContext)(void 0);
function ConfirmDialogProvider({ children }) {
  const [open, setOpen] = (0, import_react.useState)(false);
  const [options, setOptions] = (0, import_react.useState)(null);
  const resolverRef = (0, import_react.useRef)();
  const closingRef = (0, import_react.useRef)(false);
  const triggerRef = (0, import_react.useRef)(null);
  const triggerAriaHidden = (0, import_react.useRef)(null);
  const confirm = (0, import_react.useCallback)((opts) => {
    return new Promise((resolve) => {
      if (typeof document !== "undefined") {
        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLElement) {
          triggerRef.current = activeElement;
          triggerAriaHidden.current = activeElement.getAttribute("aria-hidden");
          activeElement.setAttribute("aria-hidden", "true");
        } else {
          triggerRef.current = null;
          triggerAriaHidden.current = null;
        }
      }
      resolverRef.current = resolve;
      closingRef.current = false;
      setOptions(opts);
      setOpen(true);
    });
  }, []);
  const restoreTrigger = (0, import_react.useCallback)(() => {
    if (triggerRef.current) {
      if (triggerAriaHidden.current === null) {
        triggerRef.current.removeAttribute("aria-hidden");
      } else {
        triggerRef.current.setAttribute("aria-hidden", triggerAriaHidden.current);
      }
      triggerRef.current = null;
      triggerAriaHidden.current = null;
    }
  }, []);
  const closeDialog = (0, import_react.useCallback)(
    (result) => {
      closingRef.current = true;
      resolverRef.current?.(result);
      resolverRef.current = void 0;
      setOpen(false);
      setOptions(null);
      restoreTrigger();
    },
    [restoreTrigger]
  );
  const handleConfirm = (0, import_react.useCallback)(() => {
    closeDialog(true);
  }, [closeDialog]);
  const handleCancel = (0, import_react.useCallback)(() => {
    closeDialog(false);
  }, [closeDialog]);
  const handleDialogOpenChange = (0, import_react.useCallback)(
    (nextOpen) => {
      if (nextOpen) {
        setOpen(true);
        return;
      }
      if (closingRef.current) {
        closingRef.current = false;
        return;
      }
      closeDialog(false);
    },
    [closeDialog]
  );
  const value = (0, import_react.useMemo)(
    () => ({
      confirm
    }),
    [confirm]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(ConfirmDialogContext.Provider, { value, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "div",
      {
        "aria-hidden": open ? "true" : void 0,
        "data-aria-hidden": open ? "true" : void 0,
        style: open ? { pointerEvents: "none" } : { display: "contents" },
        children
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      ConfirmDialog,
      {
        open,
        onOpenChange: handleDialogOpenChange,
        title: options?.title ?? "Confirm action",
        description: options?.description ?? "Are you sure you want to continue?",
        confirmText: options?.confirmText ?? "Confirm",
        cancelText: options?.cancelText ?? "Cancel",
        onConfirm: handleConfirm,
        onCancel: handleCancel,
        variant: options?.variant ?? "default",
        isLoading: options?.isLoading ?? false
      }
    )
  ] });
}
function useConfirmDialog() {
  const context = (0, import_react.useContext)(ConfirmDialogContext);
  if (!context) {
    throw new Error("useConfirmDialog must be used within a ConfirmDialogProvider");
  }
  return context.confirm;
}

// src/components/dropdown-menu.tsx
var DropdownMenuPrimitive = __toESM(require("@radix-ui/react-dropdown-menu"));
var import_lucide_react = require("lucide-react");
var React4 = __toESM(require("react"));
var import_jsx_runtime6 = require("react/jsx-runtime");
var DropdownMenu = ({
  modal = false,
  ...props
}) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DropdownMenuPrimitive.Root, { modal, ...props });
DropdownMenu.displayName = "DropdownMenu";
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuGroup = DropdownMenuPrimitive.Group;
var DropdownMenuPortal = DropdownMenuPrimitive.Portal;
var DropdownMenuSub = DropdownMenuPrimitive.Sub;
var DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
var DropdownMenuSubTrigger = React4.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react.ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = "SubTrigger";
var DropdownMenuSubContent = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = "SubContent";
var DropdownMenuContent = React4.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = "Content";
var DropdownMenuItem = React4.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = "Item";
var DropdownMenuCheckboxItem = React4.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked: checked ?? false,
    ...props,
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react.Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = "CheckboxItem";
var DropdownMenuRadioItem = React4.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react.Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = "RadioItem";
var DropdownMenuLabel = React4.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = "Label";
var DropdownMenuSeparator = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = "Separator";
var DropdownMenuShortcut = ({ className, ...props }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: cn("ml-auto text-xs tracking-widest opacity-60", className), ...props });
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

// src/components/input.tsx
var React5 = __toESM(require("react"));
var import_jsx_runtime7 = require("react/jsx-runtime");
var Input = React5.forwardRef(
  ({ className = "", type, error, ...props }, ref) => {
    const hasError = !!error;
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "input",
      {
        type,
        className: `flex h-10 w-full rounded-md border ${hasError ? "border-destructive" : "border-border"} bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation ${className}`,
        ref,
        "aria-invalid": hasError,
        ...props
      }
    );
  }
);
Input.displayName = "Input";

// src/components/table.tsx
var React6 = __toESM(require("react"));
var import_jsx_runtime8 = require("react/jsx-runtime");
var Table = React6.forwardRef(
  ({ className = "", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("table", { ref, className: `w-full caption-bottom text-sm ${className}`, ...props }) })
);
Table.displayName = "Table";
var TableHeader = React6.forwardRef(({ className = "", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("thead", { ref, className: `border-b border-border ${className}`, ...props }));
TableHeader.displayName = "TableHeader";
var TableBody = React6.forwardRef(({ className = "", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("tbody", { ref, className: `${className}`, ...props }));
TableBody.displayName = "TableBody";
var TableFooter = React6.forwardRef(({ className = "", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("tfoot", { ref, className: `border-t border-border ${className}`, ...props }));
TableFooter.displayName = "TableFooter";
var TableRow = React6.forwardRef(
  ({ className = "", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    "tr",
    {
      ref,
      className: `border-b border-border transition-colors hover:bg-muted/50 ${className}`,
      ...props
    }
  )
);
TableRow.displayName = "TableRow";
var TableHead = React6.forwardRef(({ className = "", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
  "th",
  {
    ref,
    className: `h-12 px-4 text-left align-middle font-medium text-muted-foreground ${className}`,
    ...props
  }
));
TableHead.displayName = "TableHead";
var TableCell = React6.forwardRef(({ className = "", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("td", { ref, className: `p-4 align-middle ${className}`, ...props }));
TableCell.displayName = "TableCell";
var TableCaption = React6.forwardRef(({ className = "", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("caption", { ref, className: `mt-4 text-sm text-muted-foreground ${className}`, ...props }));
TableCaption.displayName = "TableCaption";

// src/components/EnhancedDataTable.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
var DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100];
var EMPTY_FILTERS = [];
var EMPTY_QUICK_FILTERS = [];
var EMPTY_BULK_ACTIONS = [];
var DEFAULT_CARD_BREAKPOINT = 768;
var DEFAULT_TRANSLATIONS = {
  searchPlaceholder: "Search...",
  filtersLabel: "Filters",
  clearFilters: "Clear filters",
  quickFiltersClear: "Clear filters",
  exportLabel: "Export",
  columnsLabel: "Columns",
  bulkActionsLabel: "Bulk Actions",
  selectedCount: (selected, total) => `${selected} of ${total} row(s) selected`,
  totalCount: (total) => `${total} total row(s)`,
  loadingLabel: "Loading...",
  rowsPerPage: "Rows per page",
  pageOf: (page, pageCount) => `Page ${page} of ${pageCount}`,
  previous: "Previous",
  next: "Next"
};
function exportToCSV(data, columns, filename) {
  if (data.length === 0) return;
  const header = columns.join(",");
  const rows = data.map(
    (row) => columns.map((col) => {
      const value = row[col];
      const stringValue = String(value ?? "");
      return stringValue.includes(",") ? `"${stringValue}"` : stringValue;
    }).join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function getSelectionColumn() {
  return {
    id: "select",
    header: ({ table }) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      Checkbox,
      {
        checked: table.getIsAllPageRowsSelected(),
        onChange: (e) => table.toggleAllPageRowsSelected(e.target.checked),
        "aria-label": "Select all",
        className: "translate-y-[2px]"
      }
    ),
    cell: ({ row }) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      Checkbox,
      {
        checked: row.getIsSelected(),
        onChange: (e) => row.toggleSelected(e.target.checked),
        "aria-label": "Select row",
        className: "translate-y-[2px]"
      }
    ),
    enableSorting: false,
    enableHiding: false
  };
}
function EnhancedDataTable({
  columns,
  data,
  searchable = true,
  searchPlaceholder = "Search...",
  searchColumn,
  searchKey,
  searchConfig,
  paginated = true,
  pagination,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  defaultPageSize = 10,
  selectable = false,
  bulkActions = EMPTY_BULK_ACTIONS,
  filterable = false,
  filters = EMPTY_FILTERS,
  quickFilters = EMPTY_QUICK_FILTERS,
  exportable = false,
  exportFilename = "data",
  exportColumns,
  columnVisibility = true,
  emptyMessage = "No results.",
  className,
  isLoading = false,
  onRowClick,
  getRowId,
  toolbarActions,
  hideToolbar,
  errorMessage,
  error,
  translations,
  enableResponsiveCards = false,
  renderMobileCard,
  responsiveCardBreakpoint = DEFAULT_CARD_BREAKPOINT
}) {
  const copy = {
    ...DEFAULT_TRANSLATIONS,
    ...searchPlaceholder ? { searchPlaceholder } : {},
    ...translations
  };
  const [sorting, setSorting] = React7.useState([]);
  const [columnFilters, setColumnFilters] = React7.useState([]);
  const [columnVisibilityState, setColumnVisibilityState] = React7.useState({});
  const [rowSelection, setRowSelection] = React7.useState({});
  const [showFilters, setShowFilters] = React7.useState(false);
  const [globalFilter, setGlobalFilter] = React7.useState("");
  const [activeQuickFilters, setActiveQuickFilters] = React7.useState(
    () => quickFilters.filter((filter) => filter.defaultActive).map((filter) => filter.label)
  );
  const [isMobileCards, setIsMobileCards] = React7.useState(false);
  const confirmDialog = useConfirmDialog();
  React7.useEffect(() => {
    setActiveQuickFilters((previous) => {
      const available = new Set(quickFilters.map((filter) => filter.label));
      const cleaned = previous.filter((label) => available.has(label));
      if (cleaned.length > 0 || quickFilters.every((filter) => !filter.defaultActive)) {
        return cleaned;
      }
      return quickFilters.filter((filter) => filter.defaultActive).map((filter) => filter.label);
    });
  }, [quickFilters]);
  React7.useEffect(() => {
    if (!enableResponsiveCards) {
      setIsMobileCards(false);
      return;
    }
    const mediaQuery = window.matchMedia(`(max-width: ${responsiveCardBreakpoint}px)`);
    const updateMatch = () => setIsMobileCards(mediaQuery.matches);
    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, [enableResponsiveCards, responsiveCardBreakpoint]);
  const searchFields = React7.useMemo(() => {
    if (searchConfig?.searchableFields?.length) {
      return searchConfig.searchableFields.map(String);
    }
    if (searchKey) return [searchKey];
    if (searchColumn) return [searchColumn];
    return [];
  }, [searchConfig, searchKey, searchColumn]);
  const enableSearch = searchable && searchFields.length > 0;
  const searchInputPlaceholder = searchConfig?.placeholder ?? copy.searchPlaceholder;
  const isPaginated = pagination ?? paginated;
  const resolvedErrorMessage = errorMessage ?? error;
  const filteredData = React7.useMemo(() => {
    if (quickFilters.length === 0 || activeQuickFilters.length === 0) {
      return data;
    }
    const activeSet = new Set(activeQuickFilters);
    return data.filter(
      (item) => Array.from(activeSet).every((label) => {
        const definition = quickFilters.find((filter) => filter.label === label);
        return definition ? definition.filter(item) : true;
      })
    );
  }, [data, quickFilters, activeQuickFilters]);
  const tableColumns = React7.useMemo(() => {
    if (selectable) {
      return [getSelectionColumn(), ...columns];
    }
    return columns;
  }, [columns, selectable]);
  const globalFilterFn = React7.useCallback(
    (row, _columnId, filterValue) => {
      const searchTerm = String(filterValue ?? "").trim().toLowerCase();
      if (!searchTerm) return true;
      const fields = searchFields.length > 0 ? searchFields : [];
      if (fields.length === 0) {
        return row.getVisibleCells().some(
          (cell) => String(cell.getValue() ?? "").toLowerCase().includes(searchTerm)
        );
      }
      return fields.some((field) => {
        const value = row.original[field];
        if (value === null || value === void 0) return false;
        return String(value).toLowerCase().includes(searchTerm);
      });
    },
    [searchFields]
  );
  const tableOptions = {
    data: filteredData,
    columns: tableColumns,
    getCoreRowModel: (0, import_react_table.getCoreRowModel)(),
    getSortedRowModel: (0, import_react_table.getSortedRowModel)(),
    getFilteredRowModel: (0, import_react_table.getFilteredRowModel)(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibilityState,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility: columnVisibilityState,
      rowSelection,
      globalFilter
    }
  };
  if (enableSearch) {
    tableOptions.globalFilterFn = globalFilterFn;
  }
  if (getRowId) {
    tableOptions.getRowId = (originalRow, index, parent) => String(getRowId(originalRow, index, parent));
  }
  if (isPaginated) {
    tableOptions.getPaginationRowModel = (0, import_react_table.getPaginationRowModel)();
    tableOptions.initialState = {
      ...tableOptions.initialState ?? {},
      pagination: {
        pageSize: defaultPageSize
      }
    };
  }
  const table = (0, import_react_table.useReactTable)(tableOptions);
  React7.useEffect(() => {
    if (isPaginated) {
      table.setPageIndex(0);
    }
  }, [filteredData, table, isPaginated]);
  const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
  const handleExport = React7.useCallback(() => {
    const dataToExport = selectedRows.length > 0 ? selectedRows : filteredData;
    const columnsToExport = exportColumns || Object.keys(filteredData[0] || {});
    exportToCSV(dataToExport, columnsToExport, exportFilename);
  }, [filteredData, selectedRows, exportColumns, exportFilename]);
  const handleBulkAction = React7.useCallback(
    async (action) => {
      if (action.confirmMessage) {
        const confirmed = await confirmDialog({
          title: action.confirmTitle ?? "Confirm action",
          description: action.confirmMessage,
          confirmText: action.confirmConfirmText ?? action.label,
          variant: action.confirmVariant ?? (action.variant === "destructive" ? "destructive" : "default")
        });
        if (!confirmed) {
          return;
        }
      }
      await action.action(selectedRows);
      table.resetRowSelection();
    },
    [confirmDialog, selectedRows, table]
  );
  const toggleQuickFilter = React7.useCallback(
    (label) => {
      setActiveQuickFilters(
        (previous) => previous.includes(label) ? previous.filter((value) => value !== label) : [...previous, label]
      );
      if (isPaginated) {
        table.setPageIndex(0);
      }
    },
    [table, isPaginated]
  );
  const hasToolbarContent = enableSearch || filterable && filters.length > 0 || quickFilters.length > 0 || !!toolbarActions || exportable || columnVisibility || selectable && bulkActions.length > 0;
  const showToolbar = !hideToolbar && hasToolbarContent;
  const showCardView = enableResponsiveCards && typeof renderMobileCard === "function" && isMobileCards;
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: cn("space-y-4", className), children: [
    resolvedErrorMessage && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive", children: resolvedErrorMessage }),
    showToolbar && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center gap-2 flex-1", children: [
          enableSearch && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            Input,
            {
              placeholder: searchInputPlaceholder,
              value: globalFilter,
              onChange: (event) => setGlobalFilter(event.target.value),
              className: "max-w-sm",
              "aria-label": copy.searchPlaceholder
            }
          ),
          filterable && filters.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
            Button,
            {
              variant: showFilters ? "default" : "outline",
              size: "sm",
              onClick: () => setShowFilters(!showFilters),
              "aria-label": copy.filtersLabel,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react2.Filter, { className: "h-4 w-4 mr-2" }),
                copy.filtersLabel
              ]
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center gap-2", children: [
          toolbarActions,
          exportable && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: handleExport,
              disabled: filteredData.length === 0,
              "aria-label": copy.exportLabel,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react2.Download, { className: "h-4 w-4 mr-2" }),
                copy.exportLabel
              ]
            }
          ),
          columnVisibility && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(DropdownMenu, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Button, { variant: "outline", size: "sm", "aria-label": copy.columnsLabel, children: copy.columnsLabel }) }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DropdownMenuContent, { align: "end", className: "bg-card", children: table.getAllColumns().filter((column) => column.getCanHide()).map((column) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              DropdownMenuCheckboxItem,
              {
                className: "capitalize",
                checked: column.getIsVisible(),
                onCheckedChange: (value) => column.toggleVisibility(!!value),
                children: column.id
              },
              column.id
            )) })
          ] }),
          selectable && bulkActions.length > 0 && selectedRows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(DropdownMenu, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(Button, { variant: "outline", size: "sm", children: [
              "Actions (",
              selectedRows.length,
              ")"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(DropdownMenuContent, { align: "end", className: "bg-card", children: [
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DropdownMenuLabel, { children: copy.bulkActionsLabel }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DropdownMenuSeparator, {}),
              bulkActions.map((action, index) => {
                const Icon2 = action.icon;
                const isDisabled = action.disabled?.(selectedRows) ?? false;
                return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
                  DropdownMenuItem,
                  {
                    onClick: () => handleBulkAction(action),
                    disabled: isDisabled,
                    className: cn(
                      action.variant === "destructive" && "text-destructive focus:text-destructive"
                    ),
                    children: [
                      Icon2 && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Icon2, { className: "h-4 w-4 mr-2" }),
                      action.label
                    ]
                  },
                  index
                );
              })
            ] })
          ] })
        ] })
      ] }),
      quickFilters.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex flex-wrap items-center gap-2", children: [
        quickFilters.map((filter) => {
          const isActive = activeQuickFilters.includes(filter.label);
          const Icon2 = filter.icon;
          return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
            Button,
            {
              size: "sm",
              variant: isActive ? "default" : "outline",
              onClick: () => toggleQuickFilter(filter.label),
              className: "gap-2",
              children: [
                Icon2 && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Icon2, { className: "h-4 w-4" }),
                filter.label
              ]
            },
            filter.label
          );
        }),
        activeQuickFilters.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Button, { size: "sm", variant: "ghost", onClick: () => setActiveQuickFilters([]), children: copy.quickFiltersClear })
      ] }),
      filterable && showFilters && filters.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center gap-4 p-4 border border-border rounded-md bg-muted/50", children: [
        filters.map((filter) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("label", { className: "text-sm font-medium text-muted-foreground", children: filter.label }),
          filter.type === "select" && filter.options ? /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
            "select",
            {
              value: table.getColumn(filter.column)?.getFilterValue() ?? "",
              onChange: (e) => table.getColumn(filter.column)?.setFilterValue(e.target.value || void 0),
              className: "h-8 rounded-md border border-input bg-card px-3 text-sm",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("option", { value: "", children: "All" }),
                filter.options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("option", { value: option.value, children: option.label }, option.value))
              ]
            }
          ) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            Input,
            {
              type: filter.type,
              value: table.getColumn(filter.column)?.getFilterValue() ?? "",
              onChange: (e) => table.getColumn(filter.column)?.setFilterValue(e.target.value || void 0),
              className: "h-8 w-40"
            }
          )
        ] }, filter.column)),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => table.resetColumnFilters(),
            className: "mt-6",
            children: copy.clearFilters
          }
        )
      ] })
    ] }),
    showCardView && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "space-y-3 md:hidden", children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "rounded-md border border-border bg-card px-4 py-6 text-sm text-muted-foreground", children: copy.loadingLabel }) : table.getRowModel().rows?.length ? table.getRowModel().rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      "div",
      {
        role: onRowClick ? "button" : void 0,
        tabIndex: onRowClick ? 0 : void 0,
        className: cn(
          "rounded-md border border-border bg-card p-4",
          onRowClick && "cursor-pointer hover:bg-muted/50"
        ),
        onClick: (event) => {
          if (event.target.closest('[role="checkbox"]') || event.target.closest("button")) {
            return;
          }
          onRowClick?.(row.original);
        },
        onKeyDown: (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onRowClick?.(row.original);
          }
        },
        children: renderMobileCard?.(row)
      },
      row.id
    )) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "rounded-md border border-border bg-card px-4 py-6 text-sm text-muted-foreground text-center", children: emptyMessage }) }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      "div",
      {
        className: cn("rounded-md border border-border bg-card", showCardView && "hidden md:block"),
        children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(Table, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(TableHeader, { children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(TableRow, { children: headerGroup.headers.map((header) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(TableHead, { children: header.isPlaceholder ? null : (0, import_react_table.flexRender)(header.column.columnDef.header, header.getContext()) }, header.id)) }, headerGroup.id)) }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(TableBody, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(TableCell, { colSpan: tableColumns.length, className: "h-24 text-center", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "text-muted-foreground", children: copy.loadingLabel }) }) }) : table.getRowModel().rows?.length ? table.getRowModel().rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            TableRow,
            {
              "data-state": row.getIsSelected() && "selected",
              className: cn(onRowClick && "cursor-pointer hover:bg-muted/50"),
              onClick: (event) => {
                if (event.target.closest('[role="checkbox"]') || event.target.closest("button")) {
                  return;
                }
                onRowClick?.(row.original);
              },
              children: row.getVisibleCells().map((cell) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(TableCell, { children: (0, import_react_table.flexRender)(cell.column.columnDef.cell, cell.getContext()) }, cell.id))
            },
            row.id
          )) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(TableCell, { colSpan: tableColumns.length, className: "h-24 text-center", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "text-muted-foreground", children: emptyMessage }) }) }) })
        ] })
      }
    ),
    isPaginated && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "text-sm text-muted-foreground", children: table.getFilteredSelectedRowModel().rows.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: copy.selectedCount(
        table.getFilteredSelectedRowModel().rows.length,
        table.getFilteredRowModel().rows.length
      ) }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: copy.totalCount(table.getFilteredRowModel().rows.length) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center space-x-6 lg:space-x-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "text-sm font-medium text-foreground", children: copy.rowsPerPage }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            "select",
            {
              value: table.getState().pagination.pageSize,
              onChange: (event) => table.setPageSize(Number(event.target.value)),
              className: "h-8 w-[70px] rounded-md border border-input bg-card px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
              "aria-label": "Select page size",
              children: pageSizeOptions.map((pageSize) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("option", { value: pageSize, children: pageSize }, pageSize))
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "flex w-[100px] items-center justify-center text-sm font-medium text-foreground", children: copy.pageOf(table.getState().pagination.pageIndex + 1, table.getPageCount()) }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => table.previousPage(),
              disabled: !table.getCanPreviousPage(),
              "aria-label": copy.previous,
              children: copy.previous
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => table.nextPage(),
              disabled: !table.getCanNextPage(),
              "aria-label": copy.next,
              children: copy.next
            }
          )
        ] })
      ] })
    ] })
  ] });
}
var DataTableUtils = {
  exportToCSV
};

// src/components/alert.tsx
var import_class_variance_authority2 = require("class-variance-authority");
var React8 = __toESM(require("react"));
var import_jsx_runtime10 = require("react/jsx-runtime");
var alertVariants = (0, import_class_variance_authority2.cva)(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success: "border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",
        warning: "border-yellow-500/50 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400",
        info: "border-blue-500/50 text-blue-700 dark:text-blue-400 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
var Alert = React8.forwardRef(
  ({ className, variant, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { ref, role: "alert", className: cn(alertVariants({ variant }), className), ...props })
);
Alert.displayName = "Alert";
var AlertTitle = React8.forwardRef(
  ({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
    "h5",
    {
      ref,
      className: cn("mb-1 font-medium leading-none tracking-tight", className),
      ...props,
      children
    }
  )
);
AlertTitle.displayName = "AlertTitle";
var AlertDescription = React8.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { ref, className: cn("text-sm [&_p]:leading-relaxed", className), ...props }));
AlertDescription.displayName = "AlertDescription";

// src/components/avatar.tsx
var React9 = __toESM(require("react"));
var import_jsx_runtime11 = require("react/jsx-runtime");
var Avatar = React9.forwardRef(
  ({ className = "", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    "div",
    {
      ref,
      className: `relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`,
      ...props
    }
  )
);
Avatar.displayName = "Avatar";
var AvatarImage = React9.forwardRef(
  ({ className = "", alt = "", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("img", { ref, className: `aspect-square h-full w-full ${className}`, alt, ...props })
);
AvatarImage.displayName = "AvatarImage";
var AvatarFallback = React9.forwardRef(
  ({ className = "", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    "div",
    {
      ref,
      className: `flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`,
      ...props
    }
  )
);
AvatarFallback.displayName = "AvatarFallback";

// src/components/badge.tsx
var import_class_variance_authority3 = require("class-variance-authority");
var import_jsx_runtime12 = require("react/jsx-runtime");
var badgeVariants = (0, import_class_variance_authority3.cva)(
  // Base styles - applied to all badges
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        info: "border-transparent bg-blue-500 text-white hover:bg-blue-600"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: cn(badgeVariants({ variant }), className), ...props });
}

// src/components/breadcrumb.tsx
var import_lucide_react3 = require("lucide-react");
var import_jsx_runtime13 = require("react/jsx-runtime");
function Breadcrumb({ items }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("nav", { "aria-label": "Breadcrumb", className: "mb-4", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("ol", { className: "flex items-center space-x-2 text-sm", children: items.map((item, index) => {
    const isLast = index === items.length - 1;
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("li", { className: "flex items-center", children: [
      index > 0 && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react3.ChevronRight, { className: "mx-2 h-4 w-4 text-muted-foreground", "aria-hidden": "true" }),
      isLast || !item.href ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "text-muted-foreground", "aria-current": isLast ? "page" : void 0, children: item.label }) : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
        "a",
        {
          href: item.href,
          className: "text-muted-foreground transition-colors hover:text-foreground",
          children: item.label
        }
      )
    ] }, index);
  }) }) });
}

// src/components/card.tsx
var import_class_variance_authority4 = require("class-variance-authority");
var React10 = __toESM(require("react"));
var import_jsx_runtime14 = require("react/jsx-runtime");
var cardVariants = (0, import_class_variance_authority4.cva)("rounded-lg border transition-colors", {
  variants: {
    variant: {
      default: "border-border bg-card text-card-foreground",
      elevated: "border-border bg-card text-card-foreground shadow-lg",
      outline: "border-2 border-border bg-transparent",
      ghost: "border-transparent bg-transparent"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});
var Card = React10.forwardRef(
  ({ className, variant, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { ref, className: cn(cardVariants({ variant }), className), ...props })
);
Card.displayName = "Card";
var CardHeader = React10.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
var CardTitle = React10.forwardRef(
  ({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    "h3",
    {
      ref,
      className: cn("text-2xl font-semibold leading-none tracking-tight", className),
      ...props,
      children
    }
  )
);
CardTitle.displayName = "CardTitle";
var CardDescription = React10.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { ref, className: cn("text-sm text-muted-foreground", className), ...props }));
CardDescription.displayName = "CardDescription";
var CardContent = React10.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
var CardFooter = React10.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";

// src/components/command.tsx
var import_react_icons = require("@radix-ui/react-icons");
var import_cmdk = require("cmdk");
var React12 = __toESM(require("react"));

// src/components/dialog.tsx
var DialogPrimitive = __toESM(require("@radix-ui/react-dialog"));
var import_lucide_react4 = require("lucide-react");
var React11 = __toESM(require("react"));
var import_jsx_runtime15 = require("react/jsx-runtime");
var Dialog = DialogPrimitive.Root;
var DialogTrigger = DialogPrimitive.Trigger;
var DialogPortal = DialogPrimitive.Portal;
var DialogClose = DialogPrimitive.Close;
var DialogOverlay = React11.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
var DialogContent = React11.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(DialogPortal, { children: [
  /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DialogOverlay, {}),
  /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_lucide_react4.X, { className: "h-4 w-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
var DialogTitle = React11.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
var DialogDescription = React11.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// src/components/command.tsx
var import_jsx_runtime16 = require("react/jsx-runtime");
var Command = React12.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
  import_cmdk.Command,
  {
    ref,
    className: cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    ),
    ...props
  }
));
Command.displayName = "Command";
var CommandDialog = ({ children, ...props }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Dialog, { ...props, children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DialogContent, { className: "overflow-hidden p-0", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Command, { className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5", children }) }) });
};
var CommandInput = React12.forwardRef(({ className, role, ...props }, ref) => {
  const inputRef = React12.useRef(null);
  const setRefs = React12.useCallback(
    (node) => {
      inputRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );
  React12.useEffect(() => {
    if (inputRef.current && !role) {
      inputRef.current.setAttribute("role", "searchbox");
    }
  }, [role]);
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "flex items-center border-b px-3", "data-cmdk-input-wrapper": "", children: [
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_react_icons.MagnifyingGlassIcon, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
      import_cmdk.Command.Input,
      {
        ref: setRefs,
        role,
        className: cn(
          "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ...props
      }
    )
  ] });
});
CommandInput.displayName = "Input";
var CommandList = React12.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
  import_cmdk.Command.List,
  {
    ref,
    className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
    ...props
  }
));
CommandList.displayName = "List";
var CommandEmpty = React12.forwardRef((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_cmdk.Command.Empty, { ref, className: "py-6 text-center text-sm", ...props }));
CommandEmpty.displayName = "Empty";
var CommandGroup = React12.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
  import_cmdk.Command.Group,
  {
    ref,
    className: cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    ),
    ...props
  }
));
CommandGroup.displayName = "Group";
var CommandSeparator = React12.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
  import_cmdk.Command.Separator,
  {
    ref,
    className: cn("-mx-1 h-px bg-border", className),
    ...props
  }
));
CommandSeparator.displayName = "CommandSeparator";
var CommandItem = React12.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
  import_cmdk.Command.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
      className
    ),
    ...props
  }
));
CommandItem.displayName = "Item";
var CommandShortcut = ({ className, ...props }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
    "span",
    {
      className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
      ...props
    }
  );
};
CommandShortcut.displayName = "CommandShortcut";

// src/components/data-table.tsx
var import_react_table2 = require("@tanstack/react-table");
var import_lucide_react5 = require("lucide-react");
var React13 = __toESM(require("react"));
var import_jsx_runtime17 = require("react/jsx-runtime");
function DataTable({
  columns,
  data,
  searchable = false,
  searchPlaceholder = "Search...",
  searchColumn,
  paginated = true,
  pageSizeOptions = [10, 20, 30, 50, 100],
  defaultPageSize = 10,
  columnVisibility = false,
  emptyMessage = "No results.",
  className,
  isLoading = false,
  onRowClick
}) {
  const [sorting, setSorting] = React13.useState([]);
  const [columnFilters, setColumnFilters] = React13.useState([]);
  const [columnVisibilityState, setColumnVisibilityState] = React13.useState({});
  const [rowSelection, setRowSelection] = React13.useState({});
  const tableOptions = {
    data,
    columns,
    getCoreRowModel: (0, import_react_table2.getCoreRowModel)(),
    getSortedRowModel: (0, import_react_table2.getSortedRowModel)(),
    getFilteredRowModel: (0, import_react_table2.getFilteredRowModel)(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibilityState,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility: columnVisibilityState,
      rowSelection
    }
  };
  if (paginated) {
    tableOptions.getPaginationRowModel = (0, import_react_table2.getPaginationRowModel)();
    tableOptions.initialState = {
      ...tableOptions.initialState ?? {},
      pagination: {
        pageSize: defaultPageSize
      }
    };
  }
  const table = (0, import_react_table2.useReactTable)(tableOptions);
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: cn("space-y-4", className), children: [
    (searchable || columnVisibility) && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex items-center justify-between gap-4", children: [
      searchable && searchColumn && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
        Input,
        {
          placeholder: searchPlaceholder,
          value: table.getColumn(searchColumn)?.getFilterValue() ?? "",
          onChange: (event) => table.getColumn(searchColumn)?.setFilterValue(event.target.value),
          className: "max-w-sm",
          "aria-label": "Search table"
        }
      ),
      columnVisibility && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(DropdownMenu, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(Button, { variant: "outline", className: "ml-auto", children: [
          "Columns ",
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react5.ChevronDown, { className: "ml-2 h-4 w-4" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(DropdownMenuContent, { align: "end", className: "bg-card", children: table.getAllColumns().filter((column) => column.getCanHide()).map((column) => {
          return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
            DropdownMenuCheckboxItem,
            {
              className: "capitalize",
              checked: column.getIsVisible(),
              onCheckedChange: (value) => column.toggleVisibility(value === true),
              children: column.id
            },
            column.id
          );
        }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "rounded-md border border-border bg-card", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(Table, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(TableHeader, { children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(TableRow, { children: headerGroup.headers.map((header) => {
        return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(TableHead, { children: header.isPlaceholder ? null : (0, import_react_table2.flexRender)(header.column.columnDef.header, header.getContext()) }, header.id);
      }) }, headerGroup.id)) }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(TableBody, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(TableCell, { colSpan: columns.length, className: "h-24 text-center", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "text-muted-foreground", children: "Loading..." }) }) }) : table.getRowModel().rows?.length ? table.getRowModel().rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
        TableRow,
        {
          "data-state": row.getIsSelected() && "selected",
          className: cn(onRowClick && "cursor-pointer hover:bg-muted/50"),
          onClick: () => onRowClick?.(row.original),
          children: row.getVisibleCells().map((cell) => /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(TableCell, { children: (0, import_react_table2.flexRender)(cell.column.columnDef.cell, cell.getContext()) }, cell.id))
        },
        row.id
      )) : /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(TableCell, { colSpan: columns.length, className: "h-24 text-center", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "text-muted-foreground", children: emptyMessage }) }) }) })
    ] }) }),
    paginated && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "text-sm text-muted-foreground", children: table.getFilteredSelectedRowModel().rows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("span", { children: [
        table.getFilteredSelectedRowModel().rows.length,
        " of",
        " ",
        table.getFilteredRowModel().rows.length,
        " row(s) selected"
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex items-center space-x-6 lg:space-x-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("p", { className: "text-sm font-medium text-foreground", children: "Rows per page" }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
            "select",
            {
              value: table.getState().pagination.pageSize,
              onChange: (e) => {
                table.setPageSize(Number(e.target.value));
              },
              className: "h-8 w-[70px] rounded-md border border-input bg-card px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              "aria-label": "Select page size",
              children: pageSizeOptions.map((pageSize) => /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("option", { value: pageSize, children: pageSize }, pageSize))
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex w-[100px] items-center justify-center text-sm font-medium text-foreground", children: [
          "Page ",
          table.getState().pagination.pageIndex + 1,
          " of ",
          table.getPageCount()
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => table.previousPage(),
              disabled: !table.getCanPreviousPage(),
              "aria-label": "Go to previous page",
              children: "Previous"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => table.nextPage(),
              disabled: !table.getCanNextPage(),
              "aria-label": "Go to next page",
              children: "Next"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function createSortableHeader(label) {
  const SortableHeader = ({ column }) => {
    return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
      Button,
      {
        variant: "ghost",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        className: "-ml-4 h-8 text-foreground hover:bg-muted",
        "aria-label": `Sort by ${label}`,
        children: [
          label,
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react5.ArrowUpDown, { className: "ml-2 h-4 w-4" })
        ]
      }
    );
  };
  SortableHeader.displayName = `SortableHeader(${label})`;
  return SortableHeader;
}

// src/components/empty-state.tsx
var import_jsx_runtime18 = require("react/jsx-runtime");
var sizeStyles = {
  sm: {
    container: "py-8",
    icon: "h-8 w-8",
    title: "text-base",
    description: "text-sm"
  },
  md: {
    container: "py-12",
    icon: "h-12 w-12",
    title: "text-lg",
    description: "text-base"
  },
  lg: {
    container: "py-16",
    icon: "h-16 w-16",
    title: "text-xl",
    description: "text-lg"
  }
};
function EmptyState({
  icon: Icon2,
  title,
  description,
  action,
  secondaryAction,
  children,
  className,
  size = "md"
}) {
  const styles = sizeStyles[size];
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
    "div",
    {
      className: cn(
        "flex flex-col items-center justify-center text-center",
        styles.container,
        className
      ),
      role: "status",
      "aria-label": title,
      children: [
        Icon2 && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "mb-4 rounded-full bg-accent p-3", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Icon2, { className: cn(styles.icon, "text-muted-foreground"), "aria-hidden": "true" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("h3", { className: cn("font-semibold text-foreground mb-2", styles.title), children: title }),
        description && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("p", { className: cn("text-muted-foreground max-w-md mb-6", styles.description), children: description }),
        children,
        (action || secondaryAction) && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "flex items-center gap-3 mt-6", children: [
          action && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(Button, { onClick: action.onClick, size: size === "sm" ? "sm" : "default", children: [
            action.icon && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(action.icon, { className: "h-4 w-4 mr-2" }),
            action.label
          ] }),
          secondaryAction && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
            Button,
            {
              onClick: secondaryAction.onClick,
              variant: "outline",
              size: size === "sm" ? "sm" : "default",
              children: [
                secondaryAction.icon && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(secondaryAction.icon, { className: "h-4 w-4 mr-2" }),
                secondaryAction.label
              ]
            }
          )
        ] })
      ]
    }
  );
}
EmptyState.List = function EmptyStateList({
  entityName,
  onCreateClick,
  createLabel,
  icon: Icon2,
  className
}) {
  const iconProps = Icon2 ? { icon: Icon2 } : {};
  const actionProps = onCreateClick ? {
    action: {
      label: createLabel || `Create ${entityName}`,
      onClick: onCreateClick
    }
  } : {};
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
    EmptyState,
    {
      ...iconProps,
      ...actionProps,
      title: `No ${entityName} found`,
      description: `Get started by creating your first ${entityName.toLowerCase()}.`,
      ...className ? { className } : {}
    }
  );
};
EmptyState.Search = function EmptyStateSearch({
  searchTerm,
  onClearSearch,
  icon: Icon2,
  className
}) {
  const iconProps = Icon2 ? { icon: Icon2 } : {};
  const actionProps = onClearSearch ? {
    action: {
      label: "Clear search",
      onClick: onClearSearch
    }
  } : {};
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
    EmptyState,
    {
      ...iconProps,
      ...actionProps,
      title: "No results found",
      description: searchTerm ? /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(import_jsx_runtime18.Fragment, { children: [
        `We couldn't find anything matching "`,
        searchTerm,
        '". Try adjusting your search.'
      ] }) : "Try adjusting your filters or search criteria.",
      size: "sm",
      ...className ? { className } : {}
    }
  );
};
EmptyState.Error = function EmptyStateError({
  title = "Something went wrong",
  description = "We encountered an error loading this content. Please try again.",
  onRetry,
  retryLabel = "Try again",
  icon: Icon2,
  className
}) {
  const iconProps = Icon2 ? { icon: Icon2 } : {};
  const actionProps = onRetry ? {
    action: {
      label: retryLabel,
      onClick: onRetry
    }
  } : {};
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
    EmptyState,
    {
      ...iconProps,
      ...actionProps,
      title,
      description,
      ...className ? { className } : {}
    }
  );
};

// src/components/error-state.tsx
var import_lucide_react6 = require("lucide-react");
var import_jsx_runtime19 = require("react/jsx-runtime");
function ErrorState({
  title = "Something went wrong",
  message: message2,
  icon: Icon2 = import_lucide_react6.AlertCircle,
  onRetry,
  retryLabel = "Try again",
  className = "",
  variant = "card"
}) {
  const variantStyles2 = {
    inline: "py-4",
    card: "rounded-lg border border-red-900/30 bg-red-950/20 p-6",
    full: "min-h-[400px] flex items-center justify-center py-12"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: cn(variantStyles2[variant], className), children: /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "flex flex-col items-center justify-center text-center max-w-md mx-auto", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "p-4 bg-red-900/30 rounded-full mb-4 animate-in fade-in zoom-in duration-300", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Icon2, { className: "h-8 w-8 text-red-400", "aria-hidden": "true" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("h3", { className: "text-lg font-semibold text-red-200 mb-2", children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("p", { className: "text-sm text-red-300/80 mb-6", children: message2 }),
    onRetry && /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
      Button,
      {
        onClick: onRetry,
        variant: "outline",
        className: "border-red-800 hover:bg-red-900/30 hover:border-red-700 transition-colors",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react6.RefreshCw, { className: "h-4 w-4 mr-2" }),
          retryLabel
        ]
      }
    )
  ] }) });
}
function ErrorBoundaryFallback({ error, resetErrorBoundary }) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
    ErrorState,
    {
      title: "Unexpected Error",
      message: error.message || "An unexpected error occurred while loading this component.",
      onRetry: resetErrorBoundary,
      variant: "full"
    }
  );
}

// src/components/form.tsx
var import_react_slot = require("@radix-ui/react-slot");
var React15 = __toESM(require("react"));
var import_react_hook_form = require("react-hook-form");

// src/components/label.tsx
var React14 = __toESM(require("react"));
var import_jsx_runtime20 = require("react/jsx-runtime");
var Label2 = React14.forwardRef(
  ({ className = "", children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("label", { ref, className: `text-sm font-medium text-foreground ${className}`, ...props, children })
);
Label2.displayName = "Label";

// src/components/form.tsx
var import_jsx_runtime21 = require("react/jsx-runtime");
var FormContext = React15.createContext(false);
var enhanceFormChildren = (children) => {
  return React15.Children.map(children, (child) => {
    if (React15.isValidElement(child) && typeof child.type === "string" && child.type === "form") {
      return React15.cloneElement(child, {
        noValidate: child.props?.noValidate ?? true
      });
    }
    return child;
  });
};
var Form = ({
  children,
  ...props
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(FormContext.Provider, { value: true, children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_react_hook_form.FormProvider, { ...props, children: enhanceFormChildren(children) }) });
};
var FormFieldContext = React15.createContext(void 0);
var FormField = ({
  ...props
}) => {
  const contextValue = React15.useMemo(
    () => ({
      name: props.name
    }),
    [props.name]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(FormFieldContext.Provider, { value: contextValue, children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_react_hook_form.Controller, { ...props }) });
};
var useFormField = () => {
  const hasFormProvider = React15.useContext(FormContext);
  const fieldContext = React15.useContext(FormFieldContext);
  const itemContext = React15.useContext(FormItemContext);
  const rhfContext = (0, import_react_hook_form.useFormContext)();
  if (!hasFormProvider) {
    throw new Error("useFormField should be used within <Form>");
  }
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>");
  }
  if (!rhfContext) {
    throw new Error("useFormField should be used within a valid FormProvider context");
  }
  const { getFieldState, formState } = rhfContext;
  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};
var FormItemContext = React15.createContext(void 0);
var FormItem = React15.forwardRef(
  ({ className, ...props }, ref) => {
    const id = React15.useId();
    const contextValue = React15.useMemo(() => ({ id }), [id]);
    return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(FormItemContext.Provider, { value: contextValue, children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { ref, className: cn("space-y-2", className), ...props }) });
  }
);
FormItem.displayName = "FormItem";
var FormLabel = React15.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
    Label2,
    {
      ref,
      className: cn(error && "text-destructive", className),
      htmlFor: formItemId,
      ...props
    }
  );
});
FormLabel.displayName = "FormLabel";
var FormControl = React15.forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
    import_react_slot.Slot,
    {
      ref,
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    }
  );
});
FormControl.displayName = "FormControl";
var FormDescription = React15.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
    "p",
    {
      ref,
      id: formDescriptionId,
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  );
});
FormDescription.displayName = "FormDescription";
var FormMessage = React15.forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;
  if (!body) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
    "p",
    {
      ref,
      id: formMessageId,
      className: cn("text-sm font-medium text-destructive", className),
      ...props,
      children: body
    }
  );
});
FormMessage.displayName = "FormMessage";

// src/components/form-error.tsx
var import_lucide_react7 = require("lucide-react");
var import_jsx_runtime22 = require("react/jsx-runtime");
function FormError({ id, error, className = "" }) {
  if (!error) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
    "div",
    {
      id,
      role: "alert",
      "aria-live": "polite",
      className: `flex items-center gap-2 mt-1 text-sm text-red-400 ${className}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(import_lucide_react7.AlertCircle, { className: "h-4 w-4 flex-shrink-0", "aria-hidden": "true" }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { children: error })
      ]
    }
  );
}

// src/components/live-indicator.tsx
var import_lucide_react8 = require("lucide-react");
var React16 = __toESM(require("react"));
var import_jsx_runtime23 = require("react/jsx-runtime");
function LiveIndicator({
  lastUpdated,
  isRefreshing = false,
  onRefresh,
  className = ""
}) {
  const [timeAgo, setTimeAgo] = React16.useState("");
  React16.useEffect(() => {
    if (!lastUpdated) return;
    const updateTimeAgo = () => {
      const now = /* @__PURE__ */ new Date();
      const seconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1e3);
      if (seconds < 10) {
        setTimeAgo("just now");
      } else if (seconds < 60) {
        setTimeAgo(`${seconds}s ago`);
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        setTimeAgo(`${minutes}m ago`);
      } else {
        const hours = Math.floor(seconds / 3600);
        setTimeAgo(`${hours}h ago`);
      }
    };
    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1e3);
    return () => clearInterval(interval);
  }, [lastUpdated]);
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: cn("flex items-center gap-2 text-sm", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "flex items-center gap-2 px-2 py-1 rounded-md bg-green-500/10 text-green-500 dark:bg-green-500/20", children: [
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(import_lucide_react8.Activity, { className: "h-3 w-3 animate-pulse" }),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { className: "text-xs font-medium", children: "Live" })
    ] }),
    lastUpdated && /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("span", { className: "text-xs text-muted-foreground dark:text-muted-foreground", children: [
      "Updated ",
      timeAgo
    ] }),
    onRefresh && /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
      "button",
      {
        onClick: onRefresh,
        disabled: isRefreshing,
        className: cn(
          "p-1 rounded hover:bg-accent dark:hover:bg-muted transition-colors",
          "text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-white",
          isRefreshing && "cursor-not-allowed opacity-50"
        ),
        "aria-label": "Refresh",
        children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(import_lucide_react8.RefreshCw, { className: cn("h-4 w-4", isRefreshing && "animate-spin") })
      }
    )
  ] });
}

// src/components/loading-overlay.tsx
var import_lucide_react9 = require("lucide-react");
var import_jsx_runtime24 = require("react/jsx-runtime");
function LoadingOverlay({
  loading = true,
  message: message2,
  className = "",
  variant = "spinner",
  size = "md"
}) {
  if (!loading) return null;
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
    "div",
    {
      className: cn(
        "absolute inset-0 bg-card/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg",
        "animate-in fade-in duration-200",
        className
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "text-center space-y-3", children: [
        variant === "spinner" && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_lucide_react9.Loader2, { className: cn(sizeClasses[size], "animate-spin text-sky-400 mx-auto") }),
        variant === "pulse" && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "flex gap-2 justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: cn(sizeClasses[size], "bg-sky-400 rounded-full animate-pulse") }) }),
        variant === "dots" && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "flex gap-2 justify-center", children: [0, 1, 2].map((i) => /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
          "div",
          {
            className: cn(
              "w-3 h-3 bg-sky-400 rounded-full animate-bounce",
              i === 1 && "animation-delay-100",
              i === 2 && "animation-delay-200"
            ),
            style: {
              animationDelay: `${i * 150}ms`
            }
          },
          i
        )) }),
        message2 && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("p", { className: "text-sm text-muted-foreground animate-in slide-in-from-bottom-2 duration-300", children: message2 })
      ] })
    }
  );
}
function InlineLoader({ message: message2, size = "md", className = "" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: cn("flex items-center gap-3", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_lucide_react9.Loader2, { className: cn(sizeClasses[size], "animate-spin text-sky-400") }),
    message2 && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: "text-sm text-muted-foreground", children: message2 })
  ] });
}

// src/components/loading-states.tsx
var import_lucide_react10 = require("lucide-react");
var import_jsx_runtime25 = require("react/jsx-runtime");
function LoadingSpinner({ size = "md", className, label }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: cn("flex items-center gap-2", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_lucide_react10.Loader2, { className: cn("animate-spin text-primary", sizeClasses[size]) }),
    label && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: "text-muted-foreground text-sm", children: label })
  ] });
}
function LoadingCard({ lines = 3, showAvatar = false, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: cn("bg-card rounded-lg p-6 animate-pulse border border-border", className), children: /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "flex items-start gap-4", children: [
    showAvatar && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "h-10 w-10 bg-muted rounded-full" }),
    /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "flex-1 space-y-3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "h-4 bg-muted rounded w-3/4" }),
      Array.from({ length: lines - 1 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "h-4 bg-muted rounded w-full" }, i))
    ] })
  ] }) });
}
function LoadingTable({ rows = 5, columns = 4, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: cn("bg-card rounded-lg overflow-hidden border border-border", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "border-b border-border p-4", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "grid gap-4", style: { gridTemplateColumns: `repeat(${columns}, 1fr)` }, children: Array.from({ length: columns }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "h-4 bg-muted rounded animate-pulse" }, i)) }) }),
    Array.from({ length: rows }).map((_, rowIndex) => /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "border-b border-border p-4 last:border-0", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "grid gap-4", style: { gridTemplateColumns: `repeat(${columns}, 1fr)` }, children: Array.from({ length: columns }).map((_2, colIndex) => /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
      "div",
      {
        className: "h-4 bg-muted rounded animate-pulse",
        style: { width: `${Math.random() * 40 + 60}%` }
      },
      colIndex
    )) }) }, rowIndex))
  ] });
}
function LoadingGrid({ items = 6, columns = 3, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
    "div",
    {
      className: cn("grid gap-6", className),
      style: { gridTemplateColumns: `repeat(${columns}, 1fr)` },
      children: Array.from({ length: items }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(LoadingCard, { lines: 2 }, i))
    }
  );
}
function LoadingState({
  loading,
  error,
  empty,
  children,
  loadingComponent,
  errorComponent,
  emptyComponent,
  emptyMessage = "No data available",
  emptyIcon
}) {
  if (loading) {
    return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_jsx_runtime25.Fragment, { children: loadingComponent || /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(LoadingSpinner, { size: "lg", className: "mx-auto my-8" }) });
  }
  if (error) {
    return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_jsx_runtime25.Fragment, { children: errorComponent || /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "flex flex-col items-center justify-center p-8 text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_lucide_react10.AlertCircle, { className: "h-12 w-12 text-destructive mb-4" }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("p", { className: "text-foreground mb-2", children: "Something went wrong" }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("p", { className: "text-muted-foreground text-sm", children: error?.message || "Please try again later" })
    ] }) });
  }
  if (empty) {
    return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_jsx_runtime25.Fragment, { children: emptyComponent || /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "flex flex-col items-center justify-center p-8 text-center", children: [
      emptyIcon || /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_lucide_react10.InfoIcon, { className: "h-12 w-12 text-muted-foreground mb-4" }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("p", { className: "text-muted-foreground", children: emptyMessage })
    ] }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_jsx_runtime25.Fragment, { children });
}
function AsyncState({
  data,
  loading,
  error,
  children,
  loadingComponent,
  errorComponent,
  emptyComponent,
  isEmpty
}) {
  const isEmptyData = data && isEmpty ? isEmpty(data) : !data;
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
    LoadingState,
    {
      loading,
      error: error ?? null,
      empty: isEmptyData,
      loadingComponent,
      errorComponent,
      emptyComponent,
      children: data && children(data)
    }
  );
}
function ButtonLoading({
  loading,
  children,
  loadingText,
  className,
  onClick,
  type = "button",
  variant = "primary",
  disabled
}) {
  const variantClasses = {
    primary: "bg-primary hover:bg-primary/90 text-primary-foreground",
    secondary: "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
    danger: "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
    "button",
    {
      type,
      onClick,
      disabled: loading || disabled,
      className: cn(
        "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2",
        variantClasses[variant],
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      ),
      children: [
        loading && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_lucide_react10.Loader2, { className: "h-4 w-4 animate-spin" }),
        loading && loadingText ? loadingText : children
      ]
    }
  );
}
function ProgressIndicator({ steps, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: cn("space-y-2", className), children: steps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
      "div",
      {
        className: cn(
          "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
          {
            "bg-muted text-muted-foreground": step.status === "pending",
            "bg-primary text-primary-foreground": step.status === "active",
            "bg-green-500 text-white": step.status === "completed",
            "bg-destructive text-destructive-foreground": step.status === "error"
          }
        ),
        children: step.status === "completed" ? /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_lucide_react10.CheckCircle, { className: "h-4 w-4" }) : step.status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_lucide_react10.AlertCircle, { className: "h-4 w-4" }) : step.status === "active" ? /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_lucide_react10.Loader2, { className: "h-4 w-4 animate-spin" }) : index + 1
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
      "span",
      {
        className: cn("text-sm", {
          "text-muted-foreground": step.status === "pending",
          "text-foreground font-medium": step.status === "active",
          "text-foreground": step.status === "completed",
          "text-destructive": step.status === "error"
        }),
        children: step.label
      }
    )
  ] }, index)) });
}

// src/components/metric-card-enhanced.tsx
var import_primitives = require("@dotmac/primitives");
var import_lucide_react11 = require("lucide-react");
var import_link = __toESM(require("next/link"));
var React17 = __toESM(require("react"));
var import_jsx_runtime26 = require("react/jsx-runtime");
function MetricCardEnhanced({
  title,
  value,
  subtitle,
  icon: Icon2,
  trend,
  href,
  currency,
  loading = false,
  error,
  emptyStateMessage,
  className = ""
}) {
  const numericValue = React17.useMemo(() => {
    if (typeof value === "number") return value;
    const parsed = parseFloat(String(value).replace(/[^0-9.-]/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  }, [value]);
  const formattedValue = React17.useMemo(() => {
    if (currency && typeof value === "number") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(value);
    }
    return value;
  }, [value, currency]);
  const isEmpty = value === 0 || value === "0";
  const showEmptyState = isEmpty && emptyStateMessage && !loading && !error;
  const shouldAnimate = !loading && !error && typeof value === "number";
  const content = /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
    import_primitives.AnimatedCard,
    {
      disabled: loading || !!error,
      className: cn(
        "group relative rounded-lg border p-6 transition-all duration-200",
        "bg-card border-border",
        !error && "hover:border-border dark:hover:border-border hover:shadow-lg hover:shadow-sky-500/5",
        error && "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20",
        className
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("p", { className: "text-sm font-medium text-muted-foreground dark:text-muted-foreground", children: title }),
          loading ? /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "h-8 w-24 bg-muted animate-pulse rounded" }),
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "h-3 w-32 bg-muted animate-pulse rounded" })
          ] }) : error ? /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "flex items-center gap-2 text-red-400", children: [
              /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react11.AlertCircle, { className: "h-4 w-4" }),
              /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("p", { className: "text-sm", children: "Failed to load" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("p", { className: "text-xs text-red-400/70", children: error })
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(import_jsx_runtime26.Fragment, { children: [
            shouldAnimate ? /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
              import_primitives.AnimatedCounter,
              {
                value: numericValue,
                duration: 1.5,
                prefix: currency ? "$" : "",
                className: cn(
                  "text-3xl font-bold transition-colors duration-200",
                  showEmptyState ? "text-muted-foreground" : "text-foreground group-hover:text-sky-400"
                )
              }
            ) : /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
              "p",
              {
                className: cn(
                  "text-3xl font-bold transition-colors duration-200",
                  showEmptyState ? "text-muted-foreground" : "text-foreground group-hover:text-sky-400"
                ),
                children: formattedValue
              }
            ),
            showEmptyState ? /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("p", { className: "text-xs text-muted-foreground italic", children: emptyStateMessage }) : subtitle ? /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("p", { className: "text-sm text-muted-foreground", children: subtitle }) : null,
            trend && !showEmptyState && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
              "div",
              {
                className: cn(
                  "flex items-center text-sm transition-colors duration-200",
                  trend.isPositive ? "text-green-400" : "text-red-400"
                ),
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
                    import_lucide_react11.TrendingUp,
                    {
                      className: cn(
                        "h-4 w-4 mr-1 transition-transform duration-200",
                        !trend.isPositive && "rotate-180"
                      )
                    }
                  ),
                  Math.abs(trend.value),
                  "% from last month"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
          "div",
          {
            className: cn(
              "p-3 rounded-lg transition-all duration-200",
              error ? "bg-red-900/30" : "bg-muted group-hover:bg-muted group-hover:scale-110"
            ),
            children: error ? /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react11.AlertCircle, { className: "h-6 w-6 text-red-400" }) : /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
              Icon2,
              {
                className: cn(
                  "h-6 w-6 transition-colors duration-200",
                  showEmptyState ? "text-muted-foreground" : "text-sky-400 group-hover:text-sky-300"
                )
              }
            )
          }
        )
      ] })
    }
  );
  if (href && !error && !loading) {
    return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_primitives.FadeInWhenVisible, { children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(import_link.default, { href, className: "block relative group/link", children: [
      content,
      /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react11.ArrowUpRight, { className: "absolute top-4 right-4 h-4 w-4 text-foreground opacity-0 group-hover/link:opacity-100 transition-all duration-200 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" })
    ] }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_primitives.FadeInWhenVisible, { children: content });
}

// src/components/page-header.tsx
var import_jsx_runtime27 = require("react/jsx-runtime");
function PageHeader({
  title,
  description,
  icon: Icon2,
  actions,
  children,
  className,
  showBorder = false
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: cn("mb-6", showBorder && "pb-6 border-b border-border", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex items-center gap-3", children: [
        Icon2 && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: "flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Icon2, { className: "h-8 w-8 text-primary", "aria-hidden": "true" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("h1", { className: "text-3xl font-bold text-foreground truncate", children: title }),
          description && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("p", { className: "text-muted-foreground mt-1 text-sm sm:text-base", children: description })
        ] })
      ] }) }),
      actions && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: "flex-shrink-0 flex items-start gap-2", children: actions })
    ] }),
    children && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: "mt-4", children })
  ] });
}
PageHeader.Actions = function PageHeaderActions({
  children,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: cn("flex items-center gap-2 flex-wrap", className), children });
};
PageHeader.Stat = function PageHeaderStat({
  label,
  value,
  icon: Icon2,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: cn("flex items-center gap-2 px-3 py-2 bg-accent rounded-lg", className), children: [
    Icon2 && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Icon2, { className: "h-4 w-4 text-muted-foreground", "aria-hidden": "true" }),
    /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("p", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("p", { className: "text-sm font-semibold text-foreground", children: value })
    ] })
  ] });
};
PageHeader.Breadcrumb = function PageHeaderBreadcrumb({
  items,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("nav", { "aria-label": "Breadcrumb", className: cn("flex items-center gap-2 text-sm mb-2", className), children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex items-center gap-2", children: [
    index > 0 && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { className: "text-muted-foreground", "aria-hidden": "true", children: "/" }),
    item.href ? /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
      "a",
      {
        href: item.href,
        className: "text-muted-foreground hover:text-foreground transition-colors",
        children: item.label
      }
    ) : /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { className: "text-foreground font-medium", children: item.label })
  ] }, index)) });
};

// src/lib/design-system/portal-themes.tsx
var import_navigation = require("next/navigation");
var import_next_themes = require("next-themes");
var import_react2 = require("react");

// src/lib/design-system/tokens/animations.ts
var duration = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
  slowest: 750
};
var easing = {
  // Standard easings
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  // Custom cubic-bezier easings
  smooth: "cubic-bezier(0.4, 0.0, 0.2, 1)",
  // Material Design standard
  sharp: "cubic-bezier(0.4, 0.0, 0.6, 1)",
  // Emphasized deceleration
  snappy: "cubic-bezier(0.0, 0.0, 0.2, 1)",
  // Sharp entrance
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  // Bounce effect
  elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
  // Elastic effect
};
var portalAnimations = {
  /**
   * Platform Admin - Fast, efficient, minimal
   * Staff need speed and clarity, not fancy animations
   */
  platformAdmin: {
    duration: duration.fast,
    easing: easing.sharp,
    hoverScale: 1.02,
    // Subtle hover effects
    activeScale: 0.98,
    // Quick feedback
    reducedMotion: true,
    // Respect accessibility more strictly
    pageTransition: "fade"
    // Simple fade transitions
  },
  /**
   * Platform Resellers - Energetic, responsive, engaging
   * Sales-focused, needs to feel dynamic and exciting
   */
  platformResellers: {
    duration: duration.normal,
    easing: easing.bounce,
    hoverScale: 1.05,
    // More pronounced hover
    activeScale: 0.95,
    // Satisfying click feedback
    reducedMotion: false,
    pageTransition: "slideUp"
  },
  /**
   * Platform Tenants - Professional, smooth, polished
   * Business users expect refinement
   */
  platformTenants: {
    duration: duration.normal,
    easing: easing.smooth,
    hoverScale: 1.03,
    activeScale: 0.97,
    reducedMotion: false,
    pageTransition: "slideRight"
  },
  /**
   * ISP Admin - Fast, precise, functional
   * Operational work requires efficiency
   */
  ispAdmin: {
    duration: duration.fast,
    easing: easing.sharp,
    hoverScale: 1.02,
    activeScale: 0.98,
    reducedMotion: true,
    pageTransition: "fade"
  },
  /**
   * ISP Reseller - Playful, mobile-optimized, fun
   * Often on mobile, needs to feel responsive and enjoyable
   */
  ispReseller: {
    duration: duration.normal,
    easing: easing.elastic,
    hoverScale: 1.08,
    // Exaggerated for mobile
    activeScale: 0.92,
    // Clear tactile feedback
    reducedMotion: false,
    pageTransition: "scale"
  },
  /**
   * ISP Customer - Gentle, accessible, reassuring
   * Non-technical users need calm, predictable animations
   */
  ispCustomer: {
    duration: duration.slow,
    // Slower, more gentle
    easing: easing.smooth,
    hoverScale: 1.02,
    // Very subtle
    activeScale: 0.98,
    reducedMotion: true,
    // Strongly respect reduced motion
    pageTransition: "fade"
  }
};
var keyframes = {
  // Fade animations
  fadeIn: {
    "0%": { opacity: "0" },
    "100%": { opacity: "1" }
  },
  fadeOut: {
    "0%": { opacity: "1" },
    "100%": { opacity: "0" }
  },
  // Slide animations
  slideInUp: {
    "0%": { transform: "translateY(100%)", opacity: "0" },
    "100%": { transform: "translateY(0)", opacity: "1" }
  },
  slideOutDown: {
    "0%": { transform: "translateY(0)", opacity: "1" },
    "100%": { transform: "translateY(100%)", opacity: "0" }
  },
  // Scale animations
  scaleIn: {
    "0%": { transform: "scale(0.9)", opacity: "0" },
    "100%": { transform: "scale(1)", opacity: "1" }
  },
  scaleOut: {
    "0%": { transform: "scale(1)", opacity: "1" },
    "100%": { transform: "scale(0.9)", opacity: "0" }
  },
  // Bounce animation
  bounce: {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-10px)" }
  },
  // Pulse animation
  pulse: {
    "0%, 100%": { opacity: "1" },
    "50%": { opacity: "0.5" }
  },
  // Shimmer animation (for skeletons)
  shimmer: {
    "0%": { backgroundPosition: "-1000px 0" },
    "100%": { backgroundPosition: "1000px 0" }
  },
  // Wave animation (for skeletons)
  wave: {
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(100%)" }
  },
  // Spin animation
  spin: {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" }
  },
  // Ping animation (notification indicator)
  ping: {
    "0%": { transform: "scale(1)", opacity: "1" },
    "75%, 100%": { transform: "scale(2)", opacity: "0" }
  }
};

// src/lib/design-system/tokens/colors.ts
var colorTokens = {
  /**
   * Portal 1: Platform Admin
   * Deep Blue - Authority, Trust, Technical Excellence
   */
  platformAdmin: {
    primary: {
      50: "hsl(217, 91%, 95%)",
      100: "hsl(217, 91%, 90%)",
      200: "hsl(217, 91%, 80%)",
      300: "hsl(217, 91%, 70%)",
      400: "hsl(217, 91%, 60%)",
      // Main
      500: "hsl(217, 91%, 50%)",
      600: "hsl(217, 91%, 40%)",
      700: "hsl(217, 91%, 30%)",
      800: "hsl(217, 91%, 20%)",
      900: "hsl(217, 91%, 10%)"
    },
    accent: {
      DEFAULT: "hsl(189, 85%, 47%)"
      // Cyan - Technical, Monitoring
    },
    sidebar: "dark"
    // Enforced dark sidebar
  },
  /**
   * Portal 2: Platform Resellers (Partners)
   * Orange - Energy, Sales, Action-Oriented
   */
  platformResellers: {
    primary: {
      50: "hsl(24, 95%, 95%)",
      100: "hsl(24, 95%, 90%)",
      200: "hsl(24, 95%, 80%)",
      300: "hsl(24, 95%, 70%)",
      400: "hsl(24, 95%, 60%)",
      500: "hsl(24, 95%, 53%)",
      // Main
      600: "hsl(24, 95%, 43%)",
      700: "hsl(24, 95%, 33%)",
      800: "hsl(24, 95%, 23%)",
      900: "hsl(24, 95%, 13%)"
    },
    accent: {
      DEFAULT: "hsl(142, 71%, 45%)"
      // Green - Money, Growth
    },
    sidebar: "light"
    // Light sidebar default
  },
  /**
   * Portal 3: Platform Tenants (ISPs)
   * Purple - Premium, Business, Professional
   */
  platformTenants: {
    primary: {
      50: "hsl(262, 83%, 95%)",
      100: "hsl(262, 83%, 90%)",
      200: "hsl(262, 83%, 80%)",
      300: "hsl(262, 83%, 70%)",
      400: "hsl(262, 83%, 60%)",
      500: "hsl(262, 83%, 58%)",
      // Main
      600: "hsl(262, 83%, 48%)",
      700: "hsl(262, 83%, 38%)",
      800: "hsl(262, 83%, 28%)",
      900: "hsl(262, 83%, 18%)"
    },
    accent: {
      DEFAULT: "hsl(217, 91%, 60%)"
      // Blue - Trust
    },
    sidebar: "light"
    // Light sidebar default
  },
  /**
   * Portal 4: ISP Admin
   * Blue - Professional, Operations, Reliable
   */
  ispAdmin: {
    primary: {
      50: "hsl(207, 90%, 95%)",
      100: "hsl(207, 90%, 90%)",
      200: "hsl(207, 90%, 80%)",
      300: "hsl(207, 90%, 70%)",
      400: "hsl(207, 90%, 60%)",
      500: "hsl(207, 90%, 54%)",
      // Main
      600: "hsl(207, 90%, 44%)",
      700: "hsl(207, 90%, 34%)",
      800: "hsl(207, 90%, 24%)",
      900: "hsl(207, 90%, 14%)"
    },
    accent: {
      DEFAULT: "hsl(142, 71%, 45%)"
      // Green - Operational Health
    },
    sidebar: "dark"
    // Dark sidebar preferred (long hours)
  },
  /**
   * Portal 5: ISP Reseller
   * Green - Money, Success, Growth
   */
  ispReseller: {
    primary: {
      50: "hsl(142, 71%, 95%)",
      100: "hsl(142, 71%, 90%)",
      200: "hsl(142, 71%, 80%)",
      300: "hsl(142, 71%, 70%)",
      400: "hsl(142, 71%, 60%)",
      500: "hsl(142, 71%, 45%)",
      // Main
      600: "hsl(142, 71%, 35%)",
      700: "hsl(142, 71%, 25%)",
      800: "hsl(142, 71%, 15%)",
      900: "hsl(142, 71%, 10%)"
    },
    accent: {
      DEFAULT: "hsl(24, 95%, 53%)"
      // Orange - Energy, Action
    },
    sidebar: "none"
    // Bottom nav on mobile
  },
  /**
   * Portal 6: ISP Customer
   * Friendly Blue - Approachable, Trustworthy, Simple
   */
  ispCustomer: {
    primary: {
      50: "hsl(207, 90%, 95%)",
      100: "hsl(207, 90%, 90%)",
      200: "hsl(207, 90%, 80%)",
      300: "hsl(207, 90%, 70%)",
      400: "hsl(207, 90%, 60%)",
      500: "hsl(207, 90%, 54%)",
      // Main
      600: "hsl(207, 90%, 44%)",
      700: "hsl(207, 90%, 34%)",
      800: "hsl(207, 90%, 24%)",
      900: "hsl(207, 90%, 14%)"
    },
    accent: {
      DEFAULT: "hsl(142, 71%, 45%)"
      // Green - Service Active
    },
    sidebar: "none"
    // Top nav on mobile
  },
  /**
   * Semantic Colors (Shared across all portals)
   */
  semantic: {
    success: "hsl(142, 71%, 45%)",
    // Green
    warning: "hsl(45, 93%, 47%)",
    // Amber
    error: "hsl(0, 84%, 60%)",
    // Red
    info: "hsl(207, 90%, 54%)"
    // Blue
  },
  /**
   * Status Colors (Network/Service Status)
   */
  status: {
    online: "hsl(142, 71%, 45%)",
    // Green
    offline: "hsl(0, 84%, 60%)",
    // Red
    degraded: "hsl(45, 93%, 47%)",
    // Amber
    unknown: "hsl(220, 9%, 46%)"
    // Gray
  }
};
function getPortalColors(portal) {
  return colorTokens[portal];
}
var portalRoutes = {
  platformAdmin: "/dashboard/platform-admin",
  platformResellers: "/partner",
  platformTenants: "/tenant",
  ispAdmin: "/dashboard",
  ispReseller: "/portal",
  ispCustomer: "/customer-portal"
};
function detectPortalFromRoute(pathname) {
  if (pathname.startsWith("/dashboard/platform-admin")) return "platformAdmin";
  if (pathname.startsWith("/customer-portal")) return "ispCustomer";
  if (pathname.startsWith("/partner")) return "platformResellers";
  if (pathname.startsWith("/tenant")) return "platformTenants";
  if (pathname.startsWith("/portal")) return "ispReseller";
  if (pathname.startsWith("/dashboard")) return "ispAdmin";
  return "ispAdmin";
}

// src/lib/design-system/tokens/spacing.ts
var spacing = {
  0: "0",
  px: "1px",
  0.5: "0.125rem",
  // 2px
  1: "0.25rem",
  // 4px
  1.5: "0.375rem",
  // 6px
  2: "0.5rem",
  // 8px
  2.5: "0.625rem",
  // 10px
  3: "0.75rem",
  // 12px
  3.5: "0.875rem",
  // 14px
  4: "1rem",
  // 16px
  5: "1.25rem",
  // 20px
  6: "1.5rem",
  // 24px
  7: "1.75rem",
  // 28px
  8: "2rem",
  // 32px
  9: "2.25rem",
  // 36px
  10: "2.5rem",
  // 40px
  11: "2.75rem",
  // 44px
  12: "3rem",
  // 48px
  14: "3.5rem",
  // 56px
  16: "4rem",
  // 64px
  20: "5rem",
  // 80px
  24: "6rem",
  // 96px
  28: "7rem",
  // 112px
  32: "8rem",
  // 128px
  36: "9rem",
  // 144px
  40: "10rem",
  // 160px
  44: "11rem",
  // 176px
  48: "12rem",
  // 192px
  52: "13rem",
  // 208px
  56: "14rem",
  // 224px
  60: "15rem",
  // 240px
  64: "16rem",
  // 256px
  72: "18rem",
  // 288px
  80: "20rem",
  // 320px
  96: "24rem"
  // 384px
};
var portalSpacing = {
  platformAdmin: {
    componentGap: spacing[4],
    // 16px - Dense
    sectionGap: spacing[6],
    // 24px
    pageGutter: spacing[6]
    // 24px
  },
  platformResellers: {
    componentGap: spacing[4],
    // 16px
    sectionGap: spacing[8],
    // 32px
    pageGutter: spacing[8]
    // 32px
  },
  platformTenants: {
    componentGap: spacing[4],
    // 16px
    sectionGap: spacing[8],
    // 32px
    pageGutter: spacing[8]
    // 32px
  },
  ispAdmin: {
    componentGap: spacing[4],
    // 16px - Dense
    sectionGap: spacing[6],
    // 24px
    pageGutter: spacing[6]
    // 24px
  },
  ispReseller: {
    componentGap: spacing[6],
    // 24px - Mobile-friendly
    sectionGap: spacing[8],
    // 32px
    pageGutter: spacing[4]
    // 16px on mobile
  },
  ispCustomer: {
    componentGap: spacing[8],
    // 32px - Very generous
    sectionGap: spacing[12],
    // 48px
    pageGutter: spacing[6]
    // 24px
  }
};
var touchTargets = {
  minimum: spacing[11],
  // 44px - WCAG AAA
  comfortable: spacing[12],
  // 48px - Recommended
  generous: spacing[14]
  // 56px - Customer portal
};

// src/lib/design-system/tokens/typography.ts
var fontFamily = {
  sans: [
    "Inter",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif"
  ].join(", "),
  mono: ["JetBrains Mono", "Fira Code", "Consolas", "Monaco", "Courier New", "monospace"].join(
    ", "
  )
};
var portalFontSizes = {
  /**
   * Admin Portals - Standard sizes for dense information
   */
  platformAdmin: {
    xs: ["0.75rem", { lineHeight: "1rem" }],
    // 12px
    sm: ["0.875rem", { lineHeight: "1.25rem" }],
    // 14px
    base: ["1rem", { lineHeight: "1.5rem" }],
    // 16px
    lg: ["1.125rem", { lineHeight: "1.75rem" }],
    // 18px
    xl: ["1.25rem", { lineHeight: "1.75rem" }],
    // 20px
    "2xl": ["1.5rem", { lineHeight: "2rem" }],
    // 24px
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
    // 30px
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }]
    // 36px
  },
  platformResellers: {
    xs: ["0.75rem", { lineHeight: "1rem" }],
    // 12px
    sm: ["0.875rem", { lineHeight: "1.25rem" }],
    // 14px
    base: ["1rem", { lineHeight: "1.5rem" }],
    // 16px
    lg: ["1.125rem", { lineHeight: "1.75rem" }],
    // 18px
    xl: ["1.25rem", { lineHeight: "1.75rem" }],
    // 20px
    "2xl": ["1.5rem", { lineHeight: "2rem" }],
    // 24px
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
    // 30px
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }]
    // 36px
  },
  platformTenants: {
    xs: ["0.75rem", { lineHeight: "1rem" }],
    // 12px
    sm: ["0.875rem", { lineHeight: "1.25rem" }],
    // 14px
    base: ["1rem", { lineHeight: "1.5rem" }],
    // 16px
    lg: ["1.125rem", { lineHeight: "1.75rem" }],
    // 18px
    xl: ["1.25rem", { lineHeight: "1.75rem" }],
    // 20px
    "2xl": ["1.5rem", { lineHeight: "2rem" }],
    // 24px
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
    // 30px
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }]
    // 36px
  },
  ispAdmin: {
    xs: ["0.75rem", { lineHeight: "1rem" }],
    // 12px
    sm: ["0.875rem", { lineHeight: "1.25rem" }],
    // 14px
    base: ["1rem", { lineHeight: "1.5rem" }],
    // 16px
    lg: ["1.125rem", { lineHeight: "1.75rem" }],
    // 18px
    xl: ["1.25rem", { lineHeight: "1.75rem" }],
    // 20px
    "2xl": ["1.5rem", { lineHeight: "2rem" }],
    // 24px
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
    // 30px
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }]
    // 36px
  },
  /**
   * Reseller Portal - Slightly larger for mobile
   */
  ispReseller: {
    xs: ["0.875rem", { lineHeight: "1.25rem" }],
    // 14px
    sm: ["1rem", { lineHeight: "1.5rem" }],
    // 16px
    base: ["1.125rem", { lineHeight: "1.75rem" }],
    // 18px
    lg: ["1.25rem", { lineHeight: "1.75rem" }],
    // 20px
    xl: ["1.5rem", { lineHeight: "2rem" }],
    // 24px
    "2xl": ["1.875rem", { lineHeight: "2.25rem" }],
    // 30px
    "3xl": ["2.25rem", { lineHeight: "2.5rem" }],
    // 36px
    "4xl": ["3rem", { lineHeight: "3.5rem" }]
    // 48px
  },
  /**
   * Customer Portal - Largest sizes for accessibility
   */
  ispCustomer: {
    xs: ["1rem", { lineHeight: "1.5rem" }],
    // 16px (no smaller!)
    sm: ["1.125rem", { lineHeight: "1.75rem" }],
    // 18px
    base: ["1.25rem", { lineHeight: "1.875rem" }],
    // 20px ⬅️ Body text
    lg: ["1.5rem", { lineHeight: "2rem" }],
    // 24px
    xl: ["1.875rem", { lineHeight: "2.25rem" }],
    // 30px
    "2xl": ["2.25rem", { lineHeight: "2.5rem" }],
    // 36px
    "3xl": ["3rem", { lineHeight: "3.5rem" }],
    // 48px
    "4xl": ["3.75rem", { lineHeight: "4rem" }]
    // 60px
  }
};
var fontWeight = {
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900"
};

// src/lib/design-system/portal-themes.tsx
var import_jsx_runtime28 = require("react/jsx-runtime");
var portalMetadata = {
  platformAdmin: {
    name: "Platform Administration",
    shortName: "Platform Admin",
    description: "Manage the entire multi-tenant platform",
    icon: "\u{1F3E2}",
    userType: "DotMac Staff"
  },
  platformResellers: {
    name: "Partner Portal",
    shortName: "Partners",
    description: "Channel partner management and commissions",
    icon: "\u{1F91D}",
    userType: "Channel Partner"
  },
  platformTenants: {
    name: "Tenant Portal",
    shortName: "Tenant",
    description: "Manage your ISP business relationship",
    icon: "\u{1F3EC}",
    userType: "ISP Owner"
  },
  ispAdmin: {
    name: "ISP Operations",
    shortName: "ISP Admin",
    description: "Full ISP operations and network management",
    icon: "\u{1F4E1}",
    userType: "ISP Staff"
  },
  ispReseller: {
    name: "Sales Portal",
    shortName: "Sales",
    description: "Generate referrals and track commissions",
    icon: "\u{1F4B0}",
    userType: "Sales Agent"
  },
  ispCustomer: {
    name: "Customer Portal",
    shortName: "My Account",
    description: "Manage your internet service",
    icon: "\u{1F3E0}",
    userType: "Customer"
  }
};
var surfacePalette = {
  light: {
    background: "hsl(210 40% 98%)",
    foreground: "hsl(222.2 47.4% 11.2%)",
    muted: "hsl(210 16% 93%)",
    border: "hsl(214.3 31.8% 91.4%)"
  },
  dark: {
    background: "hsl(222.2 84% 4.9%)",
    foreground: "hsl(210 40% 98%)",
    muted: "hsl(217.2 32.6% 17.5%)",
    border: "hsl(217.2 32.6% 20%)"
  }
};
var DARK_LIGHTNESS_SHIFT = 8;
function adjustHslLightness(color, delta) {
  const match2 = color.match(/hsl\(\s*([\d.]+)[,\s]+([\d.]+)%[,\s]+([\d.]+)%\s*\)/i);
  if (!match2) {
    return color;
  }
  const [, hue, saturation, lightness] = match2;
  if (!lightness) {
    return color;
  }
  const nextLightness = Math.min(100, Math.max(0, parseFloat(lightness) + delta));
  return `hsl(${hue} ${saturation}% ${nextLightness}%)`;
}
function deriveDarkScale(scale) {
  return Object.entries(scale).reduce(
    (acc, [shade, value]) => ({
      ...acc,
      [shade]: adjustHslLightness(value, DARK_LIGHTNESS_SHIFT)
    }),
    scale
  );
}
function getPortalPalette(portal, mode) {
  const base = colorTokens[portal];
  const primary = mode === "dark" ? deriveDarkScale(base.primary) : base.primary;
  const accent = mode === "dark" ? adjustHslLightness(base.accent.DEFAULT, DARK_LIGHTNESS_SHIFT / 2) : base.accent.DEFAULT;
  return {
    primary,
    accent: { DEFAULT: accent },
    sidebar: base.sidebar,
    surface: surfacePalette[mode]
  };
}
function generateCSSVars(palette) {
  const colors = palette;
  return {
    // Primary color scale
    "--portal-primary-50": colors.primary[50],
    "--portal-primary-100": colors.primary[100],
    "--portal-primary-200": colors.primary[200],
    "--portal-primary-300": colors.primary[300],
    "--portal-primary-400": colors.primary[400],
    "--portal-primary-500": colors.primary[500],
    "--portal-primary-600": colors.primary[600],
    "--portal-primary-700": colors.primary[700],
    "--portal-primary-800": colors.primary[800],
    "--portal-primary-900": colors.primary[900],
    // Accent color
    "--portal-accent": colors.accent.DEFAULT,
    "--portal-surface": colors.surface.background,
    "--portal-surface-foreground": colors.surface.foreground,
    "--portal-surface-muted": colors.surface.muted,
    "--portal-surface-border": colors.surface.border,
    // Semantic colors (shared)
    "--portal-success": colorTokens.semantic.success,
    "--portal-warning": colorTokens.semantic.warning,
    "--portal-error": colorTokens.semantic.error,
    "--portal-info": colorTokens.semantic.info,
    // Status colors (shared)
    "--portal-status-online": colorTokens.status.online,
    "--portal-status-offline": colorTokens.status.offline,
    "--portal-status-degraded": colorTokens.status.degraded,
    "--portal-status-unknown": colorTokens.status.unknown
  };
}
var PortalThemeContext = (0, import_react2.createContext)(null);
function PortalThemeProvider({ children }) {
  const pathname = (0, import_navigation.usePathname)();
  const { resolvedTheme } = (0, import_next_themes.useTheme)();
  const [currentPortal, setCurrentPortal] = (0, import_react2.useState)(
    () => detectPortalFromRoute(pathname || "")
  );
  const colorMode = resolvedTheme === "dark" ? "dark" : "light";
  const palette = (0, import_react2.useMemo)(
    () => getPortalPalette(currentPortal, colorMode),
    [colorMode, currentPortal]
  );
  (0, import_react2.useEffect)(() => {
    const detectedPortal = detectPortalFromRoute(pathname || "");
    setCurrentPortal(detectedPortal);
  }, [pathname]);
  (0, import_react2.useEffect)(() => {
    const cssVars = generateCSSVars(palette);
    const root = document.documentElement;
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.setAttribute("data-portal", currentPortal);
    return () => {
      Object.keys(cssVars).forEach((key) => {
        root.style.removeProperty(key);
      });
      root.removeAttribute("data-portal");
    };
  }, [currentPortal, palette]);
  const theme = (0, import_react2.useMemo)(
    () => ({
      portal: currentPortal,
      metadata: portalMetadata[currentPortal],
      colors: palette,
      fontSize: portalFontSizes[currentPortal],
      spacing: portalSpacing[currentPortal],
      animations: portalAnimations[currentPortal],
      cssVars: generateCSSVars(palette),
      mode: colorMode
    }),
    [colorMode, currentPortal, palette]
  );
  const contextValue = (0, import_react2.useMemo)(
    () => ({
      currentPortal,
      theme,
      setPortal: setCurrentPortal
    }),
    [currentPortal, theme]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(PortalThemeContext.Provider, { value: contextValue, children });
}
function usePortalTheme() {
  const context = (0, import_react2.useContext)(PortalThemeContext);
  if (!context) {
    throw new Error("usePortalTheme must be used within PortalThemeProvider");
  }
  return context;
}

// src/components/portal-badge.tsx
var import_jsx_runtime29 = require("react/jsx-runtime");
function PortalBadge({
  showIcon = true,
  shortName = false,
  className,
  size = "md"
}) {
  const { theme } = usePortalTheme();
  const { metadata } = theme;
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
    "div",
    {
      className: cn(
        "inline-flex items-center rounded-full font-medium transition-colors",
        "bg-portal-primary/10 text-portal-primary border border-portal-primary/20",
        sizeClasses[size],
        className
      ),
      role: "status",
      "aria-label": `Current portal: ${metadata.name}`,
      children: [
        showIcon && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "shrink-0", children: metadata.icon }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { children: shortName ? metadata.shortName : metadata.name })
      ]
    }
  );
}
function PortalBadgeCompact({ className }) {
  const { theme } = usePortalTheme();
  const { metadata } = theme;
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
    "div",
    {
      className: cn(
        "inline-flex items-center justify-center w-8 h-8 rounded-full",
        "bg-portal-primary/10 text-portal-primary border border-portal-primary/20",
        "text-lg",
        className
      ),
      role: "status",
      "aria-label": `Current portal: ${metadata.name}`,
      title: metadata.name,
      children: metadata.icon
    }
  );
}
function PortalUserTypeBadge({ className }) {
  const { theme } = usePortalTheme();
  const { metadata } = theme;
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
    "div",
    {
      className: cn(
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium",
        "bg-muted text-muted-foreground border border-border",
        className
      ),
      role: "status",
      "aria-label": `User type: ${metadata.userType}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "mr-1.5", children: metadata.icon }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { children: metadata.userType })
      ]
    }
  );
}
function PortalIndicatorDot({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
    "span",
    {
      className: cn("inline-block w-2 h-2 rounded-full bg-portal-primary", className),
      "aria-hidden": "true"
    }
  );
}

// src/components/portal-button.tsx
var import_class_variance_authority5 = require("class-variance-authority");
var React18 = __toESM(require("react"));
var import_jsx_runtime30 = require("react/jsx-runtime");
var portalButtonVariants = (0, import_class_variance_authority5.cva)(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-portal-primary text-white hover:opacity-90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-portal-primary text-portal-primary bg-transparent hover:bg-portal-primary/10",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-portal-primary underline-offset-4 hover:underline",
        accent: "bg-portal-accent text-white hover:opacity-90"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var PortalButton = React18.forwardRef(
  ({
    className,
    variant,
    size,
    style,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    ...props
  }, ref) => {
    const { theme } = usePortalTheme();
    const { animations } = theme;
    const isDisabled = props.disabled;
    const handleMouseEnter = (event) => {
      if (!isDisabled) {
        event.currentTarget.style.transform = `scale(${animations.hoverScale})`;
      }
      onMouseEnter?.(event);
    };
    const handleMouseLeave = (event) => {
      event.currentTarget.style.transform = "scale(1)";
      onMouseLeave?.(event);
    };
    const handleMouseDown = (event) => {
      if (!isDisabled) {
        event.currentTarget.style.transform = `scale(${animations.activeScale})`;
      }
      onMouseDown?.(event);
    };
    const handleMouseUp = (event) => {
      if (!isDisabled) {
        event.currentTarget.style.transform = `scale(${animations.hoverScale})`;
      }
      onMouseUp?.(event);
    };
    return /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
      "button",
      {
        className: cn(portalButtonVariants({ variant, size, className })),
        ref,
        style: {
          transitionDuration: `${animations.duration}ms`,
          transitionTimingFunction: animations.easing,
          ...style
        },
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        ...props
      }
    );
  }
);
PortalButton.displayName = "PortalButton";

// src/components/portal-card.tsx
var React19 = __toESM(require("react"));
var import_jsx_runtime31 = require("react/jsx-runtime");
var PortalCard = React19.forwardRef(
  ({ className, hoverable = false, interactive = false, variant = "default", ...props }, ref) => {
    const { theme } = usePortalTheme();
    const { animations } = theme;
    const variantClasses = {
      default: "bg-card text-card-foreground border shadow-sm",
      elevated: "bg-card text-card-foreground shadow-lg",
      outlined: "bg-transparent border-2 border-portal-primary/20",
      flat: "bg-card text-card-foreground"
    };
    return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
      "div",
      {
        ref,
        className: cn(
          "rounded-lg",
          variantClasses[variant],
          hoverable && "transition-all hover:shadow-md",
          interactive && "cursor-pointer transition-all hover:shadow-md active:scale-[0.99]",
          className
        ),
        style: {
          transitionDuration: `${animations.duration}ms`,
          transitionTimingFunction: animations.easing
        },
        ...props
      }
    );
  }
);
PortalCard.displayName = "PortalCard";
var PortalCardHeader = React19.forwardRef(
  ({ className, ...props }, ref) => {
    const { theme } = usePortalTheme();
    return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
      "div",
      {
        ref,
        className: cn("flex flex-col space-y-1.5", className),
        style: {
          padding: theme.spacing.componentGap
        },
        ...props
      }
    );
  }
);
PortalCardHeader.displayName = "PortalCardHeader";
var PortalCardTitle = React19.forwardRef(({ className, children, ...props }, ref) => {
  const { theme } = usePortalTheme();
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
    "h3",
    {
      ref,
      className: cn("font-semibold leading-none tracking-tight", className),
      style: {
        fontSize: theme.fontSize.lg[0],
        lineHeight: theme.fontSize.lg[1].lineHeight
      },
      ...props,
      children
    }
  );
});
PortalCardTitle.displayName = "PortalCardTitle";
var PortalCardDescription = React19.forwardRef(({ className, ...props }, ref) => {
  const { theme } = usePortalTheme();
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
    "p",
    {
      ref,
      className: cn("text-muted-foreground", className),
      style: {
        fontSize: theme.fontSize.sm[0],
        lineHeight: theme.fontSize.sm[1].lineHeight
      },
      ...props
    }
  );
});
PortalCardDescription.displayName = "PortalCardDescription";
var PortalCardContent = React19.forwardRef(
  ({ className, ...props }, ref) => {
    const { theme } = usePortalTheme();
    return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
      "div",
      {
        ref,
        className: cn(className),
        style: {
          padding: theme.spacing.componentGap,
          paddingTop: 0
        },
        ...props
      }
    );
  }
);
PortalCardContent.displayName = "PortalCardContent";
var PortalCardFooter = React19.forwardRef(
  ({ className, ...props }, ref) => {
    const { theme } = usePortalTheme();
    return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
      "div",
      {
        ref,
        className: cn("flex items-center", className),
        style: {
          padding: theme.spacing.componentGap,
          paddingTop: 0
        },
        ...props
      }
    );
  }
);
PortalCardFooter.displayName = "PortalCardFooter";

// src/components/progress.tsx
var React20 = __toESM(require("react"));
var import_jsx_runtime32 = require("react/jsx-runtime");
var Progress = React20.forwardRef(
  ({ className = "", value = 0, indicatorClassName = "", ...props }, ref) => {
    const safeValue = isNaN(value) ? 0 : Math.min(100, Math.max(0, value));
    return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
      "div",
      {
        ref,
        className: `relative h-2 w-full overflow-hidden rounded-full bg-muted ${className}`,
        ...props,
        children: /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          "div",
          {
            className: `h-full transition-all ${indicatorClassName || "bg-sky-500"}`,
            style: { width: `${safeValue}%` }
          }
        )
      }
    );
  }
);
Progress.displayName = "Progress";

// src/components/radio-group.tsx
var React21 = __toESM(require("react"));
var import_jsx_runtime33 = require("react/jsx-runtime");
var RadioGroup2 = React21.forwardRef(
  ({ className = "", value, onValueChange, defaultValue, name, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React21.useState(defaultValue);
    const currentValue = value !== void 0 ? value : internalValue;
    const generatedName = React21.useId().replace(/:/g, "");
    const groupName = name ?? `radio-group-${generatedName}`;
    const handleChange = React21.useCallback(
      (newValue) => {
        if (value === void 0) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [value, onValueChange]
    );
    return /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { ref, className: `grid gap-2 ${className}`, ...props, children: React21.Children.map(children, (child) => {
      if (React21.isValidElement(child) && child.type === RadioGroupItem) {
        return React21.cloneElement(child, {
          ...child.props,
          name: groupName,
          checked: child.props.value === currentValue,
          onChange: () => handleChange(child.props.value)
        });
      }
      return child;
    }) });
  }
);
RadioGroup2.displayName = "RadioGroup";
var RadioGroupItem = React21.forwardRef(({ className = "", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
  "input",
  {
    type: "radio",
    ref,
    className: `h-4 w-4 rounded-full border border-border text-sky-500 focus:ring-sky-500 ${className}`,
    ...props
  }
));
RadioGroupItem.displayName = "RadioGroupItem";

// src/components/scroll-area.tsx
var React22 = __toESM(require("react"));
var import_jsx_runtime34 = require("react/jsx-runtime");
var ScrollArea = React22.forwardRef(
  ({ className = "", children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { ref, className: `relative overflow-auto ${className}`, ...props, children })
);
ScrollArea.displayName = "ScrollArea";
var ScrollBar = React22.forwardRef(
  ({ className = "", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { ref, className: `${className}`, ...props })
);
ScrollBar.displayName = "ScrollBar";

// src/components/select.tsx
var SelectPrimitive = __toESM(require("@radix-ui/react-select"));
var import_lucide_react12 = require("lucide-react");
var React23 = __toESM(require("react"));
var import_jsx_runtime35 = require("react/jsx-runtime");
var SelectOpenContext = React23.createContext(false);
var Select = ({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}) => {
  const [internalOpen, setInternalOpen] = React23.useState(defaultOpen);
  const isControlled = openProp !== void 0;
  const open = isControlled ? openProp : internalOpen;
  React23.useEffect(() => {
    if (!open || typeof document === "undefined" || typeof MutationObserver === "undefined") {
      return;
    }
    const { body } = document;
    const ensurePointerEvents = () => {
      if (body.style.pointerEvents === "none") {
        body.style.pointerEvents = "";
      }
    };
    ensurePointerEvents();
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          ensurePointerEvents();
        }
      }
    });
    observer.observe(body, { attributes: true, attributeFilter: ["style"] });
    return () => {
      observer.disconnect();
      body.style.removeProperty("pointer-events");
    };
  }, [open]);
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(SelectOpenContext.Provider, { value: open, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
    SelectPrimitive.Root,
    {
      ...props,
      open,
      onOpenChange: (nextOpen) => {
        if (!isControlled) {
          setInternalOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
      },
      children
    }
  ) });
};
Select.displayName = SelectPrimitive.Root.displayName;
var SelectGroup = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(SelectPrimitive.Group, { ref, className: cn("p-1 text-foreground", className), ...props }));
SelectGroup.displayName = SelectPrimitive.Group.displayName;
var SelectValue = React23.forwardRef((props, ref) => {
  const open = React23.useContext(SelectOpenContext);
  if (open) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(SelectPrimitive.Value, { ref, ...props });
});
SelectValue.displayName = SelectPrimitive.Value.displayName;
var SelectTrigger = React23.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_lucide_react12.ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = "Trigger";
var SelectContent = React23.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(SelectPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(SelectScrollUpButton, {}),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = "Content";
var SelectLabel = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = "Label";
var SelectItem = React23.forwardRef(({ className, children, disabled, ...props }, ref) => {
  const itemClassName = cn(
    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    className
  );
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
    SelectPrimitive.Item,
    {
      ref,
      className: itemClassName,
      disabled: Boolean(disabled),
      ...props,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_lucide_react12.Check, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(SelectPrimitive.ItemText, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className, "data-disabled": disabled ? "" : void 0, children }) })
      ]
    }
  );
});
SelectItem.displayName = "Item";
var SelectSeparator = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = "Separator";
var SelectScrollUpButton = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_lucide_react12.ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = "ScrollUpButton";
var SelectScrollDownButton = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_lucide_react12.ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = "ScrollDownButton";

// src/components/separator.tsx
var React24 = __toESM(require("react"));
var import_jsx_runtime36 = require("react/jsx-runtime");
var Separator3 = React24.forwardRef(
  ({ className = "", orientation = "horizontal", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
    "div",
    {
      ref,
      className: `shrink-0 bg-muted ${orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"} ${className}`,
      ...props
    }
  )
);
Separator3.displayName = "Separator";

// src/components/skeleton.tsx
var import_jsx_runtime37 = require("react/jsx-runtime");
function Skeleton({ className = "", variant = "default", ...props }) {
  const variants = {
    default: "rounded-lg",
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-md"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: `animate-pulse bg-muted ${variants[variant]} ${className}`, ...props });
}
function SkeletonCard() {
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "rounded-lg border border-border bg-card p-6", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "space-y-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(Skeleton, { className: "h-6 w-1/3", variant: "text" }),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(Skeleton, { className: "h-4 w-full", variant: "text" }),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(Skeleton, { className: "h-4 w-5/6", variant: "text" }),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "flex gap-2 mt-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(Skeleton, { className: "h-10 w-24", variant: "rectangular" }),
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(Skeleton, { className: "h-10 w-24", variant: "rectangular" })
    ] })
  ] }) });
}
function SkeletonMetricCard() {
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "rounded-lg border border-border bg-card p-6", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "flex-1 space-y-3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(Skeleton, { className: "h-4 w-32", variant: "text" }),
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(Skeleton, { className: "h-8 w-24", variant: "text" }),
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(Skeleton, { className: "h-3 w-20", variant: "text" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(Skeleton, { className: "h-12 w-12", variant: "rectangular" })
  ] }) });
}
function SkeletonTable({ rows = 5 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "space-y-3", children: Array.from({ length: rows }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(Skeleton, { className: "h-10 w-10", variant: "circular" }),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "flex-1 space-y-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(Skeleton, { className: "h-4 w-1/4", variant: "text" }),
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(Skeleton, { className: "h-3 w-1/3", variant: "text" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(Skeleton, { className: "h-8 w-20", variant: "rectangular" })
  ] }, i)) });
}

// src/components/skip-link.tsx
var import_jsx_runtime38 = require("react/jsx-runtime");
function SkipLink() {
  return /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
    "a",
    {
      href: "#main-content",
      className: "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
      children: "Skip to main content"
    }
  );
}

// src/components/status-badge.tsx
var import_jsx_runtime39 = require("react/jsx-runtime");
var variantStyles = {
  success: "bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400 border-green-200 dark:border-green-900/20",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/20",
  error: "bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400 border-red-200 dark:border-red-900/20",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200 dark:border-blue-900/20",
  pending: "bg-orange-100 text-orange-800 dark:bg-orange-950/20 dark:text-orange-400 border-orange-200 dark:border-orange-900/20",
  active: "bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400 border-green-200 dark:border-green-900/20",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-950/20 dark:text-gray-400 border-gray-200 dark:border-gray-900/20",
  suspended: "bg-orange-100 text-orange-800 dark:bg-orange-950/20 dark:text-orange-400 border-orange-200 dark:border-orange-900/20",
  terminated: "bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400 border-red-200 dark:border-red-900/20",
  paid: "bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400 border-green-200 dark:border-green-900/20",
  unpaid: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/20",
  overdue: "bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400 border-red-200 dark:border-red-900/20",
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-950/20 dark:text-gray-400 border-gray-200 dark:border-gray-900/20",
  published: "bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200 dark:border-blue-900/20",
  archived: "bg-gray-100 text-gray-800 dark:bg-gray-950/20 dark:text-gray-400 border-gray-200 dark:border-gray-900/20",
  default: "bg-muted text-muted-foreground border-border"
};
var sizeStyles2 = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5"
};
var dotStyles = {
  success: "bg-green-600 dark:bg-green-400",
  warning: "bg-yellow-600 dark:bg-yellow-400",
  error: "bg-red-600 dark:bg-red-400",
  info: "bg-blue-600 dark:bg-blue-400",
  pending: "bg-orange-600 dark:bg-orange-400",
  active: "bg-green-600 dark:bg-green-400",
  inactive: "bg-gray-600 dark:bg-gray-400",
  suspended: "bg-orange-600 dark:bg-orange-400",
  terminated: "bg-red-600 dark:bg-red-400",
  paid: "bg-green-600 dark:bg-green-400",
  unpaid: "bg-yellow-600 dark:bg-yellow-400",
  overdue: "bg-red-600 dark:bg-red-400",
  draft: "bg-gray-600 dark:bg-gray-400",
  published: "bg-blue-600 dark:bg-blue-400",
  archived: "bg-gray-600 dark:bg-gray-400",
  default: "bg-muted-foreground"
};
function StatusBadge({
  children,
  variant = "default",
  className,
  size = "md",
  showDot = false
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        variantStyles[variant],
        sizeStyles2[size],
        className
      ),
      role: "status",
      "aria-label": `Status: ${children}`,
      children: [
        showDot && /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("span", { className: cn("h-1.5 w-1.5 rounded-full", dotStyles[variant]), "aria-hidden": "true" }),
        children
      ]
    }
  );
}
function getStatusVariant(status) {
  const normalizedStatus = status.toLowerCase().trim();
  const statusMap = {
    // Payment statuses
    paid: "paid",
    unpaid: "unpaid",
    overdue: "overdue",
    pending: "pending",
    // General statuses
    active: "active",
    inactive: "inactive",
    suspended: "suspended",
    terminated: "terminated",
    // Content statuses
    draft: "draft",
    published: "published",
    archived: "archived",
    // Result statuses
    success: "success",
    completed: "success",
    approved: "success",
    failed: "error",
    rejected: "error",
    error: "error",
    warning: "warning",
    info: "info"
  };
  return statusMap[normalizedStatus] || "default";
}

// src/components/switch.tsx
var React25 = __toESM(require("react"));
var import_jsx_runtime40 = require("react/jsx-runtime");
var Switch = React25.forwardRef(
  ({ className = "", checked = false, onCheckedChange, ...props }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(
      "button",
      {
        role: "switch",
        "aria-checked": checked,
        onClick: () => onCheckedChange?.(!checked),
        className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"} ${className}`,
        ref,
        ...props,
        children: /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(
          "span",
          {
            className: `inline-block h-4 w-4 transform rounded-full bg-primary-foreground transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`
          }
        )
      }
    );
  }
);
Switch.displayName = "Switch";

// src/components/table-pagination.tsx
var React26 = __toESM(require("react"));
var import_jsx_runtime41 = require("react/jsx-runtime");
function TablePagination({
  pageIndex,
  pageCount,
  pageSize,
  pageSizeOptions = [10, 20, 30, 50, 100],
  totalItems,
  canNextPage,
  canPreviousPage,
  onPageChange,
  onPageSizeChange,
  selectedCount,
  filteredCount,
  className
}) {
  const hasNext = canNextPage !== void 0 ? canNextPage : pageIndex < pageCount - 1;
  const hasPrevious = canPreviousPage !== void 0 ? canPreviousPage : pageIndex > 0;
  const startItem = pageIndex * pageSize + 1;
  const endItem = totalItems !== void 0 ? Math.min((pageIndex + 1) * pageSize, totalItems) : (pageIndex + 1) * pageSize;
  return /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("div", { className: cn("flex items-center justify-between", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("div", { className: "text-sm text-muted-foreground", children: selectedCount !== void 0 && selectedCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("span", { children: [
      selectedCount,
      " of ",
      filteredCount ?? totalItems ?? "many",
      " row(s) selected"
    ] }) : totalItems !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("span", { children: [
      "Showing ",
      startItem,
      " to ",
      endItem,
      " of ",
      totalItems,
      " results"
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("span", { children: [
      "Page ",
      pageIndex + 1,
      " of ",
      pageCount
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("div", { className: "flex items-center space-x-6 lg:space-x-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("p", { className: "text-sm font-medium text-foreground", children: "Rows per page" }),
        /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(
          "select",
          {
            value: pageSize,
            onChange: (e) => {
              onPageSizeChange(Number(e.target.value));
            },
            className: "h-8 w-[70px] rounded-md border border-input bg-card px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "aria-label": "Select page size",
            children: pageSizeOptions.map((size) => /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("option", { value: size, children: size }, size))
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("div", { className: "flex w-[100px] items-center justify-center text-sm font-medium text-foreground", children: [
        "Page ",
        pageIndex + 1,
        " of ",
        pageCount
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => onPageChange(pageIndex - 1),
            disabled: !hasPrevious,
            "aria-label": "Go to previous page",
            children: "Previous"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => onPageChange(pageIndex + 1),
            disabled: !hasNext,
            "aria-label": "Go to next page",
            children: "Next"
          }
        )
      ] })
    ] })
  ] });
}
function usePagination(defaultPageSize = 10) {
  const [pageIndex, setPageIndex] = React26.useState(0);
  const [pageSize, setPageSize] = React26.useState(defaultPageSize);
  const offset = pageIndex * pageSize;
  const handlePageChange = React26.useCallback((newPageIndex) => {
    setPageIndex(newPageIndex);
  }, []);
  const handlePageSizeChange = React26.useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setPageIndex(0);
  }, []);
  const resetPagination = React26.useCallback(() => {
    setPageIndex(0);
  }, []);
  return {
    pageIndex,
    pageSize,
    offset,
    limit: pageSize,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    resetPagination
  };
}

// src/components/tabs.tsx
var React27 = __toESM(require("react"));
var import_jsx_runtime42 = require("react/jsx-runtime");
var TabsContext = React27.createContext(void 0);
var Tabs = React27.forwardRef(
  ({ children, defaultValue, value: controlledValue, onValueChange, orientation, ...props }, ref) => {
    const [internalValue, setInternalValue] = React27.useState(defaultValue || "");
    const value = controlledValue !== void 0 ? controlledValue : internalValue;
    const handleValueChange = React27.useCallback(
      (newValue) => {
        if (controlledValue === void 0) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [controlledValue, onValueChange]
    );
    const contextValue = React27.useMemo(() => {
      const base = {
        value,
        onValueChange: handleValueChange
      };
      return orientation ? { ...base, orientation } : base;
    }, [value, handleValueChange, orientation]);
    return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(TabsContext.Provider, { value: contextValue, children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { ref, ...props, children }) });
  }
);
Tabs.displayName = "Tabs";
var TabsList = React27.forwardRef(
  ({ children, className = "", ...props }, ref) => {
    const context = React27.useContext(TabsContext);
    return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
      "div",
      {
        ref,
        role: "tablist",
        "aria-orientation": context?.orientation,
        className: `inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`,
        ...props,
        children
      }
    );
  }
);
TabsList.displayName = "TabsList";
var TabsTrigger = React27.forwardRef(
  ({ children, className = "", value, disabled, ...props }, ref) => {
    const context = React27.useContext(TabsContext);
    if (!context) {
      throw new Error("TabsTrigger must be used within a Tabs component");
    }
    const isActive = context.value === value;
    const triggerId = `tab-trigger-${value}`;
    const panelId = `tab-panel-${value}`;
    const handleClick = () => {
      if (!disabled) {
        context.onValueChange(value);
      }
    };
    return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
      "button",
      {
        ref,
        id: triggerId,
        role: "tab",
        "aria-selected": isActive,
        "aria-controls": panelId,
        tabIndex: isActive ? 0 : -1,
        disabled,
        className: `inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-background/50 hover:text-foreground"} ${className}`,
        onClick: handleClick,
        "data-state": isActive ? "active" : "inactive",
        ...props,
        children
      }
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";
var TabsContent = React27.forwardRef(
  ({ children, className = "", value, ...props }, ref) => {
    const context = React27.useContext(TabsContext);
    if (!context) {
      throw new Error("TabsContent must be used within a Tabs component");
    }
    const isActive = context.value === value;
    const triggerId = `tab-trigger-${value}`;
    const panelId = `tab-panel-${value}`;
    if (!isActive) {
      return null;
    }
    return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
      "div",
      {
        ref,
        id: panelId,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        tabIndex: 0,
        className: `mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`,
        "data-state": "active",
        "data-value": value,
        ...props,
        children
      }
    );
  }
);
TabsContent.displayName = "TabsContent";

// src/components/textarea.tsx
var React28 = __toESM(require("react"));
var import_jsx_runtime43 = require("react/jsx-runtime");
var Textarea = React28.forwardRef(
  ({ className = "", ...props }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
      "textarea",
      {
        className: `flex min-h-[80px] w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`,
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";

// src/components/theme-toggle.tsx
var import_lucide_react13 = require("lucide-react");
var import_next_themes2 = require("next-themes");
var React29 = __toESM(require("react"));
var import_jsx_runtime44 = require("react/jsx-runtime");
var defaultLabels = {
  light: "Light",
  dark: "Dark",
  system: "System",
  switchTo: (theme) => `Switch to ${theme} mode`,
  modeTitle: (theme) => `${theme} mode`
};
function ThemeToggle({ className = "", labels }) {
  const { theme, setTheme } = (0, import_next_themes2.useTheme)();
  const [mounted, setMounted] = React29.useState(false);
  const t = {
    light: labels?.light ?? defaultLabels.light,
    dark: labels?.dark ?? defaultLabels.dark,
    system: labels?.system ?? defaultLabels.system,
    switchTo: labels?.switchTo ?? defaultLabels.switchTo,
    modeTitle: labels?.modeTitle ?? defaultLabels.modeTitle
  };
  React29.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);
  if (!mounted) {
    return /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("div", { className: cn("h-9 w-9 rounded-lg bg-muted animate-pulse", className) });
  }
  const themes = [
    { value: "light", icon: import_lucide_react13.Sun, label: t.light },
    { value: "dark", icon: import_lucide_react13.Moon, label: t.dark },
    { value: "system", icon: import_lucide_react13.Monitor, label: t.system }
  ];
  const currentTheme = theme || "system";
  return /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("div", { className: cn("flex items-center gap-1 p-1 rounded-lg bg-secondary", className), children: themes.map(({ value, icon: Icon2, label }) => /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(
    "button",
    {
      onClick: () => setTheme(value),
      className: cn(
        "p-2 rounded-md transition-all duration-200",
        "hover:bg-accent",
        currentTheme === value ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
      ),
      "aria-label": t.switchTo(label),
      title: t.modeTitle(label),
      children: /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(Icon2, { className: "h-4 w-4" })
    },
    value
  )) });
}
function ThemeToggleButton({ className = "", labels }) {
  const { theme, setTheme } = (0, import_next_themes2.useTheme)();
  const [mounted, setMounted] = React29.useState(false);
  const t = {
    light: labels?.light ?? defaultLabels.light,
    dark: labels?.dark ?? defaultLabels.dark,
    switchTo: labels?.switchTo ?? defaultLabels.switchTo
  };
  React29.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);
  if (!mounted) {
    return /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("button", { className: cn("h-9 w-9 rounded-lg bg-muted animate-pulse", className) });
  }
  const isDark = theme === "dark";
  const targetLabel = isDark ? t.light : t.dark;
  return /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(
    "button",
    {
      onClick: () => setTheme(isDark ? "light" : "dark"),
      className: cn(
        "p-2 rounded-lg transition-all duration-200",
        "bg-secondary hover:bg-accent",
        "text-muted-foreground hover:text-foreground",
        className
      ),
      "aria-label": t.switchTo(targetLabel),
      children: isDark ? /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(import_lucide_react13.Sun, { className: "h-5 w-5 transition-transform duration-200 rotate-0 scale-100" }) : /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(import_lucide_react13.Moon, { className: "h-5 w-5 transition-transform duration-200 rotate-0 scale-100" })
    }
  );
}

// src/components/toast.tsx
var import_lucide_react14 = require("lucide-react");
var import_react3 = require("react");
var import_jsx_runtime45 = require("react/jsx-runtime");
var toastQueue = [];
var setToasts = null;
var addToast = ({ type, message: message2, duration: duration2 }) => {
  const id = Math.random().toString(36).substr(2, 9);
  const newToast = {
    id,
    type,
    message: message2,
    ...duration2 !== void 0 ? { duration: duration2 } : {}
  };
  toastQueue = [...toastQueue, newToast];
  if (setToasts) {
    setToasts([...toastQueue]);
  }
  setTimeout(() => {
    removeToast(id);
  }, duration2 ?? 5e3);
};
var removeToast = (id) => {
  toastQueue = toastQueue.filter((toast2) => toast2.id !== id);
  if (setToasts) {
    setToasts([...toastQueue]);
  }
};
var withOptionalDuration = (type, message2, duration2) => addToast({
  type,
  message: message2,
  ...duration2 !== void 0 ? { duration: duration2 } : {}
});
var toast = {
  success: (message2, duration2) => withOptionalDuration("success", message2, duration2),
  error: (message2, duration2) => withOptionalDuration("error", message2, duration2),
  info: (message2, duration2) => withOptionalDuration("info", message2, duration2),
  warning: (message2, duration2) => withOptionalDuration("warning", message2, duration2)
};
var getToastIcon = (type) => {
  switch (type) {
    case "success":
      return /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(import_lucide_react14.CheckCircle, { className: "h-5 w-5 text-green-400" });
    case "error":
      return /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(import_lucide_react14.AlertCircle, { className: "h-5 w-5 text-red-400" });
    case "warning":
      return /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(import_lucide_react14.AlertTriangle, { className: "h-5 w-5 text-yellow-400" });
    case "info":
      return /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(import_lucide_react14.Info, { className: "h-5 w-5 text-blue-400" });
  }
};
var getToastStyles = (type) => {
  switch (type) {
    case "success":
      return "bg-green-900/90 border-green-500/50 text-green-100";
    case "error":
      return "bg-red-900/90 border-red-500/50 text-red-100";
    case "warning":
      return "bg-yellow-900/90 border-yellow-500/50 text-yellow-100";
    case "info":
      return "bg-blue-900/90 border-blue-500/50 text-blue-100";
  }
};
function ToastContainer() {
  const [toasts, setToastsState] = (0, import_react3.useState)([]);
  (0, import_react3.useEffect)(() => {
    setToasts = setToastsState;
    setToastsState([...toastQueue]);
    return () => {
      setToasts = null;
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "fixed top-4 right-4 z-[60] space-y-2", children: toasts.map((toast2) => /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)(
    "div",
    {
      className: `flex items-center gap-3 p-4 rounded-lg border backdrop-blur-sm min-w-[300px] max-w-[500px] animate-in slide-in-from-right-full ${getToastStyles(toast2.type)}`,
      children: [
        getToastIcon(toast2.type),
        /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("p", { className: "flex-1 text-sm font-medium", children: toast2.message }),
        /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
          "button",
          {
            onClick: () => removeToast(toast2.id),
            className: "text-current/70 hover:text-current transition-colors",
            children: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(import_lucide_react14.X, { className: "h-4 w-4" })
          }
        )
      ]
    },
    toast2.id
  )) });
}

// src/components/tooltip.tsx
var TooltipPrimitive = __toESM(require("@radix-ui/react-tooltip"));
var React30 = __toESM(require("react"));
var import_jsx_runtime46 = require("react/jsx-runtime");
var TooltipProvider = ({
  children,
  delayDuration = 0,
  skipDelayDuration = 0,
  disableHoverableContent = true,
  ...props
}) => {
  React30.useEffect(() => {
    const sanitizeTooltipNodes = (root) => {
      const potentialNodes = root.querySelectorAll('[role="tooltip"]');
      potentialNodes.forEach((tooltipNode) => {
        const inlineStyle = tooltipNode.getAttribute("style") ?? "";
        if (inlineStyle.includes("clip: rect")) {
          tooltipNode.textContent = "";
          tooltipNode.setAttribute("aria-hidden", "true");
          tooltipNode.setAttribute("data-aria-hidden", "true");
        }
      });
    };
    sanitizeTooltipNodes(document.body);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.getAttribute("role") === "tooltip") {
              const inlineStyle = node.getAttribute("style") ?? "";
              if (inlineStyle.includes("clip: rect")) {
                node.textContent = "";
                node.setAttribute("aria-hidden", "true");
                node.setAttribute("data-aria-hidden", "true");
              }
            } else {
              sanitizeTooltipNodes(node);
            }
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(
    TooltipPrimitive.Provider,
    {
      delayDuration,
      skipDelayDuration,
      disableHoverableContent,
      ...props,
      children
    }
  );
};
var Tooltip = TooltipPrimitive.Root;
var TooltipTrigger = TooltipPrimitive.Trigger;
var TooltipContent = React30.forwardRef(({ className, sideOffset = 4, ...props }, ref) => {
  const contentRef = React30.useRef(null);
  const setRefs = React30.useCallback(
    (node) => {
      contentRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );
  React30.useEffect(() => {
    const node = contentRef.current;
    if (!node) {
      return;
    }
    const syncTooltipNode = () => {
      const hiddenTooltip = node.querySelector('[role="tooltip"]');
      if (hiddenTooltip && hiddenTooltip !== node) {
        const hiddenId = hiddenTooltip.getAttribute("id");
        if (hiddenId) {
          node.setAttribute("id", hiddenId);
        }
      }
      const potentialHiddenNodes = document.querySelectorAll('[role="tooltip"]');
      potentialHiddenNodes.forEach((tooltipNode) => {
        if (tooltipNode === node) {
          return;
        }
        const inlineStyle = tooltipNode.getAttribute("style") ?? "";
        if (inlineStyle.includes("clip: rect")) {
          tooltipNode.textContent = "";
          tooltipNode.setAttribute("aria-hidden", "true");
          tooltipNode.setAttribute("data-aria-hidden", "true");
        }
      });
      node.setAttribute("role", "tooltip");
    };
    const observer = new MutationObserver(syncTooltipNode);
    observer.observe(node, { childList: true });
    syncTooltipNode();
    return () => observer.disconnect();
  }, [props.children]);
  return /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(
    TooltipPrimitive.Content,
    {
      ref: setRefs,
      sideOffset,
      className: cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      ),
      ...props
    }
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// src/components/sheet.tsx
var SheetPrimitive = __toESM(require("@radix-ui/react-dialog"));
var import_class_variance_authority6 = require("class-variance-authority");
var import_lucide_react15 = require("lucide-react");
var React31 = __toESM(require("react"));
var import_jsx_runtime47 = require("react/jsx-runtime");
var Sheet = SheetPrimitive.Root;
var SheetTrigger = SheetPrimitive.Trigger;
var SheetClose = SheetPrimitive.Close;
var SheetPortal = SheetPrimitive.Portal;
var SheetOverlay = React31.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
  SheetPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = "Overlay";
var sheetVariants = (0, import_class_variance_authority6.cva)(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
var SheetContent = React31.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)(SheetPortal, { children: [
  /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(SheetOverlay, {}),
  /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)(SheetPrimitive.Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
    children,
    /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)(SheetPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(import_lucide_react15.X, { className: "h-4 w-4" }),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { className: "sr-only", children: "Close" })
    ] })
  ] })
] }));
SheetContent.displayName = "Content";
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
SheetFooter.displayName = "SheetFooter";
var SheetTitle = React31.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
  SheetPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = "Title";
var SheetDescription = React31.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
  SheetPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = "Description";

// src/components/popover.tsx
var PopoverPrimitive = __toESM(require("@radix-ui/react-popover"));
var React32 = __toESM(require("react"));
var import_jsx_runtime48 = require("react/jsx-runtime");
var PopoverContext = React32.createContext(null);
var Popover = ({ children, ...props }) => {
  const focusFirstRef = React32.useRef(null);
  const contextValue = React32.useMemo(() => ({ focusFirstRef }), [focusFirstRef]);
  return /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(PopoverContext.Provider, { value: contextValue, children: /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(PopoverPrimitive.Root, { ...props, children }) });
};
var PopoverTrigger = React32.forwardRef(({ onKeyDown, ...props }, ref) => {
  const context = React32.useContext(PopoverContext);
  const handleKeyDown = (event) => {
    onKeyDown?.(event);
    if (event.key === "Tab" && !event.shiftKey && context?.focusFirstRef.current) {
      event.preventDefault();
      context.focusFirstRef.current();
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(PopoverPrimitive.Trigger, { ref, onKeyDown: handleKeyDown, ...props });
});
PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;
var PopoverAnchor = PopoverPrimitive.Anchor;
var PopoverContent = React32.forwardRef(({ className, align = "center", sideOffset = 4, onOpenAutoFocus, ...props }, ref) => {
  const context = React32.useContext(PopoverContext);
  const contentRef = React32.useRef(null);
  const setRefs = React32.useCallback(
    (node) => {
      contentRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );
  const focusFirst = React32.useCallback(() => {
    const focusable = contentRef.current?.querySelector(
      'input, button, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
  }, []);
  React32.useEffect(() => {
    if (context) {
      context.focusFirstRef.current = focusFirst;
    }
  }, [context, focusFirst]);
  const handleOpenAutoFocus = React32.useCallback(
    (event) => {
      event.preventDefault();
      onOpenAutoFocus?.(event);
    },
    [onOpenAutoFocus]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(PopoverPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(
    PopoverPrimitive.Content,
    {
      ref: setRefs,
      align,
      sideOffset,
      onOpenAutoFocus: handleOpenAutoFocus,
      className: cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      ),
      ...props
    }
  ) });
});
PopoverContent.displayName = "Content";

// src/components/combobox.tsx
var import_lucide_react16 = require("lucide-react");
var React33 = __toESM(require("react"));
var import_jsx_runtime49 = require("react/jsx-runtime");
function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  disabled = false,
  className
}) {
  const [open, setOpen] = React33.useState(false);
  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;
  const triggerTextClass = cn("max-w-full truncate", !selectedOption && "text-muted-foreground");
  return /* @__PURE__ */ (0, import_jsx_runtime49.jsxs)(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime49.jsxs)(
      Button,
      {
        variant: "outline",
        role: "combobox",
        "aria-expanded": open,
        "aria-label": displayText,
        disabled,
        className: cn("w-full justify-between", className),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(
            "span",
            {
              "aria-hidden": "true",
              className: triggerTextClass,
              style: { visibility: open ? "hidden" : "visible" },
              children: displayText
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(import_lucide_react16.ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })
        ]
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(PopoverContent, { className: "w-full p-0", align: "start", children: /* @__PURE__ */ (0, import_jsx_runtime49.jsxs)(Command, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(CommandInput, { placeholder: searchPlaceholder }),
      /* @__PURE__ */ (0, import_jsx_runtime49.jsxs)(CommandList, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(CommandEmpty, { children: emptyText }),
        /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(CommandGroup, { children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime49.jsxs)(
          CommandItem,
          {
            value: option.value,
            ...option.disabled !== void 0 ? { disabled: option.disabled } : {},
            onSelect: (currentValue) => {
              onValueChange?.(currentValue === value ? "" : currentValue);
              setOpen(false);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(
                import_lucide_react16.Check,
                {
                  className: cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )
                }
              ),
              option.label
            ]
          },
          option.value
        )) })
      ] })
    ] }) })
  ] });
}
function MultiCombobox({
  options,
  value,
  onValueChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  disabled = false,
  className
}) {
  const [open, setOpen] = React33.useState(false);
  const [internalValue, setInternalValue] = React33.useState(value ?? []);
  const preventCloseRef = React33.useRef(false);
  React33.useEffect(() => {
    if (value !== void 0) {
      setInternalValue(value);
    }
  }, [value]);
  const selectedValues = internalValue;
  const selectedCount = selectedValues.length;
  const displayText = selectedCount === 0 ? placeholder : `${selectedCount} selected`;
  const triggerTextClass = cn(
    "max-w-full truncate",
    selectedCount === 0 && "text-muted-foreground"
  );
  const handleSelect = (optionValue) => {
    const newValue = selectedValues.includes(optionValue) ? selectedValues.filter((v) => v !== optionValue) : [...selectedValues, optionValue];
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };
  const handleTriggerPointerDown = () => {
    if (open) {
      preventCloseRef.current = true;
    }
  };
  const handleOpenChange = (nextOpen) => {
    if (!nextOpen && preventCloseRef.current) {
      preventCloseRef.current = false;
      return;
    }
    preventCloseRef.current = false;
    setOpen(nextOpen);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime49.jsxs)(Popover, { open, onOpenChange: handleOpenChange, children: [
    /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime49.jsxs)(
      Button,
      {
        variant: "outline",
        role: "combobox",
        "aria-expanded": open,
        "aria-label": displayText,
        disabled,
        onPointerDown: handleTriggerPointerDown,
        className: cn("w-full justify-between", className),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(
            "span",
            {
              "aria-hidden": "true",
              className: triggerTextClass,
              style: { visibility: open ? "hidden" : "visible" },
              children: displayText
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(import_lucide_react16.ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })
        ]
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(PopoverContent, { className: "w-full p-0", align: "start", children: /* @__PURE__ */ (0, import_jsx_runtime49.jsxs)(Command, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(CommandInput, { placeholder: searchPlaceholder }),
      /* @__PURE__ */ (0, import_jsx_runtime49.jsxs)(CommandList, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(CommandEmpty, { children: emptyText }),
        /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(CommandGroup, { children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime49.jsxs)(
          CommandItem,
          {
            value: option.value,
            ...option.disabled !== void 0 ? { disabled: option.disabled } : {},
            onSelect: () => handleSelect(option.value),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(
                import_lucide_react16.Check,
                {
                  className: cn(
                    "mr-2 h-4 w-4",
                    selectedValues.includes(option.value) ? "opacity-100" : "opacity-0"
                  )
                }
              ),
              option.label
            ]
          },
          option.value
        )) })
      ] })
    ] }) })
  ] });
}

// src/components/calendar.tsx
var import_lucide_react17 = require("lucide-react");
var React34 = __toESM(require("react"));
var import_react_day_picker = require("react-day-picker");
var import_jsx_runtime50 = require("react/jsx-runtime");
var baseClassNames = {
  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
  month_caption: "flex justify-center pt-1 relative items-center",
  month_grid: "w-full border-collapse space-y-1",
  caption_label: "text-sm font-medium",
  nav: "space-x-1 flex items-center",
  button_previous: cn(
    buttonVariants({ variant: "outline" }),
    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
  ),
  button_next: cn(
    buttonVariants({ variant: "outline" }),
    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
  ),
  chevron: "h-4 w-4",
  weekday: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
  day: "group h-9 w-9",
  hidden: "invisible",
  range_start: "group-data-[range_start=true]:rounded-l-md",
  range_middle: "group-data-[range_middle=true]:bg-accent group-data-[range_middle=true]:text-accent-foreground",
  range_end: "group-data-[range_end=true]:rounded-r-md",
  focused: "outline-none focus-visible:ring-2 focus-visible:ring-primary"
};
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  defaultMonth,
  month,
  mode,
  ...props
}) {
  const resolvedMode = mode ?? "single";
  const mergedClassNames = React34.useMemo(() => {
    const result = { ...classNames ?? {} };
    Object.keys(baseClassNames).forEach((key) => {
      const baseValue = baseClassNames[key];
      const incomingValue = classNames?.[key];
      result[key] = cn(baseValue, incomingValue);
    });
    if (classNames?.caption) {
      result.month_caption = cn(
        baseClassNames.month_caption,
        classNames.caption,
        classNames.month_caption
      );
    }
    return result;
  }, [classNames]);
  const DayButton = React34.useMemo(() => {
    const Button2 = ({ modifiers, className: className2, children, ...rest }) => {
      return /* @__PURE__ */ (0, import_jsx_runtime50.jsx)(
        "button",
        {
          className: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
            modifiers?.["selected"] && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            modifiers?.["today"] && "bg-accent text-accent-foreground",
            modifiers?.["outside"] && "text-muted-foreground opacity-50",
            modifiers?.["disabled"] && "text-muted-foreground opacity-50",
            className2
          ),
          ...rest,
          children
        }
      );
    };
    Button2.displayName = "CalendarDayButton";
    return Button2;
  }, []);
  const selectedValue = "selected" in props ? props.selected : void 0;
  const deriveSelectedMonth = () => {
    if (!selectedValue) {
      return void 0;
    }
    if (resolvedMode === "single" && selectedValue instanceof Date) {
      return selectedValue;
    }
    if (resolvedMode === "multiple" && Array.isArray(selectedValue) && selectedValue.length > 0) {
      return selectedValue[0];
    }
    if (resolvedMode === "range" && isDateRange(selectedValue) && selectedValue.from instanceof Date) {
      return selectedValue.from;
    }
    return void 0;
  };
  const resolvedDefaultMonth = defaultMonth ?? deriveSelectedMonth();
  const optionalMonthProps = month ? { month } : {};
  const optionalDefaultMonthProps = resolvedDefaultMonth ? { defaultMonth: resolvedDefaultMonth } : {};
  return /* @__PURE__ */ (0, import_jsx_runtime50.jsx)(
    import_react_day_picker.DayPicker,
    {
      ...{
        ...props,
        mode: resolvedMode,
        ...optionalMonthProps,
        ...optionalDefaultMonthProps,
        showOutsideDays,
        className: cn("rdp p-3", className),
        classNames: mergedClassNames,
        components: {
          DayButton,
          Chevron: ({ className: className2, orientation = "right", size = 16 }) => {
            const icons = {
              left: import_lucide_react17.ChevronLeft,
              right: import_lucide_react17.ChevronRight,
              up: import_lucide_react17.ChevronUp,
              down: import_lucide_react17.ChevronDown
            };
            const IconComponent = icons[orientation] ?? import_lucide_react17.ChevronRight;
            return /* @__PURE__ */ (0, import_jsx_runtime50.jsx)(
              IconComponent,
              {
                className: cn("h-4 w-4", className2),
                style: { width: size, height: size }
              }
            );
          }
        }
      }
    }
  );
}
Calendar.displayName = "Calendar";
function isDateRange(value) {
  return typeof value === "object" && value !== null && "from" in value;
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/toDate.mjs
function toDate(argument) {
  const argStr = Object.prototype.toString.call(argument);
  if (argument instanceof Date || typeof argument === "object" && argStr === "[object Date]") {
    return new argument.constructor(+argument);
  } else if (typeof argument === "number" || argStr === "[object Number]" || typeof argument === "string" || argStr === "[object String]") {
    return new Date(argument);
  } else {
    return /* @__PURE__ */ new Date(NaN);
  }
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/constructFrom.mjs
function constructFrom(date, value) {
  if (date instanceof Date) {
    return new date.constructor(value);
  } else {
    return new Date(value);
  }
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/constants.mjs
var daysInYear = 365.2425;
var maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1e3;
var minTime = -maxTime;
var millisecondsInWeek = 6048e5;
var millisecondsInDay = 864e5;
var secondsInHour = 3600;
var secondsInDay = secondsInHour * 24;
var secondsInWeek = secondsInDay * 7;
var secondsInYear = secondsInDay * daysInYear;
var secondsInMonth = secondsInYear / 12;
var secondsInQuarter = secondsInMonth * 3;

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/_lib/defaultOptions.mjs
var defaultOptions = {};
function getDefaultOptions() {
  return defaultOptions;
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/startOfWeek.mjs
function startOfWeek(date, options) {
  const defaultOptions2 = getDefaultOptions();
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions2.weekStartsOn ?? defaultOptions2.locale?.options?.weekStartsOn ?? 0;
  const _date = toDate(date);
  const day = _date.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  _date.setDate(_date.getDate() - diff);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/startOfISOWeek.mjs
function startOfISOWeek(date) {
  return startOfWeek(date, { weekStartsOn: 1 });
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/getISOWeekYear.mjs
function getISOWeekYear(date) {
  const _date = toDate(date);
  const year = _date.getFullYear();
  const fourthOfJanuaryOfNextYear = constructFrom(date, 0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);
  const fourthOfJanuaryOfThisYear = constructFrom(date, 0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);
  if (_date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (_date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/startOfDay.mjs
function startOfDay(date) {
  const _date = toDate(date);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.mjs
function getTimezoneOffsetInMilliseconds(date) {
  const _date = toDate(date);
  const utcDate = new Date(
    Date.UTC(
      _date.getFullYear(),
      _date.getMonth(),
      _date.getDate(),
      _date.getHours(),
      _date.getMinutes(),
      _date.getSeconds(),
      _date.getMilliseconds()
    )
  );
  utcDate.setUTCFullYear(_date.getFullYear());
  return +date - +utcDate;
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/differenceInCalendarDays.mjs
function differenceInCalendarDays(dateLeft, dateRight) {
  const startOfDayLeft = startOfDay(dateLeft);
  const startOfDayRight = startOfDay(dateRight);
  const timestampLeft = +startOfDayLeft - getTimezoneOffsetInMilliseconds(startOfDayLeft);
  const timestampRight = +startOfDayRight - getTimezoneOffsetInMilliseconds(startOfDayRight);
  return Math.round((timestampLeft - timestampRight) / millisecondsInDay);
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/startOfISOWeekYear.mjs
function startOfISOWeekYear(date) {
  const year = getISOWeekYear(date);
  const fourthOfJanuary = constructFrom(date, 0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  return startOfISOWeek(fourthOfJanuary);
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/isDate.mjs
function isDate(value) {
  return value instanceof Date || typeof value === "object" && Object.prototype.toString.call(value) === "[object Date]";
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/isValid.mjs
function isValid(date) {
  if (!isDate(date) && typeof date !== "number") {
    return false;
  }
  const _date = toDate(date);
  return !isNaN(Number(_date));
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/startOfYear.mjs
function startOfYear(date) {
  const cleanDate = toDate(date);
  const _date = constructFrom(date, 0);
  _date.setFullYear(cleanDate.getFullYear(), 0, 1);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/locale/en-US/_lib/formatDistance.mjs
var formatDistanceLocale = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
};
var formatDistance = (token, count, options) => {
  let result;
  const tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }
  if (options?.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }
  return result;
};

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/locale/_lib/buildFormatLongFn.mjs
function buildFormatLongFn(args) {
  return (options = {}) => {
    const width = options.width ? String(options.width) : args.defaultWidth;
    const format2 = args.formats[width] || args.formats[args.defaultWidth];
    return format2;
  };
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/locale/en-US/_lib/formatLong.mjs
var dateFormats = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
var timeFormats = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: "full"
  })
};

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/locale/en-US/_lib/formatRelative.mjs
var formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
};
var formatRelative = (token, _date, _baseDate, _options) => formatRelativeLocale[token];

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/locale/_lib/buildLocalizeFn.mjs
function buildLocalizeFn(args) {
  return (value, options) => {
    const context = options?.context ? String(options.context) : "standalone";
    let valuesArray;
    if (context === "formatting" && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      const width = options?.width ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      const defaultWidth = args.defaultWidth;
      const width = options?.width ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[width] || args.values[defaultWidth];
    }
    const index = args.argumentCallback ? args.argumentCallback(value) : value;
    return valuesArray[index];
  };
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/locale/en-US/_lib/localize.mjs
var eraValues = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
};
var quarterValues = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
};
var monthValues = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
};
var dayValues = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
};
var dayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
};
var formattingDayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
};
var ordinalNumber = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  const rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
};
var localize = {
  ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide"
  })
};

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/locale/_lib/buildMatchFn.mjs
function buildMatchFn(args) {
  return (string, options = {}) => {
    const width = options.width;
    const matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    const matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    const matchedString = matchResult[0];
    const parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    const key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString)) : (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
      findKey(parsePatterns, (pattern) => pattern.test(matchedString))
    );
    let value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
      options.valueCallback(value)
    ) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}
function findKey(object, predicate) {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key) && predicate(object[key])) {
      return key;
    }
  }
  return void 0;
}
function findIndex(array, predicate) {
  for (let key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return void 0;
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/locale/_lib/buildMatchPatternFn.mjs
function buildMatchPatternFn(args) {
  return (string, options = {}) => {
    const matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    const matchedString = matchResult[0];
    const parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/locale/en-US/_lib/match.mjs
var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern = /\d+/i;
var matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
};
var parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i]
};
var matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
};
var parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
var parseMonthPatterns = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
var parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
var matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
var parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
var match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: "any"
  })
};

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/locale/en-US.mjs
var enUS = {
  code: "en-US",
  formatDistance,
  formatLong,
  formatRelative,
  localize,
  match,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/getDayOfYear.mjs
function getDayOfYear(date) {
  const _date = toDate(date);
  const diff = differenceInCalendarDays(_date, startOfYear(_date));
  const dayOfYear = diff + 1;
  return dayOfYear;
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/getISOWeek.mjs
function getISOWeek(date) {
  const _date = toDate(date);
  const diff = +startOfISOWeek(_date) - +startOfISOWeekYear(_date);
  return Math.round(diff / millisecondsInWeek) + 1;
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/getWeekYear.mjs
function getWeekYear(date, options) {
  const _date = toDate(date);
  const year = _date.getFullYear();
  const defaultOptions2 = getDefaultOptions();
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions2.firstWeekContainsDate ?? defaultOptions2.locale?.options?.firstWeekContainsDate ?? 1;
  const firstWeekOfNextYear = constructFrom(date, 0);
  firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfWeek(firstWeekOfNextYear, options);
  const firstWeekOfThisYear = constructFrom(date, 0);
  firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfWeek(firstWeekOfThisYear, options);
  if (_date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (_date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/startOfWeekYear.mjs
function startOfWeekYear(date, options) {
  const defaultOptions2 = getDefaultOptions();
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions2.firstWeekContainsDate ?? defaultOptions2.locale?.options?.firstWeekContainsDate ?? 1;
  const year = getWeekYear(date, options);
  const firstWeek = constructFrom(date, 0);
  firstWeek.setFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setHours(0, 0, 0, 0);
  const _date = startOfWeek(firstWeek, options);
  return _date;
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/getWeek.mjs
function getWeek(date, options) {
  const _date = toDate(date);
  const diff = +startOfWeek(_date, options) - +startOfWeekYear(_date, options);
  return Math.round(diff / millisecondsInWeek) + 1;
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/_lib/addLeadingZeros.mjs
function addLeadingZeros(number, targetLength) {
  const sign = number < 0 ? "-" : "";
  const output = Math.abs(number).toString().padStart(targetLength, "0");
  return sign + output;
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/_lib/format/lightFormatters.mjs
var lightFormatters = {
  // Year
  y(date, token) {
    const signedYear = date.getFullYear();
    const year = signedYear > 0 ? signedYear : 1 - signedYear;
    return addLeadingZeros(token === "yy" ? year % 100 : year, token.length);
  },
  // Month
  M(date, token) {
    const month = date.getMonth();
    return token === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
  },
  // Day of the month
  d(date, token) {
    return addLeadingZeros(date.getDate(), token.length);
  },
  // AM or PM
  a(date, token) {
    const dayPeriodEnumValue = date.getHours() / 12 >= 1 ? "pm" : "am";
    switch (token) {
      case "a":
      case "aa":
        return dayPeriodEnumValue.toUpperCase();
      case "aaa":
        return dayPeriodEnumValue;
      case "aaaaa":
        return dayPeriodEnumValue[0];
      case "aaaa":
      default:
        return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
    }
  },
  // Hour [1-12]
  h(date, token) {
    return addLeadingZeros(date.getHours() % 12 || 12, token.length);
  },
  // Hour [0-23]
  H(date, token) {
    return addLeadingZeros(date.getHours(), token.length);
  },
  // Minute
  m(date, token) {
    return addLeadingZeros(date.getMinutes(), token.length);
  },
  // Second
  s(date, token) {
    return addLeadingZeros(date.getSeconds(), token.length);
  },
  // Fraction of second
  S(date, token) {
    const numberOfDigits = token.length;
    const milliseconds = date.getMilliseconds();
    const fractionalSeconds = Math.trunc(
      milliseconds * Math.pow(10, numberOfDigits - 3)
    );
    return addLeadingZeros(fractionalSeconds, token.length);
  }
};

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/_lib/format/formatters.mjs
var dayPeriodEnum = {
  am: "am",
  pm: "pm",
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
};
var formatters = {
  // Era
  G: function(date, token, localize2) {
    const era = date.getFullYear() > 0 ? 1 : 0;
    switch (token) {
      // AD, BC
      case "G":
      case "GG":
      case "GGG":
        return localize2.era(era, { width: "abbreviated" });
      // A, B
      case "GGGGG":
        return localize2.era(era, { width: "narrow" });
      // Anno Domini, Before Christ
      case "GGGG":
      default:
        return localize2.era(era, { width: "wide" });
    }
  },
  // Year
  y: function(date, token, localize2) {
    if (token === "yo") {
      const signedYear = date.getFullYear();
      const year = signedYear > 0 ? signedYear : 1 - signedYear;
      return localize2.ordinalNumber(year, { unit: "year" });
    }
    return lightFormatters.y(date, token);
  },
  // Local week-numbering year
  Y: function(date, token, localize2, options) {
    const signedWeekYear = getWeekYear(date, options);
    const weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
    if (token === "YY") {
      const twoDigitYear = weekYear % 100;
      return addLeadingZeros(twoDigitYear, 2);
    }
    if (token === "Yo") {
      return localize2.ordinalNumber(weekYear, { unit: "year" });
    }
    return addLeadingZeros(weekYear, token.length);
  },
  // ISO week-numbering year
  R: function(date, token) {
    const isoWeekYear = getISOWeekYear(date);
    return addLeadingZeros(isoWeekYear, token.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function(date, token) {
    const year = date.getFullYear();
    return addLeadingZeros(year, token.length);
  },
  // Quarter
  Q: function(date, token, localize2) {
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case "Q":
        return String(quarter);
      // 01, 02, 03, 04
      case "QQ":
        return addLeadingZeros(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case "Qo":
        return localize2.ordinalNumber(quarter, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "QQQ":
        return localize2.quarter(quarter, {
          width: "abbreviated",
          context: "formatting"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "QQQQQ":
        return localize2.quarter(quarter, {
          width: "narrow",
          context: "formatting"
        });
      // 1st quarter, 2nd quarter, ...
      case "QQQQ":
      default:
        return localize2.quarter(quarter, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(date, token, localize2) {
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case "q":
        return String(quarter);
      // 01, 02, 03, 04
      case "qq":
        return addLeadingZeros(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case "qo":
        return localize2.ordinalNumber(quarter, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "qqq":
        return localize2.quarter(quarter, {
          width: "abbreviated",
          context: "standalone"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "qqqqq":
        return localize2.quarter(quarter, {
          width: "narrow",
          context: "standalone"
        });
      // 1st quarter, 2nd quarter, ...
      case "qqqq":
      default:
        return localize2.quarter(quarter, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(date, token, localize2) {
    const month = date.getMonth();
    switch (token) {
      case "M":
      case "MM":
        return lightFormatters.M(date, token);
      // 1st, 2nd, ..., 12th
      case "Mo":
        return localize2.ordinalNumber(month + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "MMM":
        return localize2.month(month, {
          width: "abbreviated",
          context: "formatting"
        });
      // J, F, ..., D
      case "MMMMM":
        return localize2.month(month, {
          width: "narrow",
          context: "formatting"
        });
      // January, February, ..., December
      case "MMMM":
      default:
        return localize2.month(month, { width: "wide", context: "formatting" });
    }
  },
  // Stand-alone month
  L: function(date, token, localize2) {
    const month = date.getMonth();
    switch (token) {
      // 1, 2, ..., 12
      case "L":
        return String(month + 1);
      // 01, 02, ..., 12
      case "LL":
        return addLeadingZeros(month + 1, 2);
      // 1st, 2nd, ..., 12th
      case "Lo":
        return localize2.ordinalNumber(month + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "LLL":
        return localize2.month(month, {
          width: "abbreviated",
          context: "standalone"
        });
      // J, F, ..., D
      case "LLLLL":
        return localize2.month(month, {
          width: "narrow",
          context: "standalone"
        });
      // January, February, ..., December
      case "LLLL":
      default:
        return localize2.month(month, { width: "wide", context: "standalone" });
    }
  },
  // Local week of year
  w: function(date, token, localize2, options) {
    const week = getWeek(date, options);
    if (token === "wo") {
      return localize2.ordinalNumber(week, { unit: "week" });
    }
    return addLeadingZeros(week, token.length);
  },
  // ISO week of year
  I: function(date, token, localize2) {
    const isoWeek = getISOWeek(date);
    if (token === "Io") {
      return localize2.ordinalNumber(isoWeek, { unit: "week" });
    }
    return addLeadingZeros(isoWeek, token.length);
  },
  // Day of the month
  d: function(date, token, localize2) {
    if (token === "do") {
      return localize2.ordinalNumber(date.getDate(), { unit: "date" });
    }
    return lightFormatters.d(date, token);
  },
  // Day of year
  D: function(date, token, localize2) {
    const dayOfYear = getDayOfYear(date);
    if (token === "Do") {
      return localize2.ordinalNumber(dayOfYear, { unit: "dayOfYear" });
    }
    return addLeadingZeros(dayOfYear, token.length);
  },
  // Day of week
  E: function(date, token, localize2) {
    const dayOfWeek = date.getDay();
    switch (token) {
      // Tue
      case "E":
      case "EE":
      case "EEE":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "EEEEE":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "EEEEEE":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "EEEE":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(date, token, localize2, options) {
    const dayOfWeek = date.getDay();
    const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (Nth day of week with current locale or weekStartsOn)
      case "e":
        return String(localDayOfWeek);
      // Padded numerical value
      case "ee":
        return addLeadingZeros(localDayOfWeek, 2);
      // 1st, 2nd, ..., 7th
      case "eo":
        return localize2.ordinalNumber(localDayOfWeek, { unit: "day" });
      case "eee":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "eeeee":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "eeeeee":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "eeee":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(date, token, localize2, options) {
    const dayOfWeek = date.getDay();
    const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (same as in `e`)
      case "c":
        return String(localDayOfWeek);
      // Padded numerical value
      case "cc":
        return addLeadingZeros(localDayOfWeek, token.length);
      // 1st, 2nd, ..., 7th
      case "co":
        return localize2.ordinalNumber(localDayOfWeek, { unit: "day" });
      case "ccc":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "standalone"
        });
      // T
      case "ccccc":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "standalone"
        });
      // Tu
      case "cccccc":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "standalone"
        });
      // Tuesday
      case "cccc":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(date, token, localize2) {
    const dayOfWeek = date.getDay();
    const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    switch (token) {
      // 2
      case "i":
        return String(isoDayOfWeek);
      // 02
      case "ii":
        return addLeadingZeros(isoDayOfWeek, token.length);
      // 2nd
      case "io":
        return localize2.ordinalNumber(isoDayOfWeek, { unit: "day" });
      // Tue
      case "iii":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "iiiii":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "iiiiii":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "iiii":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(date, token, localize2) {
    const hours = date.getHours();
    const dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    switch (token) {
      case "a":
      case "aa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(date, token, localize2) {
    const hours = date.getHours();
    let dayPeriodEnumValue;
    if (hours === 12) {
      dayPeriodEnumValue = dayPeriodEnum.noon;
    } else if (hours === 0) {
      dayPeriodEnumValue = dayPeriodEnum.midnight;
    } else {
      dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    }
    switch (token) {
      case "b":
      case "bb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(date, token, localize2) {
    const hours = date.getHours();
    let dayPeriodEnumValue;
    if (hours >= 17) {
      dayPeriodEnumValue = dayPeriodEnum.evening;
    } else if (hours >= 12) {
      dayPeriodEnumValue = dayPeriodEnum.afternoon;
    } else if (hours >= 4) {
      dayPeriodEnumValue = dayPeriodEnum.morning;
    } else {
      dayPeriodEnumValue = dayPeriodEnum.night;
    }
    switch (token) {
      case "B":
      case "BB":
      case "BBB":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(date, token, localize2) {
    if (token === "ho") {
      let hours = date.getHours() % 12;
      if (hours === 0) hours = 12;
      return localize2.ordinalNumber(hours, { unit: "hour" });
    }
    return lightFormatters.h(date, token);
  },
  // Hour [0-23]
  H: function(date, token, localize2) {
    if (token === "Ho") {
      return localize2.ordinalNumber(date.getHours(), { unit: "hour" });
    }
    return lightFormatters.H(date, token);
  },
  // Hour [0-11]
  K: function(date, token, localize2) {
    const hours = date.getHours() % 12;
    if (token === "Ko") {
      return localize2.ordinalNumber(hours, { unit: "hour" });
    }
    return addLeadingZeros(hours, token.length);
  },
  // Hour [1-24]
  k: function(date, token, localize2) {
    let hours = date.getHours();
    if (hours === 0) hours = 24;
    if (token === "ko") {
      return localize2.ordinalNumber(hours, { unit: "hour" });
    }
    return addLeadingZeros(hours, token.length);
  },
  // Minute
  m: function(date, token, localize2) {
    if (token === "mo") {
      return localize2.ordinalNumber(date.getMinutes(), { unit: "minute" });
    }
    return lightFormatters.m(date, token);
  },
  // Second
  s: function(date, token, localize2) {
    if (token === "so") {
      return localize2.ordinalNumber(date.getSeconds(), { unit: "second" });
    }
    return lightFormatters.s(date, token);
  },
  // Fraction of second
  S: function(date, token) {
    return lightFormatters.S(date, token);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    if (timezoneOffset === 0) {
      return "Z";
    }
    switch (token) {
      // Hours and optional minutes
      case "X":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case "XXXX":
      case "XX":
        return formatTimezone(timezoneOffset);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XXX`
      case "XXXXX":
      case "XXX":
      // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    switch (token) {
      // Hours and optional minutes
      case "x":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case "xxxx":
      case "xx":
        return formatTimezone(timezoneOffset);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xxx`
      case "xxxxx":
      case "xxx":
      // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (GMT)
  O: function(date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    switch (token) {
      // Short
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      // Long
      case "OOOO":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    switch (token) {
      // Short
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      // Long
      case "zzzz":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },
  // Seconds timestamp
  t: function(date, token, _localize) {
    const timestamp = Math.trunc(date.getTime() / 1e3);
    return addLeadingZeros(timestamp, token.length);
  },
  // Milliseconds timestamp
  T: function(date, token, _localize) {
    const timestamp = date.getTime();
    return addLeadingZeros(timestamp, token.length);
  }
};
function formatTimezoneShort(offset, delimiter = "") {
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = Math.trunc(absOffset / 60);
  const minutes = absOffset % 60;
  if (minutes === 0) {
    return sign + String(hours);
  }
  return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
}
function formatTimezoneWithOptionalMinutes(offset, delimiter) {
  if (offset % 60 === 0) {
    const sign = offset > 0 ? "-" : "+";
    return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
  }
  return formatTimezone(offset, delimiter);
}
function formatTimezone(offset, delimiter = "") {
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = addLeadingZeros(Math.trunc(absOffset / 60), 2);
  const minutes = addLeadingZeros(absOffset % 60, 2);
  return sign + hours + delimiter + minutes;
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/_lib/format/longFormatters.mjs
var dateLongFormatter = (pattern, formatLong2) => {
  switch (pattern) {
    case "P":
      return formatLong2.date({ width: "short" });
    case "PP":
      return formatLong2.date({ width: "medium" });
    case "PPP":
      return formatLong2.date({ width: "long" });
    case "PPPP":
    default:
      return formatLong2.date({ width: "full" });
  }
};
var timeLongFormatter = (pattern, formatLong2) => {
  switch (pattern) {
    case "p":
      return formatLong2.time({ width: "short" });
    case "pp":
      return formatLong2.time({ width: "medium" });
    case "ppp":
      return formatLong2.time({ width: "long" });
    case "pppp":
    default:
      return formatLong2.time({ width: "full" });
  }
};
var dateTimeLongFormatter = (pattern, formatLong2) => {
  const matchResult = pattern.match(/(P+)(p+)?/) || [];
  const datePattern = matchResult[1];
  const timePattern = matchResult[2];
  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong2);
  }
  let dateTimeFormat;
  switch (datePattern) {
    case "P":
      dateTimeFormat = formatLong2.dateTime({ width: "short" });
      break;
    case "PP":
      dateTimeFormat = formatLong2.dateTime({ width: "medium" });
      break;
    case "PPP":
      dateTimeFormat = formatLong2.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      dateTimeFormat = formatLong2.dateTime({ width: "full" });
      break;
  }
  return dateTimeFormat.replace("{{date}}", dateLongFormatter(datePattern, formatLong2)).replace("{{time}}", timeLongFormatter(timePattern, formatLong2));
};
var longFormatters = {
  p: timeLongFormatter,
  P: dateTimeLongFormatter
};

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/_lib/protectedTokens.mjs
var dayOfYearTokenRE = /^D+$/;
var weekYearTokenRE = /^Y+$/;
var throwTokens = ["D", "DD", "YY", "YYYY"];
function isProtectedDayOfYearToken(token) {
  return dayOfYearTokenRE.test(token);
}
function isProtectedWeekYearToken(token) {
  return weekYearTokenRE.test(token);
}
function warnOrThrowProtectedError(token, format2, input) {
  const _message = message(token, format2, input);
  console.warn(_message);
  if (throwTokens.includes(token)) throw new RangeError(_message);
}
function message(token, format2, input) {
  const subject = token[0] === "Y" ? "years" : "days of the month";
  return `Use \`${token.toLowerCase()}\` instead of \`${token}\` (in \`${format2}\`) for formatting ${subject} to the input \`${input}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}

// ../../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/format.mjs
var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp = /^'([^]*?)'?$/;
var doubleQuoteRegExp = /''/g;
var unescapedLatinCharacterRegExp = /[a-zA-Z]/;
function format(date, formatStr, options) {
  const defaultOptions2 = getDefaultOptions();
  const locale = options?.locale ?? defaultOptions2.locale ?? enUS;
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions2.firstWeekContainsDate ?? defaultOptions2.locale?.options?.firstWeekContainsDate ?? 1;
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions2.weekStartsOn ?? defaultOptions2.locale?.options?.weekStartsOn ?? 0;
  const originalDate = toDate(date);
  if (!isValid(originalDate)) {
    throw new RangeError("Invalid time value");
  }
  let parts = formatStr.match(longFormattingTokensRegExp).map((substring) => {
    const firstCharacter = substring[0];
    if (firstCharacter === "p" || firstCharacter === "P") {
      const longFormatter = longFormatters[firstCharacter];
      return longFormatter(substring, locale.formatLong);
    }
    return substring;
  }).join("").match(formattingTokensRegExp).map((substring) => {
    if (substring === "''") {
      return { isToken: false, value: "'" };
    }
    const firstCharacter = substring[0];
    if (firstCharacter === "'") {
      return { isToken: false, value: cleanEscapedString(substring) };
    }
    if (formatters[firstCharacter]) {
      return { isToken: true, value: substring };
    }
    if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + firstCharacter + "`"
      );
    }
    return { isToken: false, value: substring };
  });
  if (locale.localize.preprocessor) {
    parts = locale.localize.preprocessor(originalDate, parts);
  }
  const formatterOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale
  };
  return parts.map((part) => {
    if (!part.isToken) return part.value;
    const token = part.value;
    if (!options?.useAdditionalWeekYearTokens && isProtectedWeekYearToken(token) || !options?.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(token)) {
      warnOrThrowProtectedError(token, formatStr, String(date));
    }
    const formatter = formatters[token[0]];
    return formatter(originalDate, token, locale.localize, formatterOptions);
  }).join("");
}
function cleanEscapedString(input) {
  const matched = input.match(escapedStringRegExp);
  if (!matched) {
    return input;
  }
  return matched[1].replace(doubleQuoteRegExp, "'");
}

// src/components/date-picker.tsx
var import_lucide_react18 = require("lucide-react");
var React35 = __toESM(require("react"));
var import_jsx_runtime51 = require("react/jsx-runtime");
function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled = false,
  className
}) {
  const [open, setOpen] = React35.useState(false);
  const handleSelect = React35.useCallback(
    (selectedDate) => {
      onDateChange?.(selectedDate);
      setOpen(false);
    },
    [onDateChange]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime51.jsxs)(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime51.jsx)(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime51.jsxs)(
      Button,
      {
        variant: "outline",
        disabled,
        className: cn(
          "w-full justify-start text-left font-normal border-input",
          !date && "text-muted-foreground",
          className
        ),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime51.jsx)(import_lucide_react18.Calendar, { className: "mr-2 h-4 w-4" }),
          date ? format(date, "PPP") : /* @__PURE__ */ (0, import_jsx_runtime51.jsx)("span", { className: "text-muted-foreground", children: placeholder })
        ]
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime51.jsx)(PopoverContent, { className: "w-auto p-0", children: /* @__PURE__ */ (0, import_jsx_runtime51.jsx)(
      Calendar,
      {
        mode: "single",
        selected: date,
        onSelect: handleSelect,
        required: false,
        initialFocus: true
      }
    ) })
  ] });
}
function DateRangePicker({
  dateRange,
  onDateRangeChange,
  placeholder = "Pick a date range",
  disabled = false,
  className
}) {
  const [open, setOpen] = React35.useState(false);
  const handleRangeSelect = React35.useCallback(
    (range) => {
      onDateRangeChange?.(range);
    },
    [onDateRangeChange]
  );
  React35.useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      setOpen(false);
    }
  }, [dateRange?.from, dateRange?.to]);
  return /* @__PURE__ */ (0, import_jsx_runtime51.jsxs)(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime51.jsx)(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime51.jsxs)(
      Button,
      {
        variant: "outline",
        disabled,
        className: cn(
          "w-full justify-start text-left font-normal border-input",
          !dateRange && "text-muted-foreground",
          className
        ),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime51.jsx)(import_lucide_react18.Calendar, { className: "mr-2 h-4 w-4" }),
          dateRange?.from ? dateRange.to ? /* @__PURE__ */ (0, import_jsx_runtime51.jsxs)(import_jsx_runtime51.Fragment, { children: [
            format(dateRange.from, "LLL dd, y"),
            " - ",
            format(dateRange.to, "LLL dd, y")
          ] }) : format(dateRange.from, "LLL dd, y") : /* @__PURE__ */ (0, import_jsx_runtime51.jsx)("span", { className: "text-muted-foreground", children: placeholder })
        ]
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime51.jsx)(PopoverContent, { className: "w-auto p-0", align: "start", children: /* @__PURE__ */ (0, import_jsx_runtime51.jsx)(
      Calendar,
      {
        initialFocus: true,
        mode: "range",
        ...dateRange?.from ? { defaultMonth: dateRange.from } : {},
        required: false,
        selected: dateRange,
        onSelect: handleRangeSelect,
        numberOfMonths: 2
      }
    ) })
  ] });
}

// src/hooks/use-toast.tsx
var import_react4 = require("react");
function useToast() {
  const [toasts, setToasts2] = (0, import_react4.useState)([]);
  const toast2 = (0, import_react4.useCallback)(({ title, description, variant = "default" }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, variant };
    if (title !== void 0) {
      newToast.title = title;
    }
    if (description !== void 0) {
      newToast.description = description;
    }
    setToasts2((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts2((prev) => prev.filter((t) => t.id !== id));
    }, 5e3);
  }, []);
  return { toast: toast2, toasts };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  AsyncState,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Breadcrumb,
  Button,
  ButtonLoading,
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Combobox,
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  ConfirmDialog,
  ConfirmDialogProvider,
  DataTable,
  DataTableUtils,
  DatePicker,
  DateRangePicker,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  EmptyState,
  EnhancedDataTable,
  ErrorBoundaryFallback,
  ErrorState,
  Form,
  FormControl,
  FormDescription,
  FormError,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InlineLoader,
  Input,
  Label,
  LiveIndicator,
  LoadingCard,
  LoadingGrid,
  LoadingOverlay,
  LoadingSpinner,
  LoadingState,
  LoadingTable,
  MetricCardEnhanced,
  MultiCombobox,
  PageHeader,
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
  PortalBadge,
  PortalBadgeCompact,
  PortalButton,
  PortalCard,
  PortalCardContent,
  PortalCardDescription,
  PortalCardFooter,
  PortalCardHeader,
  PortalCardTitle,
  PortalIndicatorDot,
  PortalThemeProvider,
  PortalUserTypeBadge,
  Progress,
  ProgressIndicator,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
  ScrollBar,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  SkeletonCard,
  SkeletonMetricCard,
  SkeletonTable,
  SkipLink,
  StatusBadge,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TablePagination,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ThemeToggle,
  ThemeToggleButton,
  ToastContainer,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  alertVariants,
  badgeVariants,
  buttonVariants,
  cardVariants,
  cn,
  colorTokens,
  createSortableHeader,
  detectPortalFromRoute,
  duration,
  easing,
  fontFamily,
  fontWeight,
  generatePortalCSSVariables,
  getPortalColors,
  getPortalConfig,
  getPortalThemeClass,
  getStatusVariant,
  keyframes,
  portalAnimations,
  portalButtonVariants,
  portalFontSizes,
  portalMetadata,
  portalRoutes,
  portalSpacing,
  spacing,
  toast,
  touchTargets,
  useConfirmDialog,
  useFormField,
  usePagination,
  usePortalTheme,
  useToast
});
