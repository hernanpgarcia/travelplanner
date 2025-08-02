/**
 * Authentication Service
 * 
 * Handles Google OAuth flow, JWT token management, and user authentication.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface GoogleOAuthRequest {
  code: string
  state?: string
}

class AuthService {
  private readonly tokenKey = 'auth_token'
  private readonly userKey = 'auth_user'

  /**
   * Get Google OAuth authorization URL
   */
  async getGoogleAuthUrl(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/google/url`)
      
      if (!response.ok) {
        throw new Error('Failed to get Google auth URL')
      }
      
      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('Error getting Google auth URL:', error)
      throw error
    }
  }

  /**
   * Handle Google OAuth callback
   */
  async handleGoogleCallback(code: string, state?: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state }),
      })

      if (!response.ok) {
        throw new Error('Authentication failed')
      }

      const authResponse: AuthResponse = await response.json()
      
      // Store token and user data
      this.setToken(authResponse.access_token)
      this.setUser(authResponse.user)
      
      return authResponse
    } catch (error) {
      console.error('Error handling Google callback:', error)
      throw error
    }
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<User> {
    const token = this.getToken()
    
    if (!token) {
      throw new Error('No authentication token')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          this.logout()
        }
        throw new Error('Failed to get current user')
      }

      const user: User = await response.json()
      this.setUser(user)
      
      return user
    } catch (error) {
      console.error('Error getting current user:', error)
      throw error
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthResponse> {
    const token = this.getToken()
    
    if (!token) {
      throw new Error('No authentication token')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        this.logout()
        throw new Error('Failed to refresh token')
      }

      const authResponse: AuthResponse = await response.json()
      
      // Update stored token and user data
      this.setToken(authResponse.access_token)
      this.setUser(authResponse.user)
      
      return authResponse
    } catch (error) {
      console.error('Error refreshing token:', error)
      throw error
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const token = this.getToken()
      
      if (token) {
        // Call logout endpoint
        await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      // Always clear local storage
      this.clearStorage()
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken()
    const user = this.getUser()
    
    return !!(token && user)
  }

  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }

  /**
   * Get stored user data
   */
  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey)
    
    if (!userStr) return null
    
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  /**
   * Store authentication token
   */
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token)
  }

  /**
   * Store user data
   */
  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user))
  }

  /**
   * Clear all stored authentication data
   */
  private clearStorage(): void {
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.userKey)
  }

  /**
   * Initialize Google OAuth flow
   */
  async initiateGoogleOAuth(): Promise<void> {
    try {
      const authUrl = await this.getGoogleAuthUrl()
      window.location.href = authUrl
    } catch (error) {
      console.error('Error initiating Google OAuth:', error)
      throw error
    }
  }
}

// Export singleton instance
export const authService = new AuthService()
export default authService