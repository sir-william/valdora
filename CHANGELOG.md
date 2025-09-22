# Changelog

All notable changes to this project will be documented in this file.

## [1.0.1] - 2025-09-22

### 🐛 Corrections Critiques
- **Fix Layout**: Résolution du problème de sidebar navigation dans dashboard et test-dashboard
- **Fix Double Layout**: Suppression des layouts dupliqués causant des conflits d'affichage  
- **Fix Navigation**: Sidebar maintenant visible et fonctionnelle sur toutes les pages
- **Fix Auto-Detection**: Badges "Auto-détecté" maintenant visibles correctement

### 📊 Améliorations
- **Performance**: Réduction de la taille du bundle grâce à la suppression des layouts dupliqués
- **UX**: Navigation cohérente et professionnelle sur toutes les pages
- **Architecture**: Structure de layout simplifiée et maintenable

### 📚 Documentation
- **Layout Fix Guide**: Documentation complète du fix de layout (LAYOUT_FIX_DOCUMENTATION.md)
- **Troubleshooting**: Guide de dépannage pour les problèmes de layout futurs
- **Best Practices**: Bonnes pratiques pour la création de nouvelles pages

## [1.0.0] - 2025-09-22

### Added
- **Tenant Management Module**: A comprehensive module for managing tenants has been added under the `/admin/tenants` route.
- **Tenant List View**: A new page at `/admin/tenants` that displays a list of all tenants with search and filter capabilities.
- **Tenant Detail View**: A dynamic page at `/admin/tenants/[id]` that shows detailed information about a specific tenant, including their status, usage, and configuration.
- **Tenant Creation Form**: A form at `/admin/tenants/new` for creating new tenants with detailed configuration options for plans, features, and billing.
- **Tenant Edit Form**: A form at `/admin/tenants/[id]/edit` for modifying existing tenant information.
- **Tenant Deletion**: Functionality to delete a tenant from the detail view.
- **Tenant Status Toggle**: A switch in the tenant detail view to activate or deactivate a tenant.
- **RTK Query API for Tenants**: Redux Toolkit Query service has been extended to include endpoints for `getTenants`, `getTenantById`, `createTenant`, `updateTenant`, and `deleteTenant`.
- **Mock API for Tenants**: A complete mock service for the tenant API to allow for frontend development and testing without a live backend.
- **Navigation Menu**: The vertical navigation menu has been updated to include a new "Administration" section with links to the tenant management pages.

### Changed
- **Routing**: The application now includes dynamic routes for tenant details and editing.
- **Next.js Config**: Temporarily disabled `output: "export"` for development testing of dynamic routes. This will be re-enabled for production builds.

### Fixed
- Resolved build errors related to `generateStaticParams` in client components by removing it and adjusting the Next.js configuration for development.

