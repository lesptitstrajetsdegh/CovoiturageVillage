import { Link } from 'react-router-dom'
import { auth } from '../lib/auth'

export function Home() {
  const session = auth.useSession()

  if (session.isPending) {
    return (
      <main className="home-page">
        <h1>Les P'tits trajets de Grand-Hallet</h1>
        <p>Chargement…</p>
      </main>
    )
  }

  const user = session.data?.user

  return (
    <main className="home-page">
      <h1>Les P'tits trajets de Grand-Hallet</h1>

    <img
      className="home-image"
      src="/carpooling-village.jpg"
      alt="Des familles du village qui organisent des trajets partagés"
    />

      <section className="home-intro">
        <p>
          <strong>Les P'tits trajets de Grand-Hallet</strong> est une plateforme
          d'entraide entre parents du village, créée pour organiser et
          mutualiser les trajets des enfants vers l'école, leurs activités 
          extrascolaires et leurs stages.
        </p>

        <p>
          <strong>L'objectif ?</strong> Se simplifier la vie, s'entraider entre
          familles, créer du lien… et éviter que plusieurs voitures fassent
          chaque semaine le même trajet.
        </p>
      </section>

      <section className="home-how">
        <h2>Comment ça fonctionne ?</h2>

        <div className="home-step">
          <h3>1. Inscrivez votre famille</h3>
          <p>
            Vous renseignez vos coordonnées et les informations nécessaires.
            Votre inscription est ensuite validée par l'administrateur.
          </p>
        </div>

        <div className="home-step">
          <h3>2. Proposez ou recherchez un trajet</h3>
          <p>
            Rendez-vous dans la page <strong>Trajets</strong> pour encoder les trajets
            que vous pouvez assurer ou ceux dont vous avez besoin, et pour rechercher
            les trajets proposés par les autres familles.
          </p>
        </div>

        <div className="home-step">
          <h3>3. Organisez-vous entre familles</h3>
          <p>
            Dans la page <strong>Trajets</strong>, vous consultez les trajets
            disponibles (via la Recherche de trajets) et prenez contact avec les autres familles pour vous
            organiser.
          </p>
        </div>
            </section>

      <section className="home-note">
        <h2>Un petit mot sur les délais</h2>

        <p>
          Les P’tits trajets de Grand-Hallet est une plateforme gratuite,
          gérée bénévolement. Les demandes sont donc traitées manuellement,
          dans la mesure des disponibilités de l’administrateur, qui ne peut
          pas être connecté à la plateforme tous les jours.
        </p>

        <p>
          Nous faisons notre possible pour traiter les demandes rapidement,
          mais un petit délai peut parfois être nécessaire. Merci pour votre
          indulgence 😊
        </p>

        <p>
          <strong>Vous n’avez pas de nouvelles après 3 jours ?</strong>{' '}
          N’hésitez pas à nous envoyer un petit mail à{' '}
          lesptitstrajetsdegh (at) gmail.com{' '}
          afin de nous le signaler.
        </p>
      </section>

      {user && (


        <section className="home-connected">
          <p>Vous êtes connecté en tant que {user.name}.</p>

          <p>
            <Link to="/family">Accéder à mes trajets</Link>
          </p>
        </section>
      )}
    </main>
  )
}