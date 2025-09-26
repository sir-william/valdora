// API Service pour VALDORA Frontend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://8000-ixcibwvst312itne63t09-5050bf6c.manusvm.computer'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.token = null
  }

  setToken(token) {
    this.token = token
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }
      
      return await response.text()
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  // Méthodes d'authentification
  async login(email, password) {
    try {
      const response = await this.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      
      if (response.token) {
        this.setToken(response.token)
      }
      
      return response
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  // Méthodes pour les brouillons IA
  async getAiDrafts() {
    return this.request('/api/ai_store_drafts')
  }

  async getAiDraft(id) {
    return this.request(`/api/ai_store_drafts/${id}`)
  }

  async createAiDraft(data) {
    return this.request('/api/ai_store_drafts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateAiDraft(id, data) {
    return this.request(`/api/ai_store_drafts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteAiDraft(id) {
    return this.request(`/api/ai_store_drafts/${id}`, {
      method: 'DELETE',
    })
  }

  // Méthodes pour la génération IA
  async generateSite(data) {
    return this.request('/api/ai/generate-site', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async publishSite(id) {
    return this.request(`/api/ai/publish-site/${id}`, {
      method: 'POST',
    })
  }

  // Test de connexion
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/api/docs`)
      return response.ok
    } catch (error) {
      console.error('Connection test failed:', error)
      return false
    }
  }
}

// Instance singleton
const apiService = new ApiService()

export default apiService
