#!/usr/bin/env python3
"""
Fix remaining TS2375 exactOptionalPropertyTypes errors
"""
import re
from pathlib import Path

BASE_DIR = Path(__file__).parent

def fix_file(filepath, replacements):
    """Apply replacements to a file"""
    file_path = BASE_DIR / filepath
    if not file_path.exists():
        print(f"Warning: {filepath} not found")
        return False

    content = file_path.read_text()
    modified = False

    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            modified = True
            print(f"Fixed pattern in {filepath}")

    if modified:
        file_path.write_text(content)
    return modified

# Fix useUsersGraphQL.ts
fix_file("hooks/useUsersGraphQL.ts", [
    (
        """  const { data, loading, error, refetch } = useUserListQuery({
    variables: {
      page,
      pageSize,
      isActive,
      isVerified,
      isSuperuser,
      isPlatformAdmin,
      search,
      includeMetadata,
      includeRoles,
      includePermissions,
      includeTeams,
    },""",
        """  const { data, loading, error, refetch } = useUserListQuery({
    variables: {
      page,
      pageSize,
      ...(isActive !== undefined && { isActive }),
      ...(isVerified !== undefined && { isVerified }),
      ...(isSuperuser !== undefined && { isSuperuser }),
      ...(isPlatformAdmin !== undefined && { isPlatformAdmin }),
      ...(search && { search }),
      includeMetadata,
      includeRoles,
      includePermissions,
      includeTeams,
    },"""
    ),
    (
        """  const { data, loading, error, refetch } = useRoleListQuery({
    variables: {
      page,
      pageSize,
      isActive,
      isSystem,
      search,
    },""",
        """  const { data, loading, error, refetch } = useRoleListQuery({
    variables: {
      page,
      pageSize,
      ...(isActive !== undefined && { isActive }),
      ...(isSystem !== undefined && { isSystem }),
      ...(search && { search }),
    },"""
    ),
    (
        """  const { data, loading, error, refetch } = usePermissionListQuery({
    variables: {
      category,
    },""",
        """  const { data, loading, error, refetch } = usePermissionListQuery({
    variables: {
      ...(category && { category }),
    },"""
    ),
    (
        """  const { data, loading, error, refetch } = useTeamListQuery({
    variables: {
      page,
      pageSize,
      isActive,
      search,
    },""",
        """  const { data, loading, error, refetch } = useTeamListQuery({
    variables: {
      page,
      pageSize,
      ...(isActive !== undefined && { isActive }),
      ...(search && { search }),
    },"""
    ),
])

# Fix useWirelessGraphQL.ts
fix_file("hooks/useWirelessGraphQL.ts", [
    (
        """  const { data, loading, error, refetch } = useAccessPointListQuery({
    variables: {
      limit,
      offset,
      status,
      siteId,
      search,
    },""",
        """  const { data, loading, error, refetch } = useAccessPointListQuery({
    variables: {
      limit,
      offset,
      ...(status && { status }),
      ...(siteId && { siteId }),
      ...(search && { search }),
    },"""
    ),
    (
        """  const { data, loading, error, refetch } = useWirelessClientListQuery({
    variables: {
      limit,
      offset,
      accessPointId,
      customerId,
      frequencyBand,
      search,
    },""",
        """  const { data, loading, error, refetch } = useWirelessClientListQuery({
    variables: {
      limit,
      offset,
      ...(accessPointId && { accessPointId }),
      ...(customerId && { customerId }),
      ...(frequencyBand && { frequencyBand }),
      ...(search && { search }),
    },"""
    ),
    (
        """  const { data, loading, error, refetch } = useCoverageAreaListQuery({
    variables: {
      limit,
      offset,
      siteId,
    },""",
        """  const { data, loading, error, refetch } = useCoverageAreaListQuery({
    variables: {
      limit,
      offset,
      ...(siteId && { siteId }),
    },"""
    ),
])

# Fix useInternetPlans.ts
fix_file("hooks/useInternetPlans.ts", [
    (
        """    const params: ListSubscriptionsParams = {
      plan_id: planId || undefined,""",
        """    const params: ListSubscriptionsParams = {
      ...(planId && { plan_id: planId }),"""
    ),
    (
        """    const params: ListSubscriptionsParams = {
      customer_id: customerId || undefined,""",
        """    const params: ListSubscriptionsParams = {
      ...(customerId && { customer_id: customerId }),"""
    ),
])

# Fix lib files
fix_file("lib/api/response-helpers.ts", [
    (
        """  return {
    data,
    message,
    success: true,
  };""",
        """  return {
    data,
    ...(message && { message }),
    success: true,
  };"""
    ),
])

fix_file("lib/services/communications-service.ts", [
    (
        """      return {
        smtp_available: false,
        redis_available: false,
        celery_available: false,
        smtp_host: undefined,
        smtp_port: undefined,""",
        """      return {
        smtp_available: false,
        redis_available: false,
        celery_available: false,
        // smtp_host and smtp_port not available"""
    ),
])

fix_file("lib/services/versioning-service.ts", [
    (
        """    return {
      major,
      minor,
      patch,
    };""",
        """    return {
      major,
      ...(minor !== undefined && { minor }),
      ...(patch !== undefined && { patch }),
    };"""
    ),
])

# Fix useLicensing.ts
fix_file("hooks/useLicensing.ts", [
    (
        "modulesError: modulesQuery.error || null,",
        "...(modulesQuery.error && { modulesError: modulesQuery.error }),"
    ),
])

# Fix notifications/templates/page.tsx
fix_file("app/dashboard/notifications/templates/page.tsx", [
    (
        "bulkActions={bulkActions}",
        "{...(bulkActions && { bulkActions })}"
    ),
])

# Fix billing lists
fix_file("components/billing/InvoiceList.tsx", [
    (
        "exportOptions={exportOptions}",
        "{...(exportOptions && { exportOptions })}"
    ),
])

fix_file("components/billing/ReceiptList.tsx", [
    (
        "exportOptions={exportOptions}",
        "{...(exportOptions && { exportOptions })}"
    ),
])

# Fix CustomerEditModal.refactored.tsx
fix_file("components/customers/CustomerEditModal.refactored.tsx", [
    (
        "credit_limit: formData.credit_limit ? parseFloat(formData.credit_limit) : undefined,",
        "...(formData.credit_limit && { credit_limit: parseFloat(formData.credit_limit) }),"
    ),
    (
        "payment_terms: formData.payment_terms ? parseInt(formData.payment_terms) : undefined,",
        "...(formData.payment_terms && { payment_terms: parseInt(formData.payment_terms) }),"
    ),
])

# Fix CPEConfigTemplates.tsx
fix_file("components/genieacs/CPEConfigTemplates.tsx", [
    (
        """      wifi: wifiConfig || undefined,
      lan: lanConfig || undefined,
      wan: wanConfig || undefined,
      custom_parameters: customParams || undefined,""",
        """      ...(wifiConfig && { wifi: wifiConfig }),
      ...(lanConfig && { lan: lanConfig }),
      ...(wanConfig && { wan: wanConfig }),
      ...(customParams && { custom_parameters: customParams }),"""
    ),
])

# Fix TenantOnboardingWizard.tsx
fix_file("components/tenant/TenantOnboardingWizard.tsx", [
    (
        """      contact_email: values.contact_email || undefined,
      contact_phone: values.contact_phone || undefined,
      billing_email: values.billing_email || undefined,
      address: values.address || undefined,
      city: values.city || undefined,
      state: values.state || undefined,
      postal_code: values.postal_code || undefined,
      country: values.country || undefined,""",
        """      ...(values.contact_email && { contact_email: values.contact_email }),
      ...(values.contact_phone && { contact_phone: values.contact_phone }),
      ...(values.billing_email && { billing_email: values.billing_email }),
      ...(values.address && { address: values.address }),
      ...(values.city && { city: values.city }),
      ...(values.state && { state: values.state }),
      ...(values.postal_code && { postal_code: values.postal_code }),
      ...(values.country && { country: values.country }),"""
    ),
])

# Fix CreatePartnerModal.tsx
fix_file("components/partners/CreatePartnerModal.tsx", [
    (
        """      tier: formData.tier || undefined,
      default_commission_rate: formData.default_commission_rate
        ? parseFloat(formData.default_commission_rate)
        : undefined,
      billing_email: formData.billing_email || undefined,
      phone: formData.phone || undefined,""",
        """      ...(formData.tier && { tier: formData.tier }),
      ...(formData.default_commission_rate && {
        default_commission_rate: parseFloat(formData.default_commission_rate)
      }),
      ...(formData.billing_email && { billing_email: formData.billing_email }),
      ...(formData.phone && { phone: formData.phone }),"""
    ),
])

# Fix global-command-palette.tsx
fix_file("components/global-command-palette.tsx", [
    (
        "keywords={item.keywords}",
        "{...(item.keywords && { keywords: item.keywords })}"
    ),
])

print("\nAll remaining fixes applied!")
