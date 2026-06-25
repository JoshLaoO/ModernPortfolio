import { useState, type FormEvent } from 'react'
import { getAuthRedirectUrl } from '../lib/authRedirect'
import { supabase } from '../lib/supabaseClient'
import { getPortfolioOwnerId, isPortfolioOwner } from '../lib/owner'
import { useAuthSession } from '../hooks/useAuthSession'

export function AuthControls() {
  const { user, initializing } = useAuthSession()
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const ownerIdConfigured = Boolean(getPortfolioOwnerId())
  const owner = isPortfolioOwner(user)

  async function handleMagicLink(e: FormEvent) {
    e.preventDefault()
    setMessage(null)
    setError(null)
    const trimmed = email.trim()
    if (!trimmed) return

    setBusy(true)
    const redirect = getAuthRedirectUrl()
    const { error: signErr } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: redirect },
    })
    setBusy(false)

    if (signErr) {
      setError(signErr.message)
      return
    }
    setMessage('Check your email for the sign-in link.')
    setEmail('')
  }

  async function handleSignOut() {
    setError(null)
    setMessage(null)
    await supabase.auth.signOut()
  }

  if (initializing) {
    return <span className="auth-controls__status">Session…</span>
  }

  if (user) {
    return (
      <div className="auth-controls auth-controls--signed-in">
        <span className="auth-controls__email" title={user.id}>
          {owner ? 'Owner' : 'Signed in'}
          {user.email ? ` · ${user.email}` : ''}
        </span>
        {!ownerIdConfigured ? (
          <p className="auth-controls__hint">
            Set <code>VITE_PORTFOLIO_OWNER_ID</code> to your user id (below), restart
            the dev server, then reload.
          </p>
        ) : null}
        {ownerIdConfigured && !owner ? (
          <p className="auth-controls__hint auth-controls__hint--warn">
            This account is not the configured owner; you cannot add entries.
          </p>
        ) : null}
        <code className="auth-controls__userid">{user.id}</code>
        <button
          type="button"
          className="auth-controls__signout"
          onClick={() => void handleSignOut()}
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <form className="auth-controls auth-controls--form" onSubmit={handleMagicLink}>
      <label className="visually-hidden" htmlFor="auth-email">
        Email for magic link
      </label>
      <input
        id="auth-email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        autoComplete="email"
        className="auth-controls__input"
        required
      />
      <button type="submit" className="auth-controls__submit" disabled={busy}>
        {busy ? 'Sending…' : 'Magic link'}
      </button>
      {message ? <p className="auth-controls__msg">{message}</p> : null}
      {error ? <p className="auth-controls__err">{error}</p> : null}
    </form>
  )
}
