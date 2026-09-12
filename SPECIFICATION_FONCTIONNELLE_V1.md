# Spécification fonctionnelle — V1

## 1. Présentation du projet

**Les P'tits trajets de Grand-Hallet** est une application web privée, réservée aux habitants du village. Son nom technique court est `lesptitstrajetsdegh` et son slogan est : « La plateforme d'entraide des parents pour les trajets des enfants ».

Elle aide les parents et responsables légaux à se mettre en relation pour organiser et mutualiser les trajets des enfants liés à l'école, aux activités extrascolaires et aux stages de vacances.

L'application n'est pas un service de covoiturage domicile-travail, de déplacements personnels, de réservation de trajets, ni de transport à la demande. Son rôle est de rendre visibles des besoins et des propositions afin que les adultes concernés organisent ensuite librement leurs arrangements par téléphone ou e-mail.

Le projet est communautaire et bénévole. La solution technique doit donc privilégier les offres gratuites, sans dépendre d'un service payant pour le fonctionnement normal de la V1.

## 2. Objectifs de la V1

- Centraliser les trajets liés à l'école, aux activités régulières et aux stages de vacances.
- Permettre à un administrateur de vérifier que chaque utilisateur appartient bien au village.
- Faciliter la découverte de parents ayant des horaires, lieux et sens de déplacement compatibles.
- Préserver la confidentialité : les adresses restent réservées à l'administrateur et les coordonnées sont masquées par défaut.
- Offrir une expérience utilisable principalement sur smartphone, sans application mobile native.

## 3. Utilisateurs, rôles et permissions

### 3.1 Visiteur non connecté

Le visiteur peut consulter la page d'accueil, comprendre le fonctionnement, créer un compte et se connecter. Il ne peut pas consulter les trajets, les lieux, ni les coordonnées d'autres personnes.

### 3.2 Compte en attente de validation

Après inscription, le compte a le statut `En attente`. Il peut se connecter et accéder à un écran indiquant que sa demande est en cours d'examen, mais ne peut pas utiliser les fonctionnalités de l'application. Il peut consulter les informations de contact humain du projet.

### 3.3 Utilisateur validé

Un compte correspond à un accès Auth individuel pour un adulte. Un même foyer peut disposer d'un seul compte lorsqu'il est géré conjointement par les parents, mais deux parents séparés peuvent créer et faire valider chacun leur propre compte. L'accès est réservé à un adulte dont l'inscription a été validée par l'administrateur.

Il peut :

- consulter les trajets actifs de l'année scolaire affichée ;
- filtrer et rechercher ces trajets ;
- voir le prénom, le nom complet et les informations de trajet de leur créateur ;
- afficher volontairement le numéro de téléphone d'un autre utilisateur ;
- créer, modifier, désactiver, réactiver et archiver ses propres trajets ;
- demander l'ajout d'un lieu ;
- consulter et modifier ses propres coordonnées ;
- consulter ses notifications internes.

Il ne peut jamais consulter l'adresse d'un autre utilisateur, modifier les trajets d'autrui, ni valider un compte ou un lieu.

### 3.4 Administrateur

L'administrateur est le seul rôle de gestion de la V1. Il peut :

- consulter les inscriptions en attente et leur adresse complète ;
- valider, refuser, suspendre, désactiver ou réactiver un compte ;
- vérifier, valider ou refuser une nouvelle adresse soumise par un utilisateur ;
- gérer les années scolaires ;
- préencoder et gérer les périodes de stage ;
- gérer les lieux ;
- valider ou refuser les demandes de création de lieu ;
- consulter les trajets et, si nécessaire, les désactiver pour modération ;
- consulter et gérer les notifications administratives.

L'accès administrateur doit être attribué explicitement et ne jamais pouvoir être obtenu par auto-inscription.

## 4. Exigences fonctionnelles

### 4.1 Inscription et validation

Le formulaire d'inscription exige :

- prénom ;
- nom complet ;
- adresse complète ;
- adresse e-mail ;
- numéro de téléphone ;
- mot de passe.

L'adresse e-mail est le seul identifiant de connexion : aucun champ « identifiant » distinct n'est prévu. Une note visible demande de vérifier attentivement l'adresse saisie, car elle servira à se connecter et ne sera pas vérifiée automatiquement. Aucun e-mail de confirmation n'est envoyé.

Le règlement de fonctionnement est affiché directement dans la page d'inscription, dans un bloc défilant. L'utilisateur doit faire défiler ce bloc jusqu'à la fin avant de pouvoir cocher la case : « J'ai lu et j'accepte les règles de fonctionnement de la plateforme. »

Le règlement affiché est le suivant :

Les P'tits trajets de Grand-Hallet repose sur une idée simple : s'entraider entre parents du village pour se simplifier la vie et prendre soin les uns des autres.

En utilisant la plateforme, je m'engage à :

- Faire preuve de respect, de courtoisie et de bienveillance envers les autres parents et leurs enfants.
- Respecter les arrangements convenus avec les autres familles et prévenir suffisamment tôt en cas d'empêchement.
- Prendre soin des enfants qui me sont confiés comme je souhaiterais que les autres parents prennent soin des miens.
- Respecter la confidentialité des informations auxquelles j'ai accès via la plateforme et ne pas communiquer les coordonnées d'un autre parent à des personnes extérieures.
- Utiliser la plateforme uniquement dans son objectif : l'entraide entre parents de Grand-Hallet pour les trajets liés à l'école, aux activités extrascolaires et aux stages des enfants.
- Régler directement entre parents les modalités de chaque trajet, dans un esprit de confiance et de bonne entente.

La plateforme facilite la mise en relation entre les familles, mais chaque trajet et chaque arrangement restent de la responsabilité des parents concernés.

Un accès aux Conditions d'utilisation est proposé ; elles peuvent s'ouvrir dans un nouvel onglet. L'utilisateur doit également cocher : « J'ai lu et j'accepte les Conditions d'utilisation. »

Un accès à la Politique de confidentialité est proposé ; elle peut s'ouvrir dans un nouvel onglet. Une formulation informe l'utilisateur que cette politique explique l'utilisation de ses données et ses droits. Cette prise de connaissance ne constitue pas un consentement au traitement.

Le bouton « Créer mon compte » reste désactivé tant que les deux cases d'acceptation obligatoires ne sont pas cochées. Le défilement obligatoire concerne uniquement le règlement affiché dans le bloc.

L'adresse est obligatoire uniquement afin que l'administrateur puisse vérifier l'appartenance au village. Elle est inaccessible aux autres utilisateurs.

Après inscription, le compte est créé avec le statut `En attente`. Une validation explicite de l'administrateur est requise avant tout accès aux trajets, lieux ou coordonnées. L'inscription apparaît dans l'espace administrateur et crée une notification interne pour l'administrateur. La validation ou le refus donne lieu à une notification interne pour l'utilisateur ; en cas de refus, elle indique que son inscription n'a pas été validée.

### 4.1.1 Modification d'adresse

L'adresse complète est utilisée pour vérifier l'appartenance de l'utilisateur au village. Lorsqu'un utilisateur modifie son adresse, l'ancienne adresse validée reste l'adresse de référence tant que la nouvelle adresse n'a pas été validée. La nouvelle adresse est enregistrée comme adresse « à vérifier ».

Le compte reste pleinement utilisable pendant la vérification. La modification apparaît dans l'espace administrateur et crée une notification interne pour l'administrateur. La validation ou le refus donne lieu à une notification interne pour l'utilisateur.

Deux cas de refus sont prévus pour la V1 :

- **Adresse à corriger ou préciser :** l'utilisateur est invité à corriger ou préciser son adresse ; son compte reste utilisable et l'ancienne adresse validée demeure l'adresse de référence jusqu'à validation de la nouvelle.
- **L'utilisateur n'habite plus dans le village :** son compte est suspendu et il n'a plus accès à la plateforme.

### 4.1.2 Notifications

Le système de notifications interne est le moyen officiel de notification. Il concerne les utilisateurs et l'administrateur. Chaque notification comporte un type, un contenu, une date de création, une date d'expiration et un état de lecture. Elle peut référencer l'élément concerné lorsque c'est pertinent.

Les notifications sont accessibles depuis la navigation et un compteur affiche le nombre de notifications non lues. Elles sont conservées un an à compter de leur création.

Exemples utilisateur : inscription validée ou refusée, nouvelle adresse validée ou à corriger/préciser, compte suspendu, demande de lieu traitée. Exemples administrateur : nouvelle inscription, nouvelle demande de lieu, nouvelle adresse à vérifier ou autre événement nécessitant une intervention.

### 4.1.3 Mot de passe oublié et contact humain

En cas de mot de passe oublié, l'utilisateur peut utiliser la procédure intégrée de récupération du mot de passe. Un lien de réinitialisation lui est envoyé par e-mail.

L'adresse e-mail de connexion ne peut pas être modifiée directement par l'utilisateur. En cas de faute de frappe, il contacte le responsable de la plateforme par téléphone, en direct ou depuis une autre adresse e-mail ; le numéro de téléphone du profil peut servir à ce contact.

Le contact humain direct se fait à l'adresse publique : « lesptitstrajetsdegh (at) gmail.com ». Remplacez « (at) » par « @ » pour nous écrire. Aucun formulaire de contact n'est prévu.

### 4.2 Années scolaires

Chaque trajet appartient à une seule année scolaire, par exemple `2026-2027`. Une année scolaire possède une date de début, une date de fin et un statut (`Active`, `Archivée`).

Par défaut, les recherches affichent exclusivement les trajets actifs de l'année scolaire active. Les trajets d'une année scolaire archivée ne sont pas mélangés aux résultats de l'année scolaire active.

### 4.3 Périodes de stage

L'administrateur préencode, pour chaque année scolaire, les périodes de stage disponibles. Chaque période appartient à une seule année scolaire et comprend un libellé permettant de l'identifier, par exemple « Automne sem 1 », « Automne sem 2 », « Noël sem 1 » ou « Noël sem 2 ».

Lors de la création d'un trajet de stage, l'utilisateur sélectionne une période de stage préencodée. L'application ne gère pas les disponibilités individuelles par jour au sein d'une période.

### 4.4 Lieux

Les activités sont rattachées à un **lieu** et non à un nom d'activité. Un même lieu peut donc servir à plusieurs enfants et activités.

Un lieu comprend au minimum son nom et son statut :

- `Actif` : visible dans l'application et sélectionnable lors de la création d'un trajet ;
- `Désactivé` : conservé dans la base mais non sélectionnable pour la création d'un nouveau trajet.

Les demandes de création de lieu sont gérées séparément. Un utilisateur validé peut soumettre une demande de nouveau lieu, qui est traitée par l'administrateur et peut être `En attente`, `Approuvée` ou `Refusée`.

### 4.5 Trajets

L'application propose trois types de trajets : `Activité régulière`, `École` et `Stage de vacances`.
Un utilisateur peut créer plusieurs trajets. Tous les trajets utilisent la même table et partagent la même gestion des familles, des lieux et des années scolaires. Les stages utilisent en plus les périodes de stage préencodées par l'administrateur.

Chaque trajet contient obligatoirement :

- l'année scolaire ;
- la famille créatrice du trajet ;
- le lieu actif concerné ;
- la catégorie du trajet (`activité`, `école` ou `stage`) ;
- le sens du trajet ;
- les informations temporelles adaptées à la catégorie ;
- les options de participation ;
- le statut du trajet ;
- les dates de création et de dernière modification.

#### Activité régulière

Le fonctionnement existant des activités régulières reste inchangé. Le trajet contient aussi le jour de la semaine, l'heure prévue au lieu d'activité et le sens de déplacement.

Les valeurs proposées pour le sens sont :

| Champ | Valeurs |
|---|---|
| Sens | `Je fais uniquement l'aller`, `Je fais uniquement le retour`, `Je fais l'aller-retour dans la foulée` |
| Participation | `Je propose un trajet`, `Je cherche une solution`, `Je souhaite organiser une tournante entre parents` |
| Statut | `Actif`, `Archivé`, `Désactivé par le créateur` |

**Un aller et un retour sont toujours deux trajets distincts à encoder.**

Les choix de sens décrivent ce que fait le parent pour le trajet concerné ; ils ne déterminent pas le nombre de trajets à encoder.

**Vous déposez votre enfant et rentrez directement à Grand-Hallet ?**  
→ Pour l'aller : **« Je fais l'aller-retour dans la foulée »**.  
→ Pour le retour : encodez également un trajet séparé et choisissez **« Je fais l'aller-retour dans la foulée »** si vous revenez directement après l'activité.

**Vous restez sur place pendant l'activité ?**  
→ Pour l'aller : **« Je fais uniquement l'aller »**.  
→ Pour le retour : **« Je fais uniquement le retour »**.

Dans les deux cas, vous encodez donc **un trajet aller ET un trajet retour**.

### 4.6 Recherche et prise de contact

Tous les utilisateurs validés peuvent consulter les trajets actifs de l'année scolaire active. Les filtres disponibles sont :

- catégorie de trajet (Activité régulière, École ou Stage de vacances)
- lieu ;
- jour de la semaine, pour une activité régulière ;
- période de stage, pour un stage
- heure approximative ;
- marge horaire de ± 15 minutes.
- sens du déplacement pour une activité régulière, ou trajet du matin/du soir pour un stage de vacances ;
- type de participation.

Un résultat affiche le prénom et le nom complet du créateur, le lieu, informations de période appropriées (jour ou période de stage), l'heure, le sens ou le trajet du matin/du soir, et le type de participation.

Le numéro de téléphone est masqué initialement et n'est affiché qu'après une action explicite, par exemple « Afficher les coordonnées ». L'adresse e-mail n'est pas affichée aux autres utilisateurs. Aucun message interne, algorithme de rapprochement, système de réservation ou confirmation de trajet n'est prévu.

## 5. Modèle de données

### `families`

Familles et comptes utilisateurs associés.

| Champ | Description |
|---|---|
| `id` | Identifiant unique de la famille |
| `auth_user_id` | Identifiant du compte d'authentification |
| `first_name` | Prénom du parent |
| `last_name` | Nom du parent |
| `street` / `house_number` | Rue et numéro de l'adresse |
| `postal_code` / `village` | Code postal et village |
| `pending_address_*` | Données liées à une éventuelle nouvelle adresse à vérifier |
| `email` | Adresse e-mail de connexion |
| `phone` | Numéro de téléphone |
| `status` | `pending`, `active`, `suspended` ou `disabled` |
| `created_at` / `updated_at` | Dates techniques |

### `notifications`

Notifications internes destinées aux familles.

| Champ | Description |
|---|---|
| `notification_id` | Identifiant unique |
| `family_id` | Famille destinataire |
| `type` | Type de notification |
| `content` | Contenu de la notification |
| `is_read` | Indique si la notification a été lue |
| `created_at` | Date de création |
| `expires_at` | Date d'expiration |

### `school_years`

| Champ | Description |
|---|---|
| `id` | Identifiant unique |
| `label` | Libellé, par exemple `2026-2027` |
| `start_date` / `end_date` | Bornes de l'année scolaire |
| `status` | Active ou archivée |

### `stage_periods`

Périodes de stage préencodées par l'administrateur et rattachées à une année scolaire.

| Champ | Description |
|---|---|
| `id` | Identifiant unique |
| `school_year_id` | Année scolaire associée |
| `label` | Libellé de la période, par exemple `Automne sem 1` |
| `status` | Statut de la période |

### `locations`

Lieux préencodés et gérés par l'administrateur.

| Champ | Description |
|---|---|
| `id` | Identifiant unique |
| `name` | Nom du lieu |
| `address_street` / `address_number` | Rue et numéro du lieu |
| `address_postal_code` / `address_village` | Code postal et village du lieu |
| `status` | Actif ou désactivé |
| `created_at` / `updated_at` | Dates de suivi |

### `location_requests`

Demandes de création de nouveaux lieux soumises par les familles et traitées par l'administrateur.

| Champ | Description |
|---|---|
| `location_request_id` | Identifiant unique |
| `family_id` | Famille à l'origine de la demande |
| `requested_name` | Nom du lieu demandé |
| `requested_address_street` | Rue et numéro du lieu demandé |
| `requested_address_postal_village` | Code postal et village du lieu demandé |
| `status` | `pending`, `approved` ou `rejected` |
| `location_id` | Lieu créé ou associé lorsque la demande est approuvée |
| `created_at` / `updated_at` | Dates de suivi |

### `admin_notifications`

Notifications internes destinées à l'administratrice.

| Champ | Description |
|---|---|
| `admin_notification_id` | Identifiant unique |
| `type` | Type de notification |
| `content` | Contenu de la notification |
| `is_read` | Indique si la notification a été lue |
| `created_at` | Date de création |
| `expires_at` | Date d'expiration |

### `trips`

Trajets publiés par les familles.

| Champ | Description |
|---|---|
| `trip_id` | Identifiant unique |
| `school_year_id` | Année scolaire associée |
| `family_id` | Famille créatrice du trajet |
| `location_id` | Lieu actif associé |
| `category` | `activity`, `school` ou `stage` |
| `direction` | Sens du trajet |
| `weekday` | Jour de la semaine, pour les trajets concernés |
| `time_on_site` | Heure prévue sur le lieu |
| `car_trip_type` | Type d'aller-retour, pour une activité |
| `drive_with_space` | Le parent propose un trajet |
| `need_ride` | Le parent cherche une solution |
| `interested_rotation` | Le parent souhaite organiser une tournante |
| `period_id` | Période de stage associée, pour un trajet de stage |
| `status` | Statut du trajet |
| `created_at` / `updated_at` | Dates de suivi |

## 6. Parcours utilisateurs

### Inscription puis accès

1. L'adulte ouvre l'application et choisit « Créer un compte ».
2. Il renseigne toutes les informations obligatoires, fait défiler le règlement jusqu'à sa fin, vérifie attentivement son adresse e-mail, puis confirme les deux acceptations obligatoires.
3. Il voit une page « En attente de validation ».
4. L'inscription apparaît dans l'espace administrateur et crée une notification interne pour l'administrateur ; celui-ci vérifie l'adresse et valide ou refuse le compte.
5. À sa prochaine connexion, l'utilisateur accède à la recherche de trajets.

### Chercher une solution

1. L'utilisateur validé accède à la page « Mes trajets », qui lui permet de consulter ses propres trajets et de rechercher les trajets actifs de l'année scolaire active.
2. Il sélectionne le type de transport, un lieu, puis les critères adaptés : jour pour une activité régulière ou période de stage pour un stage, heure et marge, puis si nécessaire un sens ou un trajet du matin/du soir et un type de participation.
3. Il consulte les résultats compatibles.
4. Il choisit « Afficher les coordonnées » pour un résultat qui l'intéresse.
5. Les familles conviennent de leur organisation en dehors de l'application.

### Publier et gérer un trajet

1. L'utilisateur choisit « Ajouter un trajet ».
2. Il sélectionne une année scolaire, un lieu actif et la catégorie du trajet. Pour une activité régulière, il renseigne le jour, l'heure, le sens et les options de participation. Pour un trajet scolaire, il renseigne les informations prévues pour l'école, le jour, l'heure, le sens et les options de participation. Pour un stage, il sélectionne une période de stage préencodée, une heure, un trajet du matin ou du soir et les options de participation.
3. Il publie le trajet, qui devient actif et immédiatement visible aux utilisateurs validés.
4. Il peut ensuite modifier, désactiver, réactiver ou archiver ce trajet depuis « Mes trajets ».

### Demander un nouveau lieu

1. L'utilisateur ne trouve pas son lieu dans la liste active.
2. Il ouvre « Demander un lieu » et soumet son nom, avec une précision facultative.
3. La demande reçoit le statut `En attente`, apparaît dans l'espace administrateur et crée une notification interne pour l'administrateur.
4. Après validation administrative, le lieu devient sélectionnable pour tous.

### Modifier son adresse

1. L'utilisateur validé modifie son adresse depuis son profil.
2. L'ancienne adresse validée reste l'adresse de référence et la nouvelle est enregistrée comme adresse à vérifier ; le compte reste pleinement utilisable.
3. La modification apparaît dans l'espace administrateur et crée une notification interne pour l'administrateur.
4. l'administrateur valide l'adresse ou la refuse selon l'un des deux cas prévus.
5. L'utilisateur reçoit l'information correspondante dans son espace sous forme de notification interne.

### Contacter le responsable de la plateforme

Le contact humain direct se fait à l'adresse « lesptitstrajetsdegh (at) gmail.com ». Remplacez « (at) » par « @ » pour nous écrire. Aucun formulaire de contact n'est prévu.

## 7. Parcours administrateur

### Validation d'un compte

1. L'administrateur ouvre la liste des inscriptions en attente.
2. Il consulte les informations nécessaires, dont l'adresse complète.
3. Il valide ou refuse la demande.


### Vérification d'une adresse modifiée

1. L'administrateur ouvre les modifications d'adresse à vérifier.
2. Il consulte l'ancienne adresse validée et la nouvelle adresse à vérifier.
3. Il valide la nouvelle adresse, demande une correction ou une précision, ou suspend le compte si l'utilisateur n'habite plus dans le village.
4. L'utilisateur en est informé dans son espace par notification interne.

### Gestion des lieux

1. L'administrateur ouvre les demandes de lieux en attente.
2. Il vérifie l'intitulé et évite les doublons éventuels.
3. Il active ou refuse la demande.
4. Un lieu activé devient disponible dans le formulaire de trajet.

### Gestion annuelle et modération

L'administrateur crée l'année scolaire suivante avant sa mise en service, y préencode les périodes de stage disponibles, définit une seule année active, puis archive l'année terminée. Il peut désactiver un trajet en cas d'erreur manifeste ou de non-respect des règles, et suspendre ou désactiver un compte si nécessaire.

## 8. Pages prévues

- Accueil public et connexion ;
- Inscription ;
- Écran d'attente de validation ;
- Notifications utilisateur et administration, accessibles depuis la navigation ;
- Recherche/liste des trajets ;
- Détail d'un trajet avec révélation volontaire des coordonnées ;
- Création et modification de trajet ;
- Mes trajets ;
- Demande de lieu ;
- Mon profil ;
- Tableau de bord administrateur : comptes, lieux, modifications d'adresse, années scolaires, périodes de stage, trajets.

## 9. Confidentialité et sécurité

- L'application est privée : les données fonctionnelles ne sont accessibles qu'après validation du compte.
- L'adresse complète est réservée à l'administrateur. Elle ne doit ni apparaître dans les listes, ni dans les résultats de recherche, ni dans les données transmises à d'autres utilisateurs.
- Le numéro de téléphone est masqué par défaut et n'est affiché qu'après une action explicite de l'utilisateur consultant un trajet. L'adresse e-mail n'est jamais affichée aux autres utilisateurs.
- L'adresse e-mail est l'identifiant de connexion et n'est pas vérifiée automatiquement en V1. Elle ne peut pas être modifiée directement par l'utilisateur.
- Le contact humain direct du projet est indiqué sous la forme « lesptitstrajetsdegh (at) gmail.com ». Les notifications courantes sont internes à l'application ; seul le processus intégré de récupération du mot de passe peut envoyer un e-mail.
- L'application ne crée pas de profil détaillé pour les enfants. Aucun prénom, âge, photo ou autre donnée personnelle concernant les enfants n'est demandé. Le nom de famille peut toutefois être utilisé lorsqu'il est nécessaire au fonctionnement prévu de la plateforme.
- Les mots de passe ne sont jamais stockés par l'application ; ils sont gérés par le fournisseur d'authentification.
- Chaque utilisateur ne peut modifier que son profil et ses trajets. Les règles d'accès doivent être appliquées côté serveur et dans la base de données, pas uniquement dans l'interface.
- Les échanges et accès d'administration doivent se faire via HTTPS.
- Une politique de confidentialité doit préciser la finalité des données, le responsable du traitement, la durée de conservation et les modalités d'accès, rectification et suppression.
- Les données des familles, lieux, trajets et années scolaires sont conservées pendant la durée prévue par les règles de conservation de la V1. Les familles désactivées sont conservées pendant un an après leur désactivation. Les notifications internes sont conservées un an à compter de leur création. Les données arrivées à échéance sont supprimées conformément à ces règles, sauf obligation légale contraire.

## 10. Architecture technique V1 de référence

- Frontend : React + Vite.
- Hébergement : Cloudflare Pages Free.
- Couche serveur : Cloudflare Pages Functions Free.
- Base de données : Neon PostgreSQL Free.
- Authentification : Neon Auth / Better Auth, par e-mail et mot de passe.
- Aucune Neon Data API n'est exposée directement au navigateur ; les accès aux données passent par la couche serveur.
- PostgreSQL RLS reste une couche de protection supplémentaire.
- Contact humain : Gmail dédié du projet.
- Aucun service SMTP ou service d'e-mail transactionnel externe n'est utilisé. Le seul e-mail fonctionnel de la V1 est celui envoyé par le processus intégré de récupération du mot de passe.

## 11. Hors périmètre de la V1

Les éléments suivants ne seront pas développés dans cette première version :

- application Android ou iOS native ;
- GPS, géolocalisation, calcul d'itinéraires ou cartes ;
- profils détaillés ou données personnelles des enfants (prénom, âge, photo, etc.) ;
- nom des activités ;
- nombre de places, capacité du véhicule ou liste des passagers ;
- calendrier détaillé par jour, exceptions ponctuelles ou disponibilités quotidiennes ;
- matching automatique ;
- messagerie interne ;
- réservation, acceptation de trajet, paiement ou notation ;
- gestion de l'assurance, de la responsabilité ou des accords entre familles.

## 12. Évolutions possibles après la V1

- Indication facultative du nombre de places proposées ;
- Préférence de contact (téléphone, e-mail ou les deux) ;
- Duplication de trajets vers une nouvelle année scolaire ;
- Indication d'une zone de départ non précise, sans dévoiler l'adresse ;
- Signalement d'un trajet obsolète ;
- Plusieurs administrateurs avec rôles limités ;
- Export et suppression autonomes des données personnelles ;
- Calendrier d'exceptions pendant les vacances ou les jours fériés.

Toute évolution devra conserver le principe fondateur : l'application facilite la mise en relation locale, mais ne devient pas un système de réservation ou de gestion opérationnelle du transport.
