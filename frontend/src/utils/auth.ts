// Simple auth utilities without hooks
export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
}

export const auth = {
  getToken: (): string | null => {
    return localStorage.getItem('auth_token')
  },
  
  getUser: (): User | null => {
    const userStr = localStorage.getItem('auth_user')
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },
  
  isAuthenticated: (): boolean => {
    return !!(auth.getToken() && auth.getUser())
  },
  
  logout: (): void => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }
}