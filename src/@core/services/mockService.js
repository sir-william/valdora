/**
 * Service de données mock pour VALDORA
 * Fournit des données de test réalistes pour le développement
 */

import { mockDelay, logger, config } from '../utils/config'

// Données mock pour les brouillons AI Store
export const mockAiStoreDrafts = [
  {
    id: 1,
    name: 'Boutique Mode Élégante',
    description: 'Boutique de vêtements féminins haut de gamme',
    status: 'completed',
    progress: 100,
    industry: 'Fashion',
    targetAudience: 'Femmes 25-45 ans, urbaines, actives',
    businessModel: 'B2C',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    estimatedRevenue: 15000,
    productsCount: 120,
  },
  {
    id: 2,
    name: 'Tech Store Pro',
    description: 'Boutique d\'électronique et gadgets technologiques',
    status: 'generating',
    progress: 75,
    industry: 'Electronics',
    targetAudience: 'Hommes et femmes 18-40 ans, passionnés de tech',
    businessModel: 'B2C',
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-21T11:20:00Z',
    estimatedRevenue: 25000,
    productsCount: 85,
  },
  {
    id: 3,
    name: 'Beauty Corner',
    description: 'Cosmétiques et produits de beauté naturels',
    status: 'pending',
    progress: 0,
    industry: 'Beauty',
    targetAudience: 'Femmes 20-50 ans, soucieuses de leur apparence',
    businessModel: 'B2C',
    createdAt: '2024-01-17T16:00:00Z',
    updatedAt: '2024-01-17T16:00:00Z',
    estimatedRevenue: 8000,
    productsCount: 0,
  },
  {
    id: 4,
    name: 'Sports & Fitness',
    description: 'Équipements sportifs et accessoires fitness',
    status: 'completed',
    progress: 100,
    industry: 'Sports',
    targetAudience: 'Sportifs et amateurs de fitness 18-60 ans',
    businessModel: 'B2C',
    createdAt: '2024-01-18T08:45:00Z',
    updatedAt: '2024-01-22T13:30:00Z',
    estimatedRevenue: 18500,
    productsCount: 95,
  },
  {
    id: 5,
    name: 'Home & Garden',
    description: 'Décoration intérieure et jardinage',
    status: 'generating',
    progress: 45,
    industry: 'Home',
    targetAudience: 'Propriétaires 30-65 ans, amateurs de décoration',
    businessModel: 'B2C',
    createdAt: '2024-01-19T12:20:00Z',
    updatedAt: '2024-01-23T09:15:00Z',
    estimatedRevenue: 12000,
    productsCount: 60,
  },
]

// Données mock pour les commandes
export const mockOrders = [
  {
    id: 'ORD-001',
    customerName: 'Marie Dubois',
    customerEmail: 'marie.dubois@email.com',
    storeName: 'Boutique Mode Élégante',
    amount: 159.99,
    status: 'completed',
    paymentStatus: 'paid',
    items: 3,
    createdAt: '2024-01-20T14:30:00Z',
    shippingAddress: '123 Rue de la Paix, 75001 Paris',
  },
  {
    id: 'ORD-002',
    customerName: 'Jean Martin',
    customerEmail: 'jean.martin@email.com',
    storeName: 'Tech Store Pro',
    amount: 299.50,
    status: 'processing',
    paymentStatus: 'paid',
    items: 2,
    createdAt: '2024-01-21T09:15:00Z',
    shippingAddress: '456 Avenue des Champs, 69000 Lyon',
  },
  {
    id: 'ORD-003',
    customerName: 'Sophie Laurent',
    customerEmail: 'sophie.laurent@email.com',
    storeName: 'Beauty Corner',
    amount: 89.99,
    status: 'pending',
    paymentStatus: 'pending',
    items: 4,
    createdAt: '2024-01-22T16:45:00Z',
    shippingAddress: '789 Boulevard Saint-Michel, 13000 Marseille',
  },
  {
    id: 'ORD-004',
    customerName: 'Pierre Durand',
    customerEmail: 'pierre.durand@email.com',
    storeName: 'Sports & Fitness',
    amount: 445.00,
    status: 'shipped',
    paymentStatus: 'paid',
    items: 1,
    createdAt: '2024-01-23T11:20:00Z',
    shippingAddress: '321 Rue de la République, 33000 Bordeaux',
  },
]

// Données mock pour les tenants
export const mockTenants = [
  {
    id: 'tenant-001',
    name: 'Acme Corporation',
    domain: 'https://acme.example.com',
    status: 'active',
    email: 'admin@acme.example.com',
    phone: '+1-555-0123',
    address: '123 Business Ave, Tech City, TC 12345',
    plan: 'enterprise',
    maxUsers: 100,
    currentUsers: 45,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-09-20T14:22:00Z',
    features: ['analytics', 'api_access', 'custom_domain', 'priority_support'],
    billingInfo: {
      monthlyRevenue: 2500.00,
      nextBillingDate: '2024-10-15T00:00:00Z',
      paymentMethod: 'credit_card'
    }
  },
  {
    id: 'tenant-002', 
    name: 'TechStart Solutions',
    domain: 'https://techstart.example.com',
    status: 'active',
    email: 'contact@techstart.example.com',
    phone: '+1-555-0456',
    address: '456 Innovation Blvd, Startup Valley, SV 67890',
    plan: 'professional',
    maxUsers: 25,
    currentUsers: 18,
    createdAt: '2024-03-22T09:15:00Z',
    updatedAt: '2024-09-18T11:45:00Z',
    features: ['analytics', 'api_access', 'custom_domain'],
    billingInfo: {
      monthlyRevenue: 750.00,
      nextBillingDate: '2024-10-22T00:00:00Z',
      paymentMethod: 'bank_transfer'
    }
  },
  {
    id: 'tenant-003',
    name: 'Global Retail Inc',
    domain: 'https://globalretail.example.com', 
    status: 'inactive',
    email: 'support@globalretail.example.com',
    phone: '+1-555-0789',
    address: '789 Commerce St, Retail City, RC 13579',
    plan: 'basic',
    maxUsers: 10,
    currentUsers: 3,
    createdAt: '2024-02-10T16:20:00Z',
    updatedAt: '2024-08-30T13:10:00Z',
    features: ['analytics'],
    billingInfo: {
      monthlyRevenue: 199.00,
      nextBillingDate: '2024-10-10T00:00:00Z',
      paymentMethod: 'credit_card'
    }
  },
  {
    id: 'tenant-004',
    name: 'Creative Agency Pro',
    domain: 'https://creativeagency.example.com',
    status: 'suspended',
    email: 'hello@creativeagency.example.com',
    phone: '+1-555-0321',
    address: '321 Design Lane, Art District, AD 24680',
    plan: 'professional',
    maxUsers: 25,
    currentUsers: 12,
    createdAt: '2024-05-05T12:00:00Z',
    updatedAt: '2024-09-15T09:30:00Z',
    features: ['analytics', 'api_access'],
    billingInfo: {
      monthlyRevenue: 750.00,
      nextBillingDate: '2024-10-05T00:00:00Z',
      paymentMethod: 'paypal'
    }
  },
  {
    id: 'tenant-005',
    name: 'HealthTech Innovations',
    domain: 'https://healthtech.example.com',
    status: 'active',
    email: 'info@healthtech.example.com',
    phone: '+1-555-0654',
    address: '654 Medical Plaza, Health City, HC 97531',
    plan: 'enterprise',
    maxUsers: 200,
    currentUsers: 87,
    createdAt: '2024-01-08T08:45:00Z',
    updatedAt: '2024-09-21T16:15:00Z',
    features: ['analytics', 'api_access', 'custom_domain', 'priority_support', 'compliance_tools'],
    billingInfo: {
      monthlyRevenue: 4200.00,
      nextBillingDate: '2024-10-08T00:00:00Z',
      paymentMethod: 'bank_transfer'
    }
  }
]

// Données mock pour les analytics
export const mockAnalytics = {
  overview: {
    totalStores: 12,
    activeStores: 8,
    totalOrders: 156,
    totalRevenue: 45230.50,
    monthlyGrowth: 15.3,
    conversionRate: 3.2,
  },
  revenueData: [
    { month: 'Jan', revenue: 12500, orders: 45 },
    { month: 'Fév', revenue: 15200, orders: 52 },
    { month: 'Mar', revenue: 18900, orders: 67 },
    { month: 'Avr', revenue: 22100, orders: 78 },
    { month: 'Mai', revenue: 19800, orders: 71 },
    { month: 'Juin', revenue: 25400, orders: 89 },
  ],
  topStores: [
    { name: 'Tech Store Pro', revenue: 25000, orders: 89 },
    { name: 'Sports & Fitness', revenue: 18500, orders: 67 },
    { name: 'Boutique Mode Élégante', revenue: 15000, orders: 52 },
    { name: 'Home & Garden', revenue: 12000, orders: 43 },
    { name: 'Beauty Corner', revenue: 8000, orders: 28 },
  ],
  ordersByStatus: [
    { status: 'Completed', count: 89, percentage: 57 },
    { status: 'Processing', count: 34, percentage: 22 },
    { status: 'Shipped', count: 23, percentage: 15 },
    { status: 'Pending', count: 10, percentage: 6 },
  ],
}

/**
 * Service Mock API
 */
class MockService {
  constructor() {
    this.isEnabled = config.mocks.enabled
    logger.info('MockService initialized', { enabled: this.isEnabled })
  }

  // AI Store Drafts
  async getAiStoreDrafts() {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Fetching AI Store Drafts (mock)')
    return {
      data: mockAiStoreDrafts,
      total: mockAiStoreDrafts.length,
      success: true,
    }
  }

  async createAiStoreDraft(data) {
    if (!this.isEnabled) return null
    
    await mockDelay(2000) // Simulation d'une création plus longue
    logger.debug('Creating AI Store Draft (mock)', data)
    
    const newDraft = {
      id: Date.now(),
      ...data,
      status: 'generating',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    return {
      data: newDraft,
      success: true,
    }
  }

  // Orders
  async getOrders() {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Fetching Orders (mock)')
    return {
      data: mockOrders,
      total: mockOrders.length,
      success: true,
    }
  }

  // Analytics
  async getAnalytics() {
    if (!this.isEnabled) return null
    
    await mockDelay(500)
    logger.debug('Fetching Analytics (mock)')
    return {
      data: mockAnalytics,
      success: true,
    }
  }

  // Tenants
  async getTenants(params = {}) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Fetching Tenants (mock)', params)
    
    let result = [...mockTenants]
    
    // Filtrage par statut
    if (params.status) {
      result = result.filter(tenant => tenant.status === params.status)
    }
    
    // Recherche par nom
    if (params.search) {
      const searchTerm = params.search.toLowerCase()
      result = result.filter(tenant => 
        tenant.name.toLowerCase().includes(searchTerm) ||
        tenant.domain.toLowerCase().includes(searchTerm) ||
        tenant.email.toLowerCase().includes(searchTerm)
      )
    }
    
    // Pagination
    const page = parseInt(params.page) || 1
    const limit = parseInt(params.limit) || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    
    return {
      data: result.slice(startIndex, endIndex),
      total: result.length,
      page,
      limit,
      totalPages: Math.ceil(result.length / limit),
      success: true,
    }
  }

  async getTenant(id) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Fetching Tenant (mock)', { id })
    
    const tenant = mockTenants.find(t => t.id === id)
    if (!tenant) {
      throw new Error('Tenant not found')
    }
    
    return {
      data: tenant,
      success: true,
    }
  }

  async createTenant(tenantData) {
    if (!this.isEnabled) return null
    
    await mockDelay(1500)
    logger.debug('Creating Tenant (mock)', tenantData)
    
    const newTenant = {
      id: `tenant-${Date.now()}`,
      ...tenantData,
      status: tenantData.status || 'active',
      currentUsers: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      features: tenantData.features || ['analytics'],
      billingInfo: {
        monthlyRevenue: 0,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: tenantData.billingInfo?.paymentMethod || 'credit_card'
      }
    }
    
    // Ajouter à la liste mock (simulation)
    mockTenants.push(newTenant)
    
    return {
      data: newTenant,
      success: true,
    }
  }

  async updateTenant(id, updates) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Updating Tenant (mock)', { id, updates })
    
    const index = mockTenants.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Tenant not found')
    }
    
    mockTenants[index] = {
      ...mockTenants[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return {
      data: mockTenants[index],
      success: true,
    }
  }

  async deleteTenant(id) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Deleting Tenant (mock)', { id })
    
    const index = mockTenants.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Tenant not found')
    }
    
    mockTenants.splice(index, 1)
    
    return {
      success: true,
    }
  }

  // Authentication
  async login(credentials) {
    if (!this.isEnabled) return null
    
    await mockDelay(1500)
    logger.debug('Login attempt (mock)', { email: credentials.email })
    
    // Simulation d'une authentification réussie
    return {
      data: {
        user: {
          id: 1,
          email: credentials.email,
          name: 'Utilisateur Test',
          role: 'admin',
        },
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
      },
      success: true,
    }
  }

  async logout() {
    if (!this.isEnabled) return null
    
    await mockDelay(500)
    logger.debug('Logout (mock)')
    return { success: true }
  }

  // ========== USER ROLE PERMISSION METHODS ==========

  async getUsers(params = {}) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Fetching Users (mock)', params)
    
    const { mockUserRolePermissionData } = await import('../../data/userRolePermission.json')
    let users = mockUserRolePermissionData.users
    
    // Apply filters
    if (params.search) {
      const search = params.search.toLowerCase()
      users = users.filter(user => 
        user.email.toLowerCase().includes(search) ||
        user.firstName?.toLowerCase().includes(search) ||
        user.lastName?.toLowerCase().includes(search)
      )
    }
    
    if (params.isActive !== undefined) {
      users = users.filter(user => user.isActive === params.isActive)
    }
    
    if (params.isEmailVerified !== undefined) {
      users = users.filter(user => user.isEmailVerified === params.isEmailVerified)
    }
    
    // Apply pagination
    const page = parseInt(params.page) || 1
    const limit = parseInt(params.limit) || 10
    const offset = (page - 1) * limit
    const paginatedUsers = users.slice(offset, offset + limit)
    
    return {
      data: paginatedUsers,
      meta: {
        total: users.length,
        page,
        limit,
        totalPages: Math.ceil(users.length / limit)
      },
      success: true,
    }
  }

  async getUser(id) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Fetching User (mock)', { id })
    
    const { mockUserRolePermissionData } = await import('../../data/userRolePermission.json')
    const user = mockUserRolePermissionData.users.find(u => u.id === parseInt(id))
    
    if (!user) {
      throw new Error('User not found')
    }
    
    // Enrich with role and permission details
    const userRoles = mockUserRolePermissionData.roles.filter(role => 
      user.userRoles.includes(role.id)
    )
    
    const allPermissions = []
    userRoles.forEach(role => {
      const rolePermissions = mockUserRolePermissionData.permissions.filter(permission =>
        role.permissions.includes(permission.id)
      )
      allPermissions.push(...rolePermissions)
    })
    
    const enrichedUser = {
      ...user,
      roleDetails: userRoles,
      permissionDetails: allPermissions.filter((permission, index, self) =>
        index === self.findIndex(p => p.id === permission.id)
      )
    }
    
    return {
      data: enrichedUser,
      success: true,
    }
  }

  async createUser(userData) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Creating User (mock)', userData)
    
    const { mockUserRolePermissionData } = await import('../../data/userRolePermission.json')
    
    const newUser = {
      id: Date.now(),
      ...userData,
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      isEmailVerified: false,
      emailVerifiedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: null,
      userRoles: userData.userRoles || [5], // Default to ROLE_USER
      stats: {
        tenantsCount: 0,
        ordersCount: 0,
        addressesCount: 0,
        rolesCount: userData.userRoles?.length || 1,
        permissionsCount: 0
      }
    }
    
    return {
      data: newUser,
      success: true,
    }
  }

  async updateUser(id, updates) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Updating User (mock)', { id, updates })
    
    const { mockUserRolePermissionData } = await import('../../data/userRolePermission.json')
    const user = mockUserRolePermissionData.users.find(u => u.id === parseInt(id))
    
    if (!user) {
      throw new Error('User not found')
    }
    
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return {
      data: updatedUser,
      success: true,
    }
  }

  async deleteUser(id) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Deleting User (mock)', { id })
    
    return {
      success: true,
    }
  }

  async getRoles(params = {}) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Fetching Roles (mock)', params)
    
    const { mockUserRolePermissionData } = await import('../../data/userRolePermission.json')
    let roles = mockUserRolePermissionData.roles
    
    // Apply filters
    if (params.search) {
      const search = params.search.toLowerCase()
      roles = roles.filter(role => 
        role.name.toLowerCase().includes(search) ||
        role.description?.toLowerCase().includes(search)
      )
    }
    
    if (params.level) {
      roles = roles.filter(role => role.level === params.level)
    }
    
    if (params.isActive !== undefined) {
      roles = roles.filter(role => role.isActive === params.isActive)
    }
    
    // Apply pagination
    const page = parseInt(params.page) || 1
    const limit = parseInt(params.limit) || 10
    const offset = (page - 1) * limit
    const paginatedRoles = roles.slice(offset, offset + limit)
    
    return {
      data: paginatedRoles,
      meta: {
        total: roles.length,
        page,
        limit,
        totalPages: Math.ceil(roles.length / limit)
      },
      success: true,
    }
  }

  async getRole(id) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Fetching Role (mock)', { id })
    
    const { mockUserRolePermissionData } = await import('../../data/userRolePermission.json')
    const role = mockUserRolePermissionData.roles.find(r => r.id === parseInt(id))
    
    if (!role) {
      throw new Error('Role not found')
    }
    
    // Enrich with permission details
    const permissions = mockUserRolePermissionData.permissions.filter(permission =>
      role.permissions.includes(permission.id)
    )
    
    const enrichedRole = {
      ...role,
      permissionDetails: permissions
    }
    
    return {
      data: enrichedRole,
      success: true,
    }
  }

  async createRole(roleData) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Creating Role (mock)', roleData)
    
    const newRole = {
      id: Date.now(),
      ...roleData,
      isActive: roleData.isActive !== undefined ? roleData.isActive : true,
      isSystemRole: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      permissions: roleData.permissions || [],
      usersCount: 0,
      permissionsCount: roleData.permissions?.length || 0
    }
    
    return {
      data: newRole,
      success: true,
    }
  }

  async updateRole(id, updates) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Updating Role (mock)', { id, updates })
    
    const { mockUserRolePermissionData } = await import('../../data/userRolePermission.json')
    const role = mockUserRolePermissionData.roles.find(r => r.id === parseInt(id))
    
    if (!role) {
      throw new Error('Role not found')
    }
    
    const updatedRole = {
      ...role,
      ...updates,
      updatedAt: new Date().toISOString(),
      permissionsCount: updates.permissions?.length || role.permissions.length
    }
    
    return {
      data: updatedRole,
      success: true,
    }
  }

  async deleteRole(id) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Deleting Role (mock)', { id })
    
    const { mockUserRolePermissionData } = await import('../../data/userRolePermission.json')
    const role = mockUserRolePermissionData.roles.find(r => r.id === parseInt(id))
    
    if (!role) {
      throw new Error('Role not found')
    }
    
    if (role.isSystemRole) {
      throw new Error('Cannot delete system role')
    }
    
    return {
      success: true,
    }
  }

  async getPermissions(params = {}) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Fetching Permissions (mock)', params)
    
    const { mockUserRolePermissionData } = await import('../../data/userRolePermission.json')
    let permissions = mockUserRolePermissionData.permissions
    
    // Apply filters
    if (params.search) {
      const search = params.search.toLowerCase()
      permissions = permissions.filter(permission => 
        permission.name.toLowerCase().includes(search) ||
        permission.description?.toLowerCase().includes(search)
      )
    }
    
    if (params.category) {
      permissions = permissions.filter(permission => permission.category === params.category)
    }
    
    if (params.action) {
      permissions = permissions.filter(permission => permission.action === params.action)
    }
    
    if (params.isActive !== undefined) {
      permissions = permissions.filter(permission => permission.isActive === params.isActive)
    }
    
    // Apply pagination
    const page = parseInt(params.page) || 1
    const limit = parseInt(params.limit) || 10
    const offset = (page - 1) * limit
    const paginatedPermissions = permissions.slice(offset, offset + limit)
    
    return {
      data: paginatedPermissions,
      meta: {
        total: permissions.length,
        page,
        limit,
        totalPages: Math.ceil(permissions.length / limit)
      },
      success: true,
    }
  }

  async getPermission(id) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Fetching Permission (mock)', { id })
    
    const { mockUserRolePermissionData } = await import('../../data/userRolePermission.json')
    const permission = mockUserRolePermissionData.permissions.find(p => p.id === parseInt(id))
    
    if (!permission) {
      throw new Error('Permission not found')
    }
    
    return {
      data: permission,
      success: true,
    }
  }

  async createPermission(permissionData) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Creating Permission (mock)', permissionData)
    
    const newPermission = {
      id: Date.now(),
      ...permissionData,
      isActive: permissionData.isActive !== undefined ? permissionData.isActive : true,
      createdAt: new Date().toISOString(),
      rolesCount: 0
    }
    
    return {
      data: newPermission,
      success: true,
    }
  }

  async updatePermission(id, updates) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Updating Permission (mock)', { id, updates })
    
    const { mockUserRolePermissionData } = await import('../../data/userRolePermission.json')
    const permission = mockUserRolePermissionData.permissions.find(p => p.id === parseInt(id))
    
    if (!permission) {
      throw new Error('Permission not found')
    }
    
    const updatedPermission = {
      ...permission,
      ...updates
    }
    
    return {
      data: updatedPermission,
      success: true,
    }
  }

  async deletePermission(id) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Deleting Permission (mock)', { id })
    
    return {
      success: true,
    }
  }

  async assignRoleToUser(userId, roleId) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Assigning Role to User (mock)', { userId, roleId })
    
    return {
      success: true,
    }
  }

  async removeRoleFromUser(userId, roleId) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Removing Role from User (mock)', { userId, roleId })
    
    return {
      success: true,
    }
  }

  async assignPermissionToRole(roleId, permissionId) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Assigning Permission to Role (mock)', { roleId, permissionId })
    
    return {
      success: true,
    }
  }

  async removePermissionFromRole(roleId, permissionId) {
    if (!this.isEnabled) return null
    
    await mockDelay()
    logger.debug('Removing Permission from Role (mock)', { roleId, permissionId })
    
    return {
      success: true,
    }
  }
}

export const mockService = new MockService()
export default mockService
