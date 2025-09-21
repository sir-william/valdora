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
}

export const mockService = new MockService()
export default mockService
