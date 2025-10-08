import { useState } from 'react'
import './Login.css'

interface LoginProps {
  onLogin: (password: string) => boolean
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 500))

    const success = onLogin(password)
    if (!success) {
      setError('Неверный пароль')
      setPassword('')
    }
    setIsLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#gradient)" />
                <path d="M8 12L16 8L24 12V20L16 24L8 20V12Z" stroke="white" strokeWidth="2" fill="none" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B6B" />
                    <stop offset="100%" stopColor="#4ECDC4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="logo-text">Admin Panel</span>
          </div>
          <h1>Добро пожаловать</h1>
          <p>Введите пароль для доступа к панели администратора</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              className={error ? 'error' : ''}
              disabled={isLoading}
              style={{ padding: 10, marginLeft: 10 }}
              required
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <button 
            style={{ marginTop: 10 }}
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || !password}
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              'Войти'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login