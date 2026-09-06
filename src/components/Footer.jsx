import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="app-footer">
      <p className="app-footer-title">
        Les P'tits trajets de Grand-Hallet
      </p>

      <nav className="app-footer-links" aria-label="Informations">
        <Link to="/rules">Règles de fonctionnement</Link>
        <span aria-hidden="true">•</span>
        <Link to="/terms">Conditions d'utilisation</Link>
        <span aria-hidden="true">•</span>
        <Link to="/privacy">Politique de confidentialité</Link>
        <span aria-hidden="true">•</span>
        <Link to="/legal">Mentions légales</Link>
      </nav>

      <p className="app-footer-contact">
        Contact : lesptitstrajetsdegh (at) gmail.com
      </p>

      <p className="app-footer-note">
        Remplacez « (at) » par « @ » pour nous écrire.
      </p>
    </footer>
  )
}