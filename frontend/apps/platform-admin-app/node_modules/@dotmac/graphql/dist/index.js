"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AccessPointDetailDocument: () => AccessPointDetailDocument,
  AccessPointListDocument: () => AccessPointListDocument,
  AccessPointStatus: () => AccessPointStatus,
  AccessPointsBySiteDocument: () => AccessPointsBySiteDocument,
  ActiveSessionsDocument: () => ActiveSessionsDocument,
  ActivityTypeEnum: () => ActivityTypeEnum,
  AlertSeverityEnum: () => AlertSeverityEnum,
  BillingCycleEnum: () => BillingCycleEnum,
  CableInstallationType: () => CableInstallationType,
  ChannelUtilizationDocument: () => ChannelUtilizationDocument,
  ClientConnectionType: () => ClientConnectionType,
  CoverageZoneDetailDocument: () => CoverageZoneDetailDocument,
  CoverageZoneListDocument: () => CoverageZoneListDocument,
  CoverageZonesBySiteDocument: () => CoverageZonesBySiteDocument,
  Customer360ViewDocument: () => Customer360ViewDocument,
  CustomerActivitiesDocument: () => CustomerActivitiesDocument,
  CustomerActivityAddedDocument: () => CustomerActivityAddedDocument,
  CustomerBillingDocument: () => CustomerBillingDocument,
  CustomerDashboardDocument: () => CustomerDashboardDocument,
  CustomerDetailDocument: () => CustomerDetailDocument,
  CustomerDevicesDocument: () => CustomerDevicesDocument,
  CustomerDevicesUpdatedDocument: () => CustomerDevicesUpdatedDocument,
  CustomerListDocument: () => CustomerListDocument,
  CustomerMetricsDocument: () => CustomerMetricsDocument,
  CustomerNetworkInfoDocument: () => CustomerNetworkInfoDocument,
  CustomerNetworkStatusUpdatedDocument: () => CustomerNetworkStatusUpdatedDocument,
  CustomerNoteUpdatedDocument: () => CustomerNoteUpdatedDocument,
  CustomerNotesDocument: () => CustomerNotesDocument,
  CustomerStatusEnum: () => CustomerStatusEnum,
  CustomerSubscriptionsDocument: () => CustomerSubscriptionsDocument,
  CustomerTicketUpdatedDocument: () => CustomerTicketUpdatedDocument,
  CustomerTicketsDocument: () => CustomerTicketsDocument,
  CustomerTierEnum: () => CustomerTierEnum,
  CustomerTypeEnum: () => CustomerTypeEnum,
  DeviceDetailDocument: () => DeviceDetailDocument,
  DeviceStatusEnum: () => DeviceStatusEnum,
  DeviceTrafficDocument: () => DeviceTrafficDocument,
  DeviceTypeEnum: () => DeviceTypeEnum,
  DeviceUpdatesDocument: () => DeviceUpdatesDocument,
  DistributionPointDetailDocument: () => DistributionPointDetailDocument,
  DistributionPointListDocument: () => DistributionPointListDocument,
  DistributionPointType: () => DistributionPointType,
  DistributionPointsBySiteDocument: () => DistributionPointsBySiteDocument,
  FiberCableDetailDocument: () => FiberCableDetailDocument,
  FiberCableListDocument: () => FiberCableListDocument,
  FiberCableStatus: () => FiberCableStatus,
  FiberCablesByDistributionPointDocument: () => FiberCablesByDistributionPointDocument,
  FiberCablesByRouteDocument: () => FiberCablesByRouteDocument,
  FiberDashboardDocument: () => FiberDashboardDocument,
  FiberHealthMetricsDocument: () => FiberHealthMetricsDocument,
  FiberHealthStatus: () => FiberHealthStatus,
  FiberNetworkAnalyticsDocument: () => FiberNetworkAnalyticsDocument,
  FiberType: () => FiberType,
  FrequencyBand: () => FrequencyBand,
  GraphQLClient: () => GraphQLClient,
  GraphQLError: () => GraphQLError,
  ListQueryBoundary: () => ListQueryBoundary,
  NetworkAlertDetailDocument: () => NetworkAlertDetailDocument,
  NetworkAlertListDocument: () => NetworkAlertListDocument,
  NetworkAlertUpdatesDocument: () => NetworkAlertUpdatesDocument,
  NetworkDashboardDocument: () => NetworkDashboardDocument,
  NetworkDeviceListDocument: () => NetworkDeviceListDocument,
  NetworkOverviewDocument: () => NetworkOverviewDocument,
  OtdrTestResultsDocument: () => OtdrTestResultsDocument,
  PaymentMethodTypeEnum: () => PaymentMethodTypeEnum,
  PaymentStatusEnum: () => PaymentStatusEnum,
  PermissionCategoryEnum: () => PermissionCategoryEnum,
  PermissionsByCategoryDocument: () => PermissionsByCategoryDocument,
  PlanListDocument: () => PlanListDocument,
  ProductListDocument: () => ProductListDocument,
  ProductTypeEnum: () => ProductTypeEnum,
  QueryBoundary: () => QueryBoundary,
  ReactQueryHooks: () => react_query_exports,
  RfAnalyticsDocument: () => RfAnalyticsDocument,
  RoleListDocument: () => RoleListDocument,
  ServiceAreaDetailDocument: () => ServiceAreaDetailDocument,
  ServiceAreaListDocument: () => ServiceAreaListDocument,
  ServiceAreaType: () => ServiceAreaType,
  ServiceAreasByPostalCodeDocument: () => ServiceAreasByPostalCodeDocument,
  SplicePointDetailDocument: () => SplicePointDetailDocument,
  SplicePointListDocument: () => SplicePointListDocument,
  SplicePointsByCableDocument: () => SplicePointsByCableDocument,
  SpliceStatus: () => SpliceStatus,
  SpliceType: () => SpliceType,
  SubscriberDashboardDocument: () => SubscriberDashboardDocument,
  SubscriberDocument: () => SubscriberDocument,
  SubscriberMetricsDocument: () => SubscriberMetricsDocument,
  SubscriptionDashboardDocument: () => SubscriptionDashboardDocument,
  SubscriptionDetailDocument: () => SubscriptionDetailDocument,
  SubscriptionListDocument: () => SubscriptionListDocument,
  SubscriptionMetricsDocument: () => SubscriptionMetricsDocument,
  SubscriptionStatusEnum: () => SubscriptionStatusEnum,
  TenantPlanTypeEnum: () => TenantPlanTypeEnum,
  TenantStatusEnum: () => TenantStatusEnum,
  UserDashboardDocument: () => UserDashboardDocument,
  UserDetailDocument: () => UserDetailDocument,
  UserListDocument: () => UserListDocument,
  UserMetricsDocument: () => UserMetricsDocument,
  UserPermissionsDocument: () => UserPermissionsDocument,
  UserRolesDocument: () => UserRolesDocument,
  UserStatusEnum: () => UserStatusEnum,
  UserTeamsDocument: () => UserTeamsDocument,
  WirelessClientDetailDocument: () => WirelessClientDetailDocument,
  WirelessClientListDocument: () => WirelessClientListDocument,
  WirelessClientsByAccessPointDocument: () => WirelessClientsByAccessPointDocument,
  WirelessClientsByCustomerDocument: () => WirelessClientsByCustomerDocument,
  WirelessDashboardDocument: () => WirelessDashboardDocument,
  WirelessSecurityType: () => WirelessSecurityType,
  WirelessSiteMetricsDocument: () => WirelessSiteMetricsDocument,
  WorkflowStatus: () => WorkflowStatus,
  WorkflowStepStatus: () => WorkflowStepStatus,
  WorkflowType: () => WorkflowType,
  combineQueryResults: () => combineQueryResults,
  createGraphQLClient: () => createGraphQLClient,
  createOptimisticUpdate: () => createOptimisticUpdate,
  extractDashboardData: () => extractDashboardData,
  graphql: () => graphql,
  graphqlClient: () => graphqlClient,
  graphqlFetcher: () => graphqlFetcher,
  handleGraphQLError: () => handleGraphQLError,
  hasQueryData: () => hasQueryData,
  invalidateQueries: () => invalidateQueries,
  isFragmentReady: () => isFragmentReady,
  loadingHelpers: () => loadingHelpers,
  makeFragmentData: () => makeFragmentData,
  mapQueryResult: () => mapQueryResult,
  mapQueryResultWithTransform: () => mapQueryResultWithTransform,
  normalizeDashboardHook: () => normalizeDashboardHook,
  normalizeDetailQuery: () => normalizeDetailQuery,
  normalizeListQuery: () => normalizeListQuery,
  useFormMutation: () => useFormMutation,
  useFragment: () => useFragment,
  useGraphQLSubscription: () => useGraphQLSubscription,
  useMutationWithToast: () => useMutationWithToast
});
module.exports = __toCommonJS(index_exports);

// src/client.ts
var import_http_client = require("@dotmac/http-client");
var GraphQLClient = class {
  constructor(config = {}) {
    this.endpoint = config.endpoint || this.getDefaultEndpoint();
    this.headers = config.headers || {};
    this.httpClient = config.httpClient || import_http_client.HttpClient.createFromHostname({
      timeout: 3e4,
      retries: 3
    }).enableAuth();
  }
  /**
   * Get default GraphQL endpoint
   * Matches Apollo client configuration for consistency
   * Works in both browser and server (SSR/build) contexts
   */
  getDefaultEndpoint() {
    const apiUrl = typeof process !== "undefined" ? process.env["NEXT_PUBLIC_API_BASE_URL"] : void 0;
    if (apiUrl) {
      return `${apiUrl}/api/v1/graphql`;
    }
    return "/api/v1/graphql";
  }
  /**
   * Execute a GraphQL request
   */
  async request(query, variables, operationName) {
    const body = {
      query,
      ...variables && { variables },
      ...operationName && { operationName }
    };
    try {
      const response = await this.httpClient.post(this.endpoint, body, {
        headers: this.headers
      });
      if (response.data.errors && response.data.errors.length > 0) {
        const error = response.data.errors[0];
        throw new GraphQLError(error.message, response.data.errors);
      }
      if (!response.data.data) {
        throw new Error("GraphQL response missing data field");
      }
      return response.data.data;
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new Error(`GraphQL request failed: ${error.message}`);
    }
  }
  /**
   * Get the underlying HTTP client (for advanced usage)
   */
  getHttpClient() {
    return this.httpClient;
  }
  /**
   * Get current tenant ID
   */
  getTenantId() {
    return this.httpClient.getCurrentTenantId();
  }
};
var GraphQLError = class extends Error {
  constructor(message, errors) {
    super(message);
    this.errors = errors;
    this.name = "GraphQLError";
  }
};
var graphqlClient = new GraphQLClient();
function createGraphQLClient(config) {
  return new GraphQLClient(config);
}
function graphqlFetcher(query, variables, headers) {
  return () => {
    return graphqlClient.request(query, variables);
  };
}

// src/error-handler.ts
var DEFAULT_FALLBACK_MESSAGE = "An unexpected error occurred. Please try again.";
var ERROR_CODE_TO_TOAST = {
  UNAUTHENTICATED: {
    title: "Authentication required",
    variant: "destructive",
    getDescription: () => "Your session has expired. Please sign in again."
  },
  FORBIDDEN: {
    title: "Access denied",
    variant: "destructive",
    getDescription: () => "You do not have permission to perform this action."
  },
  NOT_FOUND: {
    title: "Not found",
    variant: "destructive"
  },
  BAD_USER_INPUT: {
    title: "Validation error",
    variant: "destructive"
  },
  VALIDATION_ERROR: {
    title: "Validation error",
    variant: "destructive"
  },
  CONFLICT: {
    title: "Conflict detected",
    variant: "destructive"
  },
  RATE_LIMITED: {
    title: "Too many requests",
    variant: "destructive",
    getDescription: () => "You are sending requests too quickly. Please try again shortly."
  },
  SERVICE_UNAVAILABLE: {
    title: "Service unavailable",
    variant: "destructive"
  },
  INTERNAL_SERVER_ERROR: {
    title: "Server error",
    variant: "destructive",
    getDescription: () => "The server encountered an unexpected error. Please try again later."
  }
};
function isRecord(value) {
  return typeof value === "object" && value !== null;
}
function extractFirstError(errors) {
  if (!Array.isArray(errors) || errors.length === 0) {
    return void 0;
  }
  const first = errors[0] ?? {};
  const message = typeof first?.message === "string" ? first.message : typeof first === "string" ? first : DEFAULT_FALLBACK_MESSAGE;
  const extensions = isRecord(first?.extensions) ? first.extensions : void 0;
  const code = typeof extensions?.code === "string" ? extensions.code : void 0;
  const path = Array.isArray(first?.path) ? first.path : void 0;
  return {
    message,
    code,
    path
  };
}
function normalizeGraphQLError(error) {
  if (error instanceof GraphQLError) {
    const el = extractFirstError(error.errors);
    return {
      message: el?.message ?? error.message ?? DEFAULT_FALLBACK_MESSAGE,
      ...el?.code ? { code: el.code } : {},
      ...el?.path ? { path: el.path } : {}
    };
  }
  if (isRecord(error)) {
    if (Array.isArray(error.graphQLErrors)) {
      const el = extractFirstError(error.graphQLErrors);
      const errorMsg = typeof error["message"] === "string" ? error["message"] : DEFAULT_FALLBACK_MESSAGE;
      return {
        message: el?.message ?? errorMsg,
        ...el?.code ? { code: el.code } : {},
        ...el?.path ? { path: el.path } : {},
        isNetworkError: Boolean(error.networkError)
      };
    }
    if (Array.isArray(error.errors)) {
      const el = extractFirstError(error.errors);
      if (el) {
        return el;
      }
    }
    if (typeof error["message"] === "string") {
      return {
        message: error["message"],
        ...typeof error["code"] === "string" ? { code: error["code"] } : {}
      };
    }
  }
  if (typeof error === "string") {
    return {
      message: error
    };
  }
  return {
    message: DEFAULT_FALLBACK_MESSAGE
  };
}
function buildToastPayload(normalized, fallbackMessage) {
  const message = normalized.message || fallbackMessage;
  const code = normalized.code ?? "";
  const mapping = ERROR_CODE_TO_TOAST[code];
  if (mapping) {
    return {
      title: mapping.title,
      description: mapping.getDescription ? mapping.getDescription(message) : message,
      variant: mapping.variant
    };
  }
  if (normalized.isNetworkError) {
    return {
      title: "Network error",
      description: "Unable to reach the server. Check your connection and try again.",
      variant: "destructive"
    };
  }
  return {
    title: "Request failed",
    description: message,
    variant: "destructive"
  };
}
var SKIP_TOAST_CODES = /* @__PURE__ */ new Set(["UNAUTHENTICATED", "SESSION_EXPIRED"]);
function getErrorSeverity(code) {
  if (!code) return "error" /* ERROR */;
  if (code.includes("INTERNAL_SERVER_ERROR") || code.includes("DATABASE_ERROR")) {
    return "critical" /* CRITICAL */;
  }
  if (code.includes("VALIDATION_ERROR") || code.includes("BAD_USER_INPUT") || code.includes("NOT_FOUND")) {
    return "warning" /* WARNING */;
  }
  if (code.includes("UNAUTHENTICATED") || code.includes("FORBIDDEN") || code.includes("UNAUTHORIZED")) {
    return "info" /* INFO */;
  }
  return "error" /* ERROR */;
}
function handleGraphQLError(error, optionsOrContext = {}) {
  if ("toast" in optionsOrContext) {
    const {
      toast,
      logger,
      context: context2,
      fallbackMessage = DEFAULT_FALLBACK_MESSAGE,
      operationName,
      suppressToast = false,
      customMessage
    } = optionsOrContext;
    const normalized2 = normalizeGraphQLError(error);
    if (logger) {
      const logContext = {
        ...context2
      };
      if (normalized2.code) {
        logContext["code"] = normalized2.code;
      }
      if (normalized2.path) {
        logContext["path"] = normalized2.path;
      }
      if (operationName) {
        logContext["operationName"] = operationName;
      }
      const errorObject = error instanceof Error ? error : new Error(String(error));
      logger.error(
        `GraphQL operation failed${operationName ? ` (${operationName})` : ""}`,
        errorObject,
        logContext
      );
    }
    if (!suppressToast) {
      const toastPayload = customMessage ? {
        title: "Request failed",
        description: customMessage,
        variant: "destructive"
      } : buildToastPayload(normalized2, fallbackMessage);
      toast(toastPayload);
    }
    return;
  }
  const context = optionsOrContext;
  const normalized = normalizeGraphQLError(error);
  const severity = getErrorSeverity(normalized.code);
  const message = normalized.message || DEFAULT_FALLBACK_MESSAGE;
  const shouldToast = !normalized.code || !SKIP_TOAST_CODES.has(normalized.code);
  const shouldLog = true;
  if (shouldLog) {
    const logContext = {
      severity,
      code: normalized.code,
      path: normalized.path,
      ...context
    };
    console.error(`[GraphQL Error] ${message}`, logContext);
  }
  return {
    message,
    severity,
    ...normalized.code ? { code: normalized.code } : {},
    shouldToast,
    shouldLog
  };
}

// generated/fragment-masking.ts
function useFragment(_documentNode, fragmentType) {
  return fragmentType;
}
function makeFragmentData(data, _fragment) {
  return data;
}
function isFragmentReady(queryNode, fragmentNode, data) {
  const deferredFields = queryNode.__meta__?.deferredFields;
  if (!deferredFields) return true;
  const fragDef = fragmentNode.definitions[0];
  const fragName = fragDef?.name?.value;
  const fields = fragName && deferredFields[fragName] || [];
  return fields.length > 0 && fields.every((field) => data && field in data);
}

// generated/graphql.ts
var AccessPointStatus = /* @__PURE__ */ ((AccessPointStatus3) => {
  AccessPointStatus3["Degraded"] = "DEGRADED";
  AccessPointStatus3["Maintenance"] = "MAINTENANCE";
  AccessPointStatus3["Offline"] = "OFFLINE";
  AccessPointStatus3["Online"] = "ONLINE";
  AccessPointStatus3["Provisioning"] = "PROVISIONING";
  AccessPointStatus3["Rebooting"] = "REBOOTING";
  return AccessPointStatus3;
})(AccessPointStatus || {});
var ActivityTypeEnum = /* @__PURE__ */ ((ActivityTypeEnum3) => {
  ActivityTypeEnum3["ContactMade"] = "CONTACT_MADE";
  ActivityTypeEnum3["Created"] = "CREATED";
  ActivityTypeEnum3["Export"] = "EXPORT";
  ActivityTypeEnum3["Import"] = "IMPORT";
  ActivityTypeEnum3["Login"] = "LOGIN";
  ActivityTypeEnum3["NoteAdded"] = "NOTE_ADDED";
  ActivityTypeEnum3["Purchase"] = "PURCHASE";
  ActivityTypeEnum3["StatusChanged"] = "STATUS_CHANGED";
  ActivityTypeEnum3["SupportTicket"] = "SUPPORT_TICKET";
  ActivityTypeEnum3["TagAdded"] = "TAG_ADDED";
  ActivityTypeEnum3["TagRemoved"] = "TAG_REMOVED";
  ActivityTypeEnum3["Updated"] = "UPDATED";
  return ActivityTypeEnum3;
})(ActivityTypeEnum || {});
var AlertSeverityEnum = /* @__PURE__ */ ((AlertSeverityEnum3) => {
  AlertSeverityEnum3["Critical"] = "CRITICAL";
  AlertSeverityEnum3["Info"] = "INFO";
  AlertSeverityEnum3["Warning"] = "WARNING";
  return AlertSeverityEnum3;
})(AlertSeverityEnum || {});
var BillingCycleEnum = /* @__PURE__ */ ((BillingCycleEnum3) => {
  BillingCycleEnum3["Annual"] = "ANNUAL";
  BillingCycleEnum3["Custom"] = "CUSTOM";
  BillingCycleEnum3["Monthly"] = "MONTHLY";
  BillingCycleEnum3["Quarterly"] = "QUARTERLY";
  BillingCycleEnum3["Yearly"] = "YEARLY";
  return BillingCycleEnum3;
})(BillingCycleEnum || {});
var CableInstallationType = /* @__PURE__ */ ((CableInstallationType3) => {
  CableInstallationType3["Aerial"] = "AERIAL";
  CableInstallationType3["Building"] = "BUILDING";
  CableInstallationType3["Buried"] = "BURIED";
  CableInstallationType3["Duct"] = "DUCT";
  CableInstallationType3["Submarine"] = "SUBMARINE";
  CableInstallationType3["Underground"] = "UNDERGROUND";
  return CableInstallationType3;
})(CableInstallationType || {});
var ClientConnectionType = /* @__PURE__ */ ((ClientConnectionType3) => {
  ClientConnectionType3["Wifi_2_4"] = "WIFI_2_4";
  ClientConnectionType3["Wifi_5"] = "WIFI_5";
  ClientConnectionType3["Wifi_6"] = "WIFI_6";
  ClientConnectionType3["Wifi_6E"] = "WIFI_6E";
  return ClientConnectionType3;
})(ClientConnectionType || {});
var CustomerStatusEnum = /* @__PURE__ */ ((CustomerStatusEnum3) => {
  CustomerStatusEnum3["Active"] = "ACTIVE";
  CustomerStatusEnum3["Archived"] = "ARCHIVED";
  CustomerStatusEnum3["Churned"] = "CHURNED";
  CustomerStatusEnum3["Inactive"] = "INACTIVE";
  CustomerStatusEnum3["Prospect"] = "PROSPECT";
  CustomerStatusEnum3["Suspended"] = "SUSPENDED";
  return CustomerStatusEnum3;
})(CustomerStatusEnum || {});
var CustomerTierEnum = /* @__PURE__ */ ((CustomerTierEnum3) => {
  CustomerTierEnum3["Basic"] = "BASIC";
  CustomerTierEnum3["Enterprise"] = "ENTERPRISE";
  CustomerTierEnum3["Free"] = "FREE";
  CustomerTierEnum3["Premium"] = "PREMIUM";
  CustomerTierEnum3["Standard"] = "STANDARD";
  return CustomerTierEnum3;
})(CustomerTierEnum || {});
var CustomerTypeEnum = /* @__PURE__ */ ((CustomerTypeEnum3) => {
  CustomerTypeEnum3["Business"] = "BUSINESS";
  CustomerTypeEnum3["Enterprise"] = "ENTERPRISE";
  CustomerTypeEnum3["Individual"] = "INDIVIDUAL";
  CustomerTypeEnum3["Partner"] = "PARTNER";
  CustomerTypeEnum3["Vendor"] = "VENDOR";
  return CustomerTypeEnum3;
})(CustomerTypeEnum || {});
var DeviceStatusEnum = /* @__PURE__ */ ((DeviceStatusEnum3) => {
  DeviceStatusEnum3["Degraded"] = "DEGRADED";
  DeviceStatusEnum3["Offline"] = "OFFLINE";
  DeviceStatusEnum3["Online"] = "ONLINE";
  DeviceStatusEnum3["Unknown"] = "UNKNOWN";
  return DeviceStatusEnum3;
})(DeviceStatusEnum || {});
var DeviceTypeEnum = /* @__PURE__ */ ((DeviceTypeEnum3) => {
  DeviceTypeEnum3["Cpe"] = "CPE";
  DeviceTypeEnum3["Firewall"] = "FIREWALL";
  DeviceTypeEnum3["Olt"] = "OLT";
  DeviceTypeEnum3["Onu"] = "ONU";
  DeviceTypeEnum3["Other"] = "OTHER";
  DeviceTypeEnum3["Router"] = "ROUTER";
  DeviceTypeEnum3["Switch"] = "SWITCH";
  return DeviceTypeEnum3;
})(DeviceTypeEnum || {});
var DistributionPointType = /* @__PURE__ */ ((DistributionPointType3) => {
  DistributionPointType3["BuildingEntry"] = "BUILDING_ENTRY";
  DistributionPointType3["Cabinet"] = "CABINET";
  DistributionPointType3["Closure"] = "CLOSURE";
  DistributionPointType3["Handhole"] = "HANDHOLE";
  DistributionPointType3["Manhole"] = "MANHOLE";
  DistributionPointType3["Pedestal"] = "PEDESTAL";
  DistributionPointType3["Pole"] = "POLE";
  return DistributionPointType3;
})(DistributionPointType || {});
var FiberCableStatus = /* @__PURE__ */ ((FiberCableStatus3) => {
  FiberCableStatus3["Active"] = "ACTIVE";
  FiberCableStatus3["Damaged"] = "DAMAGED";
  FiberCableStatus3["Decommissioned"] = "DECOMMISSIONED";
  FiberCableStatus3["Inactive"] = "INACTIVE";
  FiberCableStatus3["Maintenance"] = "MAINTENANCE";
  FiberCableStatus3["UnderConstruction"] = "UNDER_CONSTRUCTION";
  return FiberCableStatus3;
})(FiberCableStatus || {});
var FiberHealthStatus = /* @__PURE__ */ ((FiberHealthStatus3) => {
  FiberHealthStatus3["Critical"] = "CRITICAL";
  FiberHealthStatus3["Excellent"] = "EXCELLENT";
  FiberHealthStatus3["Fair"] = "FAIR";
  FiberHealthStatus3["Good"] = "GOOD";
  FiberHealthStatus3["Poor"] = "POOR";
  return FiberHealthStatus3;
})(FiberHealthStatus || {});
var FiberType = /* @__PURE__ */ ((FiberType3) => {
  FiberType3["Hybrid"] = "HYBRID";
  FiberType3["MultiMode"] = "MULTI_MODE";
  FiberType3["SingleMode"] = "SINGLE_MODE";
  return FiberType3;
})(FiberType || {});
var FrequencyBand = /* @__PURE__ */ ((FrequencyBand3) => {
  FrequencyBand3["Band_2_4Ghz"] = "BAND_2_4_GHZ";
  FrequencyBand3["Band_5Ghz"] = "BAND_5_GHZ";
  FrequencyBand3["Band_6Ghz"] = "BAND_6_GHZ";
  return FrequencyBand3;
})(FrequencyBand || {});
var PaymentMethodTypeEnum = /* @__PURE__ */ ((PaymentMethodTypeEnum3) => {
  PaymentMethodTypeEnum3["Ach"] = "ACH";
  PaymentMethodTypeEnum3["BankAccount"] = "BANK_ACCOUNT";
  PaymentMethodTypeEnum3["Card"] = "CARD";
  PaymentMethodTypeEnum3["Cash"] = "CASH";
  PaymentMethodTypeEnum3["Check"] = "CHECK";
  PaymentMethodTypeEnum3["Crypto"] = "CRYPTO";
  PaymentMethodTypeEnum3["DigitalWallet"] = "DIGITAL_WALLET";
  PaymentMethodTypeEnum3["Other"] = "OTHER";
  PaymentMethodTypeEnum3["WireTransfer"] = "WIRE_TRANSFER";
  return PaymentMethodTypeEnum3;
})(PaymentMethodTypeEnum || {});
var PaymentStatusEnum = /* @__PURE__ */ ((PaymentStatusEnum3) => {
  PaymentStatusEnum3["Cancelled"] = "CANCELLED";
  PaymentStatusEnum3["Failed"] = "FAILED";
  PaymentStatusEnum3["Pending"] = "PENDING";
  PaymentStatusEnum3["Processing"] = "PROCESSING";
  PaymentStatusEnum3["Refunded"] = "REFUNDED";
  PaymentStatusEnum3["RequiresAction"] = "REQUIRES_ACTION";
  PaymentStatusEnum3["RequiresCapture"] = "REQUIRES_CAPTURE";
  PaymentStatusEnum3["RequiresConfirmation"] = "REQUIRES_CONFIRMATION";
  PaymentStatusEnum3["Succeeded"] = "SUCCEEDED";
  return PaymentStatusEnum3;
})(PaymentStatusEnum || {});
var PermissionCategoryEnum = /* @__PURE__ */ ((PermissionCategoryEnum3) => {
  PermissionCategoryEnum3["Admin"] = "ADMIN";
  PermissionCategoryEnum3["Analytics"] = "ANALYTICS";
  PermissionCategoryEnum3["Automation"] = "AUTOMATION";
  PermissionCategoryEnum3["Billing"] = "BILLING";
  PermissionCategoryEnum3["Communication"] = "COMMUNICATION";
  PermissionCategoryEnum3["Cpe"] = "CPE";
  PermissionCategoryEnum3["Customer"] = "CUSTOMER";
  PermissionCategoryEnum3["Ipam"] = "IPAM";
  PermissionCategoryEnum3["Network"] = "NETWORK";
  PermissionCategoryEnum3["Security"] = "SECURITY";
  PermissionCategoryEnum3["Ticket"] = "TICKET";
  PermissionCategoryEnum3["User"] = "USER";
  PermissionCategoryEnum3["Workflow"] = "WORKFLOW";
  return PermissionCategoryEnum3;
})(PermissionCategoryEnum || {});
var ProductTypeEnum = /* @__PURE__ */ ((ProductTypeEnum3) => {
  ProductTypeEnum3["Hybrid"] = "HYBRID";
  ProductTypeEnum3["OneTime"] = "ONE_TIME";
  ProductTypeEnum3["Subscription"] = "SUBSCRIPTION";
  ProductTypeEnum3["UsageBased"] = "USAGE_BASED";
  return ProductTypeEnum3;
})(ProductTypeEnum || {});
var ServiceAreaType = /* @__PURE__ */ ((ServiceAreaType3) => {
  ServiceAreaType3["Commercial"] = "COMMERCIAL";
  ServiceAreaType3["Industrial"] = "INDUSTRIAL";
  ServiceAreaType3["Mixed"] = "MIXED";
  ServiceAreaType3["Residential"] = "RESIDENTIAL";
  return ServiceAreaType3;
})(ServiceAreaType || {});
var SpliceStatus = /* @__PURE__ */ ((SpliceStatus3) => {
  SpliceStatus3["Active"] = "ACTIVE";
  SpliceStatus3["Degraded"] = "DEGRADED";
  SpliceStatus3["Failed"] = "FAILED";
  SpliceStatus3["Inactive"] = "INACTIVE";
  return SpliceStatus3;
})(SpliceStatus || {});
var SpliceType = /* @__PURE__ */ ((SpliceType3) => {
  SpliceType3["Fusion"] = "FUSION";
  SpliceType3["Mechanical"] = "MECHANICAL";
  return SpliceType3;
})(SpliceType || {});
var SubscriptionStatusEnum = /* @__PURE__ */ ((SubscriptionStatusEnum3) => {
  SubscriptionStatusEnum3["Active"] = "ACTIVE";
  SubscriptionStatusEnum3["Canceled"] = "CANCELED";
  SubscriptionStatusEnum3["Ended"] = "ENDED";
  SubscriptionStatusEnum3["Incomplete"] = "INCOMPLETE";
  SubscriptionStatusEnum3["PastDue"] = "PAST_DUE";
  SubscriptionStatusEnum3["Paused"] = "PAUSED";
  SubscriptionStatusEnum3["Trialing"] = "TRIALING";
  return SubscriptionStatusEnum3;
})(SubscriptionStatusEnum || {});
var TenantPlanTypeEnum = /* @__PURE__ */ ((TenantPlanTypeEnum3) => {
  TenantPlanTypeEnum3["Custom"] = "CUSTOM";
  TenantPlanTypeEnum3["Enterprise"] = "ENTERPRISE";
  TenantPlanTypeEnum3["Free"] = "FREE";
  TenantPlanTypeEnum3["Professional"] = "PROFESSIONAL";
  TenantPlanTypeEnum3["Starter"] = "STARTER";
  return TenantPlanTypeEnum3;
})(TenantPlanTypeEnum || {});
var TenantStatusEnum = /* @__PURE__ */ ((TenantStatusEnum3) => {
  TenantStatusEnum3["Active"] = "ACTIVE";
  TenantStatusEnum3["Cancelled"] = "CANCELLED";
  TenantStatusEnum3["Inactive"] = "INACTIVE";
  TenantStatusEnum3["Pending"] = "PENDING";
  TenantStatusEnum3["Suspended"] = "SUSPENDED";
  TenantStatusEnum3["Trial"] = "TRIAL";
  return TenantStatusEnum3;
})(TenantStatusEnum || {});
var UserStatusEnum = /* @__PURE__ */ ((UserStatusEnum3) => {
  UserStatusEnum3["Active"] = "ACTIVE";
  UserStatusEnum3["Invited"] = "INVITED";
  UserStatusEnum3["Suspended"] = "SUSPENDED";
  return UserStatusEnum3;
})(UserStatusEnum || {});
var WirelessSecurityType = /* @__PURE__ */ ((WirelessSecurityType3) => {
  WirelessSecurityType3["Open"] = "OPEN";
  WirelessSecurityType3["Wep"] = "WEP";
  WirelessSecurityType3["Wpa"] = "WPA";
  WirelessSecurityType3["Wpa2"] = "WPA2";
  WirelessSecurityType3["Wpa2Wpa3"] = "WPA2_WPA3";
  WirelessSecurityType3["Wpa3"] = "WPA3";
  return WirelessSecurityType3;
})(WirelessSecurityType || {});
var WorkflowStatus = /* @__PURE__ */ ((WorkflowStatus3) => {
  WorkflowStatus3["Compensated"] = "COMPENSATED";
  WorkflowStatus3["Completed"] = "COMPLETED";
  WorkflowStatus3["Failed"] = "FAILED";
  WorkflowStatus3["Pending"] = "PENDING";
  WorkflowStatus3["RolledBack"] = "ROLLED_BACK";
  WorkflowStatus3["RollingBack"] = "ROLLING_BACK";
  WorkflowStatus3["Running"] = "RUNNING";
  return WorkflowStatus3;
})(WorkflowStatus || {});
var WorkflowStepStatus = /* @__PURE__ */ ((WorkflowStepStatus3) => {
  WorkflowStepStatus3["Compensated"] = "COMPENSATED";
  WorkflowStepStatus3["Compensating"] = "COMPENSATING";
  WorkflowStepStatus3["CompensationFailed"] = "COMPENSATION_FAILED";
  WorkflowStepStatus3["Completed"] = "COMPLETED";
  WorkflowStepStatus3["Failed"] = "FAILED";
  WorkflowStepStatus3["Pending"] = "PENDING";
  WorkflowStepStatus3["Running"] = "RUNNING";
  WorkflowStepStatus3["Skipped"] = "SKIPPED";
  return WorkflowStepStatus3;
})(WorkflowStepStatus || {});
var WorkflowType = /* @__PURE__ */ ((WorkflowType3) => {
  WorkflowType3["ActivateService"] = "ACTIVATE_SERVICE";
  WorkflowType3["ChangeServicePlan"] = "CHANGE_SERVICE_PLAN";
  WorkflowType3["DeprovisionSubscriber"] = "DEPROVISION_SUBSCRIBER";
  WorkflowType3["MigrateSubscriber"] = "MIGRATE_SUBSCRIBER";
  WorkflowType3["ProvisionSubscriber"] = "PROVISION_SUBSCRIBER";
  WorkflowType3["SuspendService"] = "SUSPEND_SERVICE";
  WorkflowType3["TerminateService"] = "TERMINATE_SERVICE";
  WorkflowType3["UpdateNetworkConfig"] = "UPDATE_NETWORK_CONFIG";
  return WorkflowType3;
})(WorkflowType || {});
var CustomerListDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CustomerList" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "limit" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "50" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "offset" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "0" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "status" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "CustomerStatusEnum" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "search" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "includeActivities" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
          defaultValue: { kind: "BooleanValue", value: false }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "includeNotes" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
          defaultValue: { kind: "BooleanValue", value: false }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "customers" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "Variable", name: { kind: "Name", value: "limit" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: { kind: "Variable", name: { kind: "Name", value: "offset" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "status" },
                value: { kind: "Variable", name: { kind: "Name", value: "status" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: { kind: "Variable", name: { kind: "Name", value: "search" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeActivities" },
                value: { kind: "Variable", name: { kind: "Name", value: "includeActivities" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeNotes" },
                value: { kind: "Variable", name: { kind: "Name", value: "includeNotes" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "customers" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "customerNumber" } },
                      { kind: "Field", name: { kind: "Name", value: "firstName" } },
                      { kind: "Field", name: { kind: "Name", value: "lastName" } },
                      { kind: "Field", name: { kind: "Name", value: "middleName" } },
                      { kind: "Field", name: { kind: "Name", value: "displayName" } },
                      { kind: "Field", name: { kind: "Name", value: "companyName" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "customerType" } },
                      { kind: "Field", name: { kind: "Name", value: "tier" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                      { kind: "Field", name: { kind: "Name", value: "emailVerified" } },
                      { kind: "Field", name: { kind: "Name", value: "phone" } },
                      { kind: "Field", name: { kind: "Name", value: "phoneVerified" } },
                      { kind: "Field", name: { kind: "Name", value: "mobile" } },
                      { kind: "Field", name: { kind: "Name", value: "addressLine1" } },
                      { kind: "Field", name: { kind: "Name", value: "addressLine2" } },
                      { kind: "Field", name: { kind: "Name", value: "city" } },
                      { kind: "Field", name: { kind: "Name", value: "stateProvince" } },
                      { kind: "Field", name: { kind: "Name", value: "postalCode" } },
                      { kind: "Field", name: { kind: "Name", value: "country" } },
                      { kind: "Field", name: { kind: "Name", value: "taxId" } },
                      { kind: "Field", name: { kind: "Name", value: "industry" } },
                      { kind: "Field", name: { kind: "Name", value: "employeeCount" } },
                      { kind: "Field", name: { kind: "Name", value: "lifetimeValue" } },
                      { kind: "Field", name: { kind: "Name", value: "totalPurchases" } },
                      { kind: "Field", name: { kind: "Name", value: "averageOrderValue" } },
                      { kind: "Field", name: { kind: "Name", value: "lastPurchaseDate" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "acquisitionDate" } },
                      { kind: "Field", name: { kind: "Name", value: "lastContactDate" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "activities" },
                        directives: [
                          {
                            kind: "Directive",
                            name: { kind: "Name", value: "include" },
                            arguments: [
                              {
                                kind: "Argument",
                                name: { kind: "Name", value: "if" },
                                value: {
                                  kind: "Variable",
                                  name: { kind: "Name", value: "includeActivities" }
                                }
                              }
                            ]
                          }
                        ],
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "customerId" } },
                            { kind: "Field", name: { kind: "Name", value: "activityType" } },
                            { kind: "Field", name: { kind: "Name", value: "title" } },
                            { kind: "Field", name: { kind: "Name", value: "description" } },
                            { kind: "Field", name: { kind: "Name", value: "performedBy" } },
                            { kind: "Field", name: { kind: "Name", value: "createdAt" } }
                          ]
                        }
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "notes" },
                        directives: [
                          {
                            kind: "Directive",
                            name: { kind: "Name", value: "include" },
                            arguments: [
                              {
                                kind: "Argument",
                                name: { kind: "Name", value: "if" },
                                value: {
                                  kind: "Variable",
                                  name: { kind: "Name", value: "includeNotes" }
                                }
                              }
                            ]
                          }
                        ],
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "customerId" } },
                            { kind: "Field", name: { kind: "Name", value: "subject" } },
                            { kind: "Field", name: { kind: "Name", value: "content" } },
                            { kind: "Field", name: { kind: "Name", value: "isInternal" } },
                            { kind: "Field", name: { kind: "Name", value: "createdById" } },
                            { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                            { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
                          ]
                        }
                      }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var CustomerDetailDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CustomerDetail" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "customer" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeActivities" },
                value: { kind: "BooleanValue", value: true }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeNotes" },
                value: { kind: "BooleanValue", value: true }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "customerNumber" } },
                { kind: "Field", name: { kind: "Name", value: "firstName" } },
                { kind: "Field", name: { kind: "Name", value: "lastName" } },
                { kind: "Field", name: { kind: "Name", value: "middleName" } },
                { kind: "Field", name: { kind: "Name", value: "displayName" } },
                { kind: "Field", name: { kind: "Name", value: "companyName" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "customerType" } },
                { kind: "Field", name: { kind: "Name", value: "tier" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                { kind: "Field", name: { kind: "Name", value: "emailVerified" } },
                { kind: "Field", name: { kind: "Name", value: "phone" } },
                { kind: "Field", name: { kind: "Name", value: "phoneVerified" } },
                { kind: "Field", name: { kind: "Name", value: "mobile" } },
                { kind: "Field", name: { kind: "Name", value: "addressLine1" } },
                { kind: "Field", name: { kind: "Name", value: "addressLine2" } },
                { kind: "Field", name: { kind: "Name", value: "city" } },
                { kind: "Field", name: { kind: "Name", value: "stateProvince" } },
                { kind: "Field", name: { kind: "Name", value: "postalCode" } },
                { kind: "Field", name: { kind: "Name", value: "country" } },
                { kind: "Field", name: { kind: "Name", value: "taxId" } },
                { kind: "Field", name: { kind: "Name", value: "industry" } },
                { kind: "Field", name: { kind: "Name", value: "employeeCount" } },
                { kind: "Field", name: { kind: "Name", value: "lifetimeValue" } },
                { kind: "Field", name: { kind: "Name", value: "totalPurchases" } },
                { kind: "Field", name: { kind: "Name", value: "averageOrderValue" } },
                { kind: "Field", name: { kind: "Name", value: "lastPurchaseDate" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                { kind: "Field", name: { kind: "Name", value: "acquisitionDate" } },
                { kind: "Field", name: { kind: "Name", value: "lastContactDate" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "activities" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "customerId" } },
                      { kind: "Field", name: { kind: "Name", value: "activityType" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "performedBy" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "notes" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "customerId" } },
                      { kind: "Field", name: { kind: "Name", value: "subject" } },
                      { kind: "Field", name: { kind: "Name", value: "content" } },
                      { kind: "Field", name: { kind: "Name", value: "isInternal" } },
                      { kind: "Field", name: { kind: "Name", value: "createdById" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
};
var CustomerMetricsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CustomerMetrics" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "customerMetrics" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "totalCustomers" } },
                { kind: "Field", name: { kind: "Name", value: "activeCustomers" } },
                { kind: "Field", name: { kind: "Name", value: "newCustomers" } },
                { kind: "Field", name: { kind: "Name", value: "churnedCustomers" } },
                { kind: "Field", name: { kind: "Name", value: "totalCustomerValue" } },
                { kind: "Field", name: { kind: "Name", value: "averageCustomerValue" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var CustomerActivitiesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CustomerActivities" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "customer" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeActivities" },
                value: { kind: "BooleanValue", value: true }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeNotes" },
                value: { kind: "BooleanValue", value: false }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "activities" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "customerId" } },
                      { kind: "Field", name: { kind: "Name", value: "activityType" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "performedBy" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
};
var CustomerNotesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CustomerNotes" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "customer" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeActivities" },
                value: { kind: "BooleanValue", value: false }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeNotes" },
                value: { kind: "BooleanValue", value: true }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "notes" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "customerId" } },
                      { kind: "Field", name: { kind: "Name", value: "subject" } },
                      { kind: "Field", name: { kind: "Name", value: "content" } },
                      { kind: "Field", name: { kind: "Name", value: "isInternal" } },
                      { kind: "Field", name: { kind: "Name", value: "createdById" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
};
var CustomerDashboardDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CustomerDashboard" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "limit" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "20" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "offset" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "0" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "status" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "CustomerStatusEnum" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "search" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "customers" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "Variable", name: { kind: "Name", value: "limit" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: { kind: "Variable", name: { kind: "Name", value: "offset" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "status" },
                value: { kind: "Variable", name: { kind: "Name", value: "status" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: { kind: "Variable", name: { kind: "Name", value: "search" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeActivities" },
                value: { kind: "BooleanValue", value: false }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeNotes" },
                value: { kind: "BooleanValue", value: false }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "customers" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "customerNumber" } },
                      { kind: "Field", name: { kind: "Name", value: "firstName" } },
                      { kind: "Field", name: { kind: "Name", value: "lastName" } },
                      { kind: "Field", name: { kind: "Name", value: "companyName" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                      { kind: "Field", name: { kind: "Name", value: "phone" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "customerType" } },
                      { kind: "Field", name: { kind: "Name", value: "tier" } },
                      { kind: "Field", name: { kind: "Name", value: "lifetimeValue" } },
                      { kind: "Field", name: { kind: "Name", value: "totalPurchases" } },
                      { kind: "Field", name: { kind: "Name", value: "lastContactDate" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } }
              ]
            }
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "customerMetrics" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "totalCustomers" } },
                { kind: "Field", name: { kind: "Name", value: "activeCustomers" } },
                { kind: "Field", name: { kind: "Name", value: "newCustomers" } },
                { kind: "Field", name: { kind: "Name", value: "churnedCustomers" } },
                { kind: "Field", name: { kind: "Name", value: "totalCustomerValue" } },
                { kind: "Field", name: { kind: "Name", value: "averageCustomerValue" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var CustomerSubscriptionsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CustomerSubscriptions" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "customerId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "status" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "limit" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "50" }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "customerSubscriptions" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "customerId" },
                value: { kind: "Variable", name: { kind: "Name", value: "customerId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "status" },
                value: { kind: "Variable", name: { kind: "Name", value: "status" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "Variable", name: { kind: "Name", value: "limit" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "subscriptionId" } },
                { kind: "Field", name: { kind: "Name", value: "customerId" } },
                { kind: "Field", name: { kind: "Name", value: "planId" } },
                { kind: "Field", name: { kind: "Name", value: "tenantId" } },
                { kind: "Field", name: { kind: "Name", value: "currentPeriodStart" } },
                { kind: "Field", name: { kind: "Name", value: "currentPeriodEnd" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "trialEnd" } },
                { kind: "Field", name: { kind: "Name", value: "isInTrial" } },
                { kind: "Field", name: { kind: "Name", value: "cancelAtPeriodEnd" } },
                { kind: "Field", name: { kind: "Name", value: "canceledAt" } },
                { kind: "Field", name: { kind: "Name", value: "endedAt" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var CustomerNetworkInfoDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CustomerNetworkInfo" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "customerId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "customerNetworkInfo" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "customerId" },
                value: { kind: "Variable", name: { kind: "Name", value: "customerId" } }
              }
            ]
          }
        ]
      }
    }
  ]
};
var CustomerDevicesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CustomerDevices" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "customerId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "deviceType" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "activeOnly" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
          defaultValue: { kind: "BooleanValue", value: true }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "customerDevices" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "customerId" },
                value: { kind: "Variable", name: { kind: "Name", value: "customerId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "deviceType" },
                value: { kind: "Variable", name: { kind: "Name", value: "deviceType" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "activeOnly" },
                value: { kind: "Variable", name: { kind: "Name", value: "activeOnly" } }
              }
            ]
          }
        ]
      }
    }
  ]
};
var CustomerTicketsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CustomerTickets" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "customerId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "limit" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "50" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "status" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "customerTickets" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "customerId" },
                value: { kind: "Variable", name: { kind: "Name", value: "customerId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "Variable", name: { kind: "Name", value: "limit" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "status" },
                value: { kind: "Variable", name: { kind: "Name", value: "status" } }
              }
            ]
          }
        ]
      }
    }
  ]
};
var CustomerBillingDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CustomerBilling" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "customerId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "includeInvoices" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
          defaultValue: { kind: "BooleanValue", value: true }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "invoiceLimit" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "50" }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "customerBilling" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "customerId" },
                value: { kind: "Variable", name: { kind: "Name", value: "customerId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeInvoices" },
                value: { kind: "Variable", name: { kind: "Name", value: "includeInvoices" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "invoiceLimit" },
                value: { kind: "Variable", name: { kind: "Name", value: "invoiceLimit" } }
              }
            ]
          }
        ]
      }
    }
  ]
};
var Customer360ViewDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Customer360View" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "customerId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "customer" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "customerId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeActivities" },
                value: { kind: "BooleanValue", value: true }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeNotes" },
                value: { kind: "BooleanValue", value: true }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "customerNumber" } },
                { kind: "Field", name: { kind: "Name", value: "firstName" } },
                { kind: "Field", name: { kind: "Name", value: "lastName" } },
                { kind: "Field", name: { kind: "Name", value: "middleName" } },
                { kind: "Field", name: { kind: "Name", value: "displayName" } },
                { kind: "Field", name: { kind: "Name", value: "companyName" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "customerType" } },
                { kind: "Field", name: { kind: "Name", value: "tier" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                { kind: "Field", name: { kind: "Name", value: "emailVerified" } },
                { kind: "Field", name: { kind: "Name", value: "phone" } },
                { kind: "Field", name: { kind: "Name", value: "phoneVerified" } },
                { kind: "Field", name: { kind: "Name", value: "mobile" } },
                { kind: "Field", name: { kind: "Name", value: "addressLine1" } },
                { kind: "Field", name: { kind: "Name", value: "addressLine2" } },
                { kind: "Field", name: { kind: "Name", value: "city" } },
                { kind: "Field", name: { kind: "Name", value: "stateProvince" } },
                { kind: "Field", name: { kind: "Name", value: "postalCode" } },
                { kind: "Field", name: { kind: "Name", value: "country" } },
                { kind: "Field", name: { kind: "Name", value: "taxId" } },
                { kind: "Field", name: { kind: "Name", value: "industry" } },
                { kind: "Field", name: { kind: "Name", value: "employeeCount" } },
                { kind: "Field", name: { kind: "Name", value: "lifetimeValue" } },
                { kind: "Field", name: { kind: "Name", value: "totalPurchases" } },
                { kind: "Field", name: { kind: "Name", value: "averageOrderValue" } },
                { kind: "Field", name: { kind: "Name", value: "lastPurchaseDate" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                { kind: "Field", name: { kind: "Name", value: "acquisitionDate" } },
                { kind: "Field", name: { kind: "Name", value: "lastContactDate" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "activities" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "customerId" } },
                      { kind: "Field", name: { kind: "Name", value: "activityType" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "performedBy" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "notes" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "customerId" } },
                      { kind: "Field", name: { kind: "Name", value: "subject" } },
                      { kind: "Field", name: { kind: "Name", value: "content" } },
                      { kind: "Field", name: { kind: "Name", value: "isInternal" } },
                      { kind: "Field", name: { kind: "Name", value: "createdById" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
                    ]
                  }
                }
              ]
            }
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "customerSubscriptions" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "customerId" },
                value: { kind: "Variable", name: { kind: "Name", value: "customerId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "IntValue", value: "10" }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "subscriptionId" } },
                { kind: "Field", name: { kind: "Name", value: "customerId" } },
                { kind: "Field", name: { kind: "Name", value: "planId" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "currentPeriodStart" } },
                { kind: "Field", name: { kind: "Name", value: "currentPeriodEnd" } },
                { kind: "Field", name: { kind: "Name", value: "isInTrial" } },
                { kind: "Field", name: { kind: "Name", value: "cancelAtPeriodEnd" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } }
              ]
            }
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "customerNetworkInfo" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "customerId" },
                value: { kind: "Variable", name: { kind: "Name", value: "customerId" } }
              }
            ]
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "customerDevices" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "customerId" },
                value: { kind: "Variable", name: { kind: "Name", value: "customerId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "activeOnly" },
                value: { kind: "BooleanValue", value: true }
              }
            ]
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "customerTickets" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "customerId" },
                value: { kind: "Variable", name: { kind: "Name", value: "customerId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "IntValue", value: "10" }
              }
            ]
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "customerBilling" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "customerId" },
                value: { kind: "Variable", name: { kind: "Name", value: "customerId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeInvoices" },
                value: { kind: "BooleanValue", value: true }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "invoiceLimit" },
                value: { kind: "IntValue", value: "10" }
              }
            ]
          }
        ]
      }
    }
  ]
};
var CustomerNetworkStatusUpdatedDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "CustomerNetworkStatusUpdated" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "customerId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "customerNetworkStatusUpdated" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "customerId" },
                value: { kind: "Variable", name: { kind: "Name", value: "customerId" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "customerId" } },
                { kind: "Field", name: { kind: "Name", value: "connectionStatus" } },
                { kind: "Field", name: { kind: "Name", value: "lastSeenAt" } },
                { kind: "Field", name: { kind: "Name", value: "ipv4Address" } },
                { kind: "Field", name: { kind: "Name", value: "ipv6Address" } },
                { kind: "Field", name: { kind: "Name", value: "macAddress" } },
                { kind: "Field", name: { kind: "Name", value: "vlanId" } },
                { kind: "Field", name: { kind: "Name", value: "signalStrength" } },
                { kind: "Field", name: { kind: "Name", value: "signalQuality" } },
                { kind: "Field", name: { kind: "Name", value: "uptimeSeconds" } },
                { kind: "Field", name: { kind: "Name", value: "uptimePercentage" } },
                { kind: "Field", name: { kind: "Name", value: "bandwidthUsageMbps" } },
                { kind: "Field", name: { kind: "Name", value: "downloadSpeedMbps" } },
                { kind: "Field", name: { kind: "Name", value: "uploadSpeedMbps" } },
                { kind: "Field", name: { kind: "Name", value: "packetLoss" } },
                { kind: "Field", name: { kind: "Name", value: "latencyMs" } },
                { kind: "Field", name: { kind: "Name", value: "jitter" } },
                { kind: "Field", name: { kind: "Name", value: "ontRxPower" } },
                { kind: "Field", name: { kind: "Name", value: "ontTxPower" } },
                { kind: "Field", name: { kind: "Name", value: "oltRxPower" } },
                { kind: "Field", name: { kind: "Name", value: "serviceStatus" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var CustomerDevicesUpdatedDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "CustomerDevicesUpdated" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "customerId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "customerDevicesUpdated" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "customerId" },
                value: { kind: "Variable", name: { kind: "Name", value: "customerId" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "customerId" } },
                { kind: "Field", name: { kind: "Name", value: "deviceId" } },
                { kind: "Field", name: { kind: "Name", value: "deviceType" } },
                { kind: "Field", name: { kind: "Name", value: "deviceName" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "healthStatus" } },
                { kind: "Field", name: { kind: "Name", value: "isOnline" } },
                { kind: "Field", name: { kind: "Name", value: "lastSeenAt" } },
                { kind: "Field", name: { kind: "Name", value: "signalStrength" } },
                { kind: "Field", name: { kind: "Name", value: "temperature" } },
                { kind: "Field", name: { kind: "Name", value: "cpuUsage" } },
                { kind: "Field", name: { kind: "Name", value: "memoryUsage" } },
                { kind: "Field", name: { kind: "Name", value: "uptimeSeconds" } },
                { kind: "Field", name: { kind: "Name", value: "firmwareVersion" } },
                { kind: "Field", name: { kind: "Name", value: "needsFirmwareUpdate" } },
                { kind: "Field", name: { kind: "Name", value: "changeType" } },
                { kind: "Field", name: { kind: "Name", value: "previousValue" } },
                { kind: "Field", name: { kind: "Name", value: "newValue" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var CustomerTicketUpdatedDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "CustomerTicketUpdated" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "customerId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "customerTicketUpdated" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "customerId" },
                value: { kind: "Variable", name: { kind: "Name", value: "customerId" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "customerId" } },
                { kind: "Field", name: { kind: "Name", value: "action" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "ticket" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "ticketNumber" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "priority" } },
                      { kind: "Field", name: { kind: "Name", value: "category" } },
                      { kind: "Field", name: { kind: "Name", value: "subCategory" } },
                      { kind: "Field", name: { kind: "Name", value: "assignedTo" } },
                      { kind: "Field", name: { kind: "Name", value: "assignedToName" } },
                      { kind: "Field", name: { kind: "Name", value: "assignedTeam" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "resolvedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "closedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "customerId" } },
                      { kind: "Field", name: { kind: "Name", value: "customerName" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "changedBy" } },
                { kind: "Field", name: { kind: "Name", value: "changedByName" } },
                { kind: "Field", name: { kind: "Name", value: "changes" } },
                { kind: "Field", name: { kind: "Name", value: "comment" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var CustomerActivityAddedDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "CustomerActivityAdded" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "customerId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "customerActivityAdded" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "customerId" },
                value: { kind: "Variable", name: { kind: "Name", value: "customerId" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "customerId" } },
                { kind: "Field", name: { kind: "Name", value: "activityType" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "performedBy" } },
                { kind: "Field", name: { kind: "Name", value: "performedByName" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var CustomerNoteUpdatedDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "CustomerNoteUpdated" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "customerId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "customerNoteUpdated" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "customerId" },
                value: { kind: "Variable", name: { kind: "Name", value: "customerId" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "customerId" } },
                { kind: "Field", name: { kind: "Name", value: "action" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "note" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "customerId" } },
                      { kind: "Field", name: { kind: "Name", value: "subject" } },
                      { kind: "Field", name: { kind: "Name", value: "content" } },
                      { kind: "Field", name: { kind: "Name", value: "isInternal" } },
                      { kind: "Field", name: { kind: "Name", value: "createdById" } },
                      { kind: "Field", name: { kind: "Name", value: "createdByName" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "changedBy" } },
                { kind: "Field", name: { kind: "Name", value: "changedByName" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var FiberCableListDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "FiberCableList" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "limit" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "50" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "offset" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "0" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "status" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "FiberCableStatus" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "fiberType" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "FiberType" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "installationType" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "CableInstallationType" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "siteId" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "search" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "fiberCables" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "Variable", name: { kind: "Name", value: "limit" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: { kind: "Variable", name: { kind: "Name", value: "offset" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "status" },
                value: { kind: "Variable", name: { kind: "Name", value: "status" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "fiberType" },
                value: { kind: "Variable", name: { kind: "Name", value: "fiberType" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "installationType" },
                value: { kind: "Variable", name: { kind: "Name", value: "installationType" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "siteId" },
                value: { kind: "Variable", name: { kind: "Name", value: "siteId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: { kind: "Variable", name: { kind: "Name", value: "search" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "cables" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "cableId" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } },
                      { kind: "Field", name: { kind: "Name", value: "fiberType" } },
                      { kind: "Field", name: { kind: "Name", value: "totalStrands" } },
                      { kind: "Field", name: { kind: "Name", value: "availableStrands" } },
                      { kind: "Field", name: { kind: "Name", value: "usedStrands" } },
                      { kind: "Field", name: { kind: "Name", value: "manufacturer" } },
                      { kind: "Field", name: { kind: "Name", value: "model" } },
                      { kind: "Field", name: { kind: "Name", value: "installationType" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "route" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "totalDistanceMeters" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "startPoint" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "latitude" } },
                                  { kind: "Field", name: { kind: "Name", value: "longitude" } },
                                  { kind: "Field", name: { kind: "Name", value: "altitude" } }
                                ]
                              }
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "endPoint" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "latitude" } },
                                  { kind: "Field", name: { kind: "Name", value: "longitude" } },
                                  { kind: "Field", name: { kind: "Name", value: "altitude" } }
                                ]
                              }
                            }
                          ]
                        }
                      },
                      { kind: "Field", name: { kind: "Name", value: "lengthMeters" } },
                      { kind: "Field", name: { kind: "Name", value: "startDistributionPointId" } },
                      { kind: "Field", name: { kind: "Name", value: "endDistributionPointId" } },
                      { kind: "Field", name: { kind: "Name", value: "startPointName" } },
                      { kind: "Field", name: { kind: "Name", value: "endPointName" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "capacityUtilizationPercent" }
                      },
                      { kind: "Field", name: { kind: "Name", value: "bandwidthCapacityGbps" } },
                      { kind: "Field", name: { kind: "Name", value: "spliceCount" } },
                      { kind: "Field", name: { kind: "Name", value: "totalLossDb" } },
                      { kind: "Field", name: { kind: "Name", value: "averageAttenuationDbPerKm" } },
                      { kind: "Field", name: { kind: "Name", value: "maxAttenuationDbPerKm" } },
                      { kind: "Field", name: { kind: "Name", value: "isLeased" } },
                      { kind: "Field", name: { kind: "Name", value: "installedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var FiberCableDetailDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "FiberCableDetail" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "fiberCable" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "cableId" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "isActive" } },
                { kind: "Field", name: { kind: "Name", value: "fiberType" } },
                { kind: "Field", name: { kind: "Name", value: "totalStrands" } },
                { kind: "Field", name: { kind: "Name", value: "availableStrands" } },
                { kind: "Field", name: { kind: "Name", value: "usedStrands" } },
                { kind: "Field", name: { kind: "Name", value: "manufacturer" } },
                { kind: "Field", name: { kind: "Name", value: "model" } },
                { kind: "Field", name: { kind: "Name", value: "installationType" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "route" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "pathGeojson" } },
                      { kind: "Field", name: { kind: "Name", value: "totalDistanceMeters" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "startPoint" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "latitude" } },
                            { kind: "Field", name: { kind: "Name", value: "longitude" } },
                            { kind: "Field", name: { kind: "Name", value: "altitude" } }
                          ]
                        }
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "endPoint" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "latitude" } },
                            { kind: "Field", name: { kind: "Name", value: "longitude" } },
                            { kind: "Field", name: { kind: "Name", value: "altitude" } }
                          ]
                        }
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "intermediatePoints" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "latitude" } },
                            { kind: "Field", name: { kind: "Name", value: "longitude" } },
                            { kind: "Field", name: { kind: "Name", value: "altitude" } }
                          ]
                        }
                      },
                      { kind: "Field", name: { kind: "Name", value: "elevationChangeMeters" } },
                      { kind: "Field", name: { kind: "Name", value: "undergroundDistanceMeters" } },
                      { kind: "Field", name: { kind: "Name", value: "aerialDistanceMeters" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "lengthMeters" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "strands" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "strandId" } },
                      { kind: "Field", name: { kind: "Name", value: "colorCode" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } },
                      { kind: "Field", name: { kind: "Name", value: "isAvailable" } },
                      { kind: "Field", name: { kind: "Name", value: "customerId" } },
                      { kind: "Field", name: { kind: "Name", value: "customerName" } },
                      { kind: "Field", name: { kind: "Name", value: "serviceId" } },
                      { kind: "Field", name: { kind: "Name", value: "attenuationDb" } },
                      { kind: "Field", name: { kind: "Name", value: "lossDb" } },
                      { kind: "Field", name: { kind: "Name", value: "spliceCount" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "startDistributionPointId" } },
                { kind: "Field", name: { kind: "Name", value: "endDistributionPointId" } },
                { kind: "Field", name: { kind: "Name", value: "startPointName" } },
                { kind: "Field", name: { kind: "Name", value: "endPointName" } },
                { kind: "Field", name: { kind: "Name", value: "capacityUtilizationPercent" } },
                { kind: "Field", name: { kind: "Name", value: "bandwidthCapacityGbps" } },
                { kind: "Field", name: { kind: "Name", value: "splicePointIds" } },
                { kind: "Field", name: { kind: "Name", value: "spliceCount" } },
                { kind: "Field", name: { kind: "Name", value: "totalLossDb" } },
                { kind: "Field", name: { kind: "Name", value: "averageAttenuationDbPerKm" } },
                { kind: "Field", name: { kind: "Name", value: "maxAttenuationDbPerKm" } },
                { kind: "Field", name: { kind: "Name", value: "conduitId" } },
                { kind: "Field", name: { kind: "Name", value: "ductNumber" } },
                { kind: "Field", name: { kind: "Name", value: "armored" } },
                { kind: "Field", name: { kind: "Name", value: "fireRated" } },
                { kind: "Field", name: { kind: "Name", value: "ownerId" } },
                { kind: "Field", name: { kind: "Name", value: "ownerName" } },
                { kind: "Field", name: { kind: "Name", value: "isLeased" } },
                { kind: "Field", name: { kind: "Name", value: "installedAt" } },
                { kind: "Field", name: { kind: "Name", value: "testedAt" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var FiberCablesByRouteDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "FiberCablesByRoute" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "startPointId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "endPointId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "fiberCablesByRoute" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "startPointId" },
                value: { kind: "Variable", name: { kind: "Name", value: "startPointId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "endPointId" },
                value: { kind: "Variable", name: { kind: "Name", value: "endPointId" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "cableId" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "totalStrands" } },
                { kind: "Field", name: { kind: "Name", value: "availableStrands" } },
                { kind: "Field", name: { kind: "Name", value: "lengthMeters" } },
                { kind: "Field", name: { kind: "Name", value: "capacityUtilizationPercent" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var FiberCablesByDistributionPointDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "FiberCablesByDistributionPoint" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "distributionPointId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "fiberCablesByDistributionPoint" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "distributionPointId" },
                value: { kind: "Variable", name: { kind: "Name", value: "distributionPointId" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "cableId" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "totalStrands" } },
                { kind: "Field", name: { kind: "Name", value: "availableStrands" } },
                { kind: "Field", name: { kind: "Name", value: "lengthMeters" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var SplicePointListDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SplicePointList" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "limit" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "50" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "offset" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "0" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "status" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "SpliceStatus" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "cableId" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "distributionPointId" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "splicePoints" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "Variable", name: { kind: "Name", value: "limit" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: { kind: "Variable", name: { kind: "Name", value: "offset" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "status" },
                value: { kind: "Variable", name: { kind: "Name", value: "status" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "cableId" },
                value: { kind: "Variable", name: { kind: "Name", value: "cableId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "distributionPointId" },
                value: { kind: "Variable", name: { kind: "Name", value: "distributionPointId" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "splicePoints" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "spliceId" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "location" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "latitude" } },
                            { kind: "Field", name: { kind: "Name", value: "longitude" } },
                            { kind: "Field", name: { kind: "Name", value: "altitude" } }
                          ]
                        }
                      },
                      { kind: "Field", name: { kind: "Name", value: "closureType" } },
                      { kind: "Field", name: { kind: "Name", value: "manufacturer" } },
                      { kind: "Field", name: { kind: "Name", value: "model" } },
                      { kind: "Field", name: { kind: "Name", value: "trayCount" } },
                      { kind: "Field", name: { kind: "Name", value: "trayCapacity" } },
                      { kind: "Field", name: { kind: "Name", value: "cablesConnected" } },
                      { kind: "Field", name: { kind: "Name", value: "cableCount" } },
                      { kind: "Field", name: { kind: "Name", value: "totalSplices" } },
                      { kind: "Field", name: { kind: "Name", value: "activeSplices" } },
                      { kind: "Field", name: { kind: "Name", value: "averageSpliceLossDb" } },
                      { kind: "Field", name: { kind: "Name", value: "maxSpliceLossDb" } },
                      { kind: "Field", name: { kind: "Name", value: "passingSplices" } },
                      { kind: "Field", name: { kind: "Name", value: "failingSplices" } },
                      { kind: "Field", name: { kind: "Name", value: "accessType" } },
                      { kind: "Field", name: { kind: "Name", value: "requiresSpecialAccess" } },
                      { kind: "Field", name: { kind: "Name", value: "installedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "lastTestedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "lastMaintainedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var SplicePointDetailDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SplicePointDetail" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "splicePoint" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "spliceId" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "isActive" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "location" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "latitude" } },
                      { kind: "Field", name: { kind: "Name", value: "longitude" } },
                      { kind: "Field", name: { kind: "Name", value: "altitude" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "address" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "streetAddress" } },
                      { kind: "Field", name: { kind: "Name", value: "city" } },
                      { kind: "Field", name: { kind: "Name", value: "stateProvince" } },
                      { kind: "Field", name: { kind: "Name", value: "postalCode" } },
                      { kind: "Field", name: { kind: "Name", value: "country" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "distributionPointId" } },
                { kind: "Field", name: { kind: "Name", value: "closureType" } },
                { kind: "Field", name: { kind: "Name", value: "manufacturer" } },
                { kind: "Field", name: { kind: "Name", value: "model" } },
                { kind: "Field", name: { kind: "Name", value: "trayCount" } },
                { kind: "Field", name: { kind: "Name", value: "trayCapacity" } },
                { kind: "Field", name: { kind: "Name", value: "cablesConnected" } },
                { kind: "Field", name: { kind: "Name", value: "cableCount" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "spliceConnections" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "cableAId" } },
                      { kind: "Field", name: { kind: "Name", value: "cableAStrand" } },
                      { kind: "Field", name: { kind: "Name", value: "cableBId" } },
                      { kind: "Field", name: { kind: "Name", value: "cableBStrand" } },
                      { kind: "Field", name: { kind: "Name", value: "spliceType" } },
                      { kind: "Field", name: { kind: "Name", value: "lossDb" } },
                      { kind: "Field", name: { kind: "Name", value: "reflectanceDb" } },
                      { kind: "Field", name: { kind: "Name", value: "isPassing" } },
                      { kind: "Field", name: { kind: "Name", value: "testResult" } },
                      { kind: "Field", name: { kind: "Name", value: "testedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "testedBy" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalSplices" } },
                { kind: "Field", name: { kind: "Name", value: "activeSplices" } },
                { kind: "Field", name: { kind: "Name", value: "averageSpliceLossDb" } },
                { kind: "Field", name: { kind: "Name", value: "maxSpliceLossDb" } },
                { kind: "Field", name: { kind: "Name", value: "passingSplices" } },
                { kind: "Field", name: { kind: "Name", value: "failingSplices" } },
                { kind: "Field", name: { kind: "Name", value: "accessType" } },
                { kind: "Field", name: { kind: "Name", value: "requiresSpecialAccess" } },
                { kind: "Field", name: { kind: "Name", value: "accessNotes" } },
                { kind: "Field", name: { kind: "Name", value: "installedAt" } },
                { kind: "Field", name: { kind: "Name", value: "lastTestedAt" } },
                { kind: "Field", name: { kind: "Name", value: "lastMaintainedAt" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var SplicePointsByCableDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SplicePointsByCable" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "cableId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "splicePointsByCable" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "cableId" },
                value: { kind: "Variable", name: { kind: "Name", value: "cableId" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "spliceId" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "totalSplices" } },
                { kind: "Field", name: { kind: "Name", value: "activeSplices" } },
                { kind: "Field", name: { kind: "Name", value: "averageSpliceLossDb" } },
                { kind: "Field", name: { kind: "Name", value: "passingSplices" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var DistributionPointListDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "DistributionPointList" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "limit" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "50" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "offset" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "0" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "pointType" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "DistributionPointType" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "status" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "FiberCableStatus" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "siteId" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "nearCapacity" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "distributionPoints" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "Variable", name: { kind: "Name", value: "limit" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: { kind: "Variable", name: { kind: "Name", value: "offset" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "pointType" },
                value: { kind: "Variable", name: { kind: "Name", value: "pointType" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "status" },
                value: { kind: "Variable", name: { kind: "Name", value: "status" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "siteId" },
                value: { kind: "Variable", name: { kind: "Name", value: "siteId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "nearCapacity" },
                value: { kind: "Variable", name: { kind: "Name", value: "nearCapacity" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "distributionPoints" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "siteId" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "pointType" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "location" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "latitude" } },
                            { kind: "Field", name: { kind: "Name", value: "longitude" } },
                            { kind: "Field", name: { kind: "Name", value: "altitude" } }
                          ]
                        }
                      },
                      { kind: "Field", name: { kind: "Name", value: "manufacturer" } },
                      { kind: "Field", name: { kind: "Name", value: "model" } },
                      { kind: "Field", name: { kind: "Name", value: "totalCapacity" } },
                      { kind: "Field", name: { kind: "Name", value: "availableCapacity" } },
                      { kind: "Field", name: { kind: "Name", value: "usedCapacity" } },
                      { kind: "Field", name: { kind: "Name", value: "portCount" } },
                      { kind: "Field", name: { kind: "Name", value: "incomingCables" } },
                      { kind: "Field", name: { kind: "Name", value: "outgoingCables" } },
                      { kind: "Field", name: { kind: "Name", value: "totalCablesConnected" } },
                      { kind: "Field", name: { kind: "Name", value: "splicePointCount" } },
                      { kind: "Field", name: { kind: "Name", value: "hasPower" } },
                      { kind: "Field", name: { kind: "Name", value: "batteryBackup" } },
                      { kind: "Field", name: { kind: "Name", value: "environmentalMonitoring" } },
                      { kind: "Field", name: { kind: "Name", value: "temperatureCelsius" } },
                      { kind: "Field", name: { kind: "Name", value: "humidityPercent" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "capacityUtilizationPercent" }
                      },
                      { kind: "Field", name: { kind: "Name", value: "fiberStrandCount" } },
                      { kind: "Field", name: { kind: "Name", value: "availableStrandCount" } },
                      { kind: "Field", name: { kind: "Name", value: "servesCustomerCount" } },
                      { kind: "Field", name: { kind: "Name", value: "accessType" } },
                      { kind: "Field", name: { kind: "Name", value: "requiresKey" } },
                      { kind: "Field", name: { kind: "Name", value: "installedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "lastInspectedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "lastMaintainedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var DistributionPointDetailDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "DistributionPointDetail" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "distributionPoint" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "siteId" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "pointType" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "isActive" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "location" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "latitude" } },
                      { kind: "Field", name: { kind: "Name", value: "longitude" } },
                      { kind: "Field", name: { kind: "Name", value: "altitude" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "address" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "streetAddress" } },
                      { kind: "Field", name: { kind: "Name", value: "city" } },
                      { kind: "Field", name: { kind: "Name", value: "stateProvince" } },
                      { kind: "Field", name: { kind: "Name", value: "postalCode" } },
                      { kind: "Field", name: { kind: "Name", value: "country" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "siteName" } },
                { kind: "Field", name: { kind: "Name", value: "manufacturer" } },
                { kind: "Field", name: { kind: "Name", value: "model" } },
                { kind: "Field", name: { kind: "Name", value: "totalCapacity" } },
                { kind: "Field", name: { kind: "Name", value: "availableCapacity" } },
                { kind: "Field", name: { kind: "Name", value: "usedCapacity" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "ports" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "portNumber" } },
                      { kind: "Field", name: { kind: "Name", value: "isAllocated" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } },
                      { kind: "Field", name: { kind: "Name", value: "cableId" } },
                      { kind: "Field", name: { kind: "Name", value: "strandId" } },
                      { kind: "Field", name: { kind: "Name", value: "customerId" } },
                      { kind: "Field", name: { kind: "Name", value: "customerName" } },
                      { kind: "Field", name: { kind: "Name", value: "serviceId" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "portCount" } },
                { kind: "Field", name: { kind: "Name", value: "incomingCables" } },
                { kind: "Field", name: { kind: "Name", value: "outgoingCables" } },
                { kind: "Field", name: { kind: "Name", value: "totalCablesConnected" } },
                { kind: "Field", name: { kind: "Name", value: "splicePoints" } },
                { kind: "Field", name: { kind: "Name", value: "splicePointCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasPower" } },
                { kind: "Field", name: { kind: "Name", value: "batteryBackup" } },
                { kind: "Field", name: { kind: "Name", value: "environmentalMonitoring" } },
                { kind: "Field", name: { kind: "Name", value: "temperatureCelsius" } },
                { kind: "Field", name: { kind: "Name", value: "humidityPercent" } },
                { kind: "Field", name: { kind: "Name", value: "capacityUtilizationPercent" } },
                { kind: "Field", name: { kind: "Name", value: "fiberStrandCount" } },
                { kind: "Field", name: { kind: "Name", value: "availableStrandCount" } },
                { kind: "Field", name: { kind: "Name", value: "serviceAreaIds" } },
                { kind: "Field", name: { kind: "Name", value: "servesCustomerCount" } },
                { kind: "Field", name: { kind: "Name", value: "accessType" } },
                { kind: "Field", name: { kind: "Name", value: "requiresKey" } },
                { kind: "Field", name: { kind: "Name", value: "securityLevel" } },
                { kind: "Field", name: { kind: "Name", value: "accessNotes" } },
                { kind: "Field", name: { kind: "Name", value: "installedAt" } },
                { kind: "Field", name: { kind: "Name", value: "lastInspectedAt" } },
                { kind: "Field", name: { kind: "Name", value: "lastMaintainedAt" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var DistributionPointsBySiteDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "DistributionPointsBySite" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "siteId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "distributionPointsBySite" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "siteId" },
                value: { kind: "Variable", name: { kind: "Name", value: "siteId" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "pointType" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "totalCapacity" } },
                { kind: "Field", name: { kind: "Name", value: "availableCapacity" } },
                { kind: "Field", name: { kind: "Name", value: "capacityUtilizationPercent" } },
                { kind: "Field", name: { kind: "Name", value: "totalCablesConnected" } },
                { kind: "Field", name: { kind: "Name", value: "servesCustomerCount" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var ServiceAreaListDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ServiceAreaList" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "limit" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "50" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "offset" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "0" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "areaType" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "ServiceAreaType" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "isServiceable" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "constructionStatus" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "serviceAreas" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "Variable", name: { kind: "Name", value: "limit" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: { kind: "Variable", name: { kind: "Name", value: "offset" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "areaType" },
                value: { kind: "Variable", name: { kind: "Name", value: "areaType" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isServiceable" },
                value: { kind: "Variable", name: { kind: "Name", value: "isServiceable" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "constructionStatus" },
                value: { kind: "Variable", name: { kind: "Name", value: "constructionStatus" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "serviceAreas" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "areaId" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "areaType" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } },
                      { kind: "Field", name: { kind: "Name", value: "isServiceable" } },
                      { kind: "Field", name: { kind: "Name", value: "boundaryGeojson" } },
                      { kind: "Field", name: { kind: "Name", value: "areaSqkm" } },
                      { kind: "Field", name: { kind: "Name", value: "city" } },
                      { kind: "Field", name: { kind: "Name", value: "stateProvince" } },
                      { kind: "Field", name: { kind: "Name", value: "postalCodes" } },
                      { kind: "Field", name: { kind: "Name", value: "streetCount" } },
                      { kind: "Field", name: { kind: "Name", value: "homesPassed" } },
                      { kind: "Field", name: { kind: "Name", value: "homesConnected" } },
                      { kind: "Field", name: { kind: "Name", value: "businessesPassed" } },
                      { kind: "Field", name: { kind: "Name", value: "businessesConnected" } },
                      { kind: "Field", name: { kind: "Name", value: "penetrationRatePercent" } },
                      { kind: "Field", name: { kind: "Name", value: "distributionPointCount" } },
                      { kind: "Field", name: { kind: "Name", value: "totalFiberKm" } },
                      { kind: "Field", name: { kind: "Name", value: "totalCapacity" } },
                      { kind: "Field", name: { kind: "Name", value: "usedCapacity" } },
                      { kind: "Field", name: { kind: "Name", value: "availableCapacity" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "capacityUtilizationPercent" }
                      },
                      { kind: "Field", name: { kind: "Name", value: "maxBandwidthGbps" } },
                      { kind: "Field", name: { kind: "Name", value: "estimatedPopulation" } },
                      { kind: "Field", name: { kind: "Name", value: "householdDensityPerSqkm" } },
                      { kind: "Field", name: { kind: "Name", value: "constructionStatus" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "constructionCompletePercent" }
                      },
                      { kind: "Field", name: { kind: "Name", value: "targetCompletionDate" } },
                      { kind: "Field", name: { kind: "Name", value: "plannedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "constructionStartedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "activatedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var ServiceAreaDetailDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ServiceAreaDetail" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "serviceArea" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "areaId" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "areaType" } },
                { kind: "Field", name: { kind: "Name", value: "isActive" } },
                { kind: "Field", name: { kind: "Name", value: "isServiceable" } },
                { kind: "Field", name: { kind: "Name", value: "boundaryGeojson" } },
                { kind: "Field", name: { kind: "Name", value: "areaSqkm" } },
                { kind: "Field", name: { kind: "Name", value: "city" } },
                { kind: "Field", name: { kind: "Name", value: "stateProvince" } },
                { kind: "Field", name: { kind: "Name", value: "postalCodes" } },
                { kind: "Field", name: { kind: "Name", value: "streetCount" } },
                { kind: "Field", name: { kind: "Name", value: "homesPassed" } },
                { kind: "Field", name: { kind: "Name", value: "homesConnected" } },
                { kind: "Field", name: { kind: "Name", value: "businessesPassed" } },
                { kind: "Field", name: { kind: "Name", value: "businessesConnected" } },
                { kind: "Field", name: { kind: "Name", value: "penetrationRatePercent" } },
                { kind: "Field", name: { kind: "Name", value: "distributionPointIds" } },
                { kind: "Field", name: { kind: "Name", value: "distributionPointCount" } },
                { kind: "Field", name: { kind: "Name", value: "totalFiberKm" } },
                { kind: "Field", name: { kind: "Name", value: "totalCapacity" } },
                { kind: "Field", name: { kind: "Name", value: "usedCapacity" } },
                { kind: "Field", name: { kind: "Name", value: "availableCapacity" } },
                { kind: "Field", name: { kind: "Name", value: "capacityUtilizationPercent" } },
                { kind: "Field", name: { kind: "Name", value: "maxBandwidthGbps" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "averageDistanceToDistributionMeters" }
                },
                { kind: "Field", name: { kind: "Name", value: "estimatedPopulation" } },
                { kind: "Field", name: { kind: "Name", value: "householdDensityPerSqkm" } },
                { kind: "Field", name: { kind: "Name", value: "constructionStatus" } },
                { kind: "Field", name: { kind: "Name", value: "constructionCompletePercent" } },
                { kind: "Field", name: { kind: "Name", value: "targetCompletionDate" } },
                { kind: "Field", name: { kind: "Name", value: "plannedAt" } },
                { kind: "Field", name: { kind: "Name", value: "constructionStartedAt" } },
                { kind: "Field", name: { kind: "Name", value: "activatedAt" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var ServiceAreasByPostalCodeDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ServiceAreasByPostalCode" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "postalCode" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "serviceAreasByPostalCode" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "postalCode" },
                value: { kind: "Variable", name: { kind: "Name", value: "postalCode" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "areaId" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "city" } },
                { kind: "Field", name: { kind: "Name", value: "stateProvince" } },
                { kind: "Field", name: { kind: "Name", value: "isServiceable" } },
                { kind: "Field", name: { kind: "Name", value: "homesPassed" } },
                { kind: "Field", name: { kind: "Name", value: "homesConnected" } },
                { kind: "Field", name: { kind: "Name", value: "penetrationRatePercent" } },
                { kind: "Field", name: { kind: "Name", value: "maxBandwidthGbps" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var FiberHealthMetricsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "FiberHealthMetrics" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "cableId" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "healthStatus" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "FiberHealthStatus" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "fiberHealthMetrics" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "cableId" },
                value: { kind: "Variable", name: { kind: "Name", value: "cableId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "healthStatus" },
                value: { kind: "Variable", name: { kind: "Name", value: "healthStatus" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "cableId" } },
                { kind: "Field", name: { kind: "Name", value: "cableName" } },
                { kind: "Field", name: { kind: "Name", value: "healthStatus" } },
                { kind: "Field", name: { kind: "Name", value: "healthScore" } },
                { kind: "Field", name: { kind: "Name", value: "totalLossDb" } },
                { kind: "Field", name: { kind: "Name", value: "averageLossPerKmDb" } },
                { kind: "Field", name: { kind: "Name", value: "maxLossPerKmDb" } },
                { kind: "Field", name: { kind: "Name", value: "reflectanceDb" } },
                { kind: "Field", name: { kind: "Name", value: "averageSpliceLossDb" } },
                { kind: "Field", name: { kind: "Name", value: "maxSpliceLossDb" } },
                { kind: "Field", name: { kind: "Name", value: "failingSplicesCount" } },
                { kind: "Field", name: { kind: "Name", value: "totalStrands" } },
                { kind: "Field", name: { kind: "Name", value: "activeStrands" } },
                { kind: "Field", name: { kind: "Name", value: "degradedStrands" } },
                { kind: "Field", name: { kind: "Name", value: "failedStrands" } },
                { kind: "Field", name: { kind: "Name", value: "lastTestedAt" } },
                { kind: "Field", name: { kind: "Name", value: "testPassRatePercent" } },
                { kind: "Field", name: { kind: "Name", value: "daysSinceLastTest" } },
                { kind: "Field", name: { kind: "Name", value: "activeAlarms" } },
                { kind: "Field", name: { kind: "Name", value: "warningCount" } },
                { kind: "Field", name: { kind: "Name", value: "requiresMaintenance" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var OtdrTestResultsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "OTDRTestResults" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "cableId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "strandId" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "limit" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "10" }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "otdrTestResults" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "cableId" },
                value: { kind: "Variable", name: { kind: "Name", value: "cableId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "strandId" },
                value: { kind: "Variable", name: { kind: "Name", value: "strandId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "Variable", name: { kind: "Name", value: "limit" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "testId" } },
                { kind: "Field", name: { kind: "Name", value: "cableId" } },
                { kind: "Field", name: { kind: "Name", value: "strandId" } },
                { kind: "Field", name: { kind: "Name", value: "testedAt" } },
                { kind: "Field", name: { kind: "Name", value: "testedBy" } },
                { kind: "Field", name: { kind: "Name", value: "wavelengthNm" } },
                { kind: "Field", name: { kind: "Name", value: "pulseWidthNs" } },
                { kind: "Field", name: { kind: "Name", value: "totalLossDb" } },
                { kind: "Field", name: { kind: "Name", value: "totalLengthMeters" } },
                { kind: "Field", name: { kind: "Name", value: "averageAttenuationDbPerKm" } },
                { kind: "Field", name: { kind: "Name", value: "spliceCount" } },
                { kind: "Field", name: { kind: "Name", value: "connectorCount" } },
                { kind: "Field", name: { kind: "Name", value: "bendCount" } },
                { kind: "Field", name: { kind: "Name", value: "breakCount" } },
                { kind: "Field", name: { kind: "Name", value: "isPassing" } },
                { kind: "Field", name: { kind: "Name", value: "passThresholdDb" } },
                { kind: "Field", name: { kind: "Name", value: "marginDb" } },
                { kind: "Field", name: { kind: "Name", value: "traceFileUrl" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var FiberNetworkAnalyticsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "FiberNetworkAnalytics" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "fiberNetworkAnalytics" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "totalFiberKm" } },
                { kind: "Field", name: { kind: "Name", value: "totalCables" } },
                { kind: "Field", name: { kind: "Name", value: "totalStrands" } },
                { kind: "Field", name: { kind: "Name", value: "totalDistributionPoints" } },
                { kind: "Field", name: { kind: "Name", value: "totalSplicePoints" } },
                { kind: "Field", name: { kind: "Name", value: "totalCapacity" } },
                { kind: "Field", name: { kind: "Name", value: "usedCapacity" } },
                { kind: "Field", name: { kind: "Name", value: "availableCapacity" } },
                { kind: "Field", name: { kind: "Name", value: "capacityUtilizationPercent" } },
                { kind: "Field", name: { kind: "Name", value: "healthyCables" } },
                { kind: "Field", name: { kind: "Name", value: "degradedCables" } },
                { kind: "Field", name: { kind: "Name", value: "failedCables" } },
                { kind: "Field", name: { kind: "Name", value: "networkHealthScore" } },
                { kind: "Field", name: { kind: "Name", value: "totalServiceAreas" } },
                { kind: "Field", name: { kind: "Name", value: "activeServiceAreas" } },
                { kind: "Field", name: { kind: "Name", value: "homesPassed" } },
                { kind: "Field", name: { kind: "Name", value: "homesConnected" } },
                { kind: "Field", name: { kind: "Name", value: "penetrationRatePercent" } },
                { kind: "Field", name: { kind: "Name", value: "averageCableLossDbPerKm" } },
                { kind: "Field", name: { kind: "Name", value: "averageSpliceLossDb" } },
                { kind: "Field", name: { kind: "Name", value: "cablesDueForTesting" } },
                { kind: "Field", name: { kind: "Name", value: "cablesActive" } },
                { kind: "Field", name: { kind: "Name", value: "cablesInactive" } },
                { kind: "Field", name: { kind: "Name", value: "cablesUnderConstruction" } },
                { kind: "Field", name: { kind: "Name", value: "cablesMaintenance" } },
                { kind: "Field", name: { kind: "Name", value: "cablesWithHighLoss" } },
                { kind: "Field", name: { kind: "Name", value: "distributionPointsNearCapacity" } },
                { kind: "Field", name: { kind: "Name", value: "serviceAreasNeedsExpansion" } },
                { kind: "Field", name: { kind: "Name", value: "generatedAt" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var FiberDashboardDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "FiberDashboard" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "fiberDashboard" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "analytics" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "totalFiberKm" } },
                      { kind: "Field", name: { kind: "Name", value: "totalCables" } },
                      { kind: "Field", name: { kind: "Name", value: "totalStrands" } },
                      { kind: "Field", name: { kind: "Name", value: "totalDistributionPoints" } },
                      { kind: "Field", name: { kind: "Name", value: "totalSplicePoints" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "capacityUtilizationPercent" }
                      },
                      { kind: "Field", name: { kind: "Name", value: "networkHealthScore" } },
                      { kind: "Field", name: { kind: "Name", value: "homesPassed" } },
                      { kind: "Field", name: { kind: "Name", value: "homesConnected" } },
                      { kind: "Field", name: { kind: "Name", value: "penetrationRatePercent" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "topCablesByUtilization" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "cableId" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "capacityUtilizationPercent" }
                      },
                      { kind: "Field", name: { kind: "Name", value: "totalStrands" } },
                      { kind: "Field", name: { kind: "Name", value: "usedStrands" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "topDistributionPointsByCapacity" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "capacityUtilizationPercent" }
                      },
                      { kind: "Field", name: { kind: "Name", value: "totalCapacity" } },
                      { kind: "Field", name: { kind: "Name", value: "usedCapacity" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "topServiceAreasByPenetration" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "city" } },
                      { kind: "Field", name: { kind: "Name", value: "penetrationRatePercent" } },
                      { kind: "Field", name: { kind: "Name", value: "homesPassed" } },
                      { kind: "Field", name: { kind: "Name", value: "homesConnected" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "cablesRequiringAttention" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "cableId" } },
                      { kind: "Field", name: { kind: "Name", value: "cableName" } },
                      { kind: "Field", name: { kind: "Name", value: "healthStatus" } },
                      { kind: "Field", name: { kind: "Name", value: "healthScore" } },
                      { kind: "Field", name: { kind: "Name", value: "requiresMaintenance" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "recentTestResults" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "testId" } },
                      { kind: "Field", name: { kind: "Name", value: "cableId" } },
                      { kind: "Field", name: { kind: "Name", value: "strandId" } },
                      { kind: "Field", name: { kind: "Name", value: "testedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "isPassing" } },
                      { kind: "Field", name: { kind: "Name", value: "totalLossDb" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "distributionPointsNearCapacity" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "capacityUtilizationPercent" }
                      }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "serviceAreasExpansionCandidates" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "penetrationRatePercent" } },
                      { kind: "Field", name: { kind: "Name", value: "homesPassed" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "newConnectionsTrend" } },
                { kind: "Field", name: { kind: "Name", value: "capacityUtilizationTrend" } },
                { kind: "Field", name: { kind: "Name", value: "networkHealthTrend" } },
                { kind: "Field", name: { kind: "Name", value: "generatedAt" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var NetworkOverviewDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "NetworkOverview" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "networkOverview" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "totalDevices" } },
                { kind: "Field", name: { kind: "Name", value: "onlineDevices" } },
                { kind: "Field", name: { kind: "Name", value: "offlineDevices" } },
                { kind: "Field", name: { kind: "Name", value: "activeAlerts" } },
                { kind: "Field", name: { kind: "Name", value: "criticalAlerts" } },
                { kind: "Field", name: { kind: "Name", value: "warningAlerts" } },
                { kind: "Field", name: { kind: "Name", value: "totalBandwidthGbps" } },
                { kind: "Field", name: { kind: "Name", value: "uptimePercentage" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "dataSourceStatus" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "deviceTypeSummary" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "deviceType" } },
                      { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                      { kind: "Field", name: { kind: "Name", value: "onlineCount" } },
                      { kind: "Field", name: { kind: "Name", value: "avgCpuUsage" } },
                      { kind: "Field", name: { kind: "Name", value: "avgMemoryUsage" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "recentAlerts" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "alertId" } },
                      { kind: "Field", name: { kind: "Name", value: "severity" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "deviceName" } },
                      { kind: "Field", name: { kind: "Name", value: "deviceId" } },
                      { kind: "Field", name: { kind: "Name", value: "deviceType" } },
                      { kind: "Field", name: { kind: "Name", value: "triggeredAt" } },
                      { kind: "Field", name: { kind: "Name", value: "acknowledgedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "resolvedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
};
var NetworkDeviceListDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "NetworkDeviceList" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "page" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "1" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "pageSize" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "20" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "deviceType" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "DeviceTypeEnum" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "status" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "DeviceStatusEnum" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "search" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "networkDevices" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "page" },
                value: { kind: "Variable", name: { kind: "Name", value: "page" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "pageSize" },
                value: { kind: "Variable", name: { kind: "Name", value: "pageSize" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "deviceType" },
                value: { kind: "Variable", name: { kind: "Name", value: "deviceType" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "status" },
                value: { kind: "Variable", name: { kind: "Name", value: "status" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: { kind: "Variable", name: { kind: "Name", value: "search" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "devices" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "deviceId" } },
                      { kind: "Field", name: { kind: "Name", value: "deviceName" } },
                      { kind: "Field", name: { kind: "Name", value: "deviceType" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "ipAddress" } },
                      { kind: "Field", name: { kind: "Name", value: "firmwareVersion" } },
                      { kind: "Field", name: { kind: "Name", value: "model" } },
                      { kind: "Field", name: { kind: "Name", value: "location" } },
                      { kind: "Field", name: { kind: "Name", value: "tenantId" } },
                      { kind: "Field", name: { kind: "Name", value: "cpuUsagePercent" } },
                      { kind: "Field", name: { kind: "Name", value: "memoryUsagePercent" } },
                      { kind: "Field", name: { kind: "Name", value: "temperatureCelsius" } },
                      { kind: "Field", name: { kind: "Name", value: "powerStatus" } },
                      { kind: "Field", name: { kind: "Name", value: "pingLatencyMs" } },
                      { kind: "Field", name: { kind: "Name", value: "packetLossPercent" } },
                      { kind: "Field", name: { kind: "Name", value: "uptimeSeconds" } },
                      { kind: "Field", name: { kind: "Name", value: "uptimeDays" } },
                      { kind: "Field", name: { kind: "Name", value: "lastSeen" } },
                      { kind: "Field", name: { kind: "Name", value: "isHealthy" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
                { kind: "Field", name: { kind: "Name", value: "hasPrevPage" } },
                { kind: "Field", name: { kind: "Name", value: "page" } },
                { kind: "Field", name: { kind: "Name", value: "pageSize" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var DeviceDetailDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "DeviceDetail" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "deviceId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "deviceType" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "DeviceTypeEnum" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deviceHealth" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "deviceId" },
                value: { kind: "Variable", name: { kind: "Name", value: "deviceId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "deviceType" },
                value: { kind: "Variable", name: { kind: "Name", value: "deviceType" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "deviceId" } },
                { kind: "Field", name: { kind: "Name", value: "deviceName" } },
                { kind: "Field", name: { kind: "Name", value: "deviceType" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "ipAddress" } },
                { kind: "Field", name: { kind: "Name", value: "firmwareVersion" } },
                { kind: "Field", name: { kind: "Name", value: "model" } },
                { kind: "Field", name: { kind: "Name", value: "location" } },
                { kind: "Field", name: { kind: "Name", value: "tenantId" } },
                { kind: "Field", name: { kind: "Name", value: "cpuUsagePercent" } },
                { kind: "Field", name: { kind: "Name", value: "memoryUsagePercent" } },
                { kind: "Field", name: { kind: "Name", value: "temperatureCelsius" } },
                { kind: "Field", name: { kind: "Name", value: "powerStatus" } },
                { kind: "Field", name: { kind: "Name", value: "pingLatencyMs" } },
                { kind: "Field", name: { kind: "Name", value: "packetLossPercent" } },
                { kind: "Field", name: { kind: "Name", value: "uptimeSeconds" } },
                { kind: "Field", name: { kind: "Name", value: "uptimeDays" } },
                { kind: "Field", name: { kind: "Name", value: "lastSeen" } },
                { kind: "Field", name: { kind: "Name", value: "isHealthy" } }
              ]
            }
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "deviceTraffic" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "deviceId" },
                value: { kind: "Variable", name: { kind: "Name", value: "deviceId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "deviceType" },
                value: { kind: "Variable", name: { kind: "Name", value: "deviceType" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "deviceId" } },
                { kind: "Field", name: { kind: "Name", value: "deviceName" } },
                { kind: "Field", name: { kind: "Name", value: "totalBandwidthGbps" } },
                { kind: "Field", name: { kind: "Name", value: "currentRateInMbps" } },
                { kind: "Field", name: { kind: "Name", value: "currentRateOutMbps" } },
                { kind: "Field", name: { kind: "Name", value: "totalBytesIn" } },
                { kind: "Field", name: { kind: "Name", value: "totalBytesOut" } },
                { kind: "Field", name: { kind: "Name", value: "totalPacketsIn" } },
                { kind: "Field", name: { kind: "Name", value: "totalPacketsOut" } },
                { kind: "Field", name: { kind: "Name", value: "peakRateInBps" } },
                { kind: "Field", name: { kind: "Name", value: "peakRateOutBps" } },
                { kind: "Field", name: { kind: "Name", value: "peakTimestamp" } },
                { kind: "Field", name: { kind: "Name", value: "timestamp" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var DeviceTrafficDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "DeviceTraffic" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "deviceId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "deviceType" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "DeviceTypeEnum" } }
          }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "includeInterfaces" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
          defaultValue: { kind: "BooleanValue", value: false }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deviceTraffic" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "deviceId" },
                value: { kind: "Variable", name: { kind: "Name", value: "deviceId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "deviceType" },
                value: { kind: "Variable", name: { kind: "Name", value: "deviceType" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeInterfaces" },
                value: { kind: "Variable", name: { kind: "Name", value: "includeInterfaces" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "deviceId" } },
                { kind: "Field", name: { kind: "Name", value: "deviceName" } },
                { kind: "Field", name: { kind: "Name", value: "totalBandwidthGbps" } },
                { kind: "Field", name: { kind: "Name", value: "currentRateInMbps" } },
                { kind: "Field", name: { kind: "Name", value: "currentRateOutMbps" } },
                { kind: "Field", name: { kind: "Name", value: "totalBytesIn" } },
                { kind: "Field", name: { kind: "Name", value: "totalBytesOut" } },
                { kind: "Field", name: { kind: "Name", value: "totalPacketsIn" } },
                { kind: "Field", name: { kind: "Name", value: "totalPacketsOut" } },
                { kind: "Field", name: { kind: "Name", value: "peakRateInBps" } },
                { kind: "Field", name: { kind: "Name", value: "peakRateOutBps" } },
                { kind: "Field", name: { kind: "Name", value: "peakTimestamp" } },
                { kind: "Field", name: { kind: "Name", value: "timestamp" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "interfaces" },
                  directives: [
                    {
                      kind: "Directive",
                      name: { kind: "Name", value: "include" },
                      arguments: [
                        {
                          kind: "Argument",
                          name: { kind: "Name", value: "if" },
                          value: {
                            kind: "Variable",
                            name: { kind: "Name", value: "includeInterfaces" }
                          }
                        }
                      ]
                    }
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "interfaceName" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "rateInBps" } },
                      { kind: "Field", name: { kind: "Name", value: "rateOutBps" } },
                      { kind: "Field", name: { kind: "Name", value: "bytesIn" } },
                      { kind: "Field", name: { kind: "Name", value: "bytesOut" } },
                      { kind: "Field", name: { kind: "Name", value: "errorsIn" } },
                      { kind: "Field", name: { kind: "Name", value: "errorsOut" } },
                      { kind: "Field", name: { kind: "Name", value: "dropsIn" } },
                      { kind: "Field", name: { kind: "Name", value: "dropsOut" } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
};
var NetworkAlertListDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "NetworkAlertList" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "page" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "1" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "pageSize" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "50" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "severity" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "AlertSeverityEnum" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "activeOnly" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
          defaultValue: { kind: "BooleanValue", value: true }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "deviceId" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "deviceType" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "DeviceTypeEnum" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "networkAlerts" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "page" },
                value: { kind: "Variable", name: { kind: "Name", value: "page" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "pageSize" },
                value: { kind: "Variable", name: { kind: "Name", value: "pageSize" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "severity" },
                value: { kind: "Variable", name: { kind: "Name", value: "severity" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "activeOnly" },
                value: { kind: "Variable", name: { kind: "Name", value: "activeOnly" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "deviceId" },
                value: { kind: "Variable", name: { kind: "Name", value: "deviceId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "deviceType" },
                value: { kind: "Variable", name: { kind: "Name", value: "deviceType" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "alerts" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "alertId" } },
                      { kind: "Field", name: { kind: "Name", value: "alertRuleId" } },
                      { kind: "Field", name: { kind: "Name", value: "severity" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "deviceName" } },
                      { kind: "Field", name: { kind: "Name", value: "deviceId" } },
                      { kind: "Field", name: { kind: "Name", value: "deviceType" } },
                      { kind: "Field", name: { kind: "Name", value: "metricName" } },
                      { kind: "Field", name: { kind: "Name", value: "currentValue" } },
                      { kind: "Field", name: { kind: "Name", value: "thresholdValue" } },
                      { kind: "Field", name: { kind: "Name", value: "triggeredAt" } },
                      { kind: "Field", name: { kind: "Name", value: "acknowledgedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "resolvedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } },
                      { kind: "Field", name: { kind: "Name", value: "isAcknowledged" } },
                      { kind: "Field", name: { kind: "Name", value: "tenantId" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
                { kind: "Field", name: { kind: "Name", value: "hasPrevPage" } },
                { kind: "Field", name: { kind: "Name", value: "page" } },
                { kind: "Field", name: { kind: "Name", value: "pageSize" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var NetworkAlertDetailDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "NetworkAlertDetail" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "alertId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "networkAlert" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "alertId" },
                value: { kind: "Variable", name: { kind: "Name", value: "alertId" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "alertId" } },
                { kind: "Field", name: { kind: "Name", value: "alertRuleId" } },
                { kind: "Field", name: { kind: "Name", value: "severity" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "deviceName" } },
                { kind: "Field", name: { kind: "Name", value: "deviceId" } },
                { kind: "Field", name: { kind: "Name", value: "deviceType" } },
                { kind: "Field", name: { kind: "Name", value: "metricName" } },
                { kind: "Field", name: { kind: "Name", value: "currentValue" } },
                { kind: "Field", name: { kind: "Name", value: "thresholdValue" } },
                { kind: "Field", name: { kind: "Name", value: "triggeredAt" } },
                { kind: "Field", name: { kind: "Name", value: "acknowledgedAt" } },
                { kind: "Field", name: { kind: "Name", value: "resolvedAt" } },
                { kind: "Field", name: { kind: "Name", value: "isActive" } },
                { kind: "Field", name: { kind: "Name", value: "isAcknowledged" } },
                { kind: "Field", name: { kind: "Name", value: "tenantId" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var NetworkDashboardDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "NetworkDashboard" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "devicePage" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "1" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "devicePageSize" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "10" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "deviceType" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "DeviceTypeEnum" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "deviceStatus" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "DeviceStatusEnum" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "alertPage" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "1" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "alertPageSize" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "20" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "alertSeverity" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "AlertSeverityEnum" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "networkOverview" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "totalDevices" } },
                { kind: "Field", name: { kind: "Name", value: "onlineDevices" } },
                { kind: "Field", name: { kind: "Name", value: "offlineDevices" } },
                { kind: "Field", name: { kind: "Name", value: "activeAlerts" } },
                { kind: "Field", name: { kind: "Name", value: "criticalAlerts" } },
                { kind: "Field", name: { kind: "Name", value: "warningAlerts" } },
                { kind: "Field", name: { kind: "Name", value: "totalBandwidthGbps" } },
                { kind: "Field", name: { kind: "Name", value: "uptimePercentage" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "dataSourceStatus" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "deviceTypeSummary" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "deviceType" } },
                      { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                      { kind: "Field", name: { kind: "Name", value: "onlineCount" } },
                      { kind: "Field", name: { kind: "Name", value: "avgCpuUsage" } },
                      { kind: "Field", name: { kind: "Name", value: "avgMemoryUsage" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "recentAlerts" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "alertId" } },
                      { kind: "Field", name: { kind: "Name", value: "severity" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      { kind: "Field", name: { kind: "Name", value: "deviceName" } },
                      { kind: "Field", name: { kind: "Name", value: "triggeredAt" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } }
                    ]
                  }
                }
              ]
            }
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "networkDevices" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "page" },
                value: { kind: "Variable", name: { kind: "Name", value: "devicePage" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "pageSize" },
                value: { kind: "Variable", name: { kind: "Name", value: "devicePageSize" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "deviceType" },
                value: { kind: "Variable", name: { kind: "Name", value: "deviceType" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "status" },
                value: { kind: "Variable", name: { kind: "Name", value: "deviceStatus" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "devices" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "deviceId" } },
                      { kind: "Field", name: { kind: "Name", value: "deviceName" } },
                      { kind: "Field", name: { kind: "Name", value: "deviceType" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "ipAddress" } },
                      { kind: "Field", name: { kind: "Name", value: "cpuUsagePercent" } },
                      { kind: "Field", name: { kind: "Name", value: "memoryUsagePercent" } },
                      { kind: "Field", name: { kind: "Name", value: "uptimeSeconds" } },
                      { kind: "Field", name: { kind: "Name", value: "isHealthy" } },
                      { kind: "Field", name: { kind: "Name", value: "lastSeen" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } }
              ]
            }
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "networkAlerts" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "page" },
                value: { kind: "Variable", name: { kind: "Name", value: "alertPage" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "pageSize" },
                value: { kind: "Variable", name: { kind: "Name", value: "alertPageSize" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "severity" },
                value: { kind: "Variable", name: { kind: "Name", value: "alertSeverity" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "activeOnly" },
                value: { kind: "BooleanValue", value: true }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "alerts" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "alertId" } },
                      { kind: "Field", name: { kind: "Name", value: "severity" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "deviceName" } },
                      { kind: "Field", name: { kind: "Name", value: "deviceType" } },
                      { kind: "Field", name: { kind: "Name", value: "triggeredAt" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var DeviceUpdatesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "DeviceUpdates" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "deviceType" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "DeviceTypeEnum" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "status" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "DeviceStatusEnum" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deviceUpdated" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "deviceType" },
                value: { kind: "Variable", name: { kind: "Name", value: "deviceType" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "status" },
                value: { kind: "Variable", name: { kind: "Name", value: "status" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "deviceId" } },
                { kind: "Field", name: { kind: "Name", value: "deviceName" } },
                { kind: "Field", name: { kind: "Name", value: "deviceType" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "ipAddress" } },
                { kind: "Field", name: { kind: "Name", value: "firmwareVersion" } },
                { kind: "Field", name: { kind: "Name", value: "model" } },
                { kind: "Field", name: { kind: "Name", value: "location" } },
                { kind: "Field", name: { kind: "Name", value: "tenantId" } },
                { kind: "Field", name: { kind: "Name", value: "cpuUsagePercent" } },
                { kind: "Field", name: { kind: "Name", value: "memoryUsagePercent" } },
                { kind: "Field", name: { kind: "Name", value: "temperatureCelsius" } },
                { kind: "Field", name: { kind: "Name", value: "powerStatus" } },
                { kind: "Field", name: { kind: "Name", value: "pingLatencyMs" } },
                { kind: "Field", name: { kind: "Name", value: "packetLossPercent" } },
                { kind: "Field", name: { kind: "Name", value: "uptimeSeconds" } },
                { kind: "Field", name: { kind: "Name", value: "uptimeDays" } },
                { kind: "Field", name: { kind: "Name", value: "lastSeen" } },
                { kind: "Field", name: { kind: "Name", value: "isHealthy" } },
                { kind: "Field", name: { kind: "Name", value: "changeType" } },
                { kind: "Field", name: { kind: "Name", value: "previousValue" } },
                { kind: "Field", name: { kind: "Name", value: "newValue" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var NetworkAlertUpdatesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "NetworkAlertUpdates" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "severity" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "AlertSeverityEnum" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "deviceId" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "networkAlertUpdated" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "severity" },
                value: { kind: "Variable", name: { kind: "Name", value: "severity" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "deviceId" },
                value: { kind: "Variable", name: { kind: "Name", value: "deviceId" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "action" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "alert" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "alertId" } },
                      { kind: "Field", name: { kind: "Name", value: "alertRuleId" } },
                      { kind: "Field", name: { kind: "Name", value: "severity" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "deviceName" } },
                      { kind: "Field", name: { kind: "Name", value: "deviceId" } },
                      { kind: "Field", name: { kind: "Name", value: "deviceType" } },
                      { kind: "Field", name: { kind: "Name", value: "metricName" } },
                      { kind: "Field", name: { kind: "Name", value: "currentValue" } },
                      { kind: "Field", name: { kind: "Name", value: "thresholdValue" } },
                      { kind: "Field", name: { kind: "Name", value: "triggeredAt" } },
                      { kind: "Field", name: { kind: "Name", value: "acknowledgedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "resolvedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } },
                      { kind: "Field", name: { kind: "Name", value: "isAcknowledged" } },
                      { kind: "Field", name: { kind: "Name", value: "tenantId" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var SubscriberDashboardDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SubscriberDashboard" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "limit" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "50" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "search" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "subscribers" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "Variable", name: { kind: "Name", value: "limit" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: { kind: "Variable", name: { kind: "Name", value: "search" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "subscriberId" } },
                { kind: "Field", name: { kind: "Name", value: "username" } },
                { kind: "Field", name: { kind: "Name", value: "enabled" } },
                { kind: "Field", name: { kind: "Name", value: "framedIpAddress" } },
                { kind: "Field", name: { kind: "Name", value: "bandwidthProfileId" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "sessions" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "radacctid" } },
                      { kind: "Field", name: { kind: "Name", value: "username" } },
                      { kind: "Field", name: { kind: "Name", value: "nasipaddress" } },
                      { kind: "Field", name: { kind: "Name", value: "acctsessionid" } },
                      { kind: "Field", name: { kind: "Name", value: "acctsessiontime" } },
                      { kind: "Field", name: { kind: "Name", value: "acctinputoctets" } },
                      { kind: "Field", name: { kind: "Name", value: "acctoutputoctets" } },
                      { kind: "Field", name: { kind: "Name", value: "acctstarttime" } }
                    ]
                  }
                }
              ]
            }
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "subscriberMetrics" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "enabledCount" } },
                { kind: "Field", name: { kind: "Name", value: "disabledCount" } },
                { kind: "Field", name: { kind: "Name", value: "activeSessionsCount" } },
                { kind: "Field", name: { kind: "Name", value: "totalDataUsageMb" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var SubscriberDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Subscriber" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "username" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "subscribers" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "IntValue", value: "1" }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: { kind: "Variable", name: { kind: "Name", value: "username" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "subscriberId" } },
                { kind: "Field", name: { kind: "Name", value: "username" } },
                { kind: "Field", name: { kind: "Name", value: "enabled" } },
                { kind: "Field", name: { kind: "Name", value: "framedIpAddress" } },
                { kind: "Field", name: { kind: "Name", value: "bandwidthProfileId" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "sessions" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "radacctid" } },
                      { kind: "Field", name: { kind: "Name", value: "username" } },
                      { kind: "Field", name: { kind: "Name", value: "nasipaddress" } },
                      { kind: "Field", name: { kind: "Name", value: "acctsessionid" } },
                      { kind: "Field", name: { kind: "Name", value: "acctsessiontime" } },
                      { kind: "Field", name: { kind: "Name", value: "acctinputoctets" } },
                      { kind: "Field", name: { kind: "Name", value: "acctoutputoctets" } },
                      { kind: "Field", name: { kind: "Name", value: "acctstarttime" } },
                      { kind: "Field", name: { kind: "Name", value: "acctstoptime" } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
};
var ActiveSessionsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ActiveSessions" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "limit" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "100" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "username" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "sessions" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "Variable", name: { kind: "Name", value: "limit" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "username" },
                value: { kind: "Variable", name: { kind: "Name", value: "username" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "radacctid" } },
                { kind: "Field", name: { kind: "Name", value: "username" } },
                { kind: "Field", name: { kind: "Name", value: "nasipaddress" } },
                { kind: "Field", name: { kind: "Name", value: "acctsessionid" } },
                { kind: "Field", name: { kind: "Name", value: "acctsessiontime" } },
                { kind: "Field", name: { kind: "Name", value: "acctinputoctets" } },
                { kind: "Field", name: { kind: "Name", value: "acctoutputoctets" } },
                { kind: "Field", name: { kind: "Name", value: "acctstarttime" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var SubscriberMetricsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SubscriberMetrics" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "subscriberMetrics" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "enabledCount" } },
                { kind: "Field", name: { kind: "Name", value: "disabledCount" } },
                { kind: "Field", name: { kind: "Name", value: "activeSessionsCount" } },
                { kind: "Field", name: { kind: "Name", value: "totalDataUsageMb" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var SubscriptionListDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SubscriptionList" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "page" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "1" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "pageSize" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "10" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "status" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "SubscriptionStatusEnum" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "billingCycle" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "BillingCycleEnum" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "search" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "includeCustomer" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
          defaultValue: { kind: "BooleanValue", value: true }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "includePlan" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
          defaultValue: { kind: "BooleanValue", value: true }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "includeInvoices" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
          defaultValue: { kind: "BooleanValue", value: false }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "subscriptions" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "page" },
                value: { kind: "Variable", name: { kind: "Name", value: "page" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "pageSize" },
                value: { kind: "Variable", name: { kind: "Name", value: "pageSize" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "status" },
                value: { kind: "Variable", name: { kind: "Name", value: "status" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "billingCycle" },
                value: { kind: "Variable", name: { kind: "Name", value: "billingCycle" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: { kind: "Variable", name: { kind: "Name", value: "search" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeCustomer" },
                value: { kind: "Variable", name: { kind: "Name", value: "includeCustomer" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includePlan" },
                value: { kind: "Variable", name: { kind: "Name", value: "includePlan" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeInvoices" },
                value: { kind: "Variable", name: { kind: "Name", value: "includeInvoices" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "subscriptions" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "subscriptionId" } },
                      { kind: "Field", name: { kind: "Name", value: "customerId" } },
                      { kind: "Field", name: { kind: "Name", value: "planId" } },
                      { kind: "Field", name: { kind: "Name", value: "tenantId" } },
                      { kind: "Field", name: { kind: "Name", value: "currentPeriodStart" } },
                      { kind: "Field", name: { kind: "Name", value: "currentPeriodEnd" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "trialEnd" } },
                      { kind: "Field", name: { kind: "Name", value: "isInTrial" } },
                      { kind: "Field", name: { kind: "Name", value: "cancelAtPeriodEnd" } },
                      { kind: "Field", name: { kind: "Name", value: "canceledAt" } },
                      { kind: "Field", name: { kind: "Name", value: "endedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "customPrice" } },
                      { kind: "Field", name: { kind: "Name", value: "usageRecords" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } },
                      { kind: "Field", name: { kind: "Name", value: "daysUntilRenewal" } },
                      { kind: "Field", name: { kind: "Name", value: "isPastDue" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "customer" },
                        directives: [
                          {
                            kind: "Directive",
                            name: { kind: "Name", value: "include" },
                            arguments: [
                              {
                                kind: "Argument",
                                name: { kind: "Name", value: "if" },
                                value: {
                                  kind: "Variable",
                                  name: { kind: "Name", value: "includeCustomer" }
                                }
                              }
                            ]
                          }
                        ],
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "customerId" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            { kind: "Field", name: { kind: "Name", value: "email" } },
                            { kind: "Field", name: { kind: "Name", value: "phone" } },
                            { kind: "Field", name: { kind: "Name", value: "createdAt" } }
                          ]
                        }
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "plan" },
                        directives: [
                          {
                            kind: "Directive",
                            name: { kind: "Name", value: "include" },
                            arguments: [
                              {
                                kind: "Argument",
                                name: { kind: "Name", value: "if" },
                                value: {
                                  kind: "Variable",
                                  name: { kind: "Name", value: "includePlan" }
                                }
                              }
                            ]
                          }
                        ],
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "planId" } },
                            { kind: "Field", name: { kind: "Name", value: "productId" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            { kind: "Field", name: { kind: "Name", value: "description" } },
                            { kind: "Field", name: { kind: "Name", value: "billingCycle" } },
                            { kind: "Field", name: { kind: "Name", value: "price" } },
                            { kind: "Field", name: { kind: "Name", value: "currency" } },
                            { kind: "Field", name: { kind: "Name", value: "setupFee" } },
                            { kind: "Field", name: { kind: "Name", value: "trialDays" } },
                            { kind: "Field", name: { kind: "Name", value: "isActive" } },
                            { kind: "Field", name: { kind: "Name", value: "hasTrial" } },
                            { kind: "Field", name: { kind: "Name", value: "hasSetupFee" } },
                            { kind: "Field", name: { kind: "Name", value: "includedUsage" } },
                            { kind: "Field", name: { kind: "Name", value: "overageRates" } },
                            { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                            { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
                          ]
                        }
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "recentInvoices" },
                        directives: [
                          {
                            kind: "Directive",
                            name: { kind: "Name", value: "include" },
                            arguments: [
                              {
                                kind: "Argument",
                                name: { kind: "Name", value: "if" },
                                value: {
                                  kind: "Variable",
                                  name: { kind: "Name", value: "includeInvoices" }
                                }
                              }
                            ]
                          }
                        ],
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "invoiceId" } },
                            { kind: "Field", name: { kind: "Name", value: "invoiceNumber" } },
                            { kind: "Field", name: { kind: "Name", value: "amount" } },
                            { kind: "Field", name: { kind: "Name", value: "currency" } },
                            { kind: "Field", name: { kind: "Name", value: "status" } },
                            { kind: "Field", name: { kind: "Name", value: "dueDate" } },
                            { kind: "Field", name: { kind: "Name", value: "paidAt" } },
                            { kind: "Field", name: { kind: "Name", value: "createdAt" } }
                          ]
                        }
                      }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
                { kind: "Field", name: { kind: "Name", value: "hasPrevPage" } },
                { kind: "Field", name: { kind: "Name", value: "page" } },
                { kind: "Field", name: { kind: "Name", value: "pageSize" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var SubscriptionDetailDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SubscriptionDetail" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "subscription" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeCustomer" },
                value: { kind: "BooleanValue", value: true }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includePlan" },
                value: { kind: "BooleanValue", value: true }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeInvoices" },
                value: { kind: "BooleanValue", value: true }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "subscriptionId" } },
                { kind: "Field", name: { kind: "Name", value: "customerId" } },
                { kind: "Field", name: { kind: "Name", value: "planId" } },
                { kind: "Field", name: { kind: "Name", value: "tenantId" } },
                { kind: "Field", name: { kind: "Name", value: "currentPeriodStart" } },
                { kind: "Field", name: { kind: "Name", value: "currentPeriodEnd" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "trialEnd" } },
                { kind: "Field", name: { kind: "Name", value: "isInTrial" } },
                { kind: "Field", name: { kind: "Name", value: "cancelAtPeriodEnd" } },
                { kind: "Field", name: { kind: "Name", value: "canceledAt" } },
                { kind: "Field", name: { kind: "Name", value: "endedAt" } },
                { kind: "Field", name: { kind: "Name", value: "customPrice" } },
                { kind: "Field", name: { kind: "Name", value: "usageRecords" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                { kind: "Field", name: { kind: "Name", value: "isActive" } },
                { kind: "Field", name: { kind: "Name", value: "daysUntilRenewal" } },
                { kind: "Field", name: { kind: "Name", value: "isPastDue" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "customer" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "customerId" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                      { kind: "Field", name: { kind: "Name", value: "phone" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "plan" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "planId" } },
                      { kind: "Field", name: { kind: "Name", value: "productId" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "billingCycle" } },
                      { kind: "Field", name: { kind: "Name", value: "price" } },
                      { kind: "Field", name: { kind: "Name", value: "currency" } },
                      { kind: "Field", name: { kind: "Name", value: "setupFee" } },
                      { kind: "Field", name: { kind: "Name", value: "trialDays" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } },
                      { kind: "Field", name: { kind: "Name", value: "hasTrial" } },
                      { kind: "Field", name: { kind: "Name", value: "hasSetupFee" } },
                      { kind: "Field", name: { kind: "Name", value: "includedUsage" } },
                      { kind: "Field", name: { kind: "Name", value: "overageRates" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "recentInvoices" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "invoiceId" } },
                      { kind: "Field", name: { kind: "Name", value: "invoiceNumber" } },
                      { kind: "Field", name: { kind: "Name", value: "amount" } },
                      { kind: "Field", name: { kind: "Name", value: "currency" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "dueDate" } },
                      { kind: "Field", name: { kind: "Name", value: "paidAt" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
};
var SubscriptionMetricsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SubscriptionMetrics" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "subscriptionMetrics" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "totalSubscriptions" } },
                { kind: "Field", name: { kind: "Name", value: "activeSubscriptions" } },
                { kind: "Field", name: { kind: "Name", value: "trialingSubscriptions" } },
                { kind: "Field", name: { kind: "Name", value: "pastDueSubscriptions" } },
                { kind: "Field", name: { kind: "Name", value: "canceledSubscriptions" } },
                { kind: "Field", name: { kind: "Name", value: "pausedSubscriptions" } },
                { kind: "Field", name: { kind: "Name", value: "monthlyRecurringRevenue" } },
                { kind: "Field", name: { kind: "Name", value: "annualRecurringRevenue" } },
                { kind: "Field", name: { kind: "Name", value: "averageRevenuePerUser" } },
                { kind: "Field", name: { kind: "Name", value: "newSubscriptionsThisMonth" } },
                { kind: "Field", name: { kind: "Name", value: "newSubscriptionsLastMonth" } },
                { kind: "Field", name: { kind: "Name", value: "churnRate" } },
                { kind: "Field", name: { kind: "Name", value: "growthRate" } },
                { kind: "Field", name: { kind: "Name", value: "monthlySubscriptions" } },
                { kind: "Field", name: { kind: "Name", value: "quarterlySubscriptions" } },
                { kind: "Field", name: { kind: "Name", value: "annualSubscriptions" } },
                { kind: "Field", name: { kind: "Name", value: "trialConversionRate" } },
                { kind: "Field", name: { kind: "Name", value: "activeTrials" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var PlanListDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "PlanList" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "page" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "1" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "pageSize" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "20" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "isActive" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "billingCycle" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "BillingCycleEnum" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "plans" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "page" },
                value: { kind: "Variable", name: { kind: "Name", value: "page" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "pageSize" },
                value: { kind: "Variable", name: { kind: "Name", value: "pageSize" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isActive" },
                value: { kind: "Variable", name: { kind: "Name", value: "isActive" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "billingCycle" },
                value: { kind: "Variable", name: { kind: "Name", value: "billingCycle" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "plans" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "planId" } },
                      { kind: "Field", name: { kind: "Name", value: "productId" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "billingCycle" } },
                      { kind: "Field", name: { kind: "Name", value: "price" } },
                      { kind: "Field", name: { kind: "Name", value: "currency" } },
                      { kind: "Field", name: { kind: "Name", value: "setupFee" } },
                      { kind: "Field", name: { kind: "Name", value: "trialDays" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "hasTrial" } },
                      { kind: "Field", name: { kind: "Name", value: "hasSetupFee" } },
                      { kind: "Field", name: { kind: "Name", value: "includedUsage" } },
                      { kind: "Field", name: { kind: "Name", value: "overageRates" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
                { kind: "Field", name: { kind: "Name", value: "hasPrevPage" } },
                { kind: "Field", name: { kind: "Name", value: "page" } },
                { kind: "Field", name: { kind: "Name", value: "pageSize" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var ProductListDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ProductList" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "page" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "1" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "pageSize" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "20" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "isActive" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "category" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "products" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "page" },
                value: { kind: "Variable", name: { kind: "Name", value: "page" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "pageSize" },
                value: { kind: "Variable", name: { kind: "Name", value: "pageSize" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isActive" },
                value: { kind: "Variable", name: { kind: "Name", value: "isActive" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "category" },
                value: { kind: "Variable", name: { kind: "Name", value: "category" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "products" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "productId" } },
                      { kind: "Field", name: { kind: "Name", value: "sku" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "category" } },
                      { kind: "Field", name: { kind: "Name", value: "productType" } },
                      { kind: "Field", name: { kind: "Name", value: "basePrice" } },
                      { kind: "Field", name: { kind: "Name", value: "currency" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
                { kind: "Field", name: { kind: "Name", value: "hasPrevPage" } },
                { kind: "Field", name: { kind: "Name", value: "page" } },
                { kind: "Field", name: { kind: "Name", value: "pageSize" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var SubscriptionDashboardDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SubscriptionDashboard" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "page" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "1" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "pageSize" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "10" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "status" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "SubscriptionStatusEnum" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "search" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "subscriptions" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "page" },
                value: { kind: "Variable", name: { kind: "Name", value: "page" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "pageSize" },
                value: { kind: "Variable", name: { kind: "Name", value: "pageSize" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "status" },
                value: { kind: "Variable", name: { kind: "Name", value: "status" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: { kind: "Variable", name: { kind: "Name", value: "search" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeCustomer" },
                value: { kind: "BooleanValue", value: true }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includePlan" },
                value: { kind: "BooleanValue", value: true }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeInvoices" },
                value: { kind: "BooleanValue", value: false }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "subscriptions" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "subscriptionId" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "currentPeriodStart" } },
                      { kind: "Field", name: { kind: "Name", value: "currentPeriodEnd" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } },
                      { kind: "Field", name: { kind: "Name", value: "isInTrial" } },
                      { kind: "Field", name: { kind: "Name", value: "cancelAtPeriodEnd" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "customer" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            { kind: "Field", name: { kind: "Name", value: "email" } }
                          ]
                        }
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "plan" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            { kind: "Field", name: { kind: "Name", value: "price" } },
                            { kind: "Field", name: { kind: "Name", value: "currency" } },
                            { kind: "Field", name: { kind: "Name", value: "billingCycle" } }
                          ]
                        }
                      }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } }
              ]
            }
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "subscriptionMetrics" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "totalSubscriptions" } },
                { kind: "Field", name: { kind: "Name", value: "activeSubscriptions" } },
                { kind: "Field", name: { kind: "Name", value: "trialingSubscriptions" } },
                { kind: "Field", name: { kind: "Name", value: "pastDueSubscriptions" } },
                { kind: "Field", name: { kind: "Name", value: "monthlyRecurringRevenue" } },
                { kind: "Field", name: { kind: "Name", value: "annualRecurringRevenue" } },
                { kind: "Field", name: { kind: "Name", value: "averageRevenuePerUser" } },
                { kind: "Field", name: { kind: "Name", value: "newSubscriptionsThisMonth" } },
                { kind: "Field", name: { kind: "Name", value: "churnRate" } },
                { kind: "Field", name: { kind: "Name", value: "growthRate" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var UserListDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "UserList" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "page" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "1" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "pageSize" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "10" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "isActive" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "isVerified" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "isSuperuser" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "isPlatformAdmin" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "search" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "includeMetadata" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
          defaultValue: { kind: "BooleanValue", value: false }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "includeRoles" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
          defaultValue: { kind: "BooleanValue", value: false }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "includePermissions" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
          defaultValue: { kind: "BooleanValue", value: false }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "includeTeams" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
          defaultValue: { kind: "BooleanValue", value: false }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "users" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "page" },
                value: { kind: "Variable", name: { kind: "Name", value: "page" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "pageSize" },
                value: { kind: "Variable", name: { kind: "Name", value: "pageSize" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isActive" },
                value: { kind: "Variable", name: { kind: "Name", value: "isActive" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isVerified" },
                value: { kind: "Variable", name: { kind: "Name", value: "isVerified" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isSuperuser" },
                value: { kind: "Variable", name: { kind: "Name", value: "isSuperuser" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isPlatformAdmin" },
                value: { kind: "Variable", name: { kind: "Name", value: "isPlatformAdmin" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: { kind: "Variable", name: { kind: "Name", value: "search" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeMetadata" },
                value: { kind: "Variable", name: { kind: "Name", value: "includeMetadata" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeRoles" },
                value: { kind: "Variable", name: { kind: "Name", value: "includeRoles" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includePermissions" },
                value: { kind: "Variable", name: { kind: "Name", value: "includePermissions" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeTeams" },
                value: { kind: "Variable", name: { kind: "Name", value: "includeTeams" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "users" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "username" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                      { kind: "Field", name: { kind: "Name", value: "fullName" } },
                      { kind: "Field", name: { kind: "Name", value: "firstName" } },
                      { kind: "Field", name: { kind: "Name", value: "lastName" } },
                      { kind: "Field", name: { kind: "Name", value: "displayName" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } },
                      { kind: "Field", name: { kind: "Name", value: "isVerified" } },
                      { kind: "Field", name: { kind: "Name", value: "isSuperuser" } },
                      { kind: "Field", name: { kind: "Name", value: "isPlatformAdmin" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "phoneNumber" } },
                      { kind: "Field", name: { kind: "Name", value: "phone" } },
                      { kind: "Field", name: { kind: "Name", value: "phoneVerified" } },
                      { kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
                      { kind: "Field", name: { kind: "Name", value: "timezone" } },
                      { kind: "Field", name: { kind: "Name", value: "location" } },
                      { kind: "Field", name: { kind: "Name", value: "bio" } },
                      { kind: "Field", name: { kind: "Name", value: "website" } },
                      { kind: "Field", name: { kind: "Name", value: "mfaEnabled" } },
                      { kind: "Field", name: { kind: "Name", value: "lastLogin" } },
                      { kind: "Field", name: { kind: "Name", value: "lastLoginIp" } },
                      { kind: "Field", name: { kind: "Name", value: "failedLoginAttempts" } },
                      { kind: "Field", name: { kind: "Name", value: "lockedUntil" } },
                      { kind: "Field", name: { kind: "Name", value: "language" } },
                      { kind: "Field", name: { kind: "Name", value: "tenantId" } },
                      { kind: "Field", name: { kind: "Name", value: "primaryRole" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "metadata" },
                        directives: [
                          {
                            kind: "Directive",
                            name: { kind: "Name", value: "include" },
                            arguments: [
                              {
                                kind: "Argument",
                                name: { kind: "Name", value: "if" },
                                value: {
                                  kind: "Variable",
                                  name: { kind: "Name", value: "includeMetadata" }
                                }
                              }
                            ]
                          }
                        ]
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "roles" },
                        directives: [
                          {
                            kind: "Directive",
                            name: { kind: "Name", value: "include" },
                            arguments: [
                              {
                                kind: "Argument",
                                name: { kind: "Name", value: "if" },
                                value: {
                                  kind: "Variable",
                                  name: { kind: "Name", value: "includeRoles" }
                                }
                              }
                            ]
                          }
                        ],
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            { kind: "Field", name: { kind: "Name", value: "displayName" } },
                            { kind: "Field", name: { kind: "Name", value: "description" } },
                            { kind: "Field", name: { kind: "Name", value: "priority" } },
                            { kind: "Field", name: { kind: "Name", value: "isSystem" } },
                            { kind: "Field", name: { kind: "Name", value: "isActive" } },
                            { kind: "Field", name: { kind: "Name", value: "isDefault" } },
                            { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                            { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
                          ]
                        }
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "permissions" },
                        directives: [
                          {
                            kind: "Directive",
                            name: { kind: "Name", value: "include" },
                            arguments: [
                              {
                                kind: "Argument",
                                name: { kind: "Name", value: "if" },
                                value: {
                                  kind: "Variable",
                                  name: { kind: "Name", value: "includePermissions" }
                                }
                              }
                            ]
                          }
                        ],
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            { kind: "Field", name: { kind: "Name", value: "displayName" } },
                            { kind: "Field", name: { kind: "Name", value: "description" } },
                            { kind: "Field", name: { kind: "Name", value: "category" } },
                            { kind: "Field", name: { kind: "Name", value: "isActive" } },
                            { kind: "Field", name: { kind: "Name", value: "isSystem" } },
                            { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                            { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
                          ]
                        }
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "teams" },
                        directives: [
                          {
                            kind: "Directive",
                            name: { kind: "Name", value: "include" },
                            arguments: [
                              {
                                kind: "Argument",
                                name: { kind: "Name", value: "if" },
                                value: {
                                  kind: "Variable",
                                  name: { kind: "Name", value: "includeTeams" }
                                }
                              }
                            ]
                          }
                        ],
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "teamId" } },
                            { kind: "Field", name: { kind: "Name", value: "teamName" } },
                            { kind: "Field", name: { kind: "Name", value: "role" } },
                            { kind: "Field", name: { kind: "Name", value: "joinedAt" } }
                          ]
                        }
                      }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
                { kind: "Field", name: { kind: "Name", value: "hasPrevPage" } },
                { kind: "Field", name: { kind: "Name", value: "page" } },
                { kind: "Field", name: { kind: "Name", value: "pageSize" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var UserDetailDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "UserDetail" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "user" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeMetadata" },
                value: { kind: "BooleanValue", value: true }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeRoles" },
                value: { kind: "BooleanValue", value: true }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includePermissions" },
                value: { kind: "BooleanValue", value: true }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeTeams" },
                value: { kind: "BooleanValue", value: true }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeProfileChanges" },
                value: { kind: "BooleanValue", value: true }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "username" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                { kind: "Field", name: { kind: "Name", value: "fullName" } },
                { kind: "Field", name: { kind: "Name", value: "firstName" } },
                { kind: "Field", name: { kind: "Name", value: "lastName" } },
                { kind: "Field", name: { kind: "Name", value: "displayName" } },
                { kind: "Field", name: { kind: "Name", value: "isActive" } },
                { kind: "Field", name: { kind: "Name", value: "isVerified" } },
                { kind: "Field", name: { kind: "Name", value: "isSuperuser" } },
                { kind: "Field", name: { kind: "Name", value: "isPlatformAdmin" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "phoneNumber" } },
                { kind: "Field", name: { kind: "Name", value: "phone" } },
                { kind: "Field", name: { kind: "Name", value: "phoneVerified" } },
                { kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
                { kind: "Field", name: { kind: "Name", value: "timezone" } },
                { kind: "Field", name: { kind: "Name", value: "location" } },
                { kind: "Field", name: { kind: "Name", value: "bio" } },
                { kind: "Field", name: { kind: "Name", value: "website" } },
                { kind: "Field", name: { kind: "Name", value: "mfaEnabled" } },
                { kind: "Field", name: { kind: "Name", value: "lastLogin" } },
                { kind: "Field", name: { kind: "Name", value: "lastLoginIp" } },
                { kind: "Field", name: { kind: "Name", value: "failedLoginAttempts" } },
                { kind: "Field", name: { kind: "Name", value: "lockedUntil" } },
                { kind: "Field", name: { kind: "Name", value: "language" } },
                { kind: "Field", name: { kind: "Name", value: "tenantId" } },
                { kind: "Field", name: { kind: "Name", value: "primaryRole" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                { kind: "Field", name: { kind: "Name", value: "metadata" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "roles" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "displayName" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "priority" } },
                      { kind: "Field", name: { kind: "Name", value: "isSystem" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } },
                      { kind: "Field", name: { kind: "Name", value: "isDefault" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "permissions" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "displayName" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "category" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } },
                      { kind: "Field", name: { kind: "Name", value: "isSystem" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "teams" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "teamId" } },
                      { kind: "Field", name: { kind: "Name", value: "teamName" } },
                      { kind: "Field", name: { kind: "Name", value: "role" } },
                      { kind: "Field", name: { kind: "Name", value: "joinedAt" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "profileChanges" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "fieldName" } },
                      { kind: "Field", name: { kind: "Name", value: "oldValue" } },
                      { kind: "Field", name: { kind: "Name", value: "newValue" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "changedByUsername" } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
};
var UserMetricsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "UserMetrics" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "userMetrics" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "totalUsers" } },
                { kind: "Field", name: { kind: "Name", value: "activeUsers" } },
                { kind: "Field", name: { kind: "Name", value: "suspendedUsers" } },
                { kind: "Field", name: { kind: "Name", value: "invitedUsers" } },
                { kind: "Field", name: { kind: "Name", value: "verifiedUsers" } },
                { kind: "Field", name: { kind: "Name", value: "mfaEnabledUsers" } },
                { kind: "Field", name: { kind: "Name", value: "platformAdmins" } },
                { kind: "Field", name: { kind: "Name", value: "superusers" } },
                { kind: "Field", name: { kind: "Name", value: "regularUsers" } },
                { kind: "Field", name: { kind: "Name", value: "usersLoggedInLast24h" } },
                { kind: "Field", name: { kind: "Name", value: "usersLoggedInLast7d" } },
                { kind: "Field", name: { kind: "Name", value: "usersLoggedInLast30d" } },
                { kind: "Field", name: { kind: "Name", value: "neverLoggedIn" } },
                { kind: "Field", name: { kind: "Name", value: "newUsersThisMonth" } },
                { kind: "Field", name: { kind: "Name", value: "newUsersLastMonth" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var RoleListDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "RoleList" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "page" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "1" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "pageSize" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "20" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "isActive" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "isSystem" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "search" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "roles" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "page" },
                value: { kind: "Variable", name: { kind: "Name", value: "page" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "pageSize" },
                value: { kind: "Variable", name: { kind: "Name", value: "pageSize" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isActive" },
                value: { kind: "Variable", name: { kind: "Name", value: "isActive" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isSystem" },
                value: { kind: "Variable", name: { kind: "Name", value: "isSystem" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: { kind: "Variable", name: { kind: "Name", value: "search" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "roles" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "displayName" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "priority" } },
                      { kind: "Field", name: { kind: "Name", value: "isSystem" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } },
                      { kind: "Field", name: { kind: "Name", value: "isDefault" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
                { kind: "Field", name: { kind: "Name", value: "hasPrevPage" } },
                { kind: "Field", name: { kind: "Name", value: "page" } },
                { kind: "Field", name: { kind: "Name", value: "pageSize" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var PermissionsByCategoryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "PermissionsByCategory" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "category" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "PermissionCategoryEnum" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "permissionsByCategory" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "category" },
                value: { kind: "Variable", name: { kind: "Name", value: "category" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "category" } },
                { kind: "Field", name: { kind: "Name", value: "count" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "permissions" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "displayName" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "category" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } },
                      { kind: "Field", name: { kind: "Name", value: "isSystem" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
};
var UserDashboardDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "UserDashboard" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "page" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "1" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "pageSize" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "10" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "isActive" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "search" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "users" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "page" },
                value: { kind: "Variable", name: { kind: "Name", value: "page" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "pageSize" },
                value: { kind: "Variable", name: { kind: "Name", value: "pageSize" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isActive" },
                value: { kind: "Variable", name: { kind: "Name", value: "isActive" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: { kind: "Variable", name: { kind: "Name", value: "search" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeMetadata" },
                value: { kind: "BooleanValue", value: false }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeRoles" },
                value: { kind: "BooleanValue", value: true }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includePermissions" },
                value: { kind: "BooleanValue", value: false }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeTeams" },
                value: { kind: "BooleanValue", value: false }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "users" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "username" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                      { kind: "Field", name: { kind: "Name", value: "fullName" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } },
                      { kind: "Field", name: { kind: "Name", value: "isVerified" } },
                      { kind: "Field", name: { kind: "Name", value: "isSuperuser" } },
                      { kind: "Field", name: { kind: "Name", value: "lastLogin" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "roles" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            { kind: "Field", name: { kind: "Name", value: "displayName" } }
                          ]
                        }
                      }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } }
              ]
            }
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "userMetrics" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "totalUsers" } },
                { kind: "Field", name: { kind: "Name", value: "activeUsers" } },
                { kind: "Field", name: { kind: "Name", value: "suspendedUsers" } },
                { kind: "Field", name: { kind: "Name", value: "verifiedUsers" } },
                { kind: "Field", name: { kind: "Name", value: "mfaEnabledUsers" } },
                { kind: "Field", name: { kind: "Name", value: "platformAdmins" } },
                { kind: "Field", name: { kind: "Name", value: "superusers" } },
                { kind: "Field", name: { kind: "Name", value: "regularUsers" } },
                { kind: "Field", name: { kind: "Name", value: "usersLoggedInLast24h" } },
                { kind: "Field", name: { kind: "Name", value: "usersLoggedInLast7d" } },
                { kind: "Field", name: { kind: "Name", value: "newUsersThisMonth" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var UserRolesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "UserRoles" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "user" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeRoles" },
                value: { kind: "BooleanValue", value: true }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "username" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "roles" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "displayName" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "priority" } },
                      { kind: "Field", name: { kind: "Name", value: "isSystem" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
};
var UserPermissionsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "UserPermissions" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "user" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includePermissions" },
                value: { kind: "BooleanValue", value: true }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "username" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "permissions" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "displayName" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "category" } },
                      { kind: "Field", name: { kind: "Name", value: "isActive" } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
};
var UserTeamsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "UserTeams" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "user" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "includeTeams" },
                value: { kind: "BooleanValue", value: true }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "username" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "teams" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "teamId" } },
                      { kind: "Field", name: { kind: "Name", value: "teamName" } },
                      { kind: "Field", name: { kind: "Name", value: "role" } },
                      { kind: "Field", name: { kind: "Name", value: "joinedAt" } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
};
var AccessPointListDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "AccessPointList" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "limit" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "50" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "offset" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "0" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "siteId" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "status" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "AccessPointStatus" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "frequencyBand" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "FrequencyBand" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "search" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "accessPoints" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "Variable", name: { kind: "Name", value: "limit" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: { kind: "Variable", name: { kind: "Name", value: "offset" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "siteId" },
                value: { kind: "Variable", name: { kind: "Name", value: "siteId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "status" },
                value: { kind: "Variable", name: { kind: "Name", value: "status" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "frequencyBand" },
                value: { kind: "Variable", name: { kind: "Name", value: "frequencyBand" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: { kind: "Variable", name: { kind: "Name", value: "search" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "accessPoints" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "macAddress" } },
                      { kind: "Field", name: { kind: "Name", value: "ipAddress" } },
                      { kind: "Field", name: { kind: "Name", value: "serialNumber" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "isOnline" } },
                      { kind: "Field", name: { kind: "Name", value: "lastSeenAt" } },
                      { kind: "Field", name: { kind: "Name", value: "model" } },
                      { kind: "Field", name: { kind: "Name", value: "manufacturer" } },
                      { kind: "Field", name: { kind: "Name", value: "firmwareVersion" } },
                      { kind: "Field", name: { kind: "Name", value: "ssid" } },
                      { kind: "Field", name: { kind: "Name", value: "frequencyBand" } },
                      { kind: "Field", name: { kind: "Name", value: "channel" } },
                      { kind: "Field", name: { kind: "Name", value: "channelWidth" } },
                      { kind: "Field", name: { kind: "Name", value: "transmitPower" } },
                      { kind: "Field", name: { kind: "Name", value: "maxClients" } },
                      { kind: "Field", name: { kind: "Name", value: "securityType" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "location" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "siteName" } },
                            { kind: "Field", name: { kind: "Name", value: "building" } },
                            { kind: "Field", name: { kind: "Name", value: "floor" } },
                            { kind: "Field", name: { kind: "Name", value: "room" } },
                            { kind: "Field", name: { kind: "Name", value: "mountingType" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "coordinates" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "latitude" } },
                                  { kind: "Field", name: { kind: "Name", value: "longitude" } },
                                  { kind: "Field", name: { kind: "Name", value: "altitude" } }
                                ]
                              }
                            }
                          ]
                        }
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "rfMetrics" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "signalStrengthDbm" } },
                            { kind: "Field", name: { kind: "Name", value: "noiseFloorDbm" } },
                            { kind: "Field", name: { kind: "Name", value: "signalToNoiseRatio" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "channelUtilizationPercent" }
                            },
                            { kind: "Field", name: { kind: "Name", value: "interferenceLevel" } },
                            { kind: "Field", name: { kind: "Name", value: "txPowerDbm" } },
                            { kind: "Field", name: { kind: "Name", value: "rxPowerDbm" } }
                          ]
                        }
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "performance" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "txBytes" } },
                            { kind: "Field", name: { kind: "Name", value: "rxBytes" } },
                            { kind: "Field", name: { kind: "Name", value: "txPackets" } },
                            { kind: "Field", name: { kind: "Name", value: "rxPackets" } },
                            { kind: "Field", name: { kind: "Name", value: "txRateMbps" } },
                            { kind: "Field", name: { kind: "Name", value: "rxRateMbps" } },
                            { kind: "Field", name: { kind: "Name", value: "txErrors" } },
                            { kind: "Field", name: { kind: "Name", value: "rxErrors" } },
                            { kind: "Field", name: { kind: "Name", value: "connectedClients" } },
                            { kind: "Field", name: { kind: "Name", value: "cpuUsagePercent" } },
                            { kind: "Field", name: { kind: "Name", value: "memoryUsagePercent" } },
                            { kind: "Field", name: { kind: "Name", value: "uptimeSeconds" } }
                          ]
                        }
                      },
                      { kind: "Field", name: { kind: "Name", value: "controllerName" } },
                      { kind: "Field", name: { kind: "Name", value: "siteName" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "lastRebootAt" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var AccessPointDetailDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "AccessPointDetail" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "accessPoint" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "macAddress" } },
                { kind: "Field", name: { kind: "Name", value: "ipAddress" } },
                { kind: "Field", name: { kind: "Name", value: "serialNumber" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "isOnline" } },
                { kind: "Field", name: { kind: "Name", value: "lastSeenAt" } },
                { kind: "Field", name: { kind: "Name", value: "model" } },
                { kind: "Field", name: { kind: "Name", value: "manufacturer" } },
                { kind: "Field", name: { kind: "Name", value: "firmwareVersion" } },
                { kind: "Field", name: { kind: "Name", value: "hardwareRevision" } },
                { kind: "Field", name: { kind: "Name", value: "ssid" } },
                { kind: "Field", name: { kind: "Name", value: "frequencyBand" } },
                { kind: "Field", name: { kind: "Name", value: "channel" } },
                { kind: "Field", name: { kind: "Name", value: "channelWidth" } },
                { kind: "Field", name: { kind: "Name", value: "transmitPower" } },
                { kind: "Field", name: { kind: "Name", value: "maxClients" } },
                { kind: "Field", name: { kind: "Name", value: "securityType" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "location" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "siteName" } },
                      { kind: "Field", name: { kind: "Name", value: "building" } },
                      { kind: "Field", name: { kind: "Name", value: "floor" } },
                      { kind: "Field", name: { kind: "Name", value: "room" } },
                      { kind: "Field", name: { kind: "Name", value: "mountingType" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "coordinates" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "latitude" } },
                            { kind: "Field", name: { kind: "Name", value: "longitude" } },
                            { kind: "Field", name: { kind: "Name", value: "altitude" } },
                            { kind: "Field", name: { kind: "Name", value: "accuracy" } }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "rfMetrics" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "signalStrengthDbm" } },
                      { kind: "Field", name: { kind: "Name", value: "noiseFloorDbm" } },
                      { kind: "Field", name: { kind: "Name", value: "signalToNoiseRatio" } },
                      { kind: "Field", name: { kind: "Name", value: "channelUtilizationPercent" } },
                      { kind: "Field", name: { kind: "Name", value: "interferenceLevel" } },
                      { kind: "Field", name: { kind: "Name", value: "txPowerDbm" } },
                      { kind: "Field", name: { kind: "Name", value: "rxPowerDbm" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "performance" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "txBytes" } },
                      { kind: "Field", name: { kind: "Name", value: "rxBytes" } },
                      { kind: "Field", name: { kind: "Name", value: "txPackets" } },
                      { kind: "Field", name: { kind: "Name", value: "rxPackets" } },
                      { kind: "Field", name: { kind: "Name", value: "txRateMbps" } },
                      { kind: "Field", name: { kind: "Name", value: "rxRateMbps" } },
                      { kind: "Field", name: { kind: "Name", value: "txErrors" } },
                      { kind: "Field", name: { kind: "Name", value: "rxErrors" } },
                      { kind: "Field", name: { kind: "Name", value: "txDropped" } },
                      { kind: "Field", name: { kind: "Name", value: "rxDropped" } },
                      { kind: "Field", name: { kind: "Name", value: "retries" } },
                      { kind: "Field", name: { kind: "Name", value: "retryRatePercent" } },
                      { kind: "Field", name: { kind: "Name", value: "connectedClients" } },
                      { kind: "Field", name: { kind: "Name", value: "authenticatedClients" } },
                      { kind: "Field", name: { kind: "Name", value: "authorizedClients" } },
                      { kind: "Field", name: { kind: "Name", value: "cpuUsagePercent" } },
                      { kind: "Field", name: { kind: "Name", value: "memoryUsagePercent" } },
                      { kind: "Field", name: { kind: "Name", value: "uptimeSeconds" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "controllerId" } },
                { kind: "Field", name: { kind: "Name", value: "controllerName" } },
                { kind: "Field", name: { kind: "Name", value: "siteId" } },
                { kind: "Field", name: { kind: "Name", value: "siteName" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                { kind: "Field", name: { kind: "Name", value: "lastRebootAt" } },
                { kind: "Field", name: { kind: "Name", value: "isMeshEnabled" } },
                { kind: "Field", name: { kind: "Name", value: "isBandSteeringEnabled" } },
                { kind: "Field", name: { kind: "Name", value: "isLoadBalancingEnabled" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var AccessPointsBySiteDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "AccessPointsBySite" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "siteId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "accessPointsBySite" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "siteId" },
                value: { kind: "Variable", name: { kind: "Name", value: "siteId" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "macAddress" } },
                { kind: "Field", name: { kind: "Name", value: "ipAddress" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "isOnline" } },
                { kind: "Field", name: { kind: "Name", value: "ssid" } },
                { kind: "Field", name: { kind: "Name", value: "frequencyBand" } },
                { kind: "Field", name: { kind: "Name", value: "channel" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "performance" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "connectedClients" } },
                      { kind: "Field", name: { kind: "Name", value: "cpuUsagePercent" } },
                      { kind: "Field", name: { kind: "Name", value: "memoryUsagePercent" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "rfMetrics" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "signalStrengthDbm" } },
                      { kind: "Field", name: { kind: "Name", value: "channelUtilizationPercent" } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
};
var WirelessClientListDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "WirelessClientList" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "limit" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "50" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "offset" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "0" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "accessPointId" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "customerId" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "frequencyBand" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "FrequencyBand" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "search" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "wirelessClients" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "Variable", name: { kind: "Name", value: "limit" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: { kind: "Variable", name: { kind: "Name", value: "offset" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "accessPointId" },
                value: { kind: "Variable", name: { kind: "Name", value: "accessPointId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "customerId" },
                value: { kind: "Variable", name: { kind: "Name", value: "customerId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "frequencyBand" },
                value: { kind: "Variable", name: { kind: "Name", value: "frequencyBand" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: { kind: "Variable", name: { kind: "Name", value: "search" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "clients" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "macAddress" } },
                      { kind: "Field", name: { kind: "Name", value: "hostname" } },
                      { kind: "Field", name: { kind: "Name", value: "ipAddress" } },
                      { kind: "Field", name: { kind: "Name", value: "manufacturer" } },
                      { kind: "Field", name: { kind: "Name", value: "accessPointId" } },
                      { kind: "Field", name: { kind: "Name", value: "accessPointName" } },
                      { kind: "Field", name: { kind: "Name", value: "ssid" } },
                      { kind: "Field", name: { kind: "Name", value: "connectionType" } },
                      { kind: "Field", name: { kind: "Name", value: "frequencyBand" } },
                      { kind: "Field", name: { kind: "Name", value: "channel" } },
                      { kind: "Field", name: { kind: "Name", value: "isAuthenticated" } },
                      { kind: "Field", name: { kind: "Name", value: "isAuthorized" } },
                      { kind: "Field", name: { kind: "Name", value: "signalStrengthDbm" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "signalQuality" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "rssiDbm" } },
                            { kind: "Field", name: { kind: "Name", value: "snrDb" } },
                            { kind: "Field", name: { kind: "Name", value: "noiseFloorDbm" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "signalStrengthPercent" }
                            },
                            { kind: "Field", name: { kind: "Name", value: "linkQualityPercent" } }
                          ]
                        }
                      },
                      { kind: "Field", name: { kind: "Name", value: "noiseFloorDbm" } },
                      { kind: "Field", name: { kind: "Name", value: "snr" } },
                      { kind: "Field", name: { kind: "Name", value: "txRateMbps" } },
                      { kind: "Field", name: { kind: "Name", value: "rxRateMbps" } },
                      { kind: "Field", name: { kind: "Name", value: "txBytes" } },
                      { kind: "Field", name: { kind: "Name", value: "rxBytes" } },
                      { kind: "Field", name: { kind: "Name", value: "connectedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "lastSeenAt" } },
                      { kind: "Field", name: { kind: "Name", value: "uptimeSeconds" } },
                      { kind: "Field", name: { kind: "Name", value: "customerId" } },
                      { kind: "Field", name: { kind: "Name", value: "customerName" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var WirelessClientDetailDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "WirelessClientDetail" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "wirelessClient" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "macAddress" } },
                { kind: "Field", name: { kind: "Name", value: "hostname" } },
                { kind: "Field", name: { kind: "Name", value: "ipAddress" } },
                { kind: "Field", name: { kind: "Name", value: "manufacturer" } },
                { kind: "Field", name: { kind: "Name", value: "accessPointId" } },
                { kind: "Field", name: { kind: "Name", value: "accessPointName" } },
                { kind: "Field", name: { kind: "Name", value: "ssid" } },
                { kind: "Field", name: { kind: "Name", value: "connectionType" } },
                { kind: "Field", name: { kind: "Name", value: "frequencyBand" } },
                { kind: "Field", name: { kind: "Name", value: "channel" } },
                { kind: "Field", name: { kind: "Name", value: "isAuthenticated" } },
                { kind: "Field", name: { kind: "Name", value: "isAuthorized" } },
                { kind: "Field", name: { kind: "Name", value: "authMethod" } },
                { kind: "Field", name: { kind: "Name", value: "signalStrengthDbm" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "signalQuality" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "rssiDbm" } },
                      { kind: "Field", name: { kind: "Name", value: "snrDb" } },
                      { kind: "Field", name: { kind: "Name", value: "noiseFloorDbm" } },
                      { kind: "Field", name: { kind: "Name", value: "signalStrengthPercent" } },
                      { kind: "Field", name: { kind: "Name", value: "linkQualityPercent" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "noiseFloorDbm" } },
                { kind: "Field", name: { kind: "Name", value: "snr" } },
                { kind: "Field", name: { kind: "Name", value: "txRateMbps" } },
                { kind: "Field", name: { kind: "Name", value: "rxRateMbps" } },
                { kind: "Field", name: { kind: "Name", value: "txBytes" } },
                { kind: "Field", name: { kind: "Name", value: "rxBytes" } },
                { kind: "Field", name: { kind: "Name", value: "txPackets" } },
                { kind: "Field", name: { kind: "Name", value: "rxPackets" } },
                { kind: "Field", name: { kind: "Name", value: "txRetries" } },
                { kind: "Field", name: { kind: "Name", value: "rxRetries" } },
                { kind: "Field", name: { kind: "Name", value: "connectedAt" } },
                { kind: "Field", name: { kind: "Name", value: "lastSeenAt" } },
                { kind: "Field", name: { kind: "Name", value: "uptimeSeconds" } },
                { kind: "Field", name: { kind: "Name", value: "idleTimeSeconds" } },
                { kind: "Field", name: { kind: "Name", value: "supports80211k" } },
                { kind: "Field", name: { kind: "Name", value: "supports80211r" } },
                { kind: "Field", name: { kind: "Name", value: "supports80211v" } },
                { kind: "Field", name: { kind: "Name", value: "maxPhyRateMbps" } },
                { kind: "Field", name: { kind: "Name", value: "customerId" } },
                { kind: "Field", name: { kind: "Name", value: "customerName" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var WirelessClientsByAccessPointDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "WirelessClientsByAccessPoint" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "accessPointId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "wirelessClientsByAccessPoint" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "accessPointId" },
                value: { kind: "Variable", name: { kind: "Name", value: "accessPointId" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "macAddress" } },
                { kind: "Field", name: { kind: "Name", value: "hostname" } },
                { kind: "Field", name: { kind: "Name", value: "ipAddress" } },
                { kind: "Field", name: { kind: "Name", value: "ssid" } },
                { kind: "Field", name: { kind: "Name", value: "signalStrengthDbm" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "signalQuality" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "rssiDbm" } },
                      { kind: "Field", name: { kind: "Name", value: "snrDb" } },
                      { kind: "Field", name: { kind: "Name", value: "noiseFloorDbm" } },
                      { kind: "Field", name: { kind: "Name", value: "signalStrengthPercent" } },
                      { kind: "Field", name: { kind: "Name", value: "linkQualityPercent" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "txRateMbps" } },
                { kind: "Field", name: { kind: "Name", value: "rxRateMbps" } },
                { kind: "Field", name: { kind: "Name", value: "connectedAt" } },
                { kind: "Field", name: { kind: "Name", value: "customerId" } },
                { kind: "Field", name: { kind: "Name", value: "customerName" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var WirelessClientsByCustomerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "WirelessClientsByCustomer" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "customerId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "wirelessClientsByCustomer" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "customerId" },
                value: { kind: "Variable", name: { kind: "Name", value: "customerId" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "macAddress" } },
                { kind: "Field", name: { kind: "Name", value: "hostname" } },
                { kind: "Field", name: { kind: "Name", value: "ipAddress" } },
                { kind: "Field", name: { kind: "Name", value: "accessPointName" } },
                { kind: "Field", name: { kind: "Name", value: "ssid" } },
                { kind: "Field", name: { kind: "Name", value: "frequencyBand" } },
                { kind: "Field", name: { kind: "Name", value: "signalStrengthDbm" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "signalQuality" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "rssiDbm" } },
                      { kind: "Field", name: { kind: "Name", value: "snrDb" } },
                      { kind: "Field", name: { kind: "Name", value: "noiseFloorDbm" } },
                      { kind: "Field", name: { kind: "Name", value: "signalStrengthPercent" } },
                      { kind: "Field", name: { kind: "Name", value: "linkQualityPercent" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "isAuthenticated" } },
                { kind: "Field", name: { kind: "Name", value: "connectedAt" } },
                { kind: "Field", name: { kind: "Name", value: "lastSeenAt" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var CoverageZoneListDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CoverageZoneList" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "limit" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "50" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "offset" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "0" }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "siteId" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "areaType" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "coverageZones" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "Variable", name: { kind: "Name", value: "limit" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: { kind: "Variable", name: { kind: "Name", value: "offset" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "siteId" },
                value: { kind: "Variable", name: { kind: "Name", value: "siteId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "areaType" },
                value: { kind: "Variable", name: { kind: "Name", value: "areaType" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "zones" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "siteId" } },
                      { kind: "Field", name: { kind: "Name", value: "siteName" } },
                      { kind: "Field", name: { kind: "Name", value: "floor" } },
                      { kind: "Field", name: { kind: "Name", value: "areaType" } },
                      { kind: "Field", name: { kind: "Name", value: "coverageAreaSqm" } },
                      { kind: "Field", name: { kind: "Name", value: "signalStrengthMinDbm" } },
                      { kind: "Field", name: { kind: "Name", value: "signalStrengthMaxDbm" } },
                      { kind: "Field", name: { kind: "Name", value: "signalStrengthAvgDbm" } },
                      { kind: "Field", name: { kind: "Name", value: "accessPointIds" } },
                      { kind: "Field", name: { kind: "Name", value: "accessPointCount" } },
                      { kind: "Field", name: { kind: "Name", value: "interferenceLevel" } },
                      { kind: "Field", name: { kind: "Name", value: "channelUtilizationAvg" } },
                      { kind: "Field", name: { kind: "Name", value: "noiseFloorAvgDbm" } },
                      { kind: "Field", name: { kind: "Name", value: "connectedClients" } },
                      { kind: "Field", name: { kind: "Name", value: "maxClientCapacity" } },
                      { kind: "Field", name: { kind: "Name", value: "clientDensityPerAp" } },
                      { kind: "Field", name: { kind: "Name", value: "coveragePolygon" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "lastSurveyedAt" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                { kind: "Field", name: { kind: "Name", value: "hasNextPage" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var CoverageZoneDetailDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CoverageZoneDetail" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "coverageZone" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "siteId" } },
                { kind: "Field", name: { kind: "Name", value: "siteName" } },
                { kind: "Field", name: { kind: "Name", value: "floor" } },
                { kind: "Field", name: { kind: "Name", value: "areaType" } },
                { kind: "Field", name: { kind: "Name", value: "coverageAreaSqm" } },
                { kind: "Field", name: { kind: "Name", value: "signalStrengthMinDbm" } },
                { kind: "Field", name: { kind: "Name", value: "signalStrengthMaxDbm" } },
                { kind: "Field", name: { kind: "Name", value: "signalStrengthAvgDbm" } },
                { kind: "Field", name: { kind: "Name", value: "accessPointIds" } },
                { kind: "Field", name: { kind: "Name", value: "accessPointCount" } },
                { kind: "Field", name: { kind: "Name", value: "interferenceLevel" } },
                { kind: "Field", name: { kind: "Name", value: "channelUtilizationAvg" } },
                { kind: "Field", name: { kind: "Name", value: "noiseFloorAvgDbm" } },
                { kind: "Field", name: { kind: "Name", value: "connectedClients" } },
                { kind: "Field", name: { kind: "Name", value: "maxClientCapacity" } },
                { kind: "Field", name: { kind: "Name", value: "clientDensityPerAp" } },
                { kind: "Field", name: { kind: "Name", value: "coveragePolygon" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                { kind: "Field", name: { kind: "Name", value: "lastSurveyedAt" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var CoverageZonesBySiteDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CoverageZonesBySite" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "siteId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "coverageZonesBySite" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "siteId" },
                value: { kind: "Variable", name: { kind: "Name", value: "siteId" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "floor" } },
                { kind: "Field", name: { kind: "Name", value: "areaType" } },
                { kind: "Field", name: { kind: "Name", value: "coverageAreaSqm" } },
                { kind: "Field", name: { kind: "Name", value: "accessPointCount" } },
                { kind: "Field", name: { kind: "Name", value: "connectedClients" } },
                { kind: "Field", name: { kind: "Name", value: "maxClientCapacity" } },
                { kind: "Field", name: { kind: "Name", value: "signalStrengthAvgDbm" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var RfAnalyticsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "RFAnalytics" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "siteId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "rfAnalytics" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "siteId" },
                value: { kind: "Variable", name: { kind: "Name", value: "siteId" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "siteId" } },
                { kind: "Field", name: { kind: "Name", value: "siteName" } },
                { kind: "Field", name: { kind: "Name", value: "analysisTimestamp" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "channelUtilization24ghz" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "channel" } },
                      { kind: "Field", name: { kind: "Name", value: "frequencyMhz" } },
                      { kind: "Field", name: { kind: "Name", value: "band" } },
                      { kind: "Field", name: { kind: "Name", value: "utilizationPercent" } },
                      { kind: "Field", name: { kind: "Name", value: "interferenceLevel" } },
                      { kind: "Field", name: { kind: "Name", value: "accessPointsCount" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "channelUtilization5ghz" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "channel" } },
                      { kind: "Field", name: { kind: "Name", value: "frequencyMhz" } },
                      { kind: "Field", name: { kind: "Name", value: "band" } },
                      { kind: "Field", name: { kind: "Name", value: "utilizationPercent" } },
                      { kind: "Field", name: { kind: "Name", value: "interferenceLevel" } },
                      { kind: "Field", name: { kind: "Name", value: "accessPointsCount" } }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "channelUtilization6ghz" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "channel" } },
                      { kind: "Field", name: { kind: "Name", value: "frequencyMhz" } },
                      { kind: "Field", name: { kind: "Name", value: "band" } },
                      { kind: "Field", name: { kind: "Name", value: "utilizationPercent" } },
                      { kind: "Field", name: { kind: "Name", value: "interferenceLevel" } },
                      { kind: "Field", name: { kind: "Name", value: "accessPointsCount" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "recommendedChannels24ghz" } },
                { kind: "Field", name: { kind: "Name", value: "recommendedChannels5ghz" } },
                { kind: "Field", name: { kind: "Name", value: "recommendedChannels6ghz" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "interferenceSources" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "sourceType" } },
                      { kind: "Field", name: { kind: "Name", value: "frequencyMhz" } },
                      { kind: "Field", name: { kind: "Name", value: "strengthDbm" } },
                      { kind: "Field", name: { kind: "Name", value: "affectedChannels" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalInterferenceScore" } },
                { kind: "Field", name: { kind: "Name", value: "averageSignalStrengthDbm" } },
                { kind: "Field", name: { kind: "Name", value: "averageSnr" } },
                { kind: "Field", name: { kind: "Name", value: "coverageQualityScore" } },
                { kind: "Field", name: { kind: "Name", value: "clientsPerBand24ghz" } },
                { kind: "Field", name: { kind: "Name", value: "clientsPerBand5ghz" } },
                { kind: "Field", name: { kind: "Name", value: "clientsPerBand6ghz" } },
                { kind: "Field", name: { kind: "Name", value: "bandUtilizationBalanceScore" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var ChannelUtilizationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ChannelUtilization" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "siteId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          }
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "frequencyBand" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "FrequencyBand" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "channelUtilization" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "siteId" },
                value: { kind: "Variable", name: { kind: "Name", value: "siteId" } }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "frequencyBand" },
                value: { kind: "Variable", name: { kind: "Name", value: "frequencyBand" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "channel" } },
                { kind: "Field", name: { kind: "Name", value: "frequencyMhz" } },
                { kind: "Field", name: { kind: "Name", value: "band" } },
                { kind: "Field", name: { kind: "Name", value: "utilizationPercent" } },
                { kind: "Field", name: { kind: "Name", value: "interferenceLevel" } },
                { kind: "Field", name: { kind: "Name", value: "accessPointsCount" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var WirelessSiteMetricsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "WirelessSiteMetrics" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "siteId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          }
        }
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "wirelessSiteMetrics" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "siteId" },
                value: { kind: "Variable", name: { kind: "Name", value: "siteId" } }
              }
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "siteId" } },
                { kind: "Field", name: { kind: "Name", value: "siteName" } },
                { kind: "Field", name: { kind: "Name", value: "totalAps" } },
                { kind: "Field", name: { kind: "Name", value: "onlineAps" } },
                { kind: "Field", name: { kind: "Name", value: "offlineAps" } },
                { kind: "Field", name: { kind: "Name", value: "degradedAps" } },
                { kind: "Field", name: { kind: "Name", value: "totalClients" } },
                { kind: "Field", name: { kind: "Name", value: "clients24ghz" } },
                { kind: "Field", name: { kind: "Name", value: "clients5ghz" } },
                { kind: "Field", name: { kind: "Name", value: "clients6ghz" } },
                { kind: "Field", name: { kind: "Name", value: "averageSignalStrengthDbm" } },
                { kind: "Field", name: { kind: "Name", value: "averageSnr" } },
                { kind: "Field", name: { kind: "Name", value: "totalThroughputMbps" } },
                { kind: "Field", name: { kind: "Name", value: "totalCapacity" } },
                { kind: "Field", name: { kind: "Name", value: "capacityUtilizationPercent" } },
                { kind: "Field", name: { kind: "Name", value: "overallHealthScore" } },
                { kind: "Field", name: { kind: "Name", value: "rfHealthScore" } },
                { kind: "Field", name: { kind: "Name", value: "clientExperienceScore" } }
              ]
            }
          }
        ]
      }
    }
  ]
};
var WirelessDashboardDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "WirelessDashboard" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "wirelessDashboard" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "totalSites" } },
                { kind: "Field", name: { kind: "Name", value: "totalAccessPoints" } },
                { kind: "Field", name: { kind: "Name", value: "totalClients" } },
                { kind: "Field", name: { kind: "Name", value: "totalCoverageZones" } },
                { kind: "Field", name: { kind: "Name", value: "onlineAps" } },
                { kind: "Field", name: { kind: "Name", value: "offlineAps" } },
                { kind: "Field", name: { kind: "Name", value: "degradedAps" } },
                { kind: "Field", name: { kind: "Name", value: "clientsByBand24ghz" } },
                { kind: "Field", name: { kind: "Name", value: "clientsByBand5ghz" } },
                { kind: "Field", name: { kind: "Name", value: "clientsByBand6ghz" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "topApsByClients" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "siteName" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "performance" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "connectedClients" } }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "topApsByThroughput" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "siteName" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "performance" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "txRateMbps" } },
                            { kind: "Field", name: { kind: "Name", value: "rxRateMbps" } }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "sitesWithIssues" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "siteId" } },
                      { kind: "Field", name: { kind: "Name", value: "siteName" } },
                      { kind: "Field", name: { kind: "Name", value: "offlineAps" } },
                      { kind: "Field", name: { kind: "Name", value: "degradedAps" } },
                      { kind: "Field", name: { kind: "Name", value: "overallHealthScore" } }
                    ]
                  }
                },
                { kind: "Field", name: { kind: "Name", value: "totalThroughputMbps" } },
                { kind: "Field", name: { kind: "Name", value: "averageSignalStrengthDbm" } },
                { kind: "Field", name: { kind: "Name", value: "averageClientExperienceScore" } },
                { kind: "Field", name: { kind: "Name", value: "clientCountTrend" } },
                { kind: "Field", name: { kind: "Name", value: "throughputTrendMbps" } },
                { kind: "Field", name: { kind: "Name", value: "offlineEventsCount" } },
                { kind: "Field", name: { kind: "Name", value: "generatedAt" } }
              ]
            }
          }
        ]
      }
    }
  ]
};

// generated/gql.ts
var documents = {
  "query CustomerList($limit: Int = 50, $offset: Int = 0, $status: CustomerStatusEnum, $search: String, $includeActivities: Boolean = false, $includeNotes: Boolean = false) {\n  customers(\n    limit: $limit\n    offset: $offset\n    status: $status\n    search: $search\n    includeActivities: $includeActivities\n    includeNotes: $includeNotes\n  ) {\n    customers {\n      id\n      customerNumber\n      firstName\n      lastName\n      middleName\n      displayName\n      companyName\n      status\n      customerType\n      tier\n      email\n      emailVerified\n      phone\n      phoneVerified\n      mobile\n      addressLine1\n      addressLine2\n      city\n      stateProvince\n      postalCode\n      country\n      taxId\n      industry\n      employeeCount\n      lifetimeValue\n      totalPurchases\n      averageOrderValue\n      lastPurchaseDate\n      createdAt\n      updatedAt\n      acquisitionDate\n      lastContactDate\n      activities @include(if: $includeActivities) {\n        id\n        customerId\n        activityType\n        title\n        description\n        performedBy\n        createdAt\n      }\n      notes @include(if: $includeNotes) {\n        id\n        customerId\n        subject\n        content\n        isInternal\n        createdById\n        createdAt\n        updatedAt\n      }\n    }\n    totalCount\n    hasNextPage\n  }\n}\n\nquery CustomerDetail($id: ID!) {\n  customer(id: $id, includeActivities: true, includeNotes: true) {\n    id\n    customerNumber\n    firstName\n    lastName\n    middleName\n    displayName\n    companyName\n    status\n    customerType\n    tier\n    email\n    emailVerified\n    phone\n    phoneVerified\n    mobile\n    addressLine1\n    addressLine2\n    city\n    stateProvince\n    postalCode\n    country\n    taxId\n    industry\n    employeeCount\n    lifetimeValue\n    totalPurchases\n    averageOrderValue\n    lastPurchaseDate\n    createdAt\n    updatedAt\n    acquisitionDate\n    lastContactDate\n    activities {\n      id\n      customerId\n      activityType\n      title\n      description\n      performedBy\n      createdAt\n    }\n    notes {\n      id\n      customerId\n      subject\n      content\n      isInternal\n      createdById\n      createdAt\n      updatedAt\n    }\n  }\n}\n\nquery CustomerMetrics {\n  customerMetrics {\n    totalCustomers\n    activeCustomers\n    newCustomers\n    churnedCustomers\n    totalCustomerValue\n    averageCustomerValue\n  }\n}\n\nquery CustomerActivities($id: ID!) {\n  customer(id: $id, includeActivities: true, includeNotes: false) {\n    id\n    activities {\n      id\n      customerId\n      activityType\n      title\n      description\n      performedBy\n      createdAt\n    }\n  }\n}\n\nquery CustomerNotes($id: ID!) {\n  customer(id: $id, includeActivities: false, includeNotes: true) {\n    id\n    notes {\n      id\n      customerId\n      subject\n      content\n      isInternal\n      createdById\n      createdAt\n      updatedAt\n    }\n  }\n}\n\nquery CustomerDashboard($limit: Int = 20, $offset: Int = 0, $status: CustomerStatusEnum, $search: String) {\n  customers(\n    limit: $limit\n    offset: $offset\n    status: $status\n    search: $search\n    includeActivities: false\n    includeNotes: false\n  ) {\n    customers {\n      id\n      customerNumber\n      firstName\n      lastName\n      companyName\n      email\n      phone\n      status\n      customerType\n      tier\n      lifetimeValue\n      totalPurchases\n      lastContactDate\n      createdAt\n    }\n    totalCount\n    hasNextPage\n  }\n  customerMetrics {\n    totalCustomers\n    activeCustomers\n    newCustomers\n    churnedCustomers\n    totalCustomerValue\n    averageCustomerValue\n  }\n}\n\nquery CustomerSubscriptions($customerId: ID!, $status: String, $limit: Int = 50) {\n  customerSubscriptions(customerId: $customerId, status: $status, limit: $limit) {\n    id\n    subscriptionId\n    customerId\n    planId\n    tenantId\n    currentPeriodStart\n    currentPeriodEnd\n    status\n    trialEnd\n    isInTrial\n    cancelAtPeriodEnd\n    canceledAt\n    endedAt\n    createdAt\n    updatedAt\n  }\n}\n\nquery CustomerNetworkInfo($customerId: ID!) {\n  customerNetworkInfo(customerId: $customerId)\n}\n\nquery CustomerDevices($customerId: ID!, $deviceType: String, $activeOnly: Boolean = true) {\n  customerDevices(\n    customerId: $customerId\n    deviceType: $deviceType\n    activeOnly: $activeOnly\n  )\n}\n\nquery CustomerTickets($customerId: ID!, $limit: Int = 50, $status: String) {\n  customerTickets(customerId: $customerId, limit: $limit, status: $status)\n}\n\nquery CustomerBilling($customerId: ID!, $includeInvoices: Boolean = true, $invoiceLimit: Int = 50) {\n  customerBilling(\n    customerId: $customerId\n    includeInvoices: $includeInvoices\n    invoiceLimit: $invoiceLimit\n  )\n}\n\nquery Customer360View($customerId: ID!) {\n  customer(id: $customerId, includeActivities: true, includeNotes: true) {\n    id\n    customerNumber\n    firstName\n    lastName\n    middleName\n    displayName\n    companyName\n    status\n    customerType\n    tier\n    email\n    emailVerified\n    phone\n    phoneVerified\n    mobile\n    addressLine1\n    addressLine2\n    city\n    stateProvince\n    postalCode\n    country\n    taxId\n    industry\n    employeeCount\n    lifetimeValue\n    totalPurchases\n    averageOrderValue\n    lastPurchaseDate\n    createdAt\n    updatedAt\n    acquisitionDate\n    lastContactDate\n    activities {\n      id\n      customerId\n      activityType\n      title\n      description\n      performedBy\n      createdAt\n    }\n    notes {\n      id\n      customerId\n      subject\n      content\n      isInternal\n      createdById\n      createdAt\n      updatedAt\n    }\n  }\n  customerSubscriptions(customerId: $customerId, limit: 10) {\n    id\n    subscriptionId\n    customerId\n    planId\n    status\n    currentPeriodStart\n    currentPeriodEnd\n    isInTrial\n    cancelAtPeriodEnd\n    createdAt\n  }\n  customerNetworkInfo(customerId: $customerId)\n  customerDevices(customerId: $customerId, activeOnly: true)\n  customerTickets(customerId: $customerId, limit: 10)\n  customerBilling(\n    customerId: $customerId\n    includeInvoices: true\n    invoiceLimit: 10\n  )\n}\n\nsubscription CustomerNetworkStatusUpdated($customerId: ID!) {\n  customerNetworkStatusUpdated(customerId: $customerId) {\n    customerId\n    connectionStatus\n    lastSeenAt\n    ipv4Address\n    ipv6Address\n    macAddress\n    vlanId\n    signalStrength\n    signalQuality\n    uptimeSeconds\n    uptimePercentage\n    bandwidthUsageMbps\n    downloadSpeedMbps\n    uploadSpeedMbps\n    packetLoss\n    latencyMs\n    jitter\n    ontRxPower\n    ontTxPower\n    oltRxPower\n    serviceStatus\n    updatedAt\n  }\n}\n\nsubscription CustomerDevicesUpdated($customerId: ID!) {\n  customerDevicesUpdated(customerId: $customerId) {\n    customerId\n    deviceId\n    deviceType\n    deviceName\n    status\n    healthStatus\n    isOnline\n    lastSeenAt\n    signalStrength\n    temperature\n    cpuUsage\n    memoryUsage\n    uptimeSeconds\n    firmwareVersion\n    needsFirmwareUpdate\n    changeType\n    previousValue\n    newValue\n    updatedAt\n  }\n}\n\nsubscription CustomerTicketUpdated($customerId: ID!) {\n  customerTicketUpdated(customerId: $customerId) {\n    customerId\n    action\n    ticket {\n      id\n      ticketNumber\n      title\n      description\n      status\n      priority\n      category\n      subCategory\n      assignedTo\n      assignedToName\n      assignedTeam\n      createdAt\n      updatedAt\n      resolvedAt\n      closedAt\n      customerId\n      customerName\n    }\n    changedBy\n    changedByName\n    changes\n    comment\n    updatedAt\n  }\n}\n\nsubscription CustomerActivityAdded($customerId: ID!) {\n  customerActivityAdded(customerId: $customerId) {\n    id\n    customerId\n    activityType\n    title\n    description\n    performedBy\n    performedByName\n    createdAt\n  }\n}\n\nsubscription CustomerNoteUpdated($customerId: ID!) {\n  customerNoteUpdated(customerId: $customerId) {\n    customerId\n    action\n    note {\n      id\n      customerId\n      subject\n      content\n      isInternal\n      createdById\n      createdByName\n      createdAt\n      updatedAt\n    }\n    changedBy\n    changedByName\n    updatedAt\n  }\n}": CustomerListDocument,
  "query FiberCableList($limit: Int = 50, $offset: Int = 0, $status: FiberCableStatus, $fiberType: FiberType, $installationType: CableInstallationType, $siteId: String, $search: String) {\n  fiberCables(\n    limit: $limit\n    offset: $offset\n    status: $status\n    fiberType: $fiberType\n    installationType: $installationType\n    siteId: $siteId\n    search: $search\n  ) {\n    cables {\n      id\n      cableId\n      name\n      description\n      status\n      isActive\n      fiberType\n      totalStrands\n      availableStrands\n      usedStrands\n      manufacturer\n      model\n      installationType\n      route {\n        totalDistanceMeters\n        startPoint {\n          latitude\n          longitude\n          altitude\n        }\n        endPoint {\n          latitude\n          longitude\n          altitude\n        }\n      }\n      lengthMeters\n      startDistributionPointId\n      endDistributionPointId\n      startPointName\n      endPointName\n      capacityUtilizationPercent\n      bandwidthCapacityGbps\n      spliceCount\n      totalLossDb\n      averageAttenuationDbPerKm\n      maxAttenuationDbPerKm\n      isLeased\n      installedAt\n      createdAt\n      updatedAt\n    }\n    totalCount\n    hasNextPage\n  }\n}\n\nquery FiberCableDetail($id: ID!) {\n  fiberCable(id: $id) {\n    id\n    cableId\n    name\n    description\n    status\n    isActive\n    fiberType\n    totalStrands\n    availableStrands\n    usedStrands\n    manufacturer\n    model\n    installationType\n    route {\n      pathGeojson\n      totalDistanceMeters\n      startPoint {\n        latitude\n        longitude\n        altitude\n      }\n      endPoint {\n        latitude\n        longitude\n        altitude\n      }\n      intermediatePoints {\n        latitude\n        longitude\n        altitude\n      }\n      elevationChangeMeters\n      undergroundDistanceMeters\n      aerialDistanceMeters\n    }\n    lengthMeters\n    strands {\n      strandId\n      colorCode\n      isActive\n      isAvailable\n      customerId\n      customerName\n      serviceId\n      attenuationDb\n      lossDb\n      spliceCount\n    }\n    startDistributionPointId\n    endDistributionPointId\n    startPointName\n    endPointName\n    capacityUtilizationPercent\n    bandwidthCapacityGbps\n    splicePointIds\n    spliceCount\n    totalLossDb\n    averageAttenuationDbPerKm\n    maxAttenuationDbPerKm\n    conduitId\n    ductNumber\n    armored\n    fireRated\n    ownerId\n    ownerName\n    isLeased\n    installedAt\n    testedAt\n    createdAt\n    updatedAt\n  }\n}\n\nquery FiberCablesByRoute($startPointId: String!, $endPointId: String!) {\n  fiberCablesByRoute(startPointId: $startPointId, endPointId: $endPointId) {\n    id\n    cableId\n    name\n    status\n    totalStrands\n    availableStrands\n    lengthMeters\n    capacityUtilizationPercent\n  }\n}\n\nquery FiberCablesByDistributionPoint($distributionPointId: String!) {\n  fiberCablesByDistributionPoint(distributionPointId: $distributionPointId) {\n    id\n    cableId\n    name\n    status\n    totalStrands\n    availableStrands\n    lengthMeters\n  }\n}\n\nquery SplicePointList($limit: Int = 50, $offset: Int = 0, $status: SpliceStatus, $cableId: String, $distributionPointId: String) {\n  splicePoints(\n    limit: $limit\n    offset: $offset\n    status: $status\n    cableId: $cableId\n    distributionPointId: $distributionPointId\n  ) {\n    splicePoints {\n      id\n      spliceId\n      name\n      description\n      status\n      isActive\n      location {\n        latitude\n        longitude\n        altitude\n      }\n      closureType\n      manufacturer\n      model\n      trayCount\n      trayCapacity\n      cablesConnected\n      cableCount\n      totalSplices\n      activeSplices\n      averageSpliceLossDb\n      maxSpliceLossDb\n      passingSplices\n      failingSplices\n      accessType\n      requiresSpecialAccess\n      installedAt\n      lastTestedAt\n      lastMaintainedAt\n      createdAt\n      updatedAt\n    }\n    totalCount\n    hasNextPage\n  }\n}\n\nquery SplicePointDetail($id: ID!) {\n  splicePoint(id: $id) {\n    id\n    spliceId\n    name\n    description\n    status\n    isActive\n    location {\n      latitude\n      longitude\n      altitude\n    }\n    address {\n      streetAddress\n      city\n      stateProvince\n      postalCode\n      country\n    }\n    distributionPointId\n    closureType\n    manufacturer\n    model\n    trayCount\n    trayCapacity\n    cablesConnected\n    cableCount\n    spliceConnections {\n      cableAId\n      cableAStrand\n      cableBId\n      cableBStrand\n      spliceType\n      lossDb\n      reflectanceDb\n      isPassing\n      testResult\n      testedAt\n      testedBy\n    }\n    totalSplices\n    activeSplices\n    averageSpliceLossDb\n    maxSpliceLossDb\n    passingSplices\n    failingSplices\n    accessType\n    requiresSpecialAccess\n    accessNotes\n    installedAt\n    lastTestedAt\n    lastMaintainedAt\n    createdAt\n    updatedAt\n  }\n}\n\nquery SplicePointsByCable($cableId: String!) {\n  splicePointsByCable(cableId: $cableId) {\n    id\n    spliceId\n    name\n    status\n    totalSplices\n    activeSplices\n    averageSpliceLossDb\n    passingSplices\n  }\n}\n\nquery DistributionPointList($limit: Int = 50, $offset: Int = 0, $pointType: DistributionPointType, $status: FiberCableStatus, $siteId: String, $nearCapacity: Boolean) {\n  distributionPoints(\n    limit: $limit\n    offset: $offset\n    pointType: $pointType\n    status: $status\n    siteId: $siteId\n    nearCapacity: $nearCapacity\n  ) {\n    distributionPoints {\n      id\n      siteId\n      name\n      description\n      pointType\n      status\n      isActive\n      location {\n        latitude\n        longitude\n        altitude\n      }\n      manufacturer\n      model\n      totalCapacity\n      availableCapacity\n      usedCapacity\n      portCount\n      incomingCables\n      outgoingCables\n      totalCablesConnected\n      splicePointCount\n      hasPower\n      batteryBackup\n      environmentalMonitoring\n      temperatureCelsius\n      humidityPercent\n      capacityUtilizationPercent\n      fiberStrandCount\n      availableStrandCount\n      servesCustomerCount\n      accessType\n      requiresKey\n      installedAt\n      lastInspectedAt\n      lastMaintainedAt\n      createdAt\n      updatedAt\n    }\n    totalCount\n    hasNextPage\n  }\n}\n\nquery DistributionPointDetail($id: ID!) {\n  distributionPoint(id: $id) {\n    id\n    siteId\n    name\n    description\n    pointType\n    status\n    isActive\n    location {\n      latitude\n      longitude\n      altitude\n    }\n    address {\n      streetAddress\n      city\n      stateProvince\n      postalCode\n      country\n    }\n    siteName\n    manufacturer\n    model\n    totalCapacity\n    availableCapacity\n    usedCapacity\n    ports {\n      portNumber\n      isAllocated\n      isActive\n      cableId\n      strandId\n      customerId\n      customerName\n      serviceId\n    }\n    portCount\n    incomingCables\n    outgoingCables\n    totalCablesConnected\n    splicePoints\n    splicePointCount\n    hasPower\n    batteryBackup\n    environmentalMonitoring\n    temperatureCelsius\n    humidityPercent\n    capacityUtilizationPercent\n    fiberStrandCount\n    availableStrandCount\n    serviceAreaIds\n    servesCustomerCount\n    accessType\n    requiresKey\n    securityLevel\n    accessNotes\n    installedAt\n    lastInspectedAt\n    lastMaintainedAt\n    createdAt\n    updatedAt\n  }\n}\n\nquery DistributionPointsBySite($siteId: String!) {\n  distributionPointsBySite(siteId: $siteId) {\n    id\n    name\n    pointType\n    status\n    totalCapacity\n    availableCapacity\n    capacityUtilizationPercent\n    totalCablesConnected\n    servesCustomerCount\n  }\n}\n\nquery ServiceAreaList($limit: Int = 50, $offset: Int = 0, $areaType: ServiceAreaType, $isServiceable: Boolean, $constructionStatus: String) {\n  serviceAreas(\n    limit: $limit\n    offset: $offset\n    areaType: $areaType\n    isServiceable: $isServiceable\n    constructionStatus: $constructionStatus\n  ) {\n    serviceAreas {\n      id\n      areaId\n      name\n      description\n      areaType\n      isActive\n      isServiceable\n      boundaryGeojson\n      areaSqkm\n      city\n      stateProvince\n      postalCodes\n      streetCount\n      homesPassed\n      homesConnected\n      businessesPassed\n      businessesConnected\n      penetrationRatePercent\n      distributionPointCount\n      totalFiberKm\n      totalCapacity\n      usedCapacity\n      availableCapacity\n      capacityUtilizationPercent\n      maxBandwidthGbps\n      estimatedPopulation\n      householdDensityPerSqkm\n      constructionStatus\n      constructionCompletePercent\n      targetCompletionDate\n      plannedAt\n      constructionStartedAt\n      activatedAt\n      createdAt\n      updatedAt\n    }\n    totalCount\n    hasNextPage\n  }\n}\n\nquery ServiceAreaDetail($id: ID!) {\n  serviceArea(id: $id) {\n    id\n    areaId\n    name\n    description\n    areaType\n    isActive\n    isServiceable\n    boundaryGeojson\n    areaSqkm\n    city\n    stateProvince\n    postalCodes\n    streetCount\n    homesPassed\n    homesConnected\n    businessesPassed\n    businessesConnected\n    penetrationRatePercent\n    distributionPointIds\n    distributionPointCount\n    totalFiberKm\n    totalCapacity\n    usedCapacity\n    availableCapacity\n    capacityUtilizationPercent\n    maxBandwidthGbps\n    averageDistanceToDistributionMeters\n    estimatedPopulation\n    householdDensityPerSqkm\n    constructionStatus\n    constructionCompletePercent\n    targetCompletionDate\n    plannedAt\n    constructionStartedAt\n    activatedAt\n    createdAt\n    updatedAt\n  }\n}\n\nquery ServiceAreasByPostalCode($postalCode: String!) {\n  serviceAreasByPostalCode(postalCode: $postalCode) {\n    id\n    areaId\n    name\n    city\n    stateProvince\n    isServiceable\n    homesPassed\n    homesConnected\n    penetrationRatePercent\n    maxBandwidthGbps\n  }\n}\n\nquery FiberHealthMetrics($cableId: String, $healthStatus: FiberHealthStatus) {\n  fiberHealthMetrics(cableId: $cableId, healthStatus: $healthStatus) {\n    cableId\n    cableName\n    healthStatus\n    healthScore\n    totalLossDb\n    averageLossPerKmDb\n    maxLossPerKmDb\n    reflectanceDb\n    averageSpliceLossDb\n    maxSpliceLossDb\n    failingSplicesCount\n    totalStrands\n    activeStrands\n    degradedStrands\n    failedStrands\n    lastTestedAt\n    testPassRatePercent\n    daysSinceLastTest\n    activeAlarms\n    warningCount\n    requiresMaintenance\n  }\n}\n\nquery OTDRTestResults($cableId: String!, $strandId: Int, $limit: Int = 10) {\n  otdrTestResults(cableId: $cableId, strandId: $strandId, limit: $limit) {\n    testId\n    cableId\n    strandId\n    testedAt\n    testedBy\n    wavelengthNm\n    pulseWidthNs\n    totalLossDb\n    totalLengthMeters\n    averageAttenuationDbPerKm\n    spliceCount\n    connectorCount\n    bendCount\n    breakCount\n    isPassing\n    passThresholdDb\n    marginDb\n    traceFileUrl\n  }\n}\n\nquery FiberNetworkAnalytics {\n  fiberNetworkAnalytics {\n    totalFiberKm\n    totalCables\n    totalStrands\n    totalDistributionPoints\n    totalSplicePoints\n    totalCapacity\n    usedCapacity\n    availableCapacity\n    capacityUtilizationPercent\n    healthyCables\n    degradedCables\n    failedCables\n    networkHealthScore\n    totalServiceAreas\n    activeServiceAreas\n    homesPassed\n    homesConnected\n    penetrationRatePercent\n    averageCableLossDbPerKm\n    averageSpliceLossDb\n    cablesDueForTesting\n    cablesActive\n    cablesInactive\n    cablesUnderConstruction\n    cablesMaintenance\n    cablesWithHighLoss\n    distributionPointsNearCapacity\n    serviceAreasNeedsExpansion\n    generatedAt\n  }\n}\n\nquery FiberDashboard {\n  fiberDashboard {\n    analytics {\n      totalFiberKm\n      totalCables\n      totalStrands\n      totalDistributionPoints\n      totalSplicePoints\n      capacityUtilizationPercent\n      networkHealthScore\n      homesPassed\n      homesConnected\n      penetrationRatePercent\n    }\n    topCablesByUtilization {\n      id\n      cableId\n      name\n      capacityUtilizationPercent\n      totalStrands\n      usedStrands\n    }\n    topDistributionPointsByCapacity {\n      id\n      name\n      capacityUtilizationPercent\n      totalCapacity\n      usedCapacity\n    }\n    topServiceAreasByPenetration {\n      id\n      name\n      city\n      penetrationRatePercent\n      homesPassed\n      homesConnected\n    }\n    cablesRequiringAttention {\n      cableId\n      cableName\n      healthStatus\n      healthScore\n      requiresMaintenance\n    }\n    recentTestResults {\n      testId\n      cableId\n      strandId\n      testedAt\n      isPassing\n      totalLossDb\n    }\n    distributionPointsNearCapacity {\n      id\n      name\n      capacityUtilizationPercent\n    }\n    serviceAreasExpansionCandidates {\n      id\n      name\n      penetrationRatePercent\n      homesPassed\n    }\n    newConnectionsTrend\n    capacityUtilizationTrend\n    networkHealthTrend\n    generatedAt\n  }\n}": FiberCableListDocument,
  "query NetworkOverview {\n  networkOverview {\n    totalDevices\n    onlineDevices\n    offlineDevices\n    activeAlerts\n    criticalAlerts\n    warningAlerts\n    totalBandwidthGbps\n    uptimePercentage\n    dataSourceStatus {\n      name\n      status\n    }\n    deviceTypeSummary {\n      deviceType\n      totalCount\n      onlineCount\n      avgCpuUsage\n      avgMemoryUsage\n    }\n    recentAlerts {\n      alertId\n      severity\n      title\n      description\n      deviceName\n      deviceId\n      deviceType\n      triggeredAt\n      acknowledgedAt\n      resolvedAt\n      isActive\n    }\n  }\n}\n\nquery NetworkDeviceList($page: Int = 1, $pageSize: Int = 20, $deviceType: DeviceTypeEnum, $status: DeviceStatusEnum, $search: String) {\n  networkDevices(\n    page: $page\n    pageSize: $pageSize\n    deviceType: $deviceType\n    status: $status\n    search: $search\n  ) {\n    devices {\n      deviceId\n      deviceName\n      deviceType\n      status\n      ipAddress\n      firmwareVersion\n      model\n      location\n      tenantId\n      cpuUsagePercent\n      memoryUsagePercent\n      temperatureCelsius\n      powerStatus\n      pingLatencyMs\n      packetLossPercent\n      uptimeSeconds\n      uptimeDays\n      lastSeen\n      isHealthy\n    }\n    totalCount\n    hasNextPage\n    hasPrevPage\n    page\n    pageSize\n  }\n}\n\nquery DeviceDetail($deviceId: String!, $deviceType: DeviceTypeEnum!) {\n  deviceHealth(deviceId: $deviceId, deviceType: $deviceType) {\n    deviceId\n    deviceName\n    deviceType\n    status\n    ipAddress\n    firmwareVersion\n    model\n    location\n    tenantId\n    cpuUsagePercent\n    memoryUsagePercent\n    temperatureCelsius\n    powerStatus\n    pingLatencyMs\n    packetLossPercent\n    uptimeSeconds\n    uptimeDays\n    lastSeen\n    isHealthy\n  }\n  deviceTraffic(deviceId: $deviceId, deviceType: $deviceType) {\n    deviceId\n    deviceName\n    totalBandwidthGbps\n    currentRateInMbps\n    currentRateOutMbps\n    totalBytesIn\n    totalBytesOut\n    totalPacketsIn\n    totalPacketsOut\n    peakRateInBps\n    peakRateOutBps\n    peakTimestamp\n    timestamp\n  }\n}\n\nquery DeviceTraffic($deviceId: String!, $deviceType: DeviceTypeEnum!, $includeInterfaces: Boolean = false) {\n  deviceTraffic(\n    deviceId: $deviceId\n    deviceType: $deviceType\n    includeInterfaces: $includeInterfaces\n  ) {\n    deviceId\n    deviceName\n    totalBandwidthGbps\n    currentRateInMbps\n    currentRateOutMbps\n    totalBytesIn\n    totalBytesOut\n    totalPacketsIn\n    totalPacketsOut\n    peakRateInBps\n    peakRateOutBps\n    peakTimestamp\n    timestamp\n    interfaces @include(if: $includeInterfaces) {\n      interfaceName\n      status\n      rateInBps\n      rateOutBps\n      bytesIn\n      bytesOut\n      errorsIn\n      errorsOut\n      dropsIn\n      dropsOut\n    }\n  }\n}\n\nquery NetworkAlertList($page: Int = 1, $pageSize: Int = 50, $severity: AlertSeverityEnum, $activeOnly: Boolean = true, $deviceId: String, $deviceType: DeviceTypeEnum) {\n  networkAlerts(\n    page: $page\n    pageSize: $pageSize\n    severity: $severity\n    activeOnly: $activeOnly\n    deviceId: $deviceId\n    deviceType: $deviceType\n  ) {\n    alerts {\n      alertId\n      alertRuleId\n      severity\n      title\n      description\n      deviceName\n      deviceId\n      deviceType\n      metricName\n      currentValue\n      thresholdValue\n      triggeredAt\n      acknowledgedAt\n      resolvedAt\n      isActive\n      isAcknowledged\n      tenantId\n    }\n    totalCount\n    hasNextPage\n    hasPrevPage\n    page\n    pageSize\n  }\n}\n\nquery NetworkAlertDetail($alertId: String!) {\n  networkAlert(alertId: $alertId) {\n    alertId\n    alertRuleId\n    severity\n    title\n    description\n    deviceName\n    deviceId\n    deviceType\n    metricName\n    currentValue\n    thresholdValue\n    triggeredAt\n    acknowledgedAt\n    resolvedAt\n    isActive\n    isAcknowledged\n    tenantId\n  }\n}\n\nquery NetworkDashboard($devicePage: Int = 1, $devicePageSize: Int = 10, $deviceType: DeviceTypeEnum, $deviceStatus: DeviceStatusEnum, $alertPage: Int = 1, $alertPageSize: Int = 20, $alertSeverity: AlertSeverityEnum) {\n  networkOverview {\n    totalDevices\n    onlineDevices\n    offlineDevices\n    activeAlerts\n    criticalAlerts\n    warningAlerts\n    totalBandwidthGbps\n    uptimePercentage\n    dataSourceStatus {\n      name\n      status\n    }\n    deviceTypeSummary {\n      deviceType\n      totalCount\n      onlineCount\n      avgCpuUsage\n      avgMemoryUsage\n    }\n    recentAlerts {\n      alertId\n      severity\n      title\n      deviceName\n      triggeredAt\n      isActive\n    }\n  }\n  networkDevices(\n    page: $devicePage\n    pageSize: $devicePageSize\n    deviceType: $deviceType\n    status: $deviceStatus\n  ) {\n    devices {\n      deviceId\n      deviceName\n      deviceType\n      status\n      ipAddress\n      cpuUsagePercent\n      memoryUsagePercent\n      uptimeSeconds\n      isHealthy\n      lastSeen\n    }\n    totalCount\n    hasNextPage\n  }\n  networkAlerts(\n    page: $alertPage\n    pageSize: $alertPageSize\n    severity: $alertSeverity\n    activeOnly: true\n  ) {\n    alerts {\n      alertId\n      severity\n      title\n      description\n      deviceName\n      deviceType\n      triggeredAt\n      isActive\n    }\n    totalCount\n    hasNextPage\n  }\n}\n\nsubscription DeviceUpdates($deviceType: DeviceTypeEnum, $status: DeviceStatusEnum) {\n  deviceUpdated(deviceType: $deviceType, status: $status) {\n    deviceId\n    deviceName\n    deviceType\n    status\n    ipAddress\n    firmwareVersion\n    model\n    location\n    tenantId\n    cpuUsagePercent\n    memoryUsagePercent\n    temperatureCelsius\n    powerStatus\n    pingLatencyMs\n    packetLossPercent\n    uptimeSeconds\n    uptimeDays\n    lastSeen\n    isHealthy\n    changeType\n    previousValue\n    newValue\n    updatedAt\n  }\n}\n\nsubscription NetworkAlertUpdates($severity: AlertSeverityEnum, $deviceId: String) {\n  networkAlertUpdated(severity: $severity, deviceId: $deviceId) {\n    action\n    alert {\n      alertId\n      alertRuleId\n      severity\n      title\n      description\n      deviceName\n      deviceId\n      deviceType\n      metricName\n      currentValue\n      thresholdValue\n      triggeredAt\n      acknowledgedAt\n      resolvedAt\n      isActive\n      isAcknowledged\n      tenantId\n    }\n    updatedAt\n  }\n}": NetworkOverviewDocument,
  "query SubscriberDashboard($limit: Int = 50, $search: String) {\n  subscribers(limit: $limit, search: $search) {\n    id\n    subscriberId\n    username\n    enabled\n    framedIpAddress\n    bandwidthProfileId\n    createdAt\n    updatedAt\n    sessions {\n      radacctid\n      username\n      nasipaddress\n      acctsessionid\n      acctsessiontime\n      acctinputoctets\n      acctoutputoctets\n      acctstarttime\n    }\n  }\n  subscriberMetrics {\n    totalCount\n    enabledCount\n    disabledCount\n    activeSessionsCount\n    totalDataUsageMb\n  }\n}\n\nquery Subscriber($username: String!) {\n  subscribers(limit: 1, search: $username) {\n    id\n    subscriberId\n    username\n    enabled\n    framedIpAddress\n    bandwidthProfileId\n    createdAt\n    updatedAt\n    sessions {\n      radacctid\n      username\n      nasipaddress\n      acctsessionid\n      acctsessiontime\n      acctinputoctets\n      acctoutputoctets\n      acctstarttime\n      acctstoptime\n    }\n  }\n}\n\nquery ActiveSessions($limit: Int = 100, $username: String) {\n  sessions(limit: $limit, username: $username) {\n    radacctid\n    username\n    nasipaddress\n    acctsessionid\n    acctsessiontime\n    acctinputoctets\n    acctoutputoctets\n    acctstarttime\n  }\n}\n\nquery SubscriberMetrics {\n  subscriberMetrics {\n    totalCount\n    enabledCount\n    disabledCount\n    activeSessionsCount\n    totalDataUsageMb\n  }\n}": SubscriberDashboardDocument,
  "query SubscriptionList($page: Int = 1, $pageSize: Int = 10, $status: SubscriptionStatusEnum, $billingCycle: BillingCycleEnum, $search: String, $includeCustomer: Boolean = true, $includePlan: Boolean = true, $includeInvoices: Boolean = false) {\n  subscriptions(\n    page: $page\n    pageSize: $pageSize\n    status: $status\n    billingCycle: $billingCycle\n    search: $search\n    includeCustomer: $includeCustomer\n    includePlan: $includePlan\n    includeInvoices: $includeInvoices\n  ) {\n    subscriptions {\n      id\n      subscriptionId\n      customerId\n      planId\n      tenantId\n      currentPeriodStart\n      currentPeriodEnd\n      status\n      trialEnd\n      isInTrial\n      cancelAtPeriodEnd\n      canceledAt\n      endedAt\n      customPrice\n      usageRecords\n      createdAt\n      updatedAt\n      isActive\n      daysUntilRenewal\n      isPastDue\n      customer @include(if: $includeCustomer) {\n        id\n        customerId\n        name\n        email\n        phone\n        createdAt\n      }\n      plan @include(if: $includePlan) {\n        id\n        planId\n        productId\n        name\n        description\n        billingCycle\n        price\n        currency\n        setupFee\n        trialDays\n        isActive\n        hasTrial\n        hasSetupFee\n        includedUsage\n        overageRates\n        createdAt\n        updatedAt\n      }\n      recentInvoices @include(if: $includeInvoices) {\n        id\n        invoiceId\n        invoiceNumber\n        amount\n        currency\n        status\n        dueDate\n        paidAt\n        createdAt\n      }\n    }\n    totalCount\n    hasNextPage\n    hasPrevPage\n    page\n    pageSize\n  }\n}\n\nquery SubscriptionDetail($id: ID!) {\n  subscription(\n    id: $id\n    includeCustomer: true\n    includePlan: true\n    includeInvoices: true\n  ) {\n    id\n    subscriptionId\n    customerId\n    planId\n    tenantId\n    currentPeriodStart\n    currentPeriodEnd\n    status\n    trialEnd\n    isInTrial\n    cancelAtPeriodEnd\n    canceledAt\n    endedAt\n    customPrice\n    usageRecords\n    createdAt\n    updatedAt\n    isActive\n    daysUntilRenewal\n    isPastDue\n    customer {\n      id\n      customerId\n      name\n      email\n      phone\n      createdAt\n    }\n    plan {\n      id\n      planId\n      productId\n      name\n      description\n      billingCycle\n      price\n      currency\n      setupFee\n      trialDays\n      isActive\n      hasTrial\n      hasSetupFee\n      includedUsage\n      overageRates\n      createdAt\n      updatedAt\n    }\n    recentInvoices {\n      id\n      invoiceId\n      invoiceNumber\n      amount\n      currency\n      status\n      dueDate\n      paidAt\n      createdAt\n    }\n  }\n}\n\nquery SubscriptionMetrics {\n  subscriptionMetrics {\n    totalSubscriptions\n    activeSubscriptions\n    trialingSubscriptions\n    pastDueSubscriptions\n    canceledSubscriptions\n    pausedSubscriptions\n    monthlyRecurringRevenue\n    annualRecurringRevenue\n    averageRevenuePerUser\n    newSubscriptionsThisMonth\n    newSubscriptionsLastMonth\n    churnRate\n    growthRate\n    monthlySubscriptions\n    quarterlySubscriptions\n    annualSubscriptions\n    trialConversionRate\n    activeTrials\n  }\n}\n\nquery PlanList($page: Int = 1, $pageSize: Int = 20, $isActive: Boolean, $billingCycle: BillingCycleEnum) {\n  plans(\n    page: $page\n    pageSize: $pageSize\n    isActive: $isActive\n    billingCycle: $billingCycle\n  ) {\n    plans {\n      id\n      planId\n      productId\n      name\n      description\n      billingCycle\n      price\n      currency\n      setupFee\n      trialDays\n      isActive\n      createdAt\n      updatedAt\n      hasTrial\n      hasSetupFee\n      includedUsage\n      overageRates\n    }\n    totalCount\n    hasNextPage\n    hasPrevPage\n    page\n    pageSize\n  }\n}\n\nquery ProductList($page: Int = 1, $pageSize: Int = 20, $isActive: Boolean, $category: String) {\n  products(\n    page: $page\n    pageSize: $pageSize\n    isActive: $isActive\n    category: $category\n  ) {\n    products {\n      id\n      productId\n      sku\n      name\n      description\n      category\n      productType\n      basePrice\n      currency\n      isActive\n      createdAt\n      updatedAt\n    }\n    totalCount\n    hasNextPage\n    hasPrevPage\n    page\n    pageSize\n  }\n}\n\nquery SubscriptionDashboard($page: Int = 1, $pageSize: Int = 10, $status: SubscriptionStatusEnum, $search: String) {\n  subscriptions(\n    page: $page\n    pageSize: $pageSize\n    status: $status\n    search: $search\n    includeCustomer: true\n    includePlan: true\n    includeInvoices: false\n  ) {\n    subscriptions {\n      id\n      subscriptionId\n      status\n      currentPeriodStart\n      currentPeriodEnd\n      isActive\n      isInTrial\n      cancelAtPeriodEnd\n      createdAt\n      customer {\n        id\n        name\n        email\n      }\n      plan {\n        id\n        name\n        price\n        currency\n        billingCycle\n      }\n    }\n    totalCount\n    hasNextPage\n  }\n  subscriptionMetrics {\n    totalSubscriptions\n    activeSubscriptions\n    trialingSubscriptions\n    pastDueSubscriptions\n    monthlyRecurringRevenue\n    annualRecurringRevenue\n    averageRevenuePerUser\n    newSubscriptionsThisMonth\n    churnRate\n    growthRate\n  }\n}": SubscriptionListDocument,
  "query UserList($page: Int = 1, $pageSize: Int = 10, $isActive: Boolean, $isVerified: Boolean, $isSuperuser: Boolean, $isPlatformAdmin: Boolean, $search: String, $includeMetadata: Boolean = false, $includeRoles: Boolean = false, $includePermissions: Boolean = false, $includeTeams: Boolean = false) {\n  users(\n    page: $page\n    pageSize: $pageSize\n    isActive: $isActive\n    isVerified: $isVerified\n    isSuperuser: $isSuperuser\n    isPlatformAdmin: $isPlatformAdmin\n    search: $search\n    includeMetadata: $includeMetadata\n    includeRoles: $includeRoles\n    includePermissions: $includePermissions\n    includeTeams: $includeTeams\n  ) {\n    users {\n      id\n      username\n      email\n      fullName\n      firstName\n      lastName\n      displayName\n      isActive\n      isVerified\n      isSuperuser\n      isPlatformAdmin\n      status\n      phoneNumber\n      phone\n      phoneVerified\n      avatarUrl\n      timezone\n      location\n      bio\n      website\n      mfaEnabled\n      lastLogin\n      lastLoginIp\n      failedLoginAttempts\n      lockedUntil\n      language\n      tenantId\n      primaryRole\n      createdAt\n      updatedAt\n      metadata @include(if: $includeMetadata)\n      roles @include(if: $includeRoles) {\n        id\n        name\n        displayName\n        description\n        priority\n        isSystem\n        isActive\n        isDefault\n        createdAt\n        updatedAt\n      }\n      permissions @include(if: $includePermissions) {\n        id\n        name\n        displayName\n        description\n        category\n        isActive\n        isSystem\n        createdAt\n        updatedAt\n      }\n      teams @include(if: $includeTeams) {\n        teamId\n        teamName\n        role\n        joinedAt\n      }\n    }\n    totalCount\n    hasNextPage\n    hasPrevPage\n    page\n    pageSize\n  }\n}\n\nquery UserDetail($id: ID!) {\n  user(\n    id: $id\n    includeMetadata: true\n    includeRoles: true\n    includePermissions: true\n    includeTeams: true\n    includeProfileChanges: true\n  ) {\n    id\n    username\n    email\n    fullName\n    firstName\n    lastName\n    displayName\n    isActive\n    isVerified\n    isSuperuser\n    isPlatformAdmin\n    status\n    phoneNumber\n    phone\n    phoneVerified\n    avatarUrl\n    timezone\n    location\n    bio\n    website\n    mfaEnabled\n    lastLogin\n    lastLoginIp\n    failedLoginAttempts\n    lockedUntil\n    language\n    tenantId\n    primaryRole\n    createdAt\n    updatedAt\n    metadata\n    roles {\n      id\n      name\n      displayName\n      description\n      priority\n      isSystem\n      isActive\n      isDefault\n      createdAt\n      updatedAt\n    }\n    permissions {\n      id\n      name\n      displayName\n      description\n      category\n      isActive\n      isSystem\n      createdAt\n      updatedAt\n    }\n    teams {\n      teamId\n      teamName\n      role\n      joinedAt\n    }\n    profileChanges {\n      id\n      fieldName\n      oldValue\n      newValue\n      createdAt\n      changedByUsername\n    }\n  }\n}\n\nquery UserMetrics {\n  userMetrics {\n    totalUsers\n    activeUsers\n    suspendedUsers\n    invitedUsers\n    verifiedUsers\n    mfaEnabledUsers\n    platformAdmins\n    superusers\n    regularUsers\n    usersLoggedInLast24h\n    usersLoggedInLast7d\n    usersLoggedInLast30d\n    neverLoggedIn\n    newUsersThisMonth\n    newUsersLastMonth\n  }\n}\n\nquery RoleList($page: Int = 1, $pageSize: Int = 20, $isActive: Boolean, $isSystem: Boolean, $search: String) {\n  roles(\n    page: $page\n    pageSize: $pageSize\n    isActive: $isActive\n    isSystem: $isSystem\n    search: $search\n  ) {\n    roles {\n      id\n      name\n      displayName\n      description\n      priority\n      isSystem\n      isActive\n      isDefault\n      createdAt\n      updatedAt\n    }\n    totalCount\n    hasNextPage\n    hasPrevPage\n    page\n    pageSize\n  }\n}\n\nquery PermissionsByCategory($category: PermissionCategoryEnum) {\n  permissionsByCategory(category: $category) {\n    category\n    count\n    permissions {\n      id\n      name\n      displayName\n      description\n      category\n      isActive\n      isSystem\n      createdAt\n      updatedAt\n    }\n  }\n}\n\nquery UserDashboard($page: Int = 1, $pageSize: Int = 10, $isActive: Boolean, $search: String) {\n  users(\n    page: $page\n    pageSize: $pageSize\n    isActive: $isActive\n    search: $search\n    includeMetadata: false\n    includeRoles: true\n    includePermissions: false\n    includeTeams: false\n  ) {\n    users {\n      id\n      username\n      email\n      fullName\n      isActive\n      isVerified\n      isSuperuser\n      lastLogin\n      createdAt\n      roles {\n        id\n        name\n        displayName\n      }\n    }\n    totalCount\n    hasNextPage\n  }\n  userMetrics {\n    totalUsers\n    activeUsers\n    suspendedUsers\n    verifiedUsers\n    mfaEnabledUsers\n    platformAdmins\n    superusers\n    regularUsers\n    usersLoggedInLast24h\n    usersLoggedInLast7d\n    newUsersThisMonth\n  }\n}\n\nquery UserRoles($id: ID!) {\n  user(id: $id, includeRoles: true) {\n    id\n    username\n    roles {\n      id\n      name\n      displayName\n      description\n      priority\n      isSystem\n      isActive\n      createdAt\n    }\n  }\n}\n\nquery UserPermissions($id: ID!) {\n  user(id: $id, includePermissions: true) {\n    id\n    username\n    permissions {\n      id\n      name\n      displayName\n      description\n      category\n      isActive\n    }\n  }\n}\n\nquery UserTeams($id: ID!) {\n  user(id: $id, includeTeams: true) {\n    id\n    username\n    teams {\n      teamId\n      teamName\n      role\n      joinedAt\n    }\n  }\n}": UserListDocument,
  "query AccessPointList($limit: Int = 50, $offset: Int = 0, $siteId: String, $status: AccessPointStatus, $frequencyBand: FrequencyBand, $search: String) {\n  accessPoints(\n    limit: $limit\n    offset: $offset\n    siteId: $siteId\n    status: $status\n    frequencyBand: $frequencyBand\n    search: $search\n  ) {\n    accessPoints {\n      id\n      name\n      macAddress\n      ipAddress\n      serialNumber\n      status\n      isOnline\n      lastSeenAt\n      model\n      manufacturer\n      firmwareVersion\n      ssid\n      frequencyBand\n      channel\n      channelWidth\n      transmitPower\n      maxClients\n      securityType\n      location {\n        siteName\n        building\n        floor\n        room\n        mountingType\n        coordinates {\n          latitude\n          longitude\n          altitude\n        }\n      }\n      rfMetrics {\n        signalStrengthDbm\n        noiseFloorDbm\n        signalToNoiseRatio\n        channelUtilizationPercent\n        interferenceLevel\n        txPowerDbm\n        rxPowerDbm\n      }\n      performance {\n        txBytes\n        rxBytes\n        txPackets\n        rxPackets\n        txRateMbps\n        rxRateMbps\n        txErrors\n        rxErrors\n        connectedClients\n        cpuUsagePercent\n        memoryUsagePercent\n        uptimeSeconds\n      }\n      controllerName\n      siteName\n      createdAt\n      updatedAt\n      lastRebootAt\n    }\n    totalCount\n    hasNextPage\n  }\n}\n\nquery AccessPointDetail($id: ID!) {\n  accessPoint(id: $id) {\n    id\n    name\n    macAddress\n    ipAddress\n    serialNumber\n    status\n    isOnline\n    lastSeenAt\n    model\n    manufacturer\n    firmwareVersion\n    hardwareRevision\n    ssid\n    frequencyBand\n    channel\n    channelWidth\n    transmitPower\n    maxClients\n    securityType\n    location {\n      siteName\n      building\n      floor\n      room\n      mountingType\n      coordinates {\n        latitude\n        longitude\n        altitude\n        accuracy\n      }\n    }\n    rfMetrics {\n      signalStrengthDbm\n      noiseFloorDbm\n      signalToNoiseRatio\n      channelUtilizationPercent\n      interferenceLevel\n      txPowerDbm\n      rxPowerDbm\n    }\n    performance {\n      txBytes\n      rxBytes\n      txPackets\n      rxPackets\n      txRateMbps\n      rxRateMbps\n      txErrors\n      rxErrors\n      txDropped\n      rxDropped\n      retries\n      retryRatePercent\n      connectedClients\n      authenticatedClients\n      authorizedClients\n      cpuUsagePercent\n      memoryUsagePercent\n      uptimeSeconds\n    }\n    controllerId\n    controllerName\n    siteId\n    siteName\n    createdAt\n    updatedAt\n    lastRebootAt\n    isMeshEnabled\n    isBandSteeringEnabled\n    isLoadBalancingEnabled\n  }\n}\n\nquery AccessPointsBySite($siteId: String!) {\n  accessPointsBySite(siteId: $siteId) {\n    id\n    name\n    macAddress\n    ipAddress\n    status\n    isOnline\n    ssid\n    frequencyBand\n    channel\n    performance {\n      connectedClients\n      cpuUsagePercent\n      memoryUsagePercent\n    }\n    rfMetrics {\n      signalStrengthDbm\n      channelUtilizationPercent\n    }\n  }\n}\n\nquery WirelessClientList($limit: Int = 50, $offset: Int = 0, $accessPointId: String, $customerId: String, $frequencyBand: FrequencyBand, $search: String) {\n  wirelessClients(\n    limit: $limit\n    offset: $offset\n    accessPointId: $accessPointId\n    customerId: $customerId\n    frequencyBand: $frequencyBand\n    search: $search\n  ) {\n    clients {\n      id\n      macAddress\n      hostname\n      ipAddress\n      manufacturer\n      accessPointId\n      accessPointName\n      ssid\n      connectionType\n      frequencyBand\n      channel\n      isAuthenticated\n      isAuthorized\n      signalStrengthDbm\n      signalQuality {\n        rssiDbm\n        snrDb\n        noiseFloorDbm\n        signalStrengthPercent\n        linkQualityPercent\n      }\n      noiseFloorDbm\n      snr\n      txRateMbps\n      rxRateMbps\n      txBytes\n      rxBytes\n      connectedAt\n      lastSeenAt\n      uptimeSeconds\n      customerId\n      customerName\n    }\n    totalCount\n    hasNextPage\n  }\n}\n\nquery WirelessClientDetail($id: ID!) {\n  wirelessClient(id: $id) {\n    id\n    macAddress\n    hostname\n    ipAddress\n    manufacturer\n    accessPointId\n    accessPointName\n    ssid\n    connectionType\n    frequencyBand\n    channel\n    isAuthenticated\n    isAuthorized\n    authMethod\n    signalStrengthDbm\n    signalQuality {\n      rssiDbm\n      snrDb\n      noiseFloorDbm\n      signalStrengthPercent\n      linkQualityPercent\n    }\n    noiseFloorDbm\n    snr\n    txRateMbps\n    rxRateMbps\n    txBytes\n    rxBytes\n    txPackets\n    rxPackets\n    txRetries\n    rxRetries\n    connectedAt\n    lastSeenAt\n    uptimeSeconds\n    idleTimeSeconds\n    supports80211k\n    supports80211r\n    supports80211v\n    maxPhyRateMbps\n    customerId\n    customerName\n  }\n}\n\nquery WirelessClientsByAccessPoint($accessPointId: String!) {\n  wirelessClientsByAccessPoint(accessPointId: $accessPointId) {\n    id\n    macAddress\n    hostname\n    ipAddress\n    ssid\n    signalStrengthDbm\n    signalQuality {\n      rssiDbm\n      snrDb\n      noiseFloorDbm\n      signalStrengthPercent\n      linkQualityPercent\n    }\n    txRateMbps\n    rxRateMbps\n    connectedAt\n    customerId\n    customerName\n  }\n}\n\nquery WirelessClientsByCustomer($customerId: String!) {\n  wirelessClientsByCustomer(customerId: $customerId) {\n    id\n    macAddress\n    hostname\n    ipAddress\n    accessPointName\n    ssid\n    frequencyBand\n    signalStrengthDbm\n    signalQuality {\n      rssiDbm\n      snrDb\n      noiseFloorDbm\n      signalStrengthPercent\n      linkQualityPercent\n    }\n    isAuthenticated\n    connectedAt\n    lastSeenAt\n  }\n}\n\nquery CoverageZoneList($limit: Int = 50, $offset: Int = 0, $siteId: String, $areaType: String) {\n  coverageZones(\n    limit: $limit\n    offset: $offset\n    siteId: $siteId\n    areaType: $areaType\n  ) {\n    zones {\n      id\n      name\n      description\n      siteId\n      siteName\n      floor\n      areaType\n      coverageAreaSqm\n      signalStrengthMinDbm\n      signalStrengthMaxDbm\n      signalStrengthAvgDbm\n      accessPointIds\n      accessPointCount\n      interferenceLevel\n      channelUtilizationAvg\n      noiseFloorAvgDbm\n      connectedClients\n      maxClientCapacity\n      clientDensityPerAp\n      coveragePolygon\n      createdAt\n      updatedAt\n      lastSurveyedAt\n    }\n    totalCount\n    hasNextPage\n  }\n}\n\nquery CoverageZoneDetail($id: ID!) {\n  coverageZone(id: $id) {\n    id\n    name\n    description\n    siteId\n    siteName\n    floor\n    areaType\n    coverageAreaSqm\n    signalStrengthMinDbm\n    signalStrengthMaxDbm\n    signalStrengthAvgDbm\n    accessPointIds\n    accessPointCount\n    interferenceLevel\n    channelUtilizationAvg\n    noiseFloorAvgDbm\n    connectedClients\n    maxClientCapacity\n    clientDensityPerAp\n    coveragePolygon\n    createdAt\n    updatedAt\n    lastSurveyedAt\n  }\n}\n\nquery CoverageZonesBySite($siteId: String!) {\n  coverageZonesBySite(siteId: $siteId) {\n    id\n    name\n    floor\n    areaType\n    coverageAreaSqm\n    accessPointCount\n    connectedClients\n    maxClientCapacity\n    signalStrengthAvgDbm\n  }\n}\n\nquery RFAnalytics($siteId: String!) {\n  rfAnalytics(siteId: $siteId) {\n    siteId\n    siteName\n    analysisTimestamp\n    channelUtilization24ghz {\n      channel\n      frequencyMhz\n      band\n      utilizationPercent\n      interferenceLevel\n      accessPointsCount\n    }\n    channelUtilization5ghz {\n      channel\n      frequencyMhz\n      band\n      utilizationPercent\n      interferenceLevel\n      accessPointsCount\n    }\n    channelUtilization6ghz {\n      channel\n      frequencyMhz\n      band\n      utilizationPercent\n      interferenceLevel\n      accessPointsCount\n    }\n    recommendedChannels24ghz\n    recommendedChannels5ghz\n    recommendedChannels6ghz\n    interferenceSources {\n      sourceType\n      frequencyMhz\n      strengthDbm\n      affectedChannels\n    }\n    totalInterferenceScore\n    averageSignalStrengthDbm\n    averageSnr\n    coverageQualityScore\n    clientsPerBand24ghz\n    clientsPerBand5ghz\n    clientsPerBand6ghz\n    bandUtilizationBalanceScore\n  }\n}\n\nquery ChannelUtilization($siteId: String!, $frequencyBand: FrequencyBand!) {\n  channelUtilization(siteId: $siteId, frequencyBand: $frequencyBand) {\n    channel\n    frequencyMhz\n    band\n    utilizationPercent\n    interferenceLevel\n    accessPointsCount\n  }\n}\n\nquery WirelessSiteMetrics($siteId: String!) {\n  wirelessSiteMetrics(siteId: $siteId) {\n    siteId\n    siteName\n    totalAps\n    onlineAps\n    offlineAps\n    degradedAps\n    totalClients\n    clients24ghz\n    clients5ghz\n    clients6ghz\n    averageSignalStrengthDbm\n    averageSnr\n    totalThroughputMbps\n    totalCapacity\n    capacityUtilizationPercent\n    overallHealthScore\n    rfHealthScore\n    clientExperienceScore\n  }\n}\n\nquery WirelessDashboard {\n  wirelessDashboard {\n    totalSites\n    totalAccessPoints\n    totalClients\n    totalCoverageZones\n    onlineAps\n    offlineAps\n    degradedAps\n    clientsByBand24ghz\n    clientsByBand5ghz\n    clientsByBand6ghz\n    topApsByClients {\n      id\n      name\n      siteName\n      performance {\n        connectedClients\n      }\n    }\n    topApsByThroughput {\n      id\n      name\n      siteName\n      performance {\n        txRateMbps\n        rxRateMbps\n      }\n    }\n    sitesWithIssues {\n      siteId\n      siteName\n      offlineAps\n      degradedAps\n      overallHealthScore\n    }\n    totalThroughputMbps\n    averageSignalStrengthDbm\n    averageClientExperienceScore\n    clientCountTrend\n    throughputTrendMbps\n    offlineEventsCount\n    generatedAt\n  }\n}": AccessPointListDocument
};
function graphql(source) {
  return documents[source] ?? {};
}

// generated/react-query.ts
var react_query_exports = {};
__export(react_query_exports, {
  AccessPointDetailDocument: () => AccessPointDetailDocument2,
  AccessPointListDocument: () => AccessPointListDocument2,
  AccessPointStatus: () => AccessPointStatus2,
  AccessPointsBySiteDocument: () => AccessPointsBySiteDocument2,
  ActiveSessionsDocument: () => ActiveSessionsDocument2,
  ActivityTypeEnum: () => ActivityTypeEnum2,
  AlertSeverityEnum: () => AlertSeverityEnum2,
  BillingCycleEnum: () => BillingCycleEnum2,
  CableInstallationType: () => CableInstallationType2,
  ChannelUtilizationDocument: () => ChannelUtilizationDocument2,
  ClientConnectionType: () => ClientConnectionType2,
  CoverageZoneDetailDocument: () => CoverageZoneDetailDocument2,
  CoverageZoneListDocument: () => CoverageZoneListDocument2,
  CoverageZonesBySiteDocument: () => CoverageZonesBySiteDocument2,
  Customer360ViewDocument: () => Customer360ViewDocument2,
  CustomerActivitiesDocument: () => CustomerActivitiesDocument2,
  CustomerActivityAddedDocument: () => CustomerActivityAddedDocument2,
  CustomerBillingDocument: () => CustomerBillingDocument2,
  CustomerDashboardDocument: () => CustomerDashboardDocument2,
  CustomerDetailDocument: () => CustomerDetailDocument2,
  CustomerDevicesDocument: () => CustomerDevicesDocument2,
  CustomerDevicesUpdatedDocument: () => CustomerDevicesUpdatedDocument2,
  CustomerListDocument: () => CustomerListDocument2,
  CustomerMetricsDocument: () => CustomerMetricsDocument2,
  CustomerNetworkInfoDocument: () => CustomerNetworkInfoDocument2,
  CustomerNetworkStatusUpdatedDocument: () => CustomerNetworkStatusUpdatedDocument2,
  CustomerNoteUpdatedDocument: () => CustomerNoteUpdatedDocument2,
  CustomerNotesDocument: () => CustomerNotesDocument2,
  CustomerStatusEnum: () => CustomerStatusEnum2,
  CustomerSubscriptionsDocument: () => CustomerSubscriptionsDocument2,
  CustomerTicketUpdatedDocument: () => CustomerTicketUpdatedDocument2,
  CustomerTicketsDocument: () => CustomerTicketsDocument2,
  CustomerTierEnum: () => CustomerTierEnum2,
  CustomerTypeEnum: () => CustomerTypeEnum2,
  DeviceDetailDocument: () => DeviceDetailDocument2,
  DeviceStatusEnum: () => DeviceStatusEnum2,
  DeviceTrafficDocument: () => DeviceTrafficDocument2,
  DeviceTypeEnum: () => DeviceTypeEnum2,
  DeviceUpdatesDocument: () => DeviceUpdatesDocument2,
  DistributionPointDetailDocument: () => DistributionPointDetailDocument2,
  DistributionPointListDocument: () => DistributionPointListDocument2,
  DistributionPointType: () => DistributionPointType2,
  DistributionPointsBySiteDocument: () => DistributionPointsBySiteDocument2,
  FiberCableDetailDocument: () => FiberCableDetailDocument2,
  FiberCableListDocument: () => FiberCableListDocument2,
  FiberCableStatus: () => FiberCableStatus2,
  FiberCablesByDistributionPointDocument: () => FiberCablesByDistributionPointDocument2,
  FiberCablesByRouteDocument: () => FiberCablesByRouteDocument2,
  FiberDashboardDocument: () => FiberDashboardDocument2,
  FiberHealthMetricsDocument: () => FiberHealthMetricsDocument2,
  FiberHealthStatus: () => FiberHealthStatus2,
  FiberNetworkAnalyticsDocument: () => FiberNetworkAnalyticsDocument2,
  FiberType: () => FiberType2,
  FrequencyBand: () => FrequencyBand2,
  NetworkAlertDetailDocument: () => NetworkAlertDetailDocument2,
  NetworkAlertListDocument: () => NetworkAlertListDocument2,
  NetworkAlertUpdatesDocument: () => NetworkAlertUpdatesDocument2,
  NetworkDashboardDocument: () => NetworkDashboardDocument2,
  NetworkDeviceListDocument: () => NetworkDeviceListDocument2,
  NetworkOverviewDocument: () => NetworkOverviewDocument2,
  OtdrTestResultsDocument: () => OtdrTestResultsDocument2,
  PaymentMethodTypeEnum: () => PaymentMethodTypeEnum2,
  PaymentStatusEnum: () => PaymentStatusEnum2,
  PermissionCategoryEnum: () => PermissionCategoryEnum2,
  PermissionsByCategoryDocument: () => PermissionsByCategoryDocument2,
  PlanListDocument: () => PlanListDocument2,
  ProductListDocument: () => ProductListDocument2,
  ProductTypeEnum: () => ProductTypeEnum2,
  RfAnalyticsDocument: () => RfAnalyticsDocument2,
  RoleListDocument: () => RoleListDocument2,
  ServiceAreaDetailDocument: () => ServiceAreaDetailDocument2,
  ServiceAreaListDocument: () => ServiceAreaListDocument2,
  ServiceAreaType: () => ServiceAreaType2,
  ServiceAreasByPostalCodeDocument: () => ServiceAreasByPostalCodeDocument2,
  SplicePointDetailDocument: () => SplicePointDetailDocument2,
  SplicePointListDocument: () => SplicePointListDocument2,
  SplicePointsByCableDocument: () => SplicePointsByCableDocument2,
  SpliceStatus: () => SpliceStatus2,
  SpliceType: () => SpliceType2,
  SubscriberDashboardDocument: () => SubscriberDashboardDocument2,
  SubscriberDocument: () => SubscriberDocument2,
  SubscriberMetricsDocument: () => SubscriberMetricsDocument2,
  SubscriptionDashboardDocument: () => SubscriptionDashboardDocument2,
  SubscriptionDetailDocument: () => SubscriptionDetailDocument2,
  SubscriptionListDocument: () => SubscriptionListDocument2,
  SubscriptionMetricsDocument: () => SubscriptionMetricsDocument2,
  SubscriptionStatusEnum: () => SubscriptionStatusEnum2,
  TenantPlanTypeEnum: () => TenantPlanTypeEnum2,
  TenantStatusEnum: () => TenantStatusEnum2,
  UserDashboardDocument: () => UserDashboardDocument2,
  UserDetailDocument: () => UserDetailDocument2,
  UserListDocument: () => UserListDocument2,
  UserMetricsDocument: () => UserMetricsDocument2,
  UserPermissionsDocument: () => UserPermissionsDocument2,
  UserRolesDocument: () => UserRolesDocument2,
  UserStatusEnum: () => UserStatusEnum2,
  UserTeamsDocument: () => UserTeamsDocument2,
  WirelessClientDetailDocument: () => WirelessClientDetailDocument2,
  WirelessClientListDocument: () => WirelessClientListDocument2,
  WirelessClientsByAccessPointDocument: () => WirelessClientsByAccessPointDocument2,
  WirelessClientsByCustomerDocument: () => WirelessClientsByCustomerDocument2,
  WirelessDashboardDocument: () => WirelessDashboardDocument2,
  WirelessSecurityType: () => WirelessSecurityType2,
  WirelessSiteMetricsDocument: () => WirelessSiteMetricsDocument2,
  WorkflowStatus: () => WorkflowStatus2,
  WorkflowStepStatus: () => WorkflowStepStatus2,
  WorkflowType: () => WorkflowType2,
  useAccessPointDetailQuery: () => useAccessPointDetailQuery,
  useAccessPointListQuery: () => useAccessPointListQuery,
  useAccessPointsBySiteQuery: () => useAccessPointsBySiteQuery,
  useActiveSessionsQuery: () => useActiveSessionsQuery,
  useChannelUtilizationQuery: () => useChannelUtilizationQuery,
  useCoverageZoneDetailQuery: () => useCoverageZoneDetailQuery,
  useCoverageZoneListQuery: () => useCoverageZoneListQuery,
  useCoverageZonesBySiteQuery: () => useCoverageZonesBySiteQuery,
  useCustomer360ViewQuery: () => useCustomer360ViewQuery,
  useCustomerActivitiesQuery: () => useCustomerActivitiesQuery,
  useCustomerBillingQuery: () => useCustomerBillingQuery,
  useCustomerDashboardQuery: () => useCustomerDashboardQuery,
  useCustomerDetailQuery: () => useCustomerDetailQuery,
  useCustomerDevicesQuery: () => useCustomerDevicesQuery,
  useCustomerListQuery: () => useCustomerListQuery,
  useCustomerMetricsQuery: () => useCustomerMetricsQuery,
  useCustomerNetworkInfoQuery: () => useCustomerNetworkInfoQuery,
  useCustomerNotesQuery: () => useCustomerNotesQuery,
  useCustomerSubscriptionsQuery: () => useCustomerSubscriptionsQuery,
  useCustomerTicketsQuery: () => useCustomerTicketsQuery,
  useDeviceDetailQuery: () => useDeviceDetailQuery,
  useDeviceTrafficQuery: () => useDeviceTrafficQuery,
  useDistributionPointDetailQuery: () => useDistributionPointDetailQuery,
  useDistributionPointListQuery: () => useDistributionPointListQuery,
  useDistributionPointsBySiteQuery: () => useDistributionPointsBySiteQuery,
  useFiberCableDetailQuery: () => useFiberCableDetailQuery,
  useFiberCableListQuery: () => useFiberCableListQuery,
  useFiberCablesByDistributionPointQuery: () => useFiberCablesByDistributionPointQuery,
  useFiberCablesByRouteQuery: () => useFiberCablesByRouteQuery,
  useFiberDashboardQuery: () => useFiberDashboardQuery,
  useFiberHealthMetricsQuery: () => useFiberHealthMetricsQuery,
  useFiberNetworkAnalyticsQuery: () => useFiberNetworkAnalyticsQuery,
  useInfiniteAccessPointDetailQuery: () => useInfiniteAccessPointDetailQuery,
  useInfiniteAccessPointListQuery: () => useInfiniteAccessPointListQuery,
  useInfiniteAccessPointsBySiteQuery: () => useInfiniteAccessPointsBySiteQuery,
  useInfiniteActiveSessionsQuery: () => useInfiniteActiveSessionsQuery,
  useInfiniteChannelUtilizationQuery: () => useInfiniteChannelUtilizationQuery,
  useInfiniteCoverageZoneDetailQuery: () => useInfiniteCoverageZoneDetailQuery,
  useInfiniteCoverageZoneListQuery: () => useInfiniteCoverageZoneListQuery,
  useInfiniteCoverageZonesBySiteQuery: () => useInfiniteCoverageZonesBySiteQuery,
  useInfiniteCustomer360ViewQuery: () => useInfiniteCustomer360ViewQuery,
  useInfiniteCustomerActivitiesQuery: () => useInfiniteCustomerActivitiesQuery,
  useInfiniteCustomerBillingQuery: () => useInfiniteCustomerBillingQuery,
  useInfiniteCustomerDashboardQuery: () => useInfiniteCustomerDashboardQuery,
  useInfiniteCustomerDetailQuery: () => useInfiniteCustomerDetailQuery,
  useInfiniteCustomerDevicesQuery: () => useInfiniteCustomerDevicesQuery,
  useInfiniteCustomerListQuery: () => useInfiniteCustomerListQuery,
  useInfiniteCustomerMetricsQuery: () => useInfiniteCustomerMetricsQuery,
  useInfiniteCustomerNetworkInfoQuery: () => useInfiniteCustomerNetworkInfoQuery,
  useInfiniteCustomerNotesQuery: () => useInfiniteCustomerNotesQuery,
  useInfiniteCustomerSubscriptionsQuery: () => useInfiniteCustomerSubscriptionsQuery,
  useInfiniteCustomerTicketsQuery: () => useInfiniteCustomerTicketsQuery,
  useInfiniteDeviceDetailQuery: () => useInfiniteDeviceDetailQuery,
  useInfiniteDeviceTrafficQuery: () => useInfiniteDeviceTrafficQuery,
  useInfiniteDistributionPointDetailQuery: () => useInfiniteDistributionPointDetailQuery,
  useInfiniteDistributionPointListQuery: () => useInfiniteDistributionPointListQuery,
  useInfiniteDistributionPointsBySiteQuery: () => useInfiniteDistributionPointsBySiteQuery,
  useInfiniteFiberCableDetailQuery: () => useInfiniteFiberCableDetailQuery,
  useInfiniteFiberCableListQuery: () => useInfiniteFiberCableListQuery,
  useInfiniteFiberCablesByDistributionPointQuery: () => useInfiniteFiberCablesByDistributionPointQuery,
  useInfiniteFiberCablesByRouteQuery: () => useInfiniteFiberCablesByRouteQuery,
  useInfiniteFiberDashboardQuery: () => useInfiniteFiberDashboardQuery,
  useInfiniteFiberHealthMetricsQuery: () => useInfiniteFiberHealthMetricsQuery,
  useInfiniteFiberNetworkAnalyticsQuery: () => useInfiniteFiberNetworkAnalyticsQuery,
  useInfiniteNetworkAlertDetailQuery: () => useInfiniteNetworkAlertDetailQuery,
  useInfiniteNetworkAlertListQuery: () => useInfiniteNetworkAlertListQuery,
  useInfiniteNetworkDashboardQuery: () => useInfiniteNetworkDashboardQuery,
  useInfiniteNetworkDeviceListQuery: () => useInfiniteNetworkDeviceListQuery,
  useInfiniteNetworkOverviewQuery: () => useInfiniteNetworkOverviewQuery,
  useInfiniteOtdrTestResultsQuery: () => useInfiniteOtdrTestResultsQuery,
  useInfinitePermissionsByCategoryQuery: () => useInfinitePermissionsByCategoryQuery,
  useInfinitePlanListQuery: () => useInfinitePlanListQuery,
  useInfiniteProductListQuery: () => useInfiniteProductListQuery,
  useInfiniteRfAnalyticsQuery: () => useInfiniteRfAnalyticsQuery,
  useInfiniteRoleListQuery: () => useInfiniteRoleListQuery,
  useInfiniteServiceAreaDetailQuery: () => useInfiniteServiceAreaDetailQuery,
  useInfiniteServiceAreaListQuery: () => useInfiniteServiceAreaListQuery,
  useInfiniteServiceAreasByPostalCodeQuery: () => useInfiniteServiceAreasByPostalCodeQuery,
  useInfiniteSplicePointDetailQuery: () => useInfiniteSplicePointDetailQuery,
  useInfiniteSplicePointListQuery: () => useInfiniteSplicePointListQuery,
  useInfiniteSplicePointsByCableQuery: () => useInfiniteSplicePointsByCableQuery,
  useInfiniteSubscriberDashboardQuery: () => useInfiniteSubscriberDashboardQuery,
  useInfiniteSubscriberMetricsQuery: () => useInfiniteSubscriberMetricsQuery,
  useInfiniteSubscriberQuery: () => useInfiniteSubscriberQuery,
  useInfiniteSubscriptionDashboardQuery: () => useInfiniteSubscriptionDashboardQuery,
  useInfiniteSubscriptionDetailQuery: () => useInfiniteSubscriptionDetailQuery,
  useInfiniteSubscriptionListQuery: () => useInfiniteSubscriptionListQuery,
  useInfiniteSubscriptionMetricsQuery: () => useInfiniteSubscriptionMetricsQuery,
  useInfiniteUserDashboardQuery: () => useInfiniteUserDashboardQuery,
  useInfiniteUserDetailQuery: () => useInfiniteUserDetailQuery,
  useInfiniteUserListQuery: () => useInfiniteUserListQuery,
  useInfiniteUserMetricsQuery: () => useInfiniteUserMetricsQuery,
  useInfiniteUserPermissionsQuery: () => useInfiniteUserPermissionsQuery,
  useInfiniteUserRolesQuery: () => useInfiniteUserRolesQuery,
  useInfiniteUserTeamsQuery: () => useInfiniteUserTeamsQuery,
  useInfiniteWirelessClientDetailQuery: () => useInfiniteWirelessClientDetailQuery,
  useInfiniteWirelessClientListQuery: () => useInfiniteWirelessClientListQuery,
  useInfiniteWirelessClientsByAccessPointQuery: () => useInfiniteWirelessClientsByAccessPointQuery,
  useInfiniteWirelessClientsByCustomerQuery: () => useInfiniteWirelessClientsByCustomerQuery,
  useInfiniteWirelessDashboardQuery: () => useInfiniteWirelessDashboardQuery,
  useInfiniteWirelessSiteMetricsQuery: () => useInfiniteWirelessSiteMetricsQuery,
  useNetworkAlertDetailQuery: () => useNetworkAlertDetailQuery,
  useNetworkAlertListQuery: () => useNetworkAlertListQuery,
  useNetworkDashboardQuery: () => useNetworkDashboardQuery,
  useNetworkDeviceListQuery: () => useNetworkDeviceListQuery,
  useNetworkOverviewQuery: () => useNetworkOverviewQuery,
  useOtdrTestResultsQuery: () => useOtdrTestResultsQuery,
  usePermissionsByCategoryQuery: () => usePermissionsByCategoryQuery,
  usePlanListQuery: () => usePlanListQuery,
  useProductListQuery: () => useProductListQuery,
  useRfAnalyticsQuery: () => useRfAnalyticsQuery,
  useRoleListQuery: () => useRoleListQuery,
  useServiceAreaDetailQuery: () => useServiceAreaDetailQuery,
  useServiceAreaListQuery: () => useServiceAreaListQuery,
  useServiceAreasByPostalCodeQuery: () => useServiceAreasByPostalCodeQuery,
  useSplicePointDetailQuery: () => useSplicePointDetailQuery,
  useSplicePointListQuery: () => useSplicePointListQuery,
  useSplicePointsByCableQuery: () => useSplicePointsByCableQuery,
  useSubscriberDashboardQuery: () => useSubscriberDashboardQuery,
  useSubscriberMetricsQuery: () => useSubscriberMetricsQuery,
  useSubscriberQuery: () => useSubscriberQuery,
  useSubscriptionDashboardQuery: () => useSubscriptionDashboardQuery,
  useSubscriptionDetailQuery: () => useSubscriptionDetailQuery,
  useSubscriptionListQuery: () => useSubscriptionListQuery,
  useSubscriptionMetricsQuery: () => useSubscriptionMetricsQuery,
  useUserDashboardQuery: () => useUserDashboardQuery,
  useUserDetailQuery: () => useUserDetailQuery,
  useUserListQuery: () => useUserListQuery,
  useUserMetricsQuery: () => useUserMetricsQuery,
  useUserPermissionsQuery: () => useUserPermissionsQuery,
  useUserRolesQuery: () => useUserRolesQuery,
  useUserTeamsQuery: () => useUserTeamsQuery,
  useWirelessClientDetailQuery: () => useWirelessClientDetailQuery,
  useWirelessClientListQuery: () => useWirelessClientListQuery,
  useWirelessClientsByAccessPointQuery: () => useWirelessClientsByAccessPointQuery,
  useWirelessClientsByCustomerQuery: () => useWirelessClientsByCustomerQuery,
  useWirelessDashboardQuery: () => useWirelessDashboardQuery,
  useWirelessSiteMetricsQuery: () => useWirelessSiteMetricsQuery
});
var import_react_query = require("@tanstack/react-query");
var AccessPointStatus2 = /* @__PURE__ */ ((AccessPointStatus3) => {
  AccessPointStatus3["Degraded"] = "DEGRADED";
  AccessPointStatus3["Maintenance"] = "MAINTENANCE";
  AccessPointStatus3["Offline"] = "OFFLINE";
  AccessPointStatus3["Online"] = "ONLINE";
  AccessPointStatus3["Provisioning"] = "PROVISIONING";
  AccessPointStatus3["Rebooting"] = "REBOOTING";
  return AccessPointStatus3;
})(AccessPointStatus2 || {});
var ActivityTypeEnum2 = /* @__PURE__ */ ((ActivityTypeEnum3) => {
  ActivityTypeEnum3["ContactMade"] = "CONTACT_MADE";
  ActivityTypeEnum3["Created"] = "CREATED";
  ActivityTypeEnum3["Export"] = "EXPORT";
  ActivityTypeEnum3["Import"] = "IMPORT";
  ActivityTypeEnum3["Login"] = "LOGIN";
  ActivityTypeEnum3["NoteAdded"] = "NOTE_ADDED";
  ActivityTypeEnum3["Purchase"] = "PURCHASE";
  ActivityTypeEnum3["StatusChanged"] = "STATUS_CHANGED";
  ActivityTypeEnum3["SupportTicket"] = "SUPPORT_TICKET";
  ActivityTypeEnum3["TagAdded"] = "TAG_ADDED";
  ActivityTypeEnum3["TagRemoved"] = "TAG_REMOVED";
  ActivityTypeEnum3["Updated"] = "UPDATED";
  return ActivityTypeEnum3;
})(ActivityTypeEnum2 || {});
var AlertSeverityEnum2 = /* @__PURE__ */ ((AlertSeverityEnum3) => {
  AlertSeverityEnum3["Critical"] = "CRITICAL";
  AlertSeverityEnum3["Info"] = "INFO";
  AlertSeverityEnum3["Warning"] = "WARNING";
  return AlertSeverityEnum3;
})(AlertSeverityEnum2 || {});
var BillingCycleEnum2 = /* @__PURE__ */ ((BillingCycleEnum3) => {
  BillingCycleEnum3["Annual"] = "ANNUAL";
  BillingCycleEnum3["Custom"] = "CUSTOM";
  BillingCycleEnum3["Monthly"] = "MONTHLY";
  BillingCycleEnum3["Quarterly"] = "QUARTERLY";
  BillingCycleEnum3["Yearly"] = "YEARLY";
  return BillingCycleEnum3;
})(BillingCycleEnum2 || {});
var CableInstallationType2 = /* @__PURE__ */ ((CableInstallationType3) => {
  CableInstallationType3["Aerial"] = "AERIAL";
  CableInstallationType3["Building"] = "BUILDING";
  CableInstallationType3["Buried"] = "BURIED";
  CableInstallationType3["Duct"] = "DUCT";
  CableInstallationType3["Submarine"] = "SUBMARINE";
  CableInstallationType3["Underground"] = "UNDERGROUND";
  return CableInstallationType3;
})(CableInstallationType2 || {});
var ClientConnectionType2 = /* @__PURE__ */ ((ClientConnectionType3) => {
  ClientConnectionType3["Wifi_2_4"] = "WIFI_2_4";
  ClientConnectionType3["Wifi_5"] = "WIFI_5";
  ClientConnectionType3["Wifi_6"] = "WIFI_6";
  ClientConnectionType3["Wifi_6E"] = "WIFI_6E";
  return ClientConnectionType3;
})(ClientConnectionType2 || {});
var CustomerStatusEnum2 = /* @__PURE__ */ ((CustomerStatusEnum3) => {
  CustomerStatusEnum3["Active"] = "ACTIVE";
  CustomerStatusEnum3["Archived"] = "ARCHIVED";
  CustomerStatusEnum3["Churned"] = "CHURNED";
  CustomerStatusEnum3["Inactive"] = "INACTIVE";
  CustomerStatusEnum3["Prospect"] = "PROSPECT";
  CustomerStatusEnum3["Suspended"] = "SUSPENDED";
  return CustomerStatusEnum3;
})(CustomerStatusEnum2 || {});
var CustomerTierEnum2 = /* @__PURE__ */ ((CustomerTierEnum3) => {
  CustomerTierEnum3["Basic"] = "BASIC";
  CustomerTierEnum3["Enterprise"] = "ENTERPRISE";
  CustomerTierEnum3["Free"] = "FREE";
  CustomerTierEnum3["Premium"] = "PREMIUM";
  CustomerTierEnum3["Standard"] = "STANDARD";
  return CustomerTierEnum3;
})(CustomerTierEnum2 || {});
var CustomerTypeEnum2 = /* @__PURE__ */ ((CustomerTypeEnum3) => {
  CustomerTypeEnum3["Business"] = "BUSINESS";
  CustomerTypeEnum3["Enterprise"] = "ENTERPRISE";
  CustomerTypeEnum3["Individual"] = "INDIVIDUAL";
  CustomerTypeEnum3["Partner"] = "PARTNER";
  CustomerTypeEnum3["Vendor"] = "VENDOR";
  return CustomerTypeEnum3;
})(CustomerTypeEnum2 || {});
var DeviceStatusEnum2 = /* @__PURE__ */ ((DeviceStatusEnum3) => {
  DeviceStatusEnum3["Degraded"] = "DEGRADED";
  DeviceStatusEnum3["Offline"] = "OFFLINE";
  DeviceStatusEnum3["Online"] = "ONLINE";
  DeviceStatusEnum3["Unknown"] = "UNKNOWN";
  return DeviceStatusEnum3;
})(DeviceStatusEnum2 || {});
var DeviceTypeEnum2 = /* @__PURE__ */ ((DeviceTypeEnum3) => {
  DeviceTypeEnum3["Cpe"] = "CPE";
  DeviceTypeEnum3["Firewall"] = "FIREWALL";
  DeviceTypeEnum3["Olt"] = "OLT";
  DeviceTypeEnum3["Onu"] = "ONU";
  DeviceTypeEnum3["Other"] = "OTHER";
  DeviceTypeEnum3["Router"] = "ROUTER";
  DeviceTypeEnum3["Switch"] = "SWITCH";
  return DeviceTypeEnum3;
})(DeviceTypeEnum2 || {});
var DistributionPointType2 = /* @__PURE__ */ ((DistributionPointType3) => {
  DistributionPointType3["BuildingEntry"] = "BUILDING_ENTRY";
  DistributionPointType3["Cabinet"] = "CABINET";
  DistributionPointType3["Closure"] = "CLOSURE";
  DistributionPointType3["Handhole"] = "HANDHOLE";
  DistributionPointType3["Manhole"] = "MANHOLE";
  DistributionPointType3["Pedestal"] = "PEDESTAL";
  DistributionPointType3["Pole"] = "POLE";
  return DistributionPointType3;
})(DistributionPointType2 || {});
var FiberCableStatus2 = /* @__PURE__ */ ((FiberCableStatus3) => {
  FiberCableStatus3["Active"] = "ACTIVE";
  FiberCableStatus3["Damaged"] = "DAMAGED";
  FiberCableStatus3["Decommissioned"] = "DECOMMISSIONED";
  FiberCableStatus3["Inactive"] = "INACTIVE";
  FiberCableStatus3["Maintenance"] = "MAINTENANCE";
  FiberCableStatus3["UnderConstruction"] = "UNDER_CONSTRUCTION";
  return FiberCableStatus3;
})(FiberCableStatus2 || {});
var FiberHealthStatus2 = /* @__PURE__ */ ((FiberHealthStatus3) => {
  FiberHealthStatus3["Critical"] = "CRITICAL";
  FiberHealthStatus3["Excellent"] = "EXCELLENT";
  FiberHealthStatus3["Fair"] = "FAIR";
  FiberHealthStatus3["Good"] = "GOOD";
  FiberHealthStatus3["Poor"] = "POOR";
  return FiberHealthStatus3;
})(FiberHealthStatus2 || {});
var FiberType2 = /* @__PURE__ */ ((FiberType3) => {
  FiberType3["Hybrid"] = "HYBRID";
  FiberType3["MultiMode"] = "MULTI_MODE";
  FiberType3["SingleMode"] = "SINGLE_MODE";
  return FiberType3;
})(FiberType2 || {});
var FrequencyBand2 = /* @__PURE__ */ ((FrequencyBand3) => {
  FrequencyBand3["Band_2_4Ghz"] = "BAND_2_4_GHZ";
  FrequencyBand3["Band_5Ghz"] = "BAND_5_GHZ";
  FrequencyBand3["Band_6Ghz"] = "BAND_6_GHZ";
  return FrequencyBand3;
})(FrequencyBand2 || {});
var PaymentMethodTypeEnum2 = /* @__PURE__ */ ((PaymentMethodTypeEnum3) => {
  PaymentMethodTypeEnum3["Ach"] = "ACH";
  PaymentMethodTypeEnum3["BankAccount"] = "BANK_ACCOUNT";
  PaymentMethodTypeEnum3["Card"] = "CARD";
  PaymentMethodTypeEnum3["Cash"] = "CASH";
  PaymentMethodTypeEnum3["Check"] = "CHECK";
  PaymentMethodTypeEnum3["Crypto"] = "CRYPTO";
  PaymentMethodTypeEnum3["DigitalWallet"] = "DIGITAL_WALLET";
  PaymentMethodTypeEnum3["Other"] = "OTHER";
  PaymentMethodTypeEnum3["WireTransfer"] = "WIRE_TRANSFER";
  return PaymentMethodTypeEnum3;
})(PaymentMethodTypeEnum2 || {});
var PaymentStatusEnum2 = /* @__PURE__ */ ((PaymentStatusEnum3) => {
  PaymentStatusEnum3["Cancelled"] = "CANCELLED";
  PaymentStatusEnum3["Failed"] = "FAILED";
  PaymentStatusEnum3["Pending"] = "PENDING";
  PaymentStatusEnum3["Processing"] = "PROCESSING";
  PaymentStatusEnum3["Refunded"] = "REFUNDED";
  PaymentStatusEnum3["RequiresAction"] = "REQUIRES_ACTION";
  PaymentStatusEnum3["RequiresCapture"] = "REQUIRES_CAPTURE";
  PaymentStatusEnum3["RequiresConfirmation"] = "REQUIRES_CONFIRMATION";
  PaymentStatusEnum3["Succeeded"] = "SUCCEEDED";
  return PaymentStatusEnum3;
})(PaymentStatusEnum2 || {});
var PermissionCategoryEnum2 = /* @__PURE__ */ ((PermissionCategoryEnum3) => {
  PermissionCategoryEnum3["Admin"] = "ADMIN";
  PermissionCategoryEnum3["Analytics"] = "ANALYTICS";
  PermissionCategoryEnum3["Automation"] = "AUTOMATION";
  PermissionCategoryEnum3["Billing"] = "BILLING";
  PermissionCategoryEnum3["Communication"] = "COMMUNICATION";
  PermissionCategoryEnum3["Cpe"] = "CPE";
  PermissionCategoryEnum3["Customer"] = "CUSTOMER";
  PermissionCategoryEnum3["Ipam"] = "IPAM";
  PermissionCategoryEnum3["Network"] = "NETWORK";
  PermissionCategoryEnum3["Security"] = "SECURITY";
  PermissionCategoryEnum3["Ticket"] = "TICKET";
  PermissionCategoryEnum3["User"] = "USER";
  PermissionCategoryEnum3["Workflow"] = "WORKFLOW";
  return PermissionCategoryEnum3;
})(PermissionCategoryEnum2 || {});
var ProductTypeEnum2 = /* @__PURE__ */ ((ProductTypeEnum3) => {
  ProductTypeEnum3["Hybrid"] = "HYBRID";
  ProductTypeEnum3["OneTime"] = "ONE_TIME";
  ProductTypeEnum3["Subscription"] = "SUBSCRIPTION";
  ProductTypeEnum3["UsageBased"] = "USAGE_BASED";
  return ProductTypeEnum3;
})(ProductTypeEnum2 || {});
var ServiceAreaType2 = /* @__PURE__ */ ((ServiceAreaType3) => {
  ServiceAreaType3["Commercial"] = "COMMERCIAL";
  ServiceAreaType3["Industrial"] = "INDUSTRIAL";
  ServiceAreaType3["Mixed"] = "MIXED";
  ServiceAreaType3["Residential"] = "RESIDENTIAL";
  return ServiceAreaType3;
})(ServiceAreaType2 || {});
var SpliceStatus2 = /* @__PURE__ */ ((SpliceStatus3) => {
  SpliceStatus3["Active"] = "ACTIVE";
  SpliceStatus3["Degraded"] = "DEGRADED";
  SpliceStatus3["Failed"] = "FAILED";
  SpliceStatus3["Inactive"] = "INACTIVE";
  return SpliceStatus3;
})(SpliceStatus2 || {});
var SpliceType2 = /* @__PURE__ */ ((SpliceType3) => {
  SpliceType3["Fusion"] = "FUSION";
  SpliceType3["Mechanical"] = "MECHANICAL";
  return SpliceType3;
})(SpliceType2 || {});
var SubscriptionStatusEnum2 = /* @__PURE__ */ ((SubscriptionStatusEnum3) => {
  SubscriptionStatusEnum3["Active"] = "ACTIVE";
  SubscriptionStatusEnum3["Canceled"] = "CANCELED";
  SubscriptionStatusEnum3["Ended"] = "ENDED";
  SubscriptionStatusEnum3["Incomplete"] = "INCOMPLETE";
  SubscriptionStatusEnum3["PastDue"] = "PAST_DUE";
  SubscriptionStatusEnum3["Paused"] = "PAUSED";
  SubscriptionStatusEnum3["Trialing"] = "TRIALING";
  return SubscriptionStatusEnum3;
})(SubscriptionStatusEnum2 || {});
var TenantPlanTypeEnum2 = /* @__PURE__ */ ((TenantPlanTypeEnum3) => {
  TenantPlanTypeEnum3["Custom"] = "CUSTOM";
  TenantPlanTypeEnum3["Enterprise"] = "ENTERPRISE";
  TenantPlanTypeEnum3["Free"] = "FREE";
  TenantPlanTypeEnum3["Professional"] = "PROFESSIONAL";
  TenantPlanTypeEnum3["Starter"] = "STARTER";
  return TenantPlanTypeEnum3;
})(TenantPlanTypeEnum2 || {});
var TenantStatusEnum2 = /* @__PURE__ */ ((TenantStatusEnum3) => {
  TenantStatusEnum3["Active"] = "ACTIVE";
  TenantStatusEnum3["Cancelled"] = "CANCELLED";
  TenantStatusEnum3["Inactive"] = "INACTIVE";
  TenantStatusEnum3["Pending"] = "PENDING";
  TenantStatusEnum3["Suspended"] = "SUSPENDED";
  TenantStatusEnum3["Trial"] = "TRIAL";
  return TenantStatusEnum3;
})(TenantStatusEnum2 || {});
var UserStatusEnum2 = /* @__PURE__ */ ((UserStatusEnum3) => {
  UserStatusEnum3["Active"] = "ACTIVE";
  UserStatusEnum3["Invited"] = "INVITED";
  UserStatusEnum3["Suspended"] = "SUSPENDED";
  return UserStatusEnum3;
})(UserStatusEnum2 || {});
var WirelessSecurityType2 = /* @__PURE__ */ ((WirelessSecurityType3) => {
  WirelessSecurityType3["Open"] = "OPEN";
  WirelessSecurityType3["Wep"] = "WEP";
  WirelessSecurityType3["Wpa"] = "WPA";
  WirelessSecurityType3["Wpa2"] = "WPA2";
  WirelessSecurityType3["Wpa2Wpa3"] = "WPA2_WPA3";
  WirelessSecurityType3["Wpa3"] = "WPA3";
  return WirelessSecurityType3;
})(WirelessSecurityType2 || {});
var WorkflowStatus2 = /* @__PURE__ */ ((WorkflowStatus3) => {
  WorkflowStatus3["Compensated"] = "COMPENSATED";
  WorkflowStatus3["Completed"] = "COMPLETED";
  WorkflowStatus3["Failed"] = "FAILED";
  WorkflowStatus3["Pending"] = "PENDING";
  WorkflowStatus3["RolledBack"] = "ROLLED_BACK";
  WorkflowStatus3["RollingBack"] = "ROLLING_BACK";
  WorkflowStatus3["Running"] = "RUNNING";
  return WorkflowStatus3;
})(WorkflowStatus2 || {});
var WorkflowStepStatus2 = /* @__PURE__ */ ((WorkflowStepStatus3) => {
  WorkflowStepStatus3["Compensated"] = "COMPENSATED";
  WorkflowStepStatus3["Compensating"] = "COMPENSATING";
  WorkflowStepStatus3["CompensationFailed"] = "COMPENSATION_FAILED";
  WorkflowStepStatus3["Completed"] = "COMPLETED";
  WorkflowStepStatus3["Failed"] = "FAILED";
  WorkflowStepStatus3["Pending"] = "PENDING";
  WorkflowStepStatus3["Running"] = "RUNNING";
  WorkflowStepStatus3["Skipped"] = "SKIPPED";
  return WorkflowStepStatus3;
})(WorkflowStepStatus2 || {});
var WorkflowType2 = /* @__PURE__ */ ((WorkflowType3) => {
  WorkflowType3["ActivateService"] = "ACTIVATE_SERVICE";
  WorkflowType3["ChangeServicePlan"] = "CHANGE_SERVICE_PLAN";
  WorkflowType3["DeprovisionSubscriber"] = "DEPROVISION_SUBSCRIBER";
  WorkflowType3["MigrateSubscriber"] = "MIGRATE_SUBSCRIBER";
  WorkflowType3["ProvisionSubscriber"] = "PROVISION_SUBSCRIBER";
  WorkflowType3["SuspendService"] = "SUSPEND_SERVICE";
  WorkflowType3["TerminateService"] = "TERMINATE_SERVICE";
  WorkflowType3["UpdateNetworkConfig"] = "UPDATE_NETWORK_CONFIG";
  return WorkflowType3;
})(WorkflowType2 || {});
var CustomerListDocument2 = `
    query CustomerList($limit: Int = 50, $offset: Int = 0, $status: CustomerStatusEnum, $search: String, $includeActivities: Boolean = false, $includeNotes: Boolean = false) {
  customers(
    limit: $limit
    offset: $offset
    status: $status
    search: $search
    includeActivities: $includeActivities
    includeNotes: $includeNotes
  ) {
    customers {
      id
      customerNumber
      firstName
      lastName
      middleName
      displayName
      companyName
      status
      customerType
      tier
      email
      emailVerified
      phone
      phoneVerified
      mobile
      addressLine1
      addressLine2
      city
      stateProvince
      postalCode
      country
      taxId
      industry
      employeeCount
      lifetimeValue
      totalPurchases
      averageOrderValue
      lastPurchaseDate
      createdAt
      updatedAt
      acquisitionDate
      lastContactDate
      activities @include(if: $includeActivities) {
        id
        customerId
        activityType
        title
        description
        performedBy
        createdAt
      }
      notes @include(if: $includeNotes) {
        id
        customerId
        subject
        content
        isInternal
        createdById
        createdAt
        updatedAt
      }
    }
    totalCount
    hasNextPage
  }
}
    `;
var useCustomerListQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["CustomerList"] : ["CustomerList", variables],
    queryFn: graphqlFetcher(
      CustomerListDocument2,
      variables
    ),
    ...options
  });
};
useCustomerListQuery.getKey = (variables) => variables === void 0 ? ["CustomerList"] : ["CustomerList", variables];
var useInfiniteCustomerListQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["CustomerList.infinite"] : ["CustomerList.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          CustomerListDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteCustomerListQuery.getKey = (variables) => variables === void 0 ? ["CustomerList.infinite"] : ["CustomerList.infinite", variables];
useCustomerListQuery.fetcher = (variables, options) => graphqlFetcher(
  CustomerListDocument2,
  variables,
  options
);
var CustomerDetailDocument2 = `
    query CustomerDetail($id: ID!) {
  customer(id: $id, includeActivities: true, includeNotes: true) {
    id
    customerNumber
    firstName
    lastName
    middleName
    displayName
    companyName
    status
    customerType
    tier
    email
    emailVerified
    phone
    phoneVerified
    mobile
    addressLine1
    addressLine2
    city
    stateProvince
    postalCode
    country
    taxId
    industry
    employeeCount
    lifetimeValue
    totalPurchases
    averageOrderValue
    lastPurchaseDate
    createdAt
    updatedAt
    acquisitionDate
    lastContactDate
    activities {
      id
      customerId
      activityType
      title
      description
      performedBy
      createdAt
    }
    notes {
      id
      customerId
      subject
      content
      isInternal
      createdById
      createdAt
      updatedAt
    }
  }
}
    `;
var useCustomerDetailQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["CustomerDetail", variables],
    queryFn: graphqlFetcher(
      CustomerDetailDocument2,
      variables
    ),
    ...options
  });
};
useCustomerDetailQuery.getKey = (variables) => [
  "CustomerDetail",
  variables
];
var useInfiniteCustomerDetailQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["CustomerDetail.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          CustomerDetailDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteCustomerDetailQuery.getKey = (variables) => [
  "CustomerDetail.infinite",
  variables
];
useCustomerDetailQuery.fetcher = (variables, options) => graphqlFetcher(
  CustomerDetailDocument2,
  variables,
  options
);
var CustomerMetricsDocument2 = `
    query CustomerMetrics {
  customerMetrics {
    totalCustomers
    activeCustomers
    newCustomers
    churnedCustomers
    totalCustomerValue
    averageCustomerValue
  }
}
    `;
var useCustomerMetricsQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["CustomerMetrics"] : ["CustomerMetrics", variables],
    queryFn: graphqlFetcher(
      CustomerMetricsDocument2,
      variables
    ),
    ...options
  });
};
useCustomerMetricsQuery.getKey = (variables) => variables === void 0 ? ["CustomerMetrics"] : ["CustomerMetrics", variables];
var useInfiniteCustomerMetricsQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["CustomerMetrics.infinite"] : ["CustomerMetrics.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          CustomerMetricsDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteCustomerMetricsQuery.getKey = (variables) => variables === void 0 ? ["CustomerMetrics.infinite"] : ["CustomerMetrics.infinite", variables];
useCustomerMetricsQuery.fetcher = (variables, options) => graphqlFetcher(
  CustomerMetricsDocument2,
  variables,
  options
);
var CustomerActivitiesDocument2 = `
    query CustomerActivities($id: ID!) {
  customer(id: $id, includeActivities: true, includeNotes: false) {
    id
    activities {
      id
      customerId
      activityType
      title
      description
      performedBy
      createdAt
    }
  }
}
    `;
var useCustomerActivitiesQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["CustomerActivities", variables],
    queryFn: graphqlFetcher(
      CustomerActivitiesDocument2,
      variables
    ),
    ...options
  });
};
useCustomerActivitiesQuery.getKey = (variables) => [
  "CustomerActivities",
  variables
];
var useInfiniteCustomerActivitiesQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["CustomerActivities.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          CustomerActivitiesDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteCustomerActivitiesQuery.getKey = (variables) => [
  "CustomerActivities.infinite",
  variables
];
useCustomerActivitiesQuery.fetcher = (variables, options) => graphqlFetcher(
  CustomerActivitiesDocument2,
  variables,
  options
);
var CustomerNotesDocument2 = `
    query CustomerNotes($id: ID!) {
  customer(id: $id, includeActivities: false, includeNotes: true) {
    id
    notes {
      id
      customerId
      subject
      content
      isInternal
      createdById
      createdAt
      updatedAt
    }
  }
}
    `;
var useCustomerNotesQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["CustomerNotes", variables],
    queryFn: graphqlFetcher(
      CustomerNotesDocument2,
      variables
    ),
    ...options
  });
};
useCustomerNotesQuery.getKey = (variables) => [
  "CustomerNotes",
  variables
];
var useInfiniteCustomerNotesQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["CustomerNotes.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          CustomerNotesDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteCustomerNotesQuery.getKey = (variables) => [
  "CustomerNotes.infinite",
  variables
];
useCustomerNotesQuery.fetcher = (variables, options) => graphqlFetcher(
  CustomerNotesDocument2,
  variables,
  options
);
var CustomerDashboardDocument2 = `
    query CustomerDashboard($limit: Int = 20, $offset: Int = 0, $status: CustomerStatusEnum, $search: String) {
  customers(
    limit: $limit
    offset: $offset
    status: $status
    search: $search
    includeActivities: false
    includeNotes: false
  ) {
    customers {
      id
      customerNumber
      firstName
      lastName
      companyName
      email
      phone
      status
      customerType
      tier
      lifetimeValue
      totalPurchases
      lastContactDate
      createdAt
    }
    totalCount
    hasNextPage
  }
  customerMetrics {
    totalCustomers
    activeCustomers
    newCustomers
    churnedCustomers
    totalCustomerValue
    averageCustomerValue
  }
}
    `;
var useCustomerDashboardQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["CustomerDashboard"] : ["CustomerDashboard", variables],
    queryFn: graphqlFetcher(
      CustomerDashboardDocument2,
      variables
    ),
    ...options
  });
};
useCustomerDashboardQuery.getKey = (variables) => variables === void 0 ? ["CustomerDashboard"] : ["CustomerDashboard", variables];
var useInfiniteCustomerDashboardQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["CustomerDashboard.infinite"] : ["CustomerDashboard.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          CustomerDashboardDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteCustomerDashboardQuery.getKey = (variables) => variables === void 0 ? ["CustomerDashboard.infinite"] : ["CustomerDashboard.infinite", variables];
useCustomerDashboardQuery.fetcher = (variables, options) => graphqlFetcher(
  CustomerDashboardDocument2,
  variables,
  options
);
var CustomerSubscriptionsDocument2 = `
    query CustomerSubscriptions($customerId: ID!, $status: String, $limit: Int = 50) {
  customerSubscriptions(customerId: $customerId, status: $status, limit: $limit) {
    id
    subscriptionId
    customerId
    planId
    tenantId
    currentPeriodStart
    currentPeriodEnd
    status
    trialEnd
    isInTrial
    cancelAtPeriodEnd
    canceledAt
    endedAt
    createdAt
    updatedAt
  }
}
    `;
var useCustomerSubscriptionsQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["CustomerSubscriptions", variables],
    queryFn: graphqlFetcher(
      CustomerSubscriptionsDocument2,
      variables
    ),
    ...options
  });
};
useCustomerSubscriptionsQuery.getKey = (variables) => [
  "CustomerSubscriptions",
  variables
];
var useInfiniteCustomerSubscriptionsQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["CustomerSubscriptions.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          CustomerSubscriptionsDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteCustomerSubscriptionsQuery.getKey = (variables) => [
  "CustomerSubscriptions.infinite",
  variables
];
useCustomerSubscriptionsQuery.fetcher = (variables, options) => graphqlFetcher(
  CustomerSubscriptionsDocument2,
  variables,
  options
);
var CustomerNetworkInfoDocument2 = `
    query CustomerNetworkInfo($customerId: ID!) {
  customerNetworkInfo(customerId: $customerId)
}
    `;
var useCustomerNetworkInfoQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["CustomerNetworkInfo", variables],
    queryFn: graphqlFetcher(
      CustomerNetworkInfoDocument2,
      variables
    ),
    ...options
  });
};
useCustomerNetworkInfoQuery.getKey = (variables) => [
  "CustomerNetworkInfo",
  variables
];
var useInfiniteCustomerNetworkInfoQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["CustomerNetworkInfo.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          CustomerNetworkInfoDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteCustomerNetworkInfoQuery.getKey = (variables) => [
  "CustomerNetworkInfo.infinite",
  variables
];
useCustomerNetworkInfoQuery.fetcher = (variables, options) => graphqlFetcher(
  CustomerNetworkInfoDocument2,
  variables,
  options
);
var CustomerDevicesDocument2 = `
    query CustomerDevices($customerId: ID!, $deviceType: String, $activeOnly: Boolean = true) {
  customerDevices(
    customerId: $customerId
    deviceType: $deviceType
    activeOnly: $activeOnly
  )
}
    `;
var useCustomerDevicesQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["CustomerDevices", variables],
    queryFn: graphqlFetcher(
      CustomerDevicesDocument2,
      variables
    ),
    ...options
  });
};
useCustomerDevicesQuery.getKey = (variables) => [
  "CustomerDevices",
  variables
];
var useInfiniteCustomerDevicesQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["CustomerDevices.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          CustomerDevicesDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteCustomerDevicesQuery.getKey = (variables) => [
  "CustomerDevices.infinite",
  variables
];
useCustomerDevicesQuery.fetcher = (variables, options) => graphqlFetcher(
  CustomerDevicesDocument2,
  variables,
  options
);
var CustomerTicketsDocument2 = `
    query CustomerTickets($customerId: ID!, $limit: Int = 50, $status: String) {
  customerTickets(customerId: $customerId, limit: $limit, status: $status)
}
    `;
var useCustomerTicketsQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["CustomerTickets", variables],
    queryFn: graphqlFetcher(
      CustomerTicketsDocument2,
      variables
    ),
    ...options
  });
};
useCustomerTicketsQuery.getKey = (variables) => [
  "CustomerTickets",
  variables
];
var useInfiniteCustomerTicketsQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["CustomerTickets.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          CustomerTicketsDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteCustomerTicketsQuery.getKey = (variables) => [
  "CustomerTickets.infinite",
  variables
];
useCustomerTicketsQuery.fetcher = (variables, options) => graphqlFetcher(
  CustomerTicketsDocument2,
  variables,
  options
);
var CustomerBillingDocument2 = `
    query CustomerBilling($customerId: ID!, $includeInvoices: Boolean = true, $invoiceLimit: Int = 50) {
  customerBilling(
    customerId: $customerId
    includeInvoices: $includeInvoices
    invoiceLimit: $invoiceLimit
  )
}
    `;
var useCustomerBillingQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["CustomerBilling", variables],
    queryFn: graphqlFetcher(
      CustomerBillingDocument2,
      variables
    ),
    ...options
  });
};
useCustomerBillingQuery.getKey = (variables) => [
  "CustomerBilling",
  variables
];
var useInfiniteCustomerBillingQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["CustomerBilling.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          CustomerBillingDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteCustomerBillingQuery.getKey = (variables) => [
  "CustomerBilling.infinite",
  variables
];
useCustomerBillingQuery.fetcher = (variables, options) => graphqlFetcher(
  CustomerBillingDocument2,
  variables,
  options
);
var Customer360ViewDocument2 = `
    query Customer360View($customerId: ID!) {
  customer(id: $customerId, includeActivities: true, includeNotes: true) {
    id
    customerNumber
    firstName
    lastName
    middleName
    displayName
    companyName
    status
    customerType
    tier
    email
    emailVerified
    phone
    phoneVerified
    mobile
    addressLine1
    addressLine2
    city
    stateProvince
    postalCode
    country
    taxId
    industry
    employeeCount
    lifetimeValue
    totalPurchases
    averageOrderValue
    lastPurchaseDate
    createdAt
    updatedAt
    acquisitionDate
    lastContactDate
    activities {
      id
      customerId
      activityType
      title
      description
      performedBy
      createdAt
    }
    notes {
      id
      customerId
      subject
      content
      isInternal
      createdById
      createdAt
      updatedAt
    }
  }
  customerSubscriptions(customerId: $customerId, limit: 10) {
    id
    subscriptionId
    customerId
    planId
    status
    currentPeriodStart
    currentPeriodEnd
    isInTrial
    cancelAtPeriodEnd
    createdAt
  }
  customerNetworkInfo(customerId: $customerId)
  customerDevices(customerId: $customerId, activeOnly: true)
  customerTickets(customerId: $customerId, limit: 10)
  customerBilling(
    customerId: $customerId
    includeInvoices: true
    invoiceLimit: 10
  )
}
    `;
var useCustomer360ViewQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["Customer360View", variables],
    queryFn: graphqlFetcher(
      Customer360ViewDocument2,
      variables
    ),
    ...options
  });
};
useCustomer360ViewQuery.getKey = (variables) => [
  "Customer360View",
  variables
];
var useInfiniteCustomer360ViewQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["Customer360View.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          Customer360ViewDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteCustomer360ViewQuery.getKey = (variables) => [
  "Customer360View.infinite",
  variables
];
useCustomer360ViewQuery.fetcher = (variables, options) => graphqlFetcher(
  Customer360ViewDocument2,
  variables,
  options
);
var CustomerNetworkStatusUpdatedDocument2 = `
    subscription CustomerNetworkStatusUpdated($customerId: ID!) {
  customerNetworkStatusUpdated(customerId: $customerId) {
    customerId
    connectionStatus
    lastSeenAt
    ipv4Address
    ipv6Address
    macAddress
    vlanId
    signalStrength
    signalQuality
    uptimeSeconds
    uptimePercentage
    bandwidthUsageMbps
    downloadSpeedMbps
    uploadSpeedMbps
    packetLoss
    latencyMs
    jitter
    ontRxPower
    ontTxPower
    oltRxPower
    serviceStatus
    updatedAt
  }
}
    `;
var CustomerDevicesUpdatedDocument2 = `
    subscription CustomerDevicesUpdated($customerId: ID!) {
  customerDevicesUpdated(customerId: $customerId) {
    customerId
    deviceId
    deviceType
    deviceName
    status
    healthStatus
    isOnline
    lastSeenAt
    signalStrength
    temperature
    cpuUsage
    memoryUsage
    uptimeSeconds
    firmwareVersion
    needsFirmwareUpdate
    changeType
    previousValue
    newValue
    updatedAt
  }
}
    `;
var CustomerTicketUpdatedDocument2 = `
    subscription CustomerTicketUpdated($customerId: ID!) {
  customerTicketUpdated(customerId: $customerId) {
    customerId
    action
    ticket {
      id
      ticketNumber
      title
      description
      status
      priority
      category
      subCategory
      assignedTo
      assignedToName
      assignedTeam
      createdAt
      updatedAt
      resolvedAt
      closedAt
      customerId
      customerName
    }
    changedBy
    changedByName
    changes
    comment
    updatedAt
  }
}
    `;
var CustomerActivityAddedDocument2 = `
    subscription CustomerActivityAdded($customerId: ID!) {
  customerActivityAdded(customerId: $customerId) {
    id
    customerId
    activityType
    title
    description
    performedBy
    performedByName
    createdAt
  }
}
    `;
var CustomerNoteUpdatedDocument2 = `
    subscription CustomerNoteUpdated($customerId: ID!) {
  customerNoteUpdated(customerId: $customerId) {
    customerId
    action
    note {
      id
      customerId
      subject
      content
      isInternal
      createdById
      createdByName
      createdAt
      updatedAt
    }
    changedBy
    changedByName
    updatedAt
  }
}
    `;
var FiberCableListDocument2 = `
    query FiberCableList($limit: Int = 50, $offset: Int = 0, $status: FiberCableStatus, $fiberType: FiberType, $installationType: CableInstallationType, $siteId: String, $search: String) {
  fiberCables(
    limit: $limit
    offset: $offset
    status: $status
    fiberType: $fiberType
    installationType: $installationType
    siteId: $siteId
    search: $search
  ) {
    cables {
      id
      cableId
      name
      description
      status
      isActive
      fiberType
      totalStrands
      availableStrands
      usedStrands
      manufacturer
      model
      installationType
      route {
        totalDistanceMeters
        startPoint {
          latitude
          longitude
          altitude
        }
        endPoint {
          latitude
          longitude
          altitude
        }
      }
      lengthMeters
      startDistributionPointId
      endDistributionPointId
      startPointName
      endPointName
      capacityUtilizationPercent
      bandwidthCapacityGbps
      spliceCount
      totalLossDb
      averageAttenuationDbPerKm
      maxAttenuationDbPerKm
      isLeased
      installedAt
      createdAt
      updatedAt
    }
    totalCount
    hasNextPage
  }
}
    `;
var useFiberCableListQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["FiberCableList"] : ["FiberCableList", variables],
    queryFn: graphqlFetcher(
      FiberCableListDocument2,
      variables
    ),
    ...options
  });
};
useFiberCableListQuery.getKey = (variables) => variables === void 0 ? ["FiberCableList"] : ["FiberCableList", variables];
var useInfiniteFiberCableListQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["FiberCableList.infinite"] : ["FiberCableList.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          FiberCableListDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteFiberCableListQuery.getKey = (variables) => variables === void 0 ? ["FiberCableList.infinite"] : ["FiberCableList.infinite", variables];
useFiberCableListQuery.fetcher = (variables, options) => graphqlFetcher(
  FiberCableListDocument2,
  variables,
  options
);
var FiberCableDetailDocument2 = `
    query FiberCableDetail($id: ID!) {
  fiberCable(id: $id) {
    id
    cableId
    name
    description
    status
    isActive
    fiberType
    totalStrands
    availableStrands
    usedStrands
    manufacturer
    model
    installationType
    route {
      pathGeojson
      totalDistanceMeters
      startPoint {
        latitude
        longitude
        altitude
      }
      endPoint {
        latitude
        longitude
        altitude
      }
      intermediatePoints {
        latitude
        longitude
        altitude
      }
      elevationChangeMeters
      undergroundDistanceMeters
      aerialDistanceMeters
    }
    lengthMeters
    strands {
      strandId
      colorCode
      isActive
      isAvailable
      customerId
      customerName
      serviceId
      attenuationDb
      lossDb
      spliceCount
    }
    startDistributionPointId
    endDistributionPointId
    startPointName
    endPointName
    capacityUtilizationPercent
    bandwidthCapacityGbps
    splicePointIds
    spliceCount
    totalLossDb
    averageAttenuationDbPerKm
    maxAttenuationDbPerKm
    conduitId
    ductNumber
    armored
    fireRated
    ownerId
    ownerName
    isLeased
    installedAt
    testedAt
    createdAt
    updatedAt
  }
}
    `;
var useFiberCableDetailQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["FiberCableDetail", variables],
    queryFn: graphqlFetcher(
      FiberCableDetailDocument2,
      variables
    ),
    ...options
  });
};
useFiberCableDetailQuery.getKey = (variables) => [
  "FiberCableDetail",
  variables
];
var useInfiniteFiberCableDetailQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["FiberCableDetail.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          FiberCableDetailDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteFiberCableDetailQuery.getKey = (variables) => [
  "FiberCableDetail.infinite",
  variables
];
useFiberCableDetailQuery.fetcher = (variables, options) => graphqlFetcher(
  FiberCableDetailDocument2,
  variables,
  options
);
var FiberCablesByRouteDocument2 = `
    query FiberCablesByRoute($startPointId: String!, $endPointId: String!) {
  fiberCablesByRoute(startPointId: $startPointId, endPointId: $endPointId) {
    id
    cableId
    name
    status
    totalStrands
    availableStrands
    lengthMeters
    capacityUtilizationPercent
  }
}
    `;
var useFiberCablesByRouteQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["FiberCablesByRoute", variables],
    queryFn: graphqlFetcher(
      FiberCablesByRouteDocument2,
      variables
    ),
    ...options
  });
};
useFiberCablesByRouteQuery.getKey = (variables) => [
  "FiberCablesByRoute",
  variables
];
var useInfiniteFiberCablesByRouteQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["FiberCablesByRoute.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          FiberCablesByRouteDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteFiberCablesByRouteQuery.getKey = (variables) => [
  "FiberCablesByRoute.infinite",
  variables
];
useFiberCablesByRouteQuery.fetcher = (variables, options) => graphqlFetcher(
  FiberCablesByRouteDocument2,
  variables,
  options
);
var FiberCablesByDistributionPointDocument2 = `
    query FiberCablesByDistributionPoint($distributionPointId: String!) {
  fiberCablesByDistributionPoint(distributionPointId: $distributionPointId) {
    id
    cableId
    name
    status
    totalStrands
    availableStrands
    lengthMeters
  }
}
    `;
var useFiberCablesByDistributionPointQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["FiberCablesByDistributionPoint", variables],
    queryFn: graphqlFetcher(FiberCablesByDistributionPointDocument2, variables),
    ...options
  });
};
useFiberCablesByDistributionPointQuery.getKey = (variables) => ["FiberCablesByDistributionPoint", variables];
var useInfiniteFiberCablesByDistributionPointQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["FiberCablesByDistributionPoint.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(FiberCablesByDistributionPointDocument2, {
          ...variables,
          ...metaData.pageParam ?? {}
        })(),
        ...restOptions
      };
    })()
  );
};
useInfiniteFiberCablesByDistributionPointQuery.getKey = (variables) => ["FiberCablesByDistributionPoint.infinite", variables];
useFiberCablesByDistributionPointQuery.fetcher = (variables, options) => graphqlFetcher(FiberCablesByDistributionPointDocument2, variables, options);
var SplicePointListDocument2 = `
    query SplicePointList($limit: Int = 50, $offset: Int = 0, $status: SpliceStatus, $cableId: String, $distributionPointId: String) {
  splicePoints(
    limit: $limit
    offset: $offset
    status: $status
    cableId: $cableId
    distributionPointId: $distributionPointId
  ) {
    splicePoints {
      id
      spliceId
      name
      description
      status
      isActive
      location {
        latitude
        longitude
        altitude
      }
      closureType
      manufacturer
      model
      trayCount
      trayCapacity
      cablesConnected
      cableCount
      totalSplices
      activeSplices
      averageSpliceLossDb
      maxSpliceLossDb
      passingSplices
      failingSplices
      accessType
      requiresSpecialAccess
      installedAt
      lastTestedAt
      lastMaintainedAt
      createdAt
      updatedAt
    }
    totalCount
    hasNextPage
  }
}
    `;
var useSplicePointListQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["SplicePointList"] : ["SplicePointList", variables],
    queryFn: graphqlFetcher(
      SplicePointListDocument2,
      variables
    ),
    ...options
  });
};
useSplicePointListQuery.getKey = (variables) => variables === void 0 ? ["SplicePointList"] : ["SplicePointList", variables];
var useInfiniteSplicePointListQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["SplicePointList.infinite"] : ["SplicePointList.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          SplicePointListDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteSplicePointListQuery.getKey = (variables) => variables === void 0 ? ["SplicePointList.infinite"] : ["SplicePointList.infinite", variables];
useSplicePointListQuery.fetcher = (variables, options) => graphqlFetcher(
  SplicePointListDocument2,
  variables,
  options
);
var SplicePointDetailDocument2 = `
    query SplicePointDetail($id: ID!) {
  splicePoint(id: $id) {
    id
    spliceId
    name
    description
    status
    isActive
    location {
      latitude
      longitude
      altitude
    }
    address {
      streetAddress
      city
      stateProvince
      postalCode
      country
    }
    distributionPointId
    closureType
    manufacturer
    model
    trayCount
    trayCapacity
    cablesConnected
    cableCount
    spliceConnections {
      cableAId
      cableAStrand
      cableBId
      cableBStrand
      spliceType
      lossDb
      reflectanceDb
      isPassing
      testResult
      testedAt
      testedBy
    }
    totalSplices
    activeSplices
    averageSpliceLossDb
    maxSpliceLossDb
    passingSplices
    failingSplices
    accessType
    requiresSpecialAccess
    accessNotes
    installedAt
    lastTestedAt
    lastMaintainedAt
    createdAt
    updatedAt
  }
}
    `;
var useSplicePointDetailQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["SplicePointDetail", variables],
    queryFn: graphqlFetcher(
      SplicePointDetailDocument2,
      variables
    ),
    ...options
  });
};
useSplicePointDetailQuery.getKey = (variables) => [
  "SplicePointDetail",
  variables
];
var useInfiniteSplicePointDetailQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["SplicePointDetail.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          SplicePointDetailDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteSplicePointDetailQuery.getKey = (variables) => [
  "SplicePointDetail.infinite",
  variables
];
useSplicePointDetailQuery.fetcher = (variables, options) => graphqlFetcher(
  SplicePointDetailDocument2,
  variables,
  options
);
var SplicePointsByCableDocument2 = `
    query SplicePointsByCable($cableId: String!) {
  splicePointsByCable(cableId: $cableId) {
    id
    spliceId
    name
    status
    totalSplices
    activeSplices
    averageSpliceLossDb
    passingSplices
  }
}
    `;
var useSplicePointsByCableQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["SplicePointsByCable", variables],
    queryFn: graphqlFetcher(
      SplicePointsByCableDocument2,
      variables
    ),
    ...options
  });
};
useSplicePointsByCableQuery.getKey = (variables) => [
  "SplicePointsByCable",
  variables
];
var useInfiniteSplicePointsByCableQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["SplicePointsByCable.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          SplicePointsByCableDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteSplicePointsByCableQuery.getKey = (variables) => [
  "SplicePointsByCable.infinite",
  variables
];
useSplicePointsByCableQuery.fetcher = (variables, options) => graphqlFetcher(
  SplicePointsByCableDocument2,
  variables,
  options
);
var DistributionPointListDocument2 = `
    query DistributionPointList($limit: Int = 50, $offset: Int = 0, $pointType: DistributionPointType, $status: FiberCableStatus, $siteId: String, $nearCapacity: Boolean) {
  distributionPoints(
    limit: $limit
    offset: $offset
    pointType: $pointType
    status: $status
    siteId: $siteId
    nearCapacity: $nearCapacity
  ) {
    distributionPoints {
      id
      siteId
      name
      description
      pointType
      status
      isActive
      location {
        latitude
        longitude
        altitude
      }
      manufacturer
      model
      totalCapacity
      availableCapacity
      usedCapacity
      portCount
      incomingCables
      outgoingCables
      totalCablesConnected
      splicePointCount
      hasPower
      batteryBackup
      environmentalMonitoring
      temperatureCelsius
      humidityPercent
      capacityUtilizationPercent
      fiberStrandCount
      availableStrandCount
      servesCustomerCount
      accessType
      requiresKey
      installedAt
      lastInspectedAt
      lastMaintainedAt
      createdAt
      updatedAt
    }
    totalCount
    hasNextPage
  }
}
    `;
var useDistributionPointListQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["DistributionPointList"] : ["DistributionPointList", variables],
    queryFn: graphqlFetcher(
      DistributionPointListDocument2,
      variables
    ),
    ...options
  });
};
useDistributionPointListQuery.getKey = (variables) => variables === void 0 ? ["DistributionPointList"] : ["DistributionPointList", variables];
var useInfiniteDistributionPointListQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["DistributionPointList.infinite"] : ["DistributionPointList.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          DistributionPointListDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteDistributionPointListQuery.getKey = (variables) => variables === void 0 ? ["DistributionPointList.infinite"] : ["DistributionPointList.infinite", variables];
useDistributionPointListQuery.fetcher = (variables, options) => graphqlFetcher(
  DistributionPointListDocument2,
  variables,
  options
);
var DistributionPointDetailDocument2 = `
    query DistributionPointDetail($id: ID!) {
  distributionPoint(id: $id) {
    id
    siteId
    name
    description
    pointType
    status
    isActive
    location {
      latitude
      longitude
      altitude
    }
    address {
      streetAddress
      city
      stateProvince
      postalCode
      country
    }
    siteName
    manufacturer
    model
    totalCapacity
    availableCapacity
    usedCapacity
    ports {
      portNumber
      isAllocated
      isActive
      cableId
      strandId
      customerId
      customerName
      serviceId
    }
    portCount
    incomingCables
    outgoingCables
    totalCablesConnected
    splicePoints
    splicePointCount
    hasPower
    batteryBackup
    environmentalMonitoring
    temperatureCelsius
    humidityPercent
    capacityUtilizationPercent
    fiberStrandCount
    availableStrandCount
    serviceAreaIds
    servesCustomerCount
    accessType
    requiresKey
    securityLevel
    accessNotes
    installedAt
    lastInspectedAt
    lastMaintainedAt
    createdAt
    updatedAt
  }
}
    `;
var useDistributionPointDetailQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["DistributionPointDetail", variables],
    queryFn: graphqlFetcher(DistributionPointDetailDocument2, variables),
    ...options
  });
};
useDistributionPointDetailQuery.getKey = (variables) => [
  "DistributionPointDetail",
  variables
];
var useInfiniteDistributionPointDetailQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["DistributionPointDetail.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          DistributionPointDetailDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteDistributionPointDetailQuery.getKey = (variables) => ["DistributionPointDetail.infinite", variables];
useDistributionPointDetailQuery.fetcher = (variables, options) => graphqlFetcher(
  DistributionPointDetailDocument2,
  variables,
  options
);
var DistributionPointsBySiteDocument2 = `
    query DistributionPointsBySite($siteId: String!) {
  distributionPointsBySite(siteId: $siteId) {
    id
    name
    pointType
    status
    totalCapacity
    availableCapacity
    capacityUtilizationPercent
    totalCablesConnected
    servesCustomerCount
  }
}
    `;
var useDistributionPointsBySiteQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["DistributionPointsBySite", variables],
    queryFn: graphqlFetcher(DistributionPointsBySiteDocument2, variables),
    ...options
  });
};
useDistributionPointsBySiteQuery.getKey = (variables) => [
  "DistributionPointsBySite",
  variables
];
var useInfiniteDistributionPointsBySiteQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["DistributionPointsBySite.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(DistributionPointsBySiteDocument2, { ...variables, ...metaData.pageParam ?? {} })(),
        ...restOptions
      };
    })()
  );
};
useInfiniteDistributionPointsBySiteQuery.getKey = (variables) => ["DistributionPointsBySite.infinite", variables];
useDistributionPointsBySiteQuery.fetcher = (variables, options) => graphqlFetcher(
  DistributionPointsBySiteDocument2,
  variables,
  options
);
var ServiceAreaListDocument2 = `
    query ServiceAreaList($limit: Int = 50, $offset: Int = 0, $areaType: ServiceAreaType, $isServiceable: Boolean, $constructionStatus: String) {
  serviceAreas(
    limit: $limit
    offset: $offset
    areaType: $areaType
    isServiceable: $isServiceable
    constructionStatus: $constructionStatus
  ) {
    serviceAreas {
      id
      areaId
      name
      description
      areaType
      isActive
      isServiceable
      boundaryGeojson
      areaSqkm
      city
      stateProvince
      postalCodes
      streetCount
      homesPassed
      homesConnected
      businessesPassed
      businessesConnected
      penetrationRatePercent
      distributionPointCount
      totalFiberKm
      totalCapacity
      usedCapacity
      availableCapacity
      capacityUtilizationPercent
      maxBandwidthGbps
      estimatedPopulation
      householdDensityPerSqkm
      constructionStatus
      constructionCompletePercent
      targetCompletionDate
      plannedAt
      constructionStartedAt
      activatedAt
      createdAt
      updatedAt
    }
    totalCount
    hasNextPage
  }
}
    `;
var useServiceAreaListQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["ServiceAreaList"] : ["ServiceAreaList", variables],
    queryFn: graphqlFetcher(
      ServiceAreaListDocument2,
      variables
    ),
    ...options
  });
};
useServiceAreaListQuery.getKey = (variables) => variables === void 0 ? ["ServiceAreaList"] : ["ServiceAreaList", variables];
var useInfiniteServiceAreaListQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["ServiceAreaList.infinite"] : ["ServiceAreaList.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          ServiceAreaListDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteServiceAreaListQuery.getKey = (variables) => variables === void 0 ? ["ServiceAreaList.infinite"] : ["ServiceAreaList.infinite", variables];
useServiceAreaListQuery.fetcher = (variables, options) => graphqlFetcher(
  ServiceAreaListDocument2,
  variables,
  options
);
var ServiceAreaDetailDocument2 = `
    query ServiceAreaDetail($id: ID!) {
  serviceArea(id: $id) {
    id
    areaId
    name
    description
    areaType
    isActive
    isServiceable
    boundaryGeojson
    areaSqkm
    city
    stateProvince
    postalCodes
    streetCount
    homesPassed
    homesConnected
    businessesPassed
    businessesConnected
    penetrationRatePercent
    distributionPointIds
    distributionPointCount
    totalFiberKm
    totalCapacity
    usedCapacity
    availableCapacity
    capacityUtilizationPercent
    maxBandwidthGbps
    averageDistanceToDistributionMeters
    estimatedPopulation
    householdDensityPerSqkm
    constructionStatus
    constructionCompletePercent
    targetCompletionDate
    plannedAt
    constructionStartedAt
    activatedAt
    createdAt
    updatedAt
  }
}
    `;
var useServiceAreaDetailQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["ServiceAreaDetail", variables],
    queryFn: graphqlFetcher(
      ServiceAreaDetailDocument2,
      variables
    ),
    ...options
  });
};
useServiceAreaDetailQuery.getKey = (variables) => [
  "ServiceAreaDetail",
  variables
];
var useInfiniteServiceAreaDetailQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["ServiceAreaDetail.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          ServiceAreaDetailDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteServiceAreaDetailQuery.getKey = (variables) => [
  "ServiceAreaDetail.infinite",
  variables
];
useServiceAreaDetailQuery.fetcher = (variables, options) => graphqlFetcher(
  ServiceAreaDetailDocument2,
  variables,
  options
);
var ServiceAreasByPostalCodeDocument2 = `
    query ServiceAreasByPostalCode($postalCode: String!) {
  serviceAreasByPostalCode(postalCode: $postalCode) {
    id
    areaId
    name
    city
    stateProvince
    isServiceable
    homesPassed
    homesConnected
    penetrationRatePercent
    maxBandwidthGbps
  }
}
    `;
var useServiceAreasByPostalCodeQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["ServiceAreasByPostalCode", variables],
    queryFn: graphqlFetcher(ServiceAreasByPostalCodeDocument2, variables),
    ...options
  });
};
useServiceAreasByPostalCodeQuery.getKey = (variables) => [
  "ServiceAreasByPostalCode",
  variables
];
var useInfiniteServiceAreasByPostalCodeQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["ServiceAreasByPostalCode.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(ServiceAreasByPostalCodeDocument2, { ...variables, ...metaData.pageParam ?? {} })(),
        ...restOptions
      };
    })()
  );
};
useInfiniteServiceAreasByPostalCodeQuery.getKey = (variables) => ["ServiceAreasByPostalCode.infinite", variables];
useServiceAreasByPostalCodeQuery.fetcher = (variables, options) => graphqlFetcher(
  ServiceAreasByPostalCodeDocument2,
  variables,
  options
);
var FiberHealthMetricsDocument2 = `
    query FiberHealthMetrics($cableId: String, $healthStatus: FiberHealthStatus) {
  fiberHealthMetrics(cableId: $cableId, healthStatus: $healthStatus) {
    cableId
    cableName
    healthStatus
    healthScore
    totalLossDb
    averageLossPerKmDb
    maxLossPerKmDb
    reflectanceDb
    averageSpliceLossDb
    maxSpliceLossDb
    failingSplicesCount
    totalStrands
    activeStrands
    degradedStrands
    failedStrands
    lastTestedAt
    testPassRatePercent
    daysSinceLastTest
    activeAlarms
    warningCount
    requiresMaintenance
  }
}
    `;
var useFiberHealthMetricsQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["FiberHealthMetrics"] : ["FiberHealthMetrics", variables],
    queryFn: graphqlFetcher(
      FiberHealthMetricsDocument2,
      variables
    ),
    ...options
  });
};
useFiberHealthMetricsQuery.getKey = (variables) => variables === void 0 ? ["FiberHealthMetrics"] : ["FiberHealthMetrics", variables];
var useInfiniteFiberHealthMetricsQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["FiberHealthMetrics.infinite"] : ["FiberHealthMetrics.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          FiberHealthMetricsDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteFiberHealthMetricsQuery.getKey = (variables) => variables === void 0 ? ["FiberHealthMetrics.infinite"] : ["FiberHealthMetrics.infinite", variables];
useFiberHealthMetricsQuery.fetcher = (variables, options) => graphqlFetcher(
  FiberHealthMetricsDocument2,
  variables,
  options
);
var OtdrTestResultsDocument2 = `
    query OTDRTestResults($cableId: String!, $strandId: Int, $limit: Int = 10) {
  otdrTestResults(cableId: $cableId, strandId: $strandId, limit: $limit) {
    testId
    cableId
    strandId
    testedAt
    testedBy
    wavelengthNm
    pulseWidthNs
    totalLossDb
    totalLengthMeters
    averageAttenuationDbPerKm
    spliceCount
    connectorCount
    bendCount
    breakCount
    isPassing
    passThresholdDb
    marginDb
    traceFileUrl
  }
}
    `;
var useOtdrTestResultsQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["OTDRTestResults", variables],
    queryFn: graphqlFetcher(
      OtdrTestResultsDocument2,
      variables
    ),
    ...options
  });
};
useOtdrTestResultsQuery.getKey = (variables) => [
  "OTDRTestResults",
  variables
];
var useInfiniteOtdrTestResultsQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["OTDRTestResults.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          OtdrTestResultsDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteOtdrTestResultsQuery.getKey = (variables) => [
  "OTDRTestResults.infinite",
  variables
];
useOtdrTestResultsQuery.fetcher = (variables, options) => graphqlFetcher(
  OtdrTestResultsDocument2,
  variables,
  options
);
var FiberNetworkAnalyticsDocument2 = `
    query FiberNetworkAnalytics {
  fiberNetworkAnalytics {
    totalFiberKm
    totalCables
    totalStrands
    totalDistributionPoints
    totalSplicePoints
    totalCapacity
    usedCapacity
    availableCapacity
    capacityUtilizationPercent
    healthyCables
    degradedCables
    failedCables
    networkHealthScore
    totalServiceAreas
    activeServiceAreas
    homesPassed
    homesConnected
    penetrationRatePercent
    averageCableLossDbPerKm
    averageSpliceLossDb
    cablesDueForTesting
    cablesActive
    cablesInactive
    cablesUnderConstruction
    cablesMaintenance
    cablesWithHighLoss
    distributionPointsNearCapacity
    serviceAreasNeedsExpansion
    generatedAt
  }
}
    `;
var useFiberNetworkAnalyticsQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["FiberNetworkAnalytics"] : ["FiberNetworkAnalytics", variables],
    queryFn: graphqlFetcher(
      FiberNetworkAnalyticsDocument2,
      variables
    ),
    ...options
  });
};
useFiberNetworkAnalyticsQuery.getKey = (variables) => variables === void 0 ? ["FiberNetworkAnalytics"] : ["FiberNetworkAnalytics", variables];
var useInfiniteFiberNetworkAnalyticsQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["FiberNetworkAnalytics.infinite"] : ["FiberNetworkAnalytics.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          FiberNetworkAnalyticsDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteFiberNetworkAnalyticsQuery.getKey = (variables) => variables === void 0 ? ["FiberNetworkAnalytics.infinite"] : ["FiberNetworkAnalytics.infinite", variables];
useFiberNetworkAnalyticsQuery.fetcher = (variables, options) => graphqlFetcher(
  FiberNetworkAnalyticsDocument2,
  variables,
  options
);
var FiberDashboardDocument2 = `
    query FiberDashboard {
  fiberDashboard {
    analytics {
      totalFiberKm
      totalCables
      totalStrands
      totalDistributionPoints
      totalSplicePoints
      capacityUtilizationPercent
      networkHealthScore
      homesPassed
      homesConnected
      penetrationRatePercent
    }
    topCablesByUtilization {
      id
      cableId
      name
      capacityUtilizationPercent
      totalStrands
      usedStrands
    }
    topDistributionPointsByCapacity {
      id
      name
      capacityUtilizationPercent
      totalCapacity
      usedCapacity
    }
    topServiceAreasByPenetration {
      id
      name
      city
      penetrationRatePercent
      homesPassed
      homesConnected
    }
    cablesRequiringAttention {
      cableId
      cableName
      healthStatus
      healthScore
      requiresMaintenance
    }
    recentTestResults {
      testId
      cableId
      strandId
      testedAt
      isPassing
      totalLossDb
    }
    distributionPointsNearCapacity {
      id
      name
      capacityUtilizationPercent
    }
    serviceAreasExpansionCandidates {
      id
      name
      penetrationRatePercent
      homesPassed
    }
    newConnectionsTrend
    capacityUtilizationTrend
    networkHealthTrend
    generatedAt
  }
}
    `;
var useFiberDashboardQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["FiberDashboard"] : ["FiberDashboard", variables],
    queryFn: graphqlFetcher(
      FiberDashboardDocument2,
      variables
    ),
    ...options
  });
};
useFiberDashboardQuery.getKey = (variables) => variables === void 0 ? ["FiberDashboard"] : ["FiberDashboard", variables];
var useInfiniteFiberDashboardQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["FiberDashboard.infinite"] : ["FiberDashboard.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          FiberDashboardDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteFiberDashboardQuery.getKey = (variables) => variables === void 0 ? ["FiberDashboard.infinite"] : ["FiberDashboard.infinite", variables];
useFiberDashboardQuery.fetcher = (variables, options) => graphqlFetcher(
  FiberDashboardDocument2,
  variables,
  options
);
var NetworkOverviewDocument2 = `
    query NetworkOverview {
  networkOverview {
    totalDevices
    onlineDevices
    offlineDevices
    activeAlerts
    criticalAlerts
    warningAlerts
    totalBandwidthGbps
    uptimePercentage
    dataSourceStatus {
      name
      status
    }
    deviceTypeSummary {
      deviceType
      totalCount
      onlineCount
      avgCpuUsage
      avgMemoryUsage
    }
    recentAlerts {
      alertId
      severity
      title
      description
      deviceName
      deviceId
      deviceType
      triggeredAt
      acknowledgedAt
      resolvedAt
      isActive
    }
  }
}
    `;
var useNetworkOverviewQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["NetworkOverview"] : ["NetworkOverview", variables],
    queryFn: graphqlFetcher(
      NetworkOverviewDocument2,
      variables
    ),
    ...options
  });
};
useNetworkOverviewQuery.getKey = (variables) => variables === void 0 ? ["NetworkOverview"] : ["NetworkOverview", variables];
var useInfiniteNetworkOverviewQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["NetworkOverview.infinite"] : ["NetworkOverview.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          NetworkOverviewDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteNetworkOverviewQuery.getKey = (variables) => variables === void 0 ? ["NetworkOverview.infinite"] : ["NetworkOverview.infinite", variables];
useNetworkOverviewQuery.fetcher = (variables, options) => graphqlFetcher(
  NetworkOverviewDocument2,
  variables,
  options
);
var NetworkDeviceListDocument2 = `
    query NetworkDeviceList($page: Int = 1, $pageSize: Int = 20, $deviceType: DeviceTypeEnum, $status: DeviceStatusEnum, $search: String) {
  networkDevices(
    page: $page
    pageSize: $pageSize
    deviceType: $deviceType
    status: $status
    search: $search
  ) {
    devices {
      deviceId
      deviceName
      deviceType
      status
      ipAddress
      firmwareVersion
      model
      location
      tenantId
      cpuUsagePercent
      memoryUsagePercent
      temperatureCelsius
      powerStatus
      pingLatencyMs
      packetLossPercent
      uptimeSeconds
      uptimeDays
      lastSeen
      isHealthy
    }
    totalCount
    hasNextPage
    hasPrevPage
    page
    pageSize
  }
}
    `;
var useNetworkDeviceListQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["NetworkDeviceList"] : ["NetworkDeviceList", variables],
    queryFn: graphqlFetcher(
      NetworkDeviceListDocument2,
      variables
    ),
    ...options
  });
};
useNetworkDeviceListQuery.getKey = (variables) => variables === void 0 ? ["NetworkDeviceList"] : ["NetworkDeviceList", variables];
var useInfiniteNetworkDeviceListQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["NetworkDeviceList.infinite"] : ["NetworkDeviceList.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          NetworkDeviceListDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteNetworkDeviceListQuery.getKey = (variables) => variables === void 0 ? ["NetworkDeviceList.infinite"] : ["NetworkDeviceList.infinite", variables];
useNetworkDeviceListQuery.fetcher = (variables, options) => graphqlFetcher(
  NetworkDeviceListDocument2,
  variables,
  options
);
var DeviceDetailDocument2 = `
    query DeviceDetail($deviceId: String!, $deviceType: DeviceTypeEnum!) {
  deviceHealth(deviceId: $deviceId, deviceType: $deviceType) {
    deviceId
    deviceName
    deviceType
    status
    ipAddress
    firmwareVersion
    model
    location
    tenantId
    cpuUsagePercent
    memoryUsagePercent
    temperatureCelsius
    powerStatus
    pingLatencyMs
    packetLossPercent
    uptimeSeconds
    uptimeDays
    lastSeen
    isHealthy
  }
  deviceTraffic(deviceId: $deviceId, deviceType: $deviceType) {
    deviceId
    deviceName
    totalBandwidthGbps
    currentRateInMbps
    currentRateOutMbps
    totalBytesIn
    totalBytesOut
    totalPacketsIn
    totalPacketsOut
    peakRateInBps
    peakRateOutBps
    peakTimestamp
    timestamp
  }
}
    `;
var useDeviceDetailQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["DeviceDetail", variables],
    queryFn: graphqlFetcher(
      DeviceDetailDocument2,
      variables
    ),
    ...options
  });
};
useDeviceDetailQuery.getKey = (variables) => [
  "DeviceDetail",
  variables
];
var useInfiniteDeviceDetailQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["DeviceDetail.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          DeviceDetailDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteDeviceDetailQuery.getKey = (variables) => [
  "DeviceDetail.infinite",
  variables
];
useDeviceDetailQuery.fetcher = (variables, options) => graphqlFetcher(
  DeviceDetailDocument2,
  variables,
  options
);
var DeviceTrafficDocument2 = `
    query DeviceTraffic($deviceId: String!, $deviceType: DeviceTypeEnum!, $includeInterfaces: Boolean = false) {
  deviceTraffic(
    deviceId: $deviceId
    deviceType: $deviceType
    includeInterfaces: $includeInterfaces
  ) {
    deviceId
    deviceName
    totalBandwidthGbps
    currentRateInMbps
    currentRateOutMbps
    totalBytesIn
    totalBytesOut
    totalPacketsIn
    totalPacketsOut
    peakRateInBps
    peakRateOutBps
    peakTimestamp
    timestamp
    interfaces @include(if: $includeInterfaces) {
      interfaceName
      status
      rateInBps
      rateOutBps
      bytesIn
      bytesOut
      errorsIn
      errorsOut
      dropsIn
      dropsOut
    }
  }
}
    `;
var useDeviceTrafficQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["DeviceTraffic", variables],
    queryFn: graphqlFetcher(
      DeviceTrafficDocument2,
      variables
    ),
    ...options
  });
};
useDeviceTrafficQuery.getKey = (variables) => [
  "DeviceTraffic",
  variables
];
var useInfiniteDeviceTrafficQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["DeviceTraffic.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          DeviceTrafficDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteDeviceTrafficQuery.getKey = (variables) => [
  "DeviceTraffic.infinite",
  variables
];
useDeviceTrafficQuery.fetcher = (variables, options) => graphqlFetcher(
  DeviceTrafficDocument2,
  variables,
  options
);
var NetworkAlertListDocument2 = `
    query NetworkAlertList($page: Int = 1, $pageSize: Int = 50, $severity: AlertSeverityEnum, $activeOnly: Boolean = true, $deviceId: String, $deviceType: DeviceTypeEnum) {
  networkAlerts(
    page: $page
    pageSize: $pageSize
    severity: $severity
    activeOnly: $activeOnly
    deviceId: $deviceId
    deviceType: $deviceType
  ) {
    alerts {
      alertId
      alertRuleId
      severity
      title
      description
      deviceName
      deviceId
      deviceType
      metricName
      currentValue
      thresholdValue
      triggeredAt
      acknowledgedAt
      resolvedAt
      isActive
      isAcknowledged
      tenantId
    }
    totalCount
    hasNextPage
    hasPrevPage
    page
    pageSize
  }
}
    `;
var useNetworkAlertListQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["NetworkAlertList"] : ["NetworkAlertList", variables],
    queryFn: graphqlFetcher(
      NetworkAlertListDocument2,
      variables
    ),
    ...options
  });
};
useNetworkAlertListQuery.getKey = (variables) => variables === void 0 ? ["NetworkAlertList"] : ["NetworkAlertList", variables];
var useInfiniteNetworkAlertListQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["NetworkAlertList.infinite"] : ["NetworkAlertList.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          NetworkAlertListDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteNetworkAlertListQuery.getKey = (variables) => variables === void 0 ? ["NetworkAlertList.infinite"] : ["NetworkAlertList.infinite", variables];
useNetworkAlertListQuery.fetcher = (variables, options) => graphqlFetcher(
  NetworkAlertListDocument2,
  variables,
  options
);
var NetworkAlertDetailDocument2 = `
    query NetworkAlertDetail($alertId: String!) {
  networkAlert(alertId: $alertId) {
    alertId
    alertRuleId
    severity
    title
    description
    deviceName
    deviceId
    deviceType
    metricName
    currentValue
    thresholdValue
    triggeredAt
    acknowledgedAt
    resolvedAt
    isActive
    isAcknowledged
    tenantId
  }
}
    `;
var useNetworkAlertDetailQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["NetworkAlertDetail", variables],
    queryFn: graphqlFetcher(
      NetworkAlertDetailDocument2,
      variables
    ),
    ...options
  });
};
useNetworkAlertDetailQuery.getKey = (variables) => [
  "NetworkAlertDetail",
  variables
];
var useInfiniteNetworkAlertDetailQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["NetworkAlertDetail.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          NetworkAlertDetailDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteNetworkAlertDetailQuery.getKey = (variables) => [
  "NetworkAlertDetail.infinite",
  variables
];
useNetworkAlertDetailQuery.fetcher = (variables, options) => graphqlFetcher(
  NetworkAlertDetailDocument2,
  variables,
  options
);
var NetworkDashboardDocument2 = `
    query NetworkDashboard($devicePage: Int = 1, $devicePageSize: Int = 10, $deviceType: DeviceTypeEnum, $deviceStatus: DeviceStatusEnum, $alertPage: Int = 1, $alertPageSize: Int = 20, $alertSeverity: AlertSeverityEnum) {
  networkOverview {
    totalDevices
    onlineDevices
    offlineDevices
    activeAlerts
    criticalAlerts
    warningAlerts
    totalBandwidthGbps
    uptimePercentage
    dataSourceStatus {
      name
      status
    }
    deviceTypeSummary {
      deviceType
      totalCount
      onlineCount
      avgCpuUsage
      avgMemoryUsage
    }
    recentAlerts {
      alertId
      severity
      title
      deviceName
      triggeredAt
      isActive
    }
  }
  networkDevices(
    page: $devicePage
    pageSize: $devicePageSize
    deviceType: $deviceType
    status: $deviceStatus
  ) {
    devices {
      deviceId
      deviceName
      deviceType
      status
      ipAddress
      cpuUsagePercent
      memoryUsagePercent
      uptimeSeconds
      isHealthy
      lastSeen
    }
    totalCount
    hasNextPage
  }
  networkAlerts(
    page: $alertPage
    pageSize: $alertPageSize
    severity: $alertSeverity
    activeOnly: true
  ) {
    alerts {
      alertId
      severity
      title
      description
      deviceName
      deviceType
      triggeredAt
      isActive
    }
    totalCount
    hasNextPage
  }
}
    `;
var useNetworkDashboardQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["NetworkDashboard"] : ["NetworkDashboard", variables],
    queryFn: graphqlFetcher(
      NetworkDashboardDocument2,
      variables
    ),
    ...options
  });
};
useNetworkDashboardQuery.getKey = (variables) => variables === void 0 ? ["NetworkDashboard"] : ["NetworkDashboard", variables];
var useInfiniteNetworkDashboardQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["NetworkDashboard.infinite"] : ["NetworkDashboard.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          NetworkDashboardDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteNetworkDashboardQuery.getKey = (variables) => variables === void 0 ? ["NetworkDashboard.infinite"] : ["NetworkDashboard.infinite", variables];
useNetworkDashboardQuery.fetcher = (variables, options) => graphqlFetcher(
  NetworkDashboardDocument2,
  variables,
  options
);
var DeviceUpdatesDocument2 = `
    subscription DeviceUpdates($deviceType: DeviceTypeEnum, $status: DeviceStatusEnum) {
  deviceUpdated(deviceType: $deviceType, status: $status) {
    deviceId
    deviceName
    deviceType
    status
    ipAddress
    firmwareVersion
    model
    location
    tenantId
    cpuUsagePercent
    memoryUsagePercent
    temperatureCelsius
    powerStatus
    pingLatencyMs
    packetLossPercent
    uptimeSeconds
    uptimeDays
    lastSeen
    isHealthy
    changeType
    previousValue
    newValue
    updatedAt
  }
}
    `;
var NetworkAlertUpdatesDocument2 = `
    subscription NetworkAlertUpdates($severity: AlertSeverityEnum, $deviceId: String) {
  networkAlertUpdated(severity: $severity, deviceId: $deviceId) {
    action
    alert {
      alertId
      alertRuleId
      severity
      title
      description
      deviceName
      deviceId
      deviceType
      metricName
      currentValue
      thresholdValue
      triggeredAt
      acknowledgedAt
      resolvedAt
      isActive
      isAcknowledged
      tenantId
    }
    updatedAt
  }
}
    `;
var SubscriberDashboardDocument2 = `
    query SubscriberDashboard($limit: Int = 50, $search: String) {
  subscribers(limit: $limit, search: $search) {
    id
    subscriberId
    username
    enabled
    framedIpAddress
    bandwidthProfileId
    createdAt
    updatedAt
    sessions {
      radacctid
      username
      nasipaddress
      acctsessionid
      acctsessiontime
      acctinputoctets
      acctoutputoctets
      acctstarttime
    }
  }
  subscriberMetrics {
    totalCount
    enabledCount
    disabledCount
    activeSessionsCount
    totalDataUsageMb
  }
}
    `;
var useSubscriberDashboardQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["SubscriberDashboard"] : ["SubscriberDashboard", variables],
    queryFn: graphqlFetcher(
      SubscriberDashboardDocument2,
      variables
    ),
    ...options
  });
};
useSubscriberDashboardQuery.getKey = (variables) => variables === void 0 ? ["SubscriberDashboard"] : ["SubscriberDashboard", variables];
var useInfiniteSubscriberDashboardQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["SubscriberDashboard.infinite"] : ["SubscriberDashboard.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          SubscriberDashboardDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteSubscriberDashboardQuery.getKey = (variables) => variables === void 0 ? ["SubscriberDashboard.infinite"] : ["SubscriberDashboard.infinite", variables];
useSubscriberDashboardQuery.fetcher = (variables, options) => graphqlFetcher(
  SubscriberDashboardDocument2,
  variables,
  options
);
var SubscriberDocument2 = `
    query Subscriber($username: String!) {
  subscribers(limit: 1, search: $username) {
    id
    subscriberId
    username
    enabled
    framedIpAddress
    bandwidthProfileId
    createdAt
    updatedAt
    sessions {
      radacctid
      username
      nasipaddress
      acctsessionid
      acctsessiontime
      acctinputoctets
      acctoutputoctets
      acctstarttime
      acctstoptime
    }
  }
}
    `;
var useSubscriberQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["Subscriber", variables],
    queryFn: graphqlFetcher(
      SubscriberDocument2,
      variables
    ),
    ...options
  });
};
useSubscriberQuery.getKey = (variables) => ["Subscriber", variables];
var useInfiniteSubscriberQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["Subscriber.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(SubscriberDocument2, {
          ...variables,
          ...metaData.pageParam ?? {}
        })(),
        ...restOptions
      };
    })()
  );
};
useInfiniteSubscriberQuery.getKey = (variables) => [
  "Subscriber.infinite",
  variables
];
useSubscriberQuery.fetcher = (variables, options) => graphqlFetcher(
  SubscriberDocument2,
  variables,
  options
);
var ActiveSessionsDocument2 = `
    query ActiveSessions($limit: Int = 100, $username: String) {
  sessions(limit: $limit, username: $username) {
    radacctid
    username
    nasipaddress
    acctsessionid
    acctsessiontime
    acctinputoctets
    acctoutputoctets
    acctstarttime
  }
}
    `;
var useActiveSessionsQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["ActiveSessions"] : ["ActiveSessions", variables],
    queryFn: graphqlFetcher(
      ActiveSessionsDocument2,
      variables
    ),
    ...options
  });
};
useActiveSessionsQuery.getKey = (variables) => variables === void 0 ? ["ActiveSessions"] : ["ActiveSessions", variables];
var useInfiniteActiveSessionsQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["ActiveSessions.infinite"] : ["ActiveSessions.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          ActiveSessionsDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteActiveSessionsQuery.getKey = (variables) => variables === void 0 ? ["ActiveSessions.infinite"] : ["ActiveSessions.infinite", variables];
useActiveSessionsQuery.fetcher = (variables, options) => graphqlFetcher(
  ActiveSessionsDocument2,
  variables,
  options
);
var SubscriberMetricsDocument2 = `
    query SubscriberMetrics {
  subscriberMetrics {
    totalCount
    enabledCount
    disabledCount
    activeSessionsCount
    totalDataUsageMb
  }
}
    `;
var useSubscriberMetricsQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["SubscriberMetrics"] : ["SubscriberMetrics", variables],
    queryFn: graphqlFetcher(
      SubscriberMetricsDocument2,
      variables
    ),
    ...options
  });
};
useSubscriberMetricsQuery.getKey = (variables) => variables === void 0 ? ["SubscriberMetrics"] : ["SubscriberMetrics", variables];
var useInfiniteSubscriberMetricsQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["SubscriberMetrics.infinite"] : ["SubscriberMetrics.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          SubscriberMetricsDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteSubscriberMetricsQuery.getKey = (variables) => variables === void 0 ? ["SubscriberMetrics.infinite"] : ["SubscriberMetrics.infinite", variables];
useSubscriberMetricsQuery.fetcher = (variables, options) => graphqlFetcher(
  SubscriberMetricsDocument2,
  variables,
  options
);
var SubscriptionListDocument2 = `
    query SubscriptionList($page: Int = 1, $pageSize: Int = 10, $status: SubscriptionStatusEnum, $billingCycle: BillingCycleEnum, $search: String, $includeCustomer: Boolean = true, $includePlan: Boolean = true, $includeInvoices: Boolean = false) {
  subscriptions(
    page: $page
    pageSize: $pageSize
    status: $status
    billingCycle: $billingCycle
    search: $search
    includeCustomer: $includeCustomer
    includePlan: $includePlan
    includeInvoices: $includeInvoices
  ) {
    subscriptions {
      id
      subscriptionId
      customerId
      planId
      tenantId
      currentPeriodStart
      currentPeriodEnd
      status
      trialEnd
      isInTrial
      cancelAtPeriodEnd
      canceledAt
      endedAt
      customPrice
      usageRecords
      createdAt
      updatedAt
      isActive
      daysUntilRenewal
      isPastDue
      customer @include(if: $includeCustomer) {
        id
        customerId
        name
        email
        phone
        createdAt
      }
      plan @include(if: $includePlan) {
        id
        planId
        productId
        name
        description
        billingCycle
        price
        currency
        setupFee
        trialDays
        isActive
        hasTrial
        hasSetupFee
        includedUsage
        overageRates
        createdAt
        updatedAt
      }
      recentInvoices @include(if: $includeInvoices) {
        id
        invoiceId
        invoiceNumber
        amount
        currency
        status
        dueDate
        paidAt
        createdAt
      }
    }
    totalCount
    hasNextPage
    hasPrevPage
    page
    pageSize
  }
}
    `;
var useSubscriptionListQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["SubscriptionList"] : ["SubscriptionList", variables],
    queryFn: graphqlFetcher(
      SubscriptionListDocument2,
      variables
    ),
    ...options
  });
};
useSubscriptionListQuery.getKey = (variables) => variables === void 0 ? ["SubscriptionList"] : ["SubscriptionList", variables];
var useInfiniteSubscriptionListQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["SubscriptionList.infinite"] : ["SubscriptionList.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          SubscriptionListDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteSubscriptionListQuery.getKey = (variables) => variables === void 0 ? ["SubscriptionList.infinite"] : ["SubscriptionList.infinite", variables];
useSubscriptionListQuery.fetcher = (variables, options) => graphqlFetcher(
  SubscriptionListDocument2,
  variables,
  options
);
var SubscriptionDetailDocument2 = `
    query SubscriptionDetail($id: ID!) {
  subscription(
    id: $id
    includeCustomer: true
    includePlan: true
    includeInvoices: true
  ) {
    id
    subscriptionId
    customerId
    planId
    tenantId
    currentPeriodStart
    currentPeriodEnd
    status
    trialEnd
    isInTrial
    cancelAtPeriodEnd
    canceledAt
    endedAt
    customPrice
    usageRecords
    createdAt
    updatedAt
    isActive
    daysUntilRenewal
    isPastDue
    customer {
      id
      customerId
      name
      email
      phone
      createdAt
    }
    plan {
      id
      planId
      productId
      name
      description
      billingCycle
      price
      currency
      setupFee
      trialDays
      isActive
      hasTrial
      hasSetupFee
      includedUsage
      overageRates
      createdAt
      updatedAt
    }
    recentInvoices {
      id
      invoiceId
      invoiceNumber
      amount
      currency
      status
      dueDate
      paidAt
      createdAt
    }
  }
}
    `;
var useSubscriptionDetailQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["SubscriptionDetail", variables],
    queryFn: graphqlFetcher(
      SubscriptionDetailDocument2,
      variables
    ),
    ...options
  });
};
useSubscriptionDetailQuery.getKey = (variables) => [
  "SubscriptionDetail",
  variables
];
var useInfiniteSubscriptionDetailQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["SubscriptionDetail.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          SubscriptionDetailDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteSubscriptionDetailQuery.getKey = (variables) => [
  "SubscriptionDetail.infinite",
  variables
];
useSubscriptionDetailQuery.fetcher = (variables, options) => graphqlFetcher(
  SubscriptionDetailDocument2,
  variables,
  options
);
var SubscriptionMetricsDocument2 = `
    query SubscriptionMetrics {
  subscriptionMetrics {
    totalSubscriptions
    activeSubscriptions
    trialingSubscriptions
    pastDueSubscriptions
    canceledSubscriptions
    pausedSubscriptions
    monthlyRecurringRevenue
    annualRecurringRevenue
    averageRevenuePerUser
    newSubscriptionsThisMonth
    newSubscriptionsLastMonth
    churnRate
    growthRate
    monthlySubscriptions
    quarterlySubscriptions
    annualSubscriptions
    trialConversionRate
    activeTrials
  }
}
    `;
var useSubscriptionMetricsQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["SubscriptionMetrics"] : ["SubscriptionMetrics", variables],
    queryFn: graphqlFetcher(
      SubscriptionMetricsDocument2,
      variables
    ),
    ...options
  });
};
useSubscriptionMetricsQuery.getKey = (variables) => variables === void 0 ? ["SubscriptionMetrics"] : ["SubscriptionMetrics", variables];
var useInfiniteSubscriptionMetricsQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["SubscriptionMetrics.infinite"] : ["SubscriptionMetrics.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          SubscriptionMetricsDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteSubscriptionMetricsQuery.getKey = (variables) => variables === void 0 ? ["SubscriptionMetrics.infinite"] : ["SubscriptionMetrics.infinite", variables];
useSubscriptionMetricsQuery.fetcher = (variables, options) => graphqlFetcher(
  SubscriptionMetricsDocument2,
  variables,
  options
);
var PlanListDocument2 = `
    query PlanList($page: Int = 1, $pageSize: Int = 20, $isActive: Boolean, $billingCycle: BillingCycleEnum) {
  plans(
    page: $page
    pageSize: $pageSize
    isActive: $isActive
    billingCycle: $billingCycle
  ) {
    plans {
      id
      planId
      productId
      name
      description
      billingCycle
      price
      currency
      setupFee
      trialDays
      isActive
      createdAt
      updatedAt
      hasTrial
      hasSetupFee
      includedUsage
      overageRates
    }
    totalCount
    hasNextPage
    hasPrevPage
    page
    pageSize
  }
}
    `;
var usePlanListQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["PlanList"] : ["PlanList", variables],
    queryFn: graphqlFetcher(
      PlanListDocument2,
      variables
    ),
    ...options
  });
};
usePlanListQuery.getKey = (variables) => variables === void 0 ? ["PlanList"] : ["PlanList", variables];
var useInfinitePlanListQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["PlanList.infinite"] : ["PlanList.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(PlanListDocument2, {
          ...variables,
          ...metaData.pageParam ?? {}
        })(),
        ...restOptions
      };
    })()
  );
};
useInfinitePlanListQuery.getKey = (variables) => variables === void 0 ? ["PlanList.infinite"] : ["PlanList.infinite", variables];
usePlanListQuery.fetcher = (variables, options) => graphqlFetcher(PlanListDocument2, variables, options);
var ProductListDocument2 = `
    query ProductList($page: Int = 1, $pageSize: Int = 20, $isActive: Boolean, $category: String) {
  products(
    page: $page
    pageSize: $pageSize
    isActive: $isActive
    category: $category
  ) {
    products {
      id
      productId
      sku
      name
      description
      category
      productType
      basePrice
      currency
      isActive
      createdAt
      updatedAt
    }
    totalCount
    hasNextPage
    hasPrevPage
    page
    pageSize
  }
}
    `;
var useProductListQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["ProductList"] : ["ProductList", variables],
    queryFn: graphqlFetcher(
      ProductListDocument2,
      variables
    ),
    ...options
  });
};
useProductListQuery.getKey = (variables) => variables === void 0 ? ["ProductList"] : ["ProductList", variables];
var useInfiniteProductListQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["ProductList.infinite"] : ["ProductList.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(ProductListDocument2, {
          ...variables,
          ...metaData.pageParam ?? {}
        })(),
        ...restOptions
      };
    })()
  );
};
useInfiniteProductListQuery.getKey = (variables) => variables === void 0 ? ["ProductList.infinite"] : ["ProductList.infinite", variables];
useProductListQuery.fetcher = (variables, options) => graphqlFetcher(
  ProductListDocument2,
  variables,
  options
);
var SubscriptionDashboardDocument2 = `
    query SubscriptionDashboard($page: Int = 1, $pageSize: Int = 10, $status: SubscriptionStatusEnum, $search: String) {
  subscriptions(
    page: $page
    pageSize: $pageSize
    status: $status
    search: $search
    includeCustomer: true
    includePlan: true
    includeInvoices: false
  ) {
    subscriptions {
      id
      subscriptionId
      status
      currentPeriodStart
      currentPeriodEnd
      isActive
      isInTrial
      cancelAtPeriodEnd
      createdAt
      customer {
        id
        name
        email
      }
      plan {
        id
        name
        price
        currency
        billingCycle
      }
    }
    totalCount
    hasNextPage
  }
  subscriptionMetrics {
    totalSubscriptions
    activeSubscriptions
    trialingSubscriptions
    pastDueSubscriptions
    monthlyRecurringRevenue
    annualRecurringRevenue
    averageRevenuePerUser
    newSubscriptionsThisMonth
    churnRate
    growthRate
  }
}
    `;
var useSubscriptionDashboardQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["SubscriptionDashboard"] : ["SubscriptionDashboard", variables],
    queryFn: graphqlFetcher(
      SubscriptionDashboardDocument2,
      variables
    ),
    ...options
  });
};
useSubscriptionDashboardQuery.getKey = (variables) => variables === void 0 ? ["SubscriptionDashboard"] : ["SubscriptionDashboard", variables];
var useInfiniteSubscriptionDashboardQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["SubscriptionDashboard.infinite"] : ["SubscriptionDashboard.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          SubscriptionDashboardDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteSubscriptionDashboardQuery.getKey = (variables) => variables === void 0 ? ["SubscriptionDashboard.infinite"] : ["SubscriptionDashboard.infinite", variables];
useSubscriptionDashboardQuery.fetcher = (variables, options) => graphqlFetcher(
  SubscriptionDashboardDocument2,
  variables,
  options
);
var UserListDocument2 = `
    query UserList($page: Int = 1, $pageSize: Int = 10, $isActive: Boolean, $isVerified: Boolean, $isSuperuser: Boolean, $isPlatformAdmin: Boolean, $search: String, $includeMetadata: Boolean = false, $includeRoles: Boolean = false, $includePermissions: Boolean = false, $includeTeams: Boolean = false) {
  users(
    page: $page
    pageSize: $pageSize
    isActive: $isActive
    isVerified: $isVerified
    isSuperuser: $isSuperuser
    isPlatformAdmin: $isPlatformAdmin
    search: $search
    includeMetadata: $includeMetadata
    includeRoles: $includeRoles
    includePermissions: $includePermissions
    includeTeams: $includeTeams
  ) {
    users {
      id
      username
      email
      fullName
      firstName
      lastName
      displayName
      isActive
      isVerified
      isSuperuser
      isPlatformAdmin
      status
      phoneNumber
      phone
      phoneVerified
      avatarUrl
      timezone
      location
      bio
      website
      mfaEnabled
      lastLogin
      lastLoginIp
      failedLoginAttempts
      lockedUntil
      language
      tenantId
      primaryRole
      createdAt
      updatedAt
      metadata @include(if: $includeMetadata)
      roles @include(if: $includeRoles) {
        id
        name
        displayName
        description
        priority
        isSystem
        isActive
        isDefault
        createdAt
        updatedAt
      }
      permissions @include(if: $includePermissions) {
        id
        name
        displayName
        description
        category
        isActive
        isSystem
        createdAt
        updatedAt
      }
      teams @include(if: $includeTeams) {
        teamId
        teamName
        role
        joinedAt
      }
    }
    totalCount
    hasNextPage
    hasPrevPage
    page
    pageSize
  }
}
    `;
var useUserListQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["UserList"] : ["UserList", variables],
    queryFn: graphqlFetcher(
      UserListDocument2,
      variables
    ),
    ...options
  });
};
useUserListQuery.getKey = (variables) => variables === void 0 ? ["UserList"] : ["UserList", variables];
var useInfiniteUserListQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["UserList.infinite"] : ["UserList.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(UserListDocument2, {
          ...variables,
          ...metaData.pageParam ?? {}
        })(),
        ...restOptions
      };
    })()
  );
};
useInfiniteUserListQuery.getKey = (variables) => variables === void 0 ? ["UserList.infinite"] : ["UserList.infinite", variables];
useUserListQuery.fetcher = (variables, options) => graphqlFetcher(UserListDocument2, variables, options);
var UserDetailDocument2 = `
    query UserDetail($id: ID!) {
  user(
    id: $id
    includeMetadata: true
    includeRoles: true
    includePermissions: true
    includeTeams: true
    includeProfileChanges: true
  ) {
    id
    username
    email
    fullName
    firstName
    lastName
    displayName
    isActive
    isVerified
    isSuperuser
    isPlatformAdmin
    status
    phoneNumber
    phone
    phoneVerified
    avatarUrl
    timezone
    location
    bio
    website
    mfaEnabled
    lastLogin
    lastLoginIp
    failedLoginAttempts
    lockedUntil
    language
    tenantId
    primaryRole
    createdAt
    updatedAt
    metadata
    roles {
      id
      name
      displayName
      description
      priority
      isSystem
      isActive
      isDefault
      createdAt
      updatedAt
    }
    permissions {
      id
      name
      displayName
      description
      category
      isActive
      isSystem
      createdAt
      updatedAt
    }
    teams {
      teamId
      teamName
      role
      joinedAt
    }
    profileChanges {
      id
      fieldName
      oldValue
      newValue
      createdAt
      changedByUsername
    }
  }
}
    `;
var useUserDetailQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["UserDetail", variables],
    queryFn: graphqlFetcher(
      UserDetailDocument2,
      variables
    ),
    ...options
  });
};
useUserDetailQuery.getKey = (variables) => ["UserDetail", variables];
var useInfiniteUserDetailQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["UserDetail.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(UserDetailDocument2, {
          ...variables,
          ...metaData.pageParam ?? {}
        })(),
        ...restOptions
      };
    })()
  );
};
useInfiniteUserDetailQuery.getKey = (variables) => [
  "UserDetail.infinite",
  variables
];
useUserDetailQuery.fetcher = (variables, options) => graphqlFetcher(
  UserDetailDocument2,
  variables,
  options
);
var UserMetricsDocument2 = `
    query UserMetrics {
  userMetrics {
    totalUsers
    activeUsers
    suspendedUsers
    invitedUsers
    verifiedUsers
    mfaEnabledUsers
    platformAdmins
    superusers
    regularUsers
    usersLoggedInLast24h
    usersLoggedInLast7d
    usersLoggedInLast30d
    neverLoggedIn
    newUsersThisMonth
    newUsersLastMonth
  }
}
    `;
var useUserMetricsQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["UserMetrics"] : ["UserMetrics", variables],
    queryFn: graphqlFetcher(
      UserMetricsDocument2,
      variables
    ),
    ...options
  });
};
useUserMetricsQuery.getKey = (variables) => variables === void 0 ? ["UserMetrics"] : ["UserMetrics", variables];
var useInfiniteUserMetricsQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["UserMetrics.infinite"] : ["UserMetrics.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(UserMetricsDocument2, {
          ...variables,
          ...metaData.pageParam ?? {}
        })(),
        ...restOptions
      };
    })()
  );
};
useInfiniteUserMetricsQuery.getKey = (variables) => variables === void 0 ? ["UserMetrics.infinite"] : ["UserMetrics.infinite", variables];
useUserMetricsQuery.fetcher = (variables, options) => graphqlFetcher(
  UserMetricsDocument2,
  variables,
  options
);
var RoleListDocument2 = `
    query RoleList($page: Int = 1, $pageSize: Int = 20, $isActive: Boolean, $isSystem: Boolean, $search: String) {
  roles(
    page: $page
    pageSize: $pageSize
    isActive: $isActive
    isSystem: $isSystem
    search: $search
  ) {
    roles {
      id
      name
      displayName
      description
      priority
      isSystem
      isActive
      isDefault
      createdAt
      updatedAt
    }
    totalCount
    hasNextPage
    hasPrevPage
    page
    pageSize
  }
}
    `;
var useRoleListQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["RoleList"] : ["RoleList", variables],
    queryFn: graphqlFetcher(
      RoleListDocument2,
      variables
    ),
    ...options
  });
};
useRoleListQuery.getKey = (variables) => variables === void 0 ? ["RoleList"] : ["RoleList", variables];
var useInfiniteRoleListQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["RoleList.infinite"] : ["RoleList.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(RoleListDocument2, {
          ...variables,
          ...metaData.pageParam ?? {}
        })(),
        ...restOptions
      };
    })()
  );
};
useInfiniteRoleListQuery.getKey = (variables) => variables === void 0 ? ["RoleList.infinite"] : ["RoleList.infinite", variables];
useRoleListQuery.fetcher = (variables, options) => graphqlFetcher(RoleListDocument2, variables, options);
var PermissionsByCategoryDocument2 = `
    query PermissionsByCategory($category: PermissionCategoryEnum) {
  permissionsByCategory(category: $category) {
    category
    count
    permissions {
      id
      name
      displayName
      description
      category
      isActive
      isSystem
      createdAt
      updatedAt
    }
  }
}
    `;
var usePermissionsByCategoryQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["PermissionsByCategory"] : ["PermissionsByCategory", variables],
    queryFn: graphqlFetcher(
      PermissionsByCategoryDocument2,
      variables
    ),
    ...options
  });
};
usePermissionsByCategoryQuery.getKey = (variables) => variables === void 0 ? ["PermissionsByCategory"] : ["PermissionsByCategory", variables];
var useInfinitePermissionsByCategoryQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["PermissionsByCategory.infinite"] : ["PermissionsByCategory.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          PermissionsByCategoryDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfinitePermissionsByCategoryQuery.getKey = (variables) => variables === void 0 ? ["PermissionsByCategory.infinite"] : ["PermissionsByCategory.infinite", variables];
usePermissionsByCategoryQuery.fetcher = (variables, options) => graphqlFetcher(
  PermissionsByCategoryDocument2,
  variables,
  options
);
var UserDashboardDocument2 = `
    query UserDashboard($page: Int = 1, $pageSize: Int = 10, $isActive: Boolean, $search: String) {
  users(
    page: $page
    pageSize: $pageSize
    isActive: $isActive
    search: $search
    includeMetadata: false
    includeRoles: true
    includePermissions: false
    includeTeams: false
  ) {
    users {
      id
      username
      email
      fullName
      isActive
      isVerified
      isSuperuser
      lastLogin
      createdAt
      roles {
        id
        name
        displayName
      }
    }
    totalCount
    hasNextPage
  }
  userMetrics {
    totalUsers
    activeUsers
    suspendedUsers
    verifiedUsers
    mfaEnabledUsers
    platformAdmins
    superusers
    regularUsers
    usersLoggedInLast24h
    usersLoggedInLast7d
    newUsersThisMonth
  }
}
    `;
var useUserDashboardQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["UserDashboard"] : ["UserDashboard", variables],
    queryFn: graphqlFetcher(
      UserDashboardDocument2,
      variables
    ),
    ...options
  });
};
useUserDashboardQuery.getKey = (variables) => variables === void 0 ? ["UserDashboard"] : ["UserDashboard", variables];
var useInfiniteUserDashboardQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["UserDashboard.infinite"] : ["UserDashboard.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          UserDashboardDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteUserDashboardQuery.getKey = (variables) => variables === void 0 ? ["UserDashboard.infinite"] : ["UserDashboard.infinite", variables];
useUserDashboardQuery.fetcher = (variables, options) => graphqlFetcher(
  UserDashboardDocument2,
  variables,
  options
);
var UserRolesDocument2 = `
    query UserRoles($id: ID!) {
  user(id: $id, includeRoles: true) {
    id
    username
    roles {
      id
      name
      displayName
      description
      priority
      isSystem
      isActive
      createdAt
    }
  }
}
    `;
var useUserRolesQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["UserRoles", variables],
    queryFn: graphqlFetcher(
      UserRolesDocument2,
      variables
    ),
    ...options
  });
};
useUserRolesQuery.getKey = (variables) => ["UserRoles", variables];
var useInfiniteUserRolesQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["UserRoles.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(UserRolesDocument2, {
          ...variables,
          ...metaData.pageParam ?? {}
        })(),
        ...restOptions
      };
    })()
  );
};
useInfiniteUserRolesQuery.getKey = (variables) => [
  "UserRoles.infinite",
  variables
];
useUserRolesQuery.fetcher = (variables, options) => graphqlFetcher(
  UserRolesDocument2,
  variables,
  options
);
var UserPermissionsDocument2 = `
    query UserPermissions($id: ID!) {
  user(id: $id, includePermissions: true) {
    id
    username
    permissions {
      id
      name
      displayName
      description
      category
      isActive
    }
  }
}
    `;
var useUserPermissionsQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["UserPermissions", variables],
    queryFn: graphqlFetcher(
      UserPermissionsDocument2,
      variables
    ),
    ...options
  });
};
useUserPermissionsQuery.getKey = (variables) => [
  "UserPermissions",
  variables
];
var useInfiniteUserPermissionsQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["UserPermissions.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          UserPermissionsDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteUserPermissionsQuery.getKey = (variables) => [
  "UserPermissions.infinite",
  variables
];
useUserPermissionsQuery.fetcher = (variables, options) => graphqlFetcher(
  UserPermissionsDocument2,
  variables,
  options
);
var UserTeamsDocument2 = `
    query UserTeams($id: ID!) {
  user(id: $id, includeTeams: true) {
    id
    username
    teams {
      teamId
      teamName
      role
      joinedAt
    }
  }
}
    `;
var useUserTeamsQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["UserTeams", variables],
    queryFn: graphqlFetcher(
      UserTeamsDocument2,
      variables
    ),
    ...options
  });
};
useUserTeamsQuery.getKey = (variables) => ["UserTeams", variables];
var useInfiniteUserTeamsQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["UserTeams.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(UserTeamsDocument2, {
          ...variables,
          ...metaData.pageParam ?? {}
        })(),
        ...restOptions
      };
    })()
  );
};
useInfiniteUserTeamsQuery.getKey = (variables) => [
  "UserTeams.infinite",
  variables
];
useUserTeamsQuery.fetcher = (variables, options) => graphqlFetcher(
  UserTeamsDocument2,
  variables,
  options
);
var AccessPointListDocument2 = `
    query AccessPointList($limit: Int = 50, $offset: Int = 0, $siteId: String, $status: AccessPointStatus, $frequencyBand: FrequencyBand, $search: String) {
  accessPoints(
    limit: $limit
    offset: $offset
    siteId: $siteId
    status: $status
    frequencyBand: $frequencyBand
    search: $search
  ) {
    accessPoints {
      id
      name
      macAddress
      ipAddress
      serialNumber
      status
      isOnline
      lastSeenAt
      model
      manufacturer
      firmwareVersion
      ssid
      frequencyBand
      channel
      channelWidth
      transmitPower
      maxClients
      securityType
      location {
        siteName
        building
        floor
        room
        mountingType
        coordinates {
          latitude
          longitude
          altitude
        }
      }
      rfMetrics {
        signalStrengthDbm
        noiseFloorDbm
        signalToNoiseRatio
        channelUtilizationPercent
        interferenceLevel
        txPowerDbm
        rxPowerDbm
      }
      performance {
        txBytes
        rxBytes
        txPackets
        rxPackets
        txRateMbps
        rxRateMbps
        txErrors
        rxErrors
        connectedClients
        cpuUsagePercent
        memoryUsagePercent
        uptimeSeconds
      }
      controllerName
      siteName
      createdAt
      updatedAt
      lastRebootAt
    }
    totalCount
    hasNextPage
  }
}
    `;
var useAccessPointListQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["AccessPointList"] : ["AccessPointList", variables],
    queryFn: graphqlFetcher(
      AccessPointListDocument2,
      variables
    ),
    ...options
  });
};
useAccessPointListQuery.getKey = (variables) => variables === void 0 ? ["AccessPointList"] : ["AccessPointList", variables];
var useInfiniteAccessPointListQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["AccessPointList.infinite"] : ["AccessPointList.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          AccessPointListDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteAccessPointListQuery.getKey = (variables) => variables === void 0 ? ["AccessPointList.infinite"] : ["AccessPointList.infinite", variables];
useAccessPointListQuery.fetcher = (variables, options) => graphqlFetcher(
  AccessPointListDocument2,
  variables,
  options
);
var AccessPointDetailDocument2 = `
    query AccessPointDetail($id: ID!) {
  accessPoint(id: $id) {
    id
    name
    macAddress
    ipAddress
    serialNumber
    status
    isOnline
    lastSeenAt
    model
    manufacturer
    firmwareVersion
    hardwareRevision
    ssid
    frequencyBand
    channel
    channelWidth
    transmitPower
    maxClients
    securityType
    location {
      siteName
      building
      floor
      room
      mountingType
      coordinates {
        latitude
        longitude
        altitude
        accuracy
      }
    }
    rfMetrics {
      signalStrengthDbm
      noiseFloorDbm
      signalToNoiseRatio
      channelUtilizationPercent
      interferenceLevel
      txPowerDbm
      rxPowerDbm
    }
    performance {
      txBytes
      rxBytes
      txPackets
      rxPackets
      txRateMbps
      rxRateMbps
      txErrors
      rxErrors
      txDropped
      rxDropped
      retries
      retryRatePercent
      connectedClients
      authenticatedClients
      authorizedClients
      cpuUsagePercent
      memoryUsagePercent
      uptimeSeconds
    }
    controllerId
    controllerName
    siteId
    siteName
    createdAt
    updatedAt
    lastRebootAt
    isMeshEnabled
    isBandSteeringEnabled
    isLoadBalancingEnabled
  }
}
    `;
var useAccessPointDetailQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["AccessPointDetail", variables],
    queryFn: graphqlFetcher(
      AccessPointDetailDocument2,
      variables
    ),
    ...options
  });
};
useAccessPointDetailQuery.getKey = (variables) => [
  "AccessPointDetail",
  variables
];
var useInfiniteAccessPointDetailQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["AccessPointDetail.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          AccessPointDetailDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteAccessPointDetailQuery.getKey = (variables) => [
  "AccessPointDetail.infinite",
  variables
];
useAccessPointDetailQuery.fetcher = (variables, options) => graphqlFetcher(
  AccessPointDetailDocument2,
  variables,
  options
);
var AccessPointsBySiteDocument2 = `
    query AccessPointsBySite($siteId: String!) {
  accessPointsBySite(siteId: $siteId) {
    id
    name
    macAddress
    ipAddress
    status
    isOnline
    ssid
    frequencyBand
    channel
    performance {
      connectedClients
      cpuUsagePercent
      memoryUsagePercent
    }
    rfMetrics {
      signalStrengthDbm
      channelUtilizationPercent
    }
  }
}
    `;
var useAccessPointsBySiteQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["AccessPointsBySite", variables],
    queryFn: graphqlFetcher(
      AccessPointsBySiteDocument2,
      variables
    ),
    ...options
  });
};
useAccessPointsBySiteQuery.getKey = (variables) => [
  "AccessPointsBySite",
  variables
];
var useInfiniteAccessPointsBySiteQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["AccessPointsBySite.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          AccessPointsBySiteDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteAccessPointsBySiteQuery.getKey = (variables) => [
  "AccessPointsBySite.infinite",
  variables
];
useAccessPointsBySiteQuery.fetcher = (variables, options) => graphqlFetcher(
  AccessPointsBySiteDocument2,
  variables,
  options
);
var WirelessClientListDocument2 = `
    query WirelessClientList($limit: Int = 50, $offset: Int = 0, $accessPointId: String, $customerId: String, $frequencyBand: FrequencyBand, $search: String) {
  wirelessClients(
    limit: $limit
    offset: $offset
    accessPointId: $accessPointId
    customerId: $customerId
    frequencyBand: $frequencyBand
    search: $search
  ) {
    clients {
      id
      macAddress
      hostname
      ipAddress
      manufacturer
      accessPointId
      accessPointName
      ssid
      connectionType
      frequencyBand
      channel
      isAuthenticated
      isAuthorized
      signalStrengthDbm
      signalQuality {
        rssiDbm
        snrDb
        noiseFloorDbm
        signalStrengthPercent
        linkQualityPercent
      }
      noiseFloorDbm
      snr
      txRateMbps
      rxRateMbps
      txBytes
      rxBytes
      connectedAt
      lastSeenAt
      uptimeSeconds
      customerId
      customerName
    }
    totalCount
    hasNextPage
  }
}
    `;
var useWirelessClientListQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["WirelessClientList"] : ["WirelessClientList", variables],
    queryFn: graphqlFetcher(
      WirelessClientListDocument2,
      variables
    ),
    ...options
  });
};
useWirelessClientListQuery.getKey = (variables) => variables === void 0 ? ["WirelessClientList"] : ["WirelessClientList", variables];
var useInfiniteWirelessClientListQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["WirelessClientList.infinite"] : ["WirelessClientList.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          WirelessClientListDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteWirelessClientListQuery.getKey = (variables) => variables === void 0 ? ["WirelessClientList.infinite"] : ["WirelessClientList.infinite", variables];
useWirelessClientListQuery.fetcher = (variables, options) => graphqlFetcher(
  WirelessClientListDocument2,
  variables,
  options
);
var WirelessClientDetailDocument2 = `
    query WirelessClientDetail($id: ID!) {
  wirelessClient(id: $id) {
    id
    macAddress
    hostname
    ipAddress
    manufacturer
    accessPointId
    accessPointName
    ssid
    connectionType
    frequencyBand
    channel
    isAuthenticated
    isAuthorized
    authMethod
    signalStrengthDbm
    signalQuality {
      rssiDbm
      snrDb
      noiseFloorDbm
      signalStrengthPercent
      linkQualityPercent
    }
    noiseFloorDbm
    snr
    txRateMbps
    rxRateMbps
    txBytes
    rxBytes
    txPackets
    rxPackets
    txRetries
    rxRetries
    connectedAt
    lastSeenAt
    uptimeSeconds
    idleTimeSeconds
    supports80211k
    supports80211r
    supports80211v
    maxPhyRateMbps
    customerId
    customerName
  }
}
    `;
var useWirelessClientDetailQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["WirelessClientDetail", variables],
    queryFn: graphqlFetcher(
      WirelessClientDetailDocument2,
      variables
    ),
    ...options
  });
};
useWirelessClientDetailQuery.getKey = (variables) => [
  "WirelessClientDetail",
  variables
];
var useInfiniteWirelessClientDetailQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["WirelessClientDetail.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          WirelessClientDetailDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteWirelessClientDetailQuery.getKey = (variables) => [
  "WirelessClientDetail.infinite",
  variables
];
useWirelessClientDetailQuery.fetcher = (variables, options) => graphqlFetcher(
  WirelessClientDetailDocument2,
  variables,
  options
);
var WirelessClientsByAccessPointDocument2 = `
    query WirelessClientsByAccessPoint($accessPointId: String!) {
  wirelessClientsByAccessPoint(accessPointId: $accessPointId) {
    id
    macAddress
    hostname
    ipAddress
    ssid
    signalStrengthDbm
    signalQuality {
      rssiDbm
      snrDb
      noiseFloorDbm
      signalStrengthPercent
      linkQualityPercent
    }
    txRateMbps
    rxRateMbps
    connectedAt
    customerId
    customerName
  }
}
    `;
var useWirelessClientsByAccessPointQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["WirelessClientsByAccessPoint", variables],
    queryFn: graphqlFetcher(WirelessClientsByAccessPointDocument2, variables),
    ...options
  });
};
useWirelessClientsByAccessPointQuery.getKey = (variables) => ["WirelessClientsByAccessPoint", variables];
var useInfiniteWirelessClientsByAccessPointQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["WirelessClientsByAccessPoint.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(WirelessClientsByAccessPointDocument2, {
          ...variables,
          ...metaData.pageParam ?? {}
        })(),
        ...restOptions
      };
    })()
  );
};
useInfiniteWirelessClientsByAccessPointQuery.getKey = (variables) => ["WirelessClientsByAccessPoint.infinite", variables];
useWirelessClientsByAccessPointQuery.fetcher = (variables, options) => graphqlFetcher(WirelessClientsByAccessPointDocument2, variables, options);
var WirelessClientsByCustomerDocument2 = `
    query WirelessClientsByCustomer($customerId: String!) {
  wirelessClientsByCustomer(customerId: $customerId) {
    id
    macAddress
    hostname
    ipAddress
    accessPointName
    ssid
    frequencyBand
    signalStrengthDbm
    signalQuality {
      rssiDbm
      snrDb
      noiseFloorDbm
      signalStrengthPercent
      linkQualityPercent
    }
    isAuthenticated
    connectedAt
    lastSeenAt
  }
}
    `;
var useWirelessClientsByCustomerQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["WirelessClientsByCustomer", variables],
    queryFn: graphqlFetcher(WirelessClientsByCustomerDocument2, variables),
    ...options
  });
};
useWirelessClientsByCustomerQuery.getKey = (variables) => [
  "WirelessClientsByCustomer",
  variables
];
var useInfiniteWirelessClientsByCustomerQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["WirelessClientsByCustomer.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(WirelessClientsByCustomerDocument2, { ...variables, ...metaData.pageParam ?? {} })(),
        ...restOptions
      };
    })()
  );
};
useInfiniteWirelessClientsByCustomerQuery.getKey = (variables) => ["WirelessClientsByCustomer.infinite", variables];
useWirelessClientsByCustomerQuery.fetcher = (variables, options) => graphqlFetcher(
  WirelessClientsByCustomerDocument2,
  variables,
  options
);
var CoverageZoneListDocument2 = `
    query CoverageZoneList($limit: Int = 50, $offset: Int = 0, $siteId: String, $areaType: String) {
  coverageZones(
    limit: $limit
    offset: $offset
    siteId: $siteId
    areaType: $areaType
  ) {
    zones {
      id
      name
      description
      siteId
      siteName
      floor
      areaType
      coverageAreaSqm
      signalStrengthMinDbm
      signalStrengthMaxDbm
      signalStrengthAvgDbm
      accessPointIds
      accessPointCount
      interferenceLevel
      channelUtilizationAvg
      noiseFloorAvgDbm
      connectedClients
      maxClientCapacity
      clientDensityPerAp
      coveragePolygon
      createdAt
      updatedAt
      lastSurveyedAt
    }
    totalCount
    hasNextPage
  }
}
    `;
var useCoverageZoneListQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["CoverageZoneList"] : ["CoverageZoneList", variables],
    queryFn: graphqlFetcher(
      CoverageZoneListDocument2,
      variables
    ),
    ...options
  });
};
useCoverageZoneListQuery.getKey = (variables) => variables === void 0 ? ["CoverageZoneList"] : ["CoverageZoneList", variables];
var useInfiniteCoverageZoneListQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["CoverageZoneList.infinite"] : ["CoverageZoneList.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          CoverageZoneListDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteCoverageZoneListQuery.getKey = (variables) => variables === void 0 ? ["CoverageZoneList.infinite"] : ["CoverageZoneList.infinite", variables];
useCoverageZoneListQuery.fetcher = (variables, options) => graphqlFetcher(
  CoverageZoneListDocument2,
  variables,
  options
);
var CoverageZoneDetailDocument2 = `
    query CoverageZoneDetail($id: ID!) {
  coverageZone(id: $id) {
    id
    name
    description
    siteId
    siteName
    floor
    areaType
    coverageAreaSqm
    signalStrengthMinDbm
    signalStrengthMaxDbm
    signalStrengthAvgDbm
    accessPointIds
    accessPointCount
    interferenceLevel
    channelUtilizationAvg
    noiseFloorAvgDbm
    connectedClients
    maxClientCapacity
    clientDensityPerAp
    coveragePolygon
    createdAt
    updatedAt
    lastSurveyedAt
  }
}
    `;
var useCoverageZoneDetailQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["CoverageZoneDetail", variables],
    queryFn: graphqlFetcher(
      CoverageZoneDetailDocument2,
      variables
    ),
    ...options
  });
};
useCoverageZoneDetailQuery.getKey = (variables) => [
  "CoverageZoneDetail",
  variables
];
var useInfiniteCoverageZoneDetailQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["CoverageZoneDetail.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          CoverageZoneDetailDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteCoverageZoneDetailQuery.getKey = (variables) => [
  "CoverageZoneDetail.infinite",
  variables
];
useCoverageZoneDetailQuery.fetcher = (variables, options) => graphqlFetcher(
  CoverageZoneDetailDocument2,
  variables,
  options
);
var CoverageZonesBySiteDocument2 = `
    query CoverageZonesBySite($siteId: String!) {
  coverageZonesBySite(siteId: $siteId) {
    id
    name
    floor
    areaType
    coverageAreaSqm
    accessPointCount
    connectedClients
    maxClientCapacity
    signalStrengthAvgDbm
  }
}
    `;
var useCoverageZonesBySiteQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["CoverageZonesBySite", variables],
    queryFn: graphqlFetcher(
      CoverageZonesBySiteDocument2,
      variables
    ),
    ...options
  });
};
useCoverageZonesBySiteQuery.getKey = (variables) => [
  "CoverageZonesBySite",
  variables
];
var useInfiniteCoverageZonesBySiteQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["CoverageZonesBySite.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          CoverageZonesBySiteDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteCoverageZonesBySiteQuery.getKey = (variables) => [
  "CoverageZonesBySite.infinite",
  variables
];
useCoverageZonesBySiteQuery.fetcher = (variables, options) => graphqlFetcher(
  CoverageZonesBySiteDocument2,
  variables,
  options
);
var RfAnalyticsDocument2 = `
    query RFAnalytics($siteId: String!) {
  rfAnalytics(siteId: $siteId) {
    siteId
    siteName
    analysisTimestamp
    channelUtilization24ghz {
      channel
      frequencyMhz
      band
      utilizationPercent
      interferenceLevel
      accessPointsCount
    }
    channelUtilization5ghz {
      channel
      frequencyMhz
      band
      utilizationPercent
      interferenceLevel
      accessPointsCount
    }
    channelUtilization6ghz {
      channel
      frequencyMhz
      band
      utilizationPercent
      interferenceLevel
      accessPointsCount
    }
    recommendedChannels24ghz
    recommendedChannels5ghz
    recommendedChannels6ghz
    interferenceSources {
      sourceType
      frequencyMhz
      strengthDbm
      affectedChannels
    }
    totalInterferenceScore
    averageSignalStrengthDbm
    averageSnr
    coverageQualityScore
    clientsPerBand24ghz
    clientsPerBand5ghz
    clientsPerBand6ghz
    bandUtilizationBalanceScore
  }
}
    `;
var useRfAnalyticsQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["RFAnalytics", variables],
    queryFn: graphqlFetcher(
      RfAnalyticsDocument2,
      variables
    ),
    ...options
  });
};
useRfAnalyticsQuery.getKey = (variables) => ["RFAnalytics", variables];
var useInfiniteRfAnalyticsQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["RFAnalytics.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(RfAnalyticsDocument2, {
          ...variables,
          ...metaData.pageParam ?? {}
        })(),
        ...restOptions
      };
    })()
  );
};
useInfiniteRfAnalyticsQuery.getKey = (variables) => [
  "RFAnalytics.infinite",
  variables
];
useRfAnalyticsQuery.fetcher = (variables, options) => graphqlFetcher(
  RfAnalyticsDocument2,
  variables,
  options
);
var ChannelUtilizationDocument2 = `
    query ChannelUtilization($siteId: String!, $frequencyBand: FrequencyBand!) {
  channelUtilization(siteId: $siteId, frequencyBand: $frequencyBand) {
    channel
    frequencyMhz
    band
    utilizationPercent
    interferenceLevel
    accessPointsCount
  }
}
    `;
var useChannelUtilizationQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["ChannelUtilization", variables],
    queryFn: graphqlFetcher(
      ChannelUtilizationDocument2,
      variables
    ),
    ...options
  });
};
useChannelUtilizationQuery.getKey = (variables) => [
  "ChannelUtilization",
  variables
];
var useInfiniteChannelUtilizationQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["ChannelUtilization.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          ChannelUtilizationDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteChannelUtilizationQuery.getKey = (variables) => [
  "ChannelUtilization.infinite",
  variables
];
useChannelUtilizationQuery.fetcher = (variables, options) => graphqlFetcher(
  ChannelUtilizationDocument2,
  variables,
  options
);
var WirelessSiteMetricsDocument2 = `
    query WirelessSiteMetrics($siteId: String!) {
  wirelessSiteMetrics(siteId: $siteId) {
    siteId
    siteName
    totalAps
    onlineAps
    offlineAps
    degradedAps
    totalClients
    clients24ghz
    clients5ghz
    clients6ghz
    averageSignalStrengthDbm
    averageSnr
    totalThroughputMbps
    totalCapacity
    capacityUtilizationPercent
    overallHealthScore
    rfHealthScore
    clientExperienceScore
  }
}
    `;
var useWirelessSiteMetricsQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: ["WirelessSiteMetrics", variables],
    queryFn: graphqlFetcher(
      WirelessSiteMetricsDocument2,
      variables
    ),
    ...options
  });
};
useWirelessSiteMetricsQuery.getKey = (variables) => [
  "WirelessSiteMetrics",
  variables
];
var useInfiniteWirelessSiteMetricsQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["WirelessSiteMetrics.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          WirelessSiteMetricsDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteWirelessSiteMetricsQuery.getKey = (variables) => [
  "WirelessSiteMetrics.infinite",
  variables
];
useWirelessSiteMetricsQuery.fetcher = (variables, options) => graphqlFetcher(
  WirelessSiteMetricsDocument2,
  variables,
  options
);
var WirelessDashboardDocument2 = `
    query WirelessDashboard {
  wirelessDashboard {
    totalSites
    totalAccessPoints
    totalClients
    totalCoverageZones
    onlineAps
    offlineAps
    degradedAps
    clientsByBand24ghz
    clientsByBand5ghz
    clientsByBand6ghz
    topApsByClients {
      id
      name
      siteName
      performance {
        connectedClients
      }
    }
    topApsByThroughput {
      id
      name
      siteName
      performance {
        txRateMbps
        rxRateMbps
      }
    }
    sitesWithIssues {
      siteId
      siteName
      offlineAps
      degradedAps
      overallHealthScore
    }
    totalThroughputMbps
    averageSignalStrengthDbm
    averageClientExperienceScore
    clientCountTrend
    throughputTrendMbps
    offlineEventsCount
    generatedAt
  }
}
    `;
var useWirelessDashboardQuery = (variables, options) => {
  return (0, import_react_query.useQuery)({
    queryKey: variables === void 0 ? ["WirelessDashboard"] : ["WirelessDashboard", variables],
    queryFn: graphqlFetcher(
      WirelessDashboardDocument2,
      variables
    ),
    ...options
  });
};
useWirelessDashboardQuery.getKey = (variables) => variables === void 0 ? ["WirelessDashboard"] : ["WirelessDashboard", variables];
var useInfiniteWirelessDashboardQuery = (variables, options) => {
  return (0, import_react_query.useInfiniteQuery)(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? variables === void 0 ? ["WirelessDashboard.infinite"] : ["WirelessDashboard.infinite", variables],
        queryFn: (metaData) => graphqlFetcher(
          WirelessDashboardDocument2,
          { ...variables, ...metaData.pageParam ?? {} }
        )(),
        ...restOptions
      };
    })()
  );
};
useInfiniteWirelessDashboardQuery.getKey = (variables) => variables === void 0 ? ["WirelessDashboard.infinite"] : ["WirelessDashboard.infinite", variables];
useWirelessDashboardQuery.fetcher = (variables, options) => graphqlFetcher(
  WirelessDashboardDocument2,
  variables,
  options
);

// src/subscription-adapter.ts
var import_client3 = require("@apollo/client");
function useGraphQLSubscription(subscription, options = {}) {
  const { variables, skip, onData, onError, onComplete } = options;
  const result = (0, import_client3.useSubscription)(subscription, {
    variables,
    ...skip !== void 0 ? { skip } : {},
    ...onData ? {
      onData: ({ data }) => {
        const actualData = data?.data || null;
        onData({ data: actualData });
      }
    } : {},
    ...onError ? { onError } : {},
    ...onComplete ? { onComplete } : {}
  });
  return {
    data: result.data || null,
    loading: result.loading,
    ...result.error ? { error: result.error } : {}
  };
}

// src/query-helpers.ts
function mapQueryResult(queryResult) {
  const { data, isLoading, isFetching, error, refetch } = queryResult;
  const hasData = data !== void 0 && data !== null;
  return {
    data,
    // Only treat as loading while no data is available yet
    loading: !hasData && (isLoading || isFetching),
    isRefetching: hasData && isFetching,
    // Normalize error to string (Apollo returned error.message)
    error: error instanceof Error ? error.message : error ? String(error) : void 0,
    refetch: () => {
      refetch();
    }
  };
}
function mapQueryResultWithTransform(queryResult, transform) {
  const { data, isLoading, isFetching, error, refetch } = queryResult;
  const hasData = data !== void 0 && data !== null;
  return {
    data: transform(data),
    loading: !hasData && (isLoading || isFetching),
    isRefetching: hasData && isFetching,
    error: error instanceof Error ? error.message : error ? String(error) : void 0,
    refetch: () => {
      refetch();
    }
  };
}
var loadingHelpers = {
  /**
   * Check if query is in initial loading state (no data yet)
   */
  isInitialLoading: (result) => result.isLoading,
  /**
   * Check if query is refetching (has data, fetching in background)
   */
  isRefetching: (result) => !result.isLoading && result.isFetching,
  /**
   * Check if any loading state is active
   */
  isAnyLoading: (result) => result.isLoading || result.isFetching
};
function hasQueryData(result) {
  return result.data !== void 0 && !result.loading && !result.error;
}

// src/normalization-helpers.ts
function normalizeDashboardHook(query, extractData) {
  const data = query.isLoading || query.error ? void 0 : extractData(query);
  return {
    data,
    loading: query.isLoading && !data,
    error: query.error,
    refetch: query.refetch,
    isRefetching: Boolean(query.isFetching)
  };
}
function normalizeListQuery(query, extractItems) {
  return normalizeDashboardHook(query, extractItems);
}
function normalizeDetailQuery(query, extractDetail) {
  const detail = query.isLoading || query.error ? void 0 : extractDetail(query);
  return {
    data: detail,
    loading: query.isLoading && !detail,
    error: query.error,
    refetch: query.refetch,
    isRefetching: Boolean(query.isFetching)
  };
}
function extractDashboardData(extractors) {
  return (query) => {
    const result = {};
    for (const key in extractors) {
      const extractor = extractors[key];
      if (extractor) {
        result[key] = extractor(query);
      }
    }
    return result;
  };
}
function combineQueryResults(result1, result2) {
  const hasData = result1.data !== void 0 && result2.data !== void 0;
  const isLoading = result1.loading || result2.loading;
  const error = result1.error || result2.error;
  return {
    data: hasData ? [result1.data, result2.data] : void 0,
    loading: isLoading && !hasData,
    error,
    refetch: () => {
      result1.refetch();
      result2.refetch();
    },
    isRefetching: result1.isRefetching || result2.isRefetching
  };
}

// src/query-boundary.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function DefaultLoadingSkeleton() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4 animate-pulse", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 bg-gray-200 rounded w-1/4" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 bg-gray-200 rounded" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 bg-gray-200 rounded" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 bg-gray-200 rounded" })
  ] });
}
function DefaultErrorDisplay({ error }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "rounded-md bg-red-50 p-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { className: "h-5 w-5 text-red-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "path",
      {
        fillRule: "evenodd",
        d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
        clipRule: "evenodd"
      }
    ) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ml-3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-sm font-medium text-red-800", children: "Error" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-2 text-sm text-red-700", children: error })
    ] })
  ] }) });
}
function DefaultEmptyState() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center py-12", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "svg",
      {
        className: "mx-auto h-12 w-12 text-gray-400",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          }
        )
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "No data" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "mt-1 text-sm text-gray-500", children: "No results found for this query" })
  ] });
}
function QueryBoundary({
  result,
  children,
  loadingComponent,
  errorComponent,
  emptyComponent,
  isEmpty,
  skipEmptyCheck = false
}) {
  if (result.loading) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: loadingComponent ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DefaultLoadingSkeleton, {}) });
  }
  if (result.error) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: errorComponent ? errorComponent(result.error) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DefaultErrorDisplay, { error: result.error }) });
  }
  if (result.data === void 0 || result.data === null) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: emptyComponent ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DefaultEmptyState, {}) });
  }
  if (!skipEmptyCheck && isEmpty && isEmpty(result.data)) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: emptyComponent ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DefaultEmptyState, {}) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: children(result.data) });
}
function ListQueryBoundary({
  result,
  data,
  children,
  loadingComponent,
  errorComponent,
  emptyComponent
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    QueryBoundary,
    {
      result,
      loadingComponent,
      ...errorComponent ? { errorComponent } : {},
      emptyComponent,
      isEmpty: (d) => Array.isArray(data) && data.length === 0,
      children
    }
  );
}

// src/mutation-helpers.ts
var import_react_query2 = require("@tanstack/react-query");
function useMutationWithToast(mutationOptions, toastOptions) {
  const {
    successMessage,
    errorMessage,
    showSuccessToast = true,
    showErrorToast = true,
    onSuccess: userOnSuccess,
    onError: userOnError,
    onSettled: userOnSettled,
    toast,
    logger,
    operationName = "Mutation"
  } = toastOptions;
  return (0, import_react_query2.useMutation)({
    ...mutationOptions,
    onSuccess: async (data, variables, context) => {
      if (showSuccessToast && successMessage) {
        const message = typeof successMessage === "function" ? successMessage(data, variables) : successMessage;
        toast({
          title: "Success",
          description: message,
          variant: "default"
        });
      }
      if (logger?.info) {
        logger.info(`${operationName} succeeded`, { data, variables });
      }
      if (userOnSuccess) {
        await userOnSuccess(data, variables, context);
      }
      if (mutationOptions.onSuccess) {
        await mutationOptions.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (showErrorToast) {
        const customMessage = typeof errorMessage === "function" ? errorMessage(error, variables) : errorMessage;
        handleGraphQLError(error, {
          toast,
          ...logger ? {
            logger: {
              error: (message, err, ctx) => {
                logger.error(message, err);
              }
            }
          } : {},
          operationName,
          ...customMessage ? { customMessage } : {},
          context: { variables }
        });
      }
      if (userOnError) {
        userOnError(error, variables, context);
      }
      if (mutationOptions.onError) {
        mutationOptions.onError(error, variables, context);
      }
    },
    onSettled: (data, error, variables, context) => {
      if (userOnSettled) {
        userOnSettled(data, error, variables, context);
      }
      if (mutationOptions.onSettled) {
        mutationOptions.onSettled(data, error, variables, context);
      }
    }
  });
}
function createOptimisticUpdate(queryClient, queryKey, updater) {
  return {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      if (previousData !== void 0) {
        const optimistic = updater(previousData, variables);
        queryClient.setQueryData(queryKey, optimistic);
      }
      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData !== void 0) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  };
}
function invalidateQueries(queryClient, queryKeys) {
  return {
    onSuccess: () => {
      queryKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    }
  };
}
function useFormMutation(form, mutationOptions, toastOptions) {
  const { resetOnSuccess = false, ...restToastOptions } = toastOptions;
  return useMutationWithToast(mutationOptions, {
    ...restToastOptions,
    onSuccess: async (data, variables, context) => {
      if (resetOnSuccess && form.reset) {
        form.reset();
      }
      if (restToastOptions.onSuccess) {
        await restToastOptions.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (form.setError && error && typeof error === "object" && "graphQLErrors" in error) {
        const graphQLErrors = error.graphQLErrors;
        if (Array.isArray(graphQLErrors)) {
          graphQLErrors.forEach((gqlError) => {
            if (gqlError.extensions?.field && form.setError) {
              form.setError(gqlError.extensions.field, {
                type: "server",
                message: gqlError.message
              });
            }
          });
        }
      }
      if (restToastOptions.onError) {
        restToastOptions.onError(error, variables, context);
      }
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AccessPointDetailDocument,
  AccessPointListDocument,
  AccessPointStatus,
  AccessPointsBySiteDocument,
  ActiveSessionsDocument,
  ActivityTypeEnum,
  AlertSeverityEnum,
  BillingCycleEnum,
  CableInstallationType,
  ChannelUtilizationDocument,
  ClientConnectionType,
  CoverageZoneDetailDocument,
  CoverageZoneListDocument,
  CoverageZonesBySiteDocument,
  Customer360ViewDocument,
  CustomerActivitiesDocument,
  CustomerActivityAddedDocument,
  CustomerBillingDocument,
  CustomerDashboardDocument,
  CustomerDetailDocument,
  CustomerDevicesDocument,
  CustomerDevicesUpdatedDocument,
  CustomerListDocument,
  CustomerMetricsDocument,
  CustomerNetworkInfoDocument,
  CustomerNetworkStatusUpdatedDocument,
  CustomerNoteUpdatedDocument,
  CustomerNotesDocument,
  CustomerStatusEnum,
  CustomerSubscriptionsDocument,
  CustomerTicketUpdatedDocument,
  CustomerTicketsDocument,
  CustomerTierEnum,
  CustomerTypeEnum,
  DeviceDetailDocument,
  DeviceStatusEnum,
  DeviceTrafficDocument,
  DeviceTypeEnum,
  DeviceUpdatesDocument,
  DistributionPointDetailDocument,
  DistributionPointListDocument,
  DistributionPointType,
  DistributionPointsBySiteDocument,
  FiberCableDetailDocument,
  FiberCableListDocument,
  FiberCableStatus,
  FiberCablesByDistributionPointDocument,
  FiberCablesByRouteDocument,
  FiberDashboardDocument,
  FiberHealthMetricsDocument,
  FiberHealthStatus,
  FiberNetworkAnalyticsDocument,
  FiberType,
  FrequencyBand,
  GraphQLClient,
  GraphQLError,
  ListQueryBoundary,
  NetworkAlertDetailDocument,
  NetworkAlertListDocument,
  NetworkAlertUpdatesDocument,
  NetworkDashboardDocument,
  NetworkDeviceListDocument,
  NetworkOverviewDocument,
  OtdrTestResultsDocument,
  PaymentMethodTypeEnum,
  PaymentStatusEnum,
  PermissionCategoryEnum,
  PermissionsByCategoryDocument,
  PlanListDocument,
  ProductListDocument,
  ProductTypeEnum,
  QueryBoundary,
  ReactQueryHooks,
  RfAnalyticsDocument,
  RoleListDocument,
  ServiceAreaDetailDocument,
  ServiceAreaListDocument,
  ServiceAreaType,
  ServiceAreasByPostalCodeDocument,
  SplicePointDetailDocument,
  SplicePointListDocument,
  SplicePointsByCableDocument,
  SpliceStatus,
  SpliceType,
  SubscriberDashboardDocument,
  SubscriberDocument,
  SubscriberMetricsDocument,
  SubscriptionDashboardDocument,
  SubscriptionDetailDocument,
  SubscriptionListDocument,
  SubscriptionMetricsDocument,
  SubscriptionStatusEnum,
  TenantPlanTypeEnum,
  TenantStatusEnum,
  UserDashboardDocument,
  UserDetailDocument,
  UserListDocument,
  UserMetricsDocument,
  UserPermissionsDocument,
  UserRolesDocument,
  UserStatusEnum,
  UserTeamsDocument,
  WirelessClientDetailDocument,
  WirelessClientListDocument,
  WirelessClientsByAccessPointDocument,
  WirelessClientsByCustomerDocument,
  WirelessDashboardDocument,
  WirelessSecurityType,
  WirelessSiteMetricsDocument,
  WorkflowStatus,
  WorkflowStepStatus,
  WorkflowType,
  combineQueryResults,
  createGraphQLClient,
  createOptimisticUpdate,
  extractDashboardData,
  graphql,
  graphqlClient,
  graphqlFetcher,
  handleGraphQLError,
  hasQueryData,
  invalidateQueries,
  isFragmentReady,
  loadingHelpers,
  makeFragmentData,
  mapQueryResult,
  mapQueryResultWithTransform,
  normalizeDashboardHook,
  normalizeDetailQuery,
  normalizeListQuery,
  useFormMutation,
  useFragment,
  useGraphQLSubscription,
  useMutationWithToast
});
