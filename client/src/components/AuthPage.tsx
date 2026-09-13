import { useState, type FormEvent } from 'react'
import { login, register, type AuthResponse } from '../services/authService'
import './AuthPage.css'

type AuthPageProps = {
  onAuthenticated: (result: AuthResponse) => void
}

function AuthPage({ onAuthenticated }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const switchMode = () => {
    setMode((current) => current === 'login' ? 'register' : 'login')
    setError('')
    setShowPassword(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (mode === 'register') await register(username.trim(), email.trim(), password)
      const result = await login(email.trim(), password)
      onAuthenticated(result)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-logo" aria-hidden="true">♫</div>
        <h1>{mode === 'login' ? 'Log in to start listening' : 'Sign up to start listening'}</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              Username
              <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Your username" autoComplete="username" required />
            </label>
          )}

          <label>
            Email address
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@domain.com" autoComplete="email" required />
          </label>

          <label>
            Password
            <span className="password-input-wrapper">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={6} required />
              <button
                className="password-toggle"
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? '◉' : '◌'}
              </button>
            </span>
          </label>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Sign up'}
          </button>
        </form>

        <div className="auth-divider" />
        <p className="auth-switch-text">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
        </p>
        <button className="auth-switch" type="button" onClick={switchMode}>
          {mode === 'login' ? 'Sign up for Spotify Clone' : 'Log in here'}
        </button>
      </section>
    </main>
  )
}

export default AuthPage
