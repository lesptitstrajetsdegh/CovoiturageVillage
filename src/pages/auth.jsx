import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthView } from '@neondatabase/neon-js/auth/react/ui'
import { auth } from '../lib/auth'

const signupRulesText = `
Les P'tits trajets de Grand-Hallet repose sur une idée simple :
s'entraider entre parents du village pour se simplifier la vie et
prendre soin les uns des autres.

En utilisant la plateforme, je m'engage à :

• Faire preuve de respect, de courtoisie et de bienveillance envers
  les autres parents et leurs enfants.

• Respecter les arrangements convenus avec les autres familles et
  prévenir suffisamment tôt en cas d'empêchement.

• Prendre soin des enfants qui me sont confiés comme je souhaiterais
  que les autres parents prennent soin des miens.

• Respecter la confidentialité des informations auxquelles j'ai accès
  via la plateforme et ne pas communiquer les coordonnées d'un autre
  parent à des personnes extérieures.

• Utiliser la plateforme uniquement dans son objectif : l'entraide
  entre parents de Grand-Hallet pour les trajets liés aux activités
  extrascolaires et aux stages des enfants.

• Régler directement entre parents les modalités de chaque trajet,
  dans un esprit de confiance et de bonne entente.

• La plateforme facilite la mise en relation entre les familles, mais
  chaque trajet et chaque arrangement restent de la responsabilité
  des parents concernés.

• La plateforme fonctionne avec des notifications internes ; pensez
  à consulter régulièrement vos notifications.

Les Conditions d'utilisation plus complètes précisent le fonctionnement
de la plateforme et les responsabilités de chacun.
`

export function Auth() {
  const location = useLocation()
  const navigate = useNavigate()
  const session = auth.useSession()
  const path = location.pathname.split('/').pop()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rulesOpen, setRulesOpen] = useState(false)
  const [rulesRead, setRulesRead] = useState(false)
  const [rulesAccepted, setRulesAccepted] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [signupError, setSignupError] = useState(null)

  useEffect(() => {
    if (path !== 'sign-up') {
      return
    }

    if (session.isPending || !session.data?.user) {
      return
    }

    const checkFamily = async () => {
      try {
        const response = await fetch('/api/family')

        if (!response.ok) {
          return
        }

        const data = await response.json()

        if (!data.family) {
          navigate('/account', { replace: true })
        }
      } catch {
        // On laisse l'utilisateur sur la page d'inscription
        // si la vérification de la famille échoue.
      }
    }

    checkFamily()
  }, [path, session.isPending, session.data?.user, navigate])

  if (path !== 'sign-up') {
    return <AuthView path={path} />
  }

  async function handleSignup(event) {
    event.preventDefault()
    setSignupError(null)
    setIsSubmitting(true)

    try {
      const result = await auth.signUp.email({
        email,
        password,
        name: email,
      })

      if (result?.error) {
        throw new Error(
          result.error.message || 'Impossible de créer le compte.',
        )
      }

      await new Promise((resolve) => setTimeout(resolve, 100))
      navigate('/account', { replace: true })
    } catch (error) {
      setSignupError(
        error instanceof Error
          ? error.message
          : 'Impossible de créer le compte.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleRulesScroll(event) {
    const element = event.currentTarget
    const reachedBottom =
      element.scrollTop + element.clientHeight >=
      element.scrollHeight - 8

    if (reachedBottom) {
      setRulesRead(true)
    }
  }

  function handleRulesToggle(event) {
    const isOpen = event.currentTarget.open
    setRulesOpen(isOpen)

    if (!isOpen && !rulesAccepted) {
      setRulesRead(false)
    }
  }

  return (
    <main>
      <h1>Créer un compte</h1>

      <form onSubmit={handleSignup}>
        <p>
          <label htmlFor="signup-email">Adresse e-mail</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </p>

        <p>
          <label htmlFor="signup-password">Mot de passe</label>
          <input
            id="signup-password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
        </p>

        <details
          className="signup-rules"
          open={rulesOpen}
          onToggle={handleRulesToggle}
        >
          <summary>
            🌿 Quelques règles simples pour bien vivre ensemble
          </summary>

          <div
            className="signup-rules-scroll"
            onScroll={handleRulesScroll}
            style={{
              maxHeight: '220px',
              overflowY: 'auto',
            }}
          >
            <p>
              <strong>
                Les P'tits trajets de Grand-Hallet, c'est avant tout
                de l'entraide entre parents du village.
              </strong>
            </p>

            {signupRulesText
              .trim()
              .split('\n\n')
              .map((paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              ))}
          </div>
        </details>

        {rulesRead && (
          <p>
            <label>
              <input
                type="checkbox"
                checked={rulesAccepted}
                onChange={(event) =>
                  setRulesAccepted(event.target.checked)
                }
              />{' '}
              J'ai lu et j'accepte les règles de fonctionnement de la
              plateforme.
            </label>
          </p>
        )}

        <p>
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Consulter les Conditions d'utilisation
          </a>
        </p>

        <p>
          <label>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) =>
                setTermsAccepted(event.target.checked)
              }
            />{' '}
            J'ai lu et j'accepte les Conditions d'utilisation.
          </label>
        </p>

        <p>
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Consulter la Politique de confidentialité
          </a>
        </p>

        {!rulesAccepted || !termsAccepted ? (
          <p className="signup-acceptance-hint">
            Pour créer votre compte, veuillez lire les règles et cocher <strong>les DEUX</strong> cases d'acceptation.
            <br />
            ℹ️ Pour voir le second bouton, lisez les règles de fonctionnement en cliquant sur la petite flèche.
          </p>
        ) : null}

        {signupError && (
          <p role="alert">
            {signupError}
          </p>
        )}

        <button
          type="submit"
          disabled={
            isSubmitting ||
            !rulesRead ||
            !rulesAccepted ||
            !termsAccepted
          }
        >
          {isSubmitting ? 'Création du compte…' : 'Créer mon compte'}
        </button>
      </form>

      <p>
        Déjà un compte ?{' '}
        <a href="/auth/sign-in">Se connecter</a>
      </p>
    </main>
  )
}