# Spécification fonctionnelle — V1

## 1. Présentation du projet

**Les P'tits trajets de Grand-Hallet** est une application web privée, réservée aux habitants du village. Son nom technique court est `lesptitstrajetsdegh` et son slogan est : « La plateforme d'entraide des parents pour les trajets des enfants ».

Elle aide les parents et responsables légaux à se mettre en relation pour organiser et mutualiser les trajets des enfants liés aux activités extrascolaires et aux stages de vacances.

L'application n'est pas un service de covoiturage domicile-travail, de déplacements personnels, de réservation de trajets, ni de transport à la demande. Son rôle est de rendre visibles des besoins et des propositions afin que les adultes concernés organisent ensuite librement leurs arrangements par téléphone ou e-mail.

Le projet est communautaire et bénévole. La solution technique doit donc privilégier les offres gratuites, sans dépendre d'un service payant pour le fonctionnement normal de la V1.

## 2. Objectifs de la V1

- Centraliser les trajets liés aux activités régulières et aux stages de vacances.
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

Un utilisateur validé représente **un adulte**, et non un foyer. Deux parents séparés peuvent donc créer et faire valider deux comptes distincts.

Il peut :

- consulter les trajets actifs de l'année scolaire affichée ;
- filtrer et rechercher ces trajets ;
- voir le prénom, le nom complet et les informations de trajet de leur créateur ;
- afficher volontairement l'e-mail et le téléphone d'un autre utilisateur ;
- créer, modifier, désactiver, réactiver et archiver ses propres trajets ;
- demander l'ajout d'un lieu ;
- consulter et modifier ses propres coordonnées ;
- consulter ses notifications internes.

Il ne peut jamais consulter l'adresse d'un autre utilisateur, modifier les trajets d'autrui, ni valider un compte ou un lieu.

### 3.4 Administrateur

L'administrateur est le seul rôle de gestion de la V1. Il peut :

- consulter les inscriptions en attente et leur adresse complète ;
- valider, refuser ou suspendre un compte ;
- gérer les années scolaires ;
- préencoder et gérer les semaines de vacances scolaires ;
- valider ou refuser les demandes de lieu ;
- consulter les trajets et, si nécessaire, les désactiver pour modération ;
- consulter un journal minimal des décisions administratives.

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
- Utiliser la plateforme uniquement dans son objectif : l'entraide entre parents de Grand-Hallet pour les trajets liés aux activités extrascolaires et aux stages des enfants.
- Régler directement entre parents les modalités de chaque trajet, dans un esprit de confiance et de bonne entente.

La plateforme facilite la mise en relation entre les familles, mais chaque trajet et chaque arrangement restent de la responsabilité des parents concernés.

Un accès aux Conditions d'utilisation est proposé ; elles peuvent s'ouvrir dans un nouvel onglet. L'utilisateur doit également cocher : « J'ai lu et j'accepte les Conditions d'utilisation. »

Un accès à la Politique de confidentialité est proposé ; elle peut s'ouvrir dans un nouvel onglet. Une formulation informe l'utilisateur que cette politique explique l'utilisation de ses données et ses droits. Cette prise de connaissance ne constitue pas un consentement au traitement.

Le bouton « Créer mon compte » reste désactivé tant que les deux cases d'acceptation obligatoires ne sont pas cochées. Le défilement obligatoire concerne uniquement le règlement affiché dans le bloc.

L'adresse est obligatoire uniquement afin que l'administrateur puisse vérifier l'appartenance au village. Elle est inaccessible aux autres utilisateurs.

Après inscription, le compte est créé avec le statut `En attente`. Une validation explicite de l'administrateur est requise avant tout accès aux trajets, lieux ou coordonnées. L'inscription apparaît dans l'espace administrateur et crée une notification interne pour l'administrateur. La validation ou le refus est tracé dans le journal d'administration et donne lieu à une notification interne pour l'utilisateur ; en cas de refus, elle indique que son inscription n'a pas été validée.

### 4.1.1 Modification d'adresse

L'adresse complète est utilisée pour vérifier l'appartenance de l'utilisateur au village. Lorsqu'un utilisateur modifie son adresse, l'ancienne adresse validée reste l'adresse de référence tant que la nouvelle adresse n'a pas été validée. La nouvelle adresse est enregistrée comme adresse « à vérifier ».

Le compte reste pleinement utilisable pendant la vérification. La modification apparaît dans l'espace administrateur et crée une notification interne pour l'administrateur. La décision est tracée dans le journal d'administration et, lorsque nécessaire, une notification interne est créée pour l'utilisateur.

Deux cas de refus sont prévus pour la V1 :

- **Adresse à corriger ou préciser :** l'utilisateur est invité à corriger ou préciser son adresse ; son compte reste utilisable et l'ancienne adresse validée demeure l'adresse de référence jusqu'à validation de la nouvelle.
- **L'utilisateur n'habite plus dans le village :** son compte est suspendu et il n'a plus accès à la plateforme.

### 4.1.2 Notifications

Le système de notifications interne est le moyen officiel de notification. Il concerne les utilisateurs et l'administrateur. Chaque notification est enregistrée dans la base, associée à son destinataire et comporte un type, un titre, un message, une date de création et un état lu/non lue. Elle peut référencer l'élément concerné lorsque c'est pertinent.

Les notifications sont accessibles depuis la navigation et un compteur affiche le nombre de notifications non lues. Elles sont conservées un an à compter de leur création.

Exemples utilisateur : inscription validée ou refusée, nouvelle adresse validée ou à corriger/préciser, compte suspendu, demande de lieu traitée. Exemples administrateur : nouvelle inscription, nouvelle demande de lieu, nouvelle adresse à vérifier ou autre événement nécessitant une intervention.

### 4.1.3 Mot de passe oublié et contact humain

Le mot de passe oublié ne déclenche aucune récupération automatique par e-mail. L'utilisateur contacte humainement le responsable de la plateforme. La procédure technique éventuelle dépendant de Neon Auth / Better Auth n'est pas détaillée ici.

L'adresse e-mail de connexion ne peut pas être modifiée directement par l'utilisateur. En cas de faute de frappe, il contacte le responsable de la plateforme par téléphone, en direct ou depuis une autre adresse e-mail ; le numéro de téléphone du profil peut servir à ce contact.

Le contact humain direct se fait à l'adresse publique : « lesptitstrajetsdegh (at) gmail.com ». Remplacez « (at) » par « @ » pour nous écrire. Aucun formulaire de contact n'est prévu.

### 4.2 Années scolaires

Chaque trajet appartient à une seule année scolaire, par exemple `2026-2027`. Une année scolaire possède une date de début, une date de fin et un statut (`Préparation`, `Active`, `Archivée`).

Par défaut, les recherches affichent exclusivement les trajets actifs de l'année scolaire active. Les données d'une année antérieure restent consultables selon la politique décidée par l'administrateur, mais elles ne sont jamais mélangées aux résultats courants.

### 4.3 Semaines de vacances scolaires

L'administrateur préencode, pour chaque année scolaire, les semaines de vacances susceptibles d'accueillir un stage, par exemple « Semaine du 3 au 7 août 2026 ». Chaque semaine de vacances appartient à une seule année scolaire et comprend un libellé, une date de début, une date de fin et, facultativement, la période de vacances concernée (Toussaint, Noël, Carnaval, Printemps ou Été).

Les jours individuels d'une semaine de vacances ne sont pas gérés par l'application.

### 4.4 Lieux

Les activités sont rattachées à un **lieu** et non à un nom d'activité. Un même lieu peut donc servir à plusieurs enfants et activités.

Un lieu comprend au minimum son nom et son statut :

- `Actif` : visible dans l'application et sélectionnable lors de la création d'un trajet ;
- `En attente` : demande soumise par un utilisateur, invisible dans les listes publiques et non sélectionnable ;
- `Refusé` : demande refusée, non sélectionnable.

Un utilisateur validé peut soumettre une demande de nouveau lieu. La demande reçoit le statut `En attente`, apparaît dans l'espace administrateur et crée une notification interne pour l'administrateur. L'administrateur peut l'activer ou la refuser. Le lieu n'est sélectionnable dans les trajets qu'après validation. La décision est tracée dans le journal d'administration et l'utilisateur concerné reçoit une notification interne.

### 4.5 Trajets

L'application propose deux types de transport : `Activité régulière` et `Stage de vacances`. Un utilisateur peut créer plusieurs trajets. Tous les trajets partagent la même gestion des parents, des lieux, des années scolaires et des trajets : il n'existe ni table de trajets distincte, ni système distinct d'utilisateurs ou de lieux pour les stages.

Chaque trajet contient obligatoirement :

- l'année scolaire ;
- le créateur du trajet ;
- le lieu actif concerné ;
- le type de transport ;
- le type de participation ;
- le statut du trajet ;
- les dates de création et de dernière modification.

#### Activité régulière

Le fonctionnement existant des activités régulières reste inchangé. Le trajet contient aussi le jour de la semaine, l'heure prévue au lieu d'activité et le sens de déplacement.

Les valeurs proposées pour le sens sont :

| Champ | Valeurs |
|---|---|
| Sens | `Je fais uniquement l'aller`, `Je fais uniquement le retour`, `Je fais l'aller-retour dans la foulée` |
| Type de participation | `Je propose un trajet`, `Je cherche une solution`, `Je souhaite organiser une tournante entre parents` |
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

#### Stage de vacances

Un trajet de type `Stage de vacances` concerne une semaine entière, et non un jour individuel. Il est associé à un lieu, à une semaine de vacances scolaires, à une heure et à un type de participation.

Il concerne soit un trajet du matin, soit un trajet du soir ; l'option « Je fais l'aller-retour dans la foulée » n'existe pas pour les stages. Le trajet du matin va du village vers le lieu d'activité et l'heure indiquée est l'heure d'arrivée au lieu. Le trajet du soir va du lieu d'activité vers le village et l'heure indiquée est l'heure de départ du lieu.

Le parent publie un trajet pour l'ensemble de la semaine. S'il ne peut participer que certains jours, les familles règlent ce point entre elles après leur prise de contact ; l'application ne gère pas les disponibilités par jour. Aucun nombre de places n'est enregistré.

Pour les deux types de transport, les types de participation restent : `Je propose un trajet`, `Je cherche une solution` et `Je souhaite organiser une tournante entre parents`.

Seuls les trajets `Actifs` sont visibles dans la recherche générale. Le créateur peut désactiver puis réactiver son trajet. L'archivage sert à clôturer définitivement ou à conserver l'historique d'un trajet qui ne doit plus être proposé.

### 4.6 Recherche et prise de contact

Tous les utilisateurs validés peuvent consulter les trajets actifs de l'année scolaire active. Les filtres disponibles sont :

- type de transport (`Activité régulière` ou `Stage de vacances`) ;
- lieu ;
- jour de la semaine, pour une activité régulière ;
- semaine de vacances scolaires, pour un stage de vacances ;
- heure approximative ;
- marge horaire acceptable avant/après l'heure demandée ;
- sens du déplacement pour une activité régulière, ou trajet du matin/du soir pour un stage de vacances ;
- type de participation.

Un résultat affiche le prénom et le nom complet du créateur, le lieu, les informations de période appropriées (jour ou semaine de vacances), l'heure, le sens ou le trajet du matin/du soir, et le type de participation.

L'e-mail et le numéro de téléphone sont masqués initialement. Ils ne sont affichés qu'après une action explicite, par exemple « Afficher les coordonnées ». Aucun message interne, algorithme de rapprochement, système de réservation ou confirmation de trajet n'est prévu.

## 5. Modèle de données

### `profiles`

Profil d'un adulte inscrit.

| Champ | Description |
|---|---|
| `id` | Identifiant unique, lié au compte d'authentification |
| `first_name` | Prénom |
| `last_name` | Nom complet |
| `home_address` | Adresse validée de référence, visible uniquement par l'administrateur |
| `pending_home_address` | Nouvelle adresse à vérifier ; absente lorsqu'aucune vérification d'adresse n'est en cours |
| `pending_home_address_status` | À vérifier ou correction/précision demandée ; absente lorsqu'aucune vérification d'adresse n'est en cours |
| `email` | E-mail de contact et de connexion |
| `phone` | Numéro de téléphone de contact |
| `account_status` | En attente, validé, refusé ou suspendu |
| `validated_at` / `validated_by` | Trace de la validation |
| `created_at` / `updated_at` | Dates techniques |

### `notifications`

Notifications internes destinées aux utilisateurs ou à l'administration. Cette entité relève du traitement « gestion du compte / administration » pour le RGPD.

| Champ | Description |
|---|---|
| `id` | Identifiant unique |
| `recipient_id` | Destinataire de la notification |
| `type` | Type d'événement |
| `title` | Titre |
| `message` | Message |
| `created_at` | Date de création |
| `read_at` | Date de lecture ; valeur absente si non lue |
| `reference_type` | Type de l'élément référencé, si nécessaire |
| `reference_id` | Identifiant de l'élément référencé, si nécessaire |

### `school_years`

| Champ | Description |
|---|---|
| `id` | Identifiant unique |
| `label` | Libellé, par exemple `2026-2027` |
| `start_date` / `end_date` | Bornes de l'année scolaire |
| `status` | Préparation, active ou archivée |

### `school_break_weeks`

Semaines de vacances scolaires préencodées par l'administrateur.

| Champ | Description |
|---|---|
| `id` | Identifiant unique |
| `school_year_id` | Année scolaire associée |
| `label` | Libellé, par exemple `Semaine du 3 au 7 août 2026` |
| `start_date` / `end_date` | Bornes de la semaine de vacances |
| `holiday_period` | Période facultative : Toussaint, Noël, Carnaval, Printemps ou Été |

### `places`

| Champ | Description |
|---|---|
| `id` | Identifiant unique |
| `name` | Nom du lieu |
| `location_details` | Adresse ou précision facultative utile au village |
| `status` | Actif, en attente ou refusé |
| `requested_by` | Utilisateur à l'origine de la demande, le cas échéant |
| `reviewed_by` / `reviewed_at` | Décision administrative |
| `refusal_reason` | Motif facultatif |

### `trips`

| Champ | Description |
|---|---|
| `id` | Identifiant unique |
| `school_year_id` | Année scolaire associée |
| `owner_id` | Adulte créateur |
| `place_id` | Lieu actif associé |
| `transport_type` | Activité régulière ou stage de vacances |
| `weekday` | Jour de la semaine, pour une activité régulière |
| `school_break_week_id` | Semaine de vacances associée, pour un stage de vacances |
| `activity_time` | Heure prévue au lieu d'activité pour une activité régulière ; heure d'arrivée (matin) ou de départ (soir) pour un stage |
| `direction` | Aller uniquement, retour uniquement ou aller-retour dans la foulée, pour une activité régulière |
| `stage_time_of_day` | Matin ou soir, pour un stage de vacances |
| `participation_type` | Proposition, recherche ou rotation |
| `status` | Actif, archivé ou désactivé |
| `created_at` / `updated_at` | Dates de suivi |

### `admin_audit_log` (recommandé)

Journal minimal des actions sensibles : validation/refus/suspension de compte, validation/refus d'adresse, validation/refus de lieu et modération de trajet.

## 6. Parcours utilisateurs

### Inscription puis accès

1. L'adulte ouvre l'application et choisit « Créer un compte ».
2. Il renseigne toutes les informations obligatoires, fait défiler le règlement jusqu'à sa fin, vérifie attentivement son adresse e-mail, puis confirme les deux acceptations obligatoires.
3. Il voit une page « En attente de validation ».
4. L'inscription apparaît dans l'espace administrateur et crée une notification interne pour l'administrateur ; celui-ci vérifie l'adresse et valide ou refuse le compte.
5. À sa prochaine connexion, l'utilisateur accède à la recherche de trajets.

### Chercher une solution

1. L'utilisateur validé ouvre l'accueil, qui liste les trajets actifs de l'année scolaire courante.
2. Il sélectionne le type de transport, un lieu, puis les critères adaptés : jour pour une activité régulière ou semaine de vacances pour un stage, heure et marge, puis si nécessaire un sens ou un trajet du matin/du soir et un type de participation.
3. Il consulte les résultats compatibles.
4. Il choisit « Afficher les coordonnées » pour un résultat qui l'intéresse.
5. Les familles conviennent de leur organisation en dehors de l'application.

### Publier et gérer un trajet

1. L'utilisateur choisit « Ajouter un trajet ».
2. Il sélectionne une année scolaire, un lieu actif et le type de transport. Pour une activité régulière, il renseigne le jour, l'heure, le sens et le type de participation. Pour un stage de vacances, il sélectionne une semaine de vacances préencodée, une heure, un trajet du matin ou du soir et le type de participation.
3. Il publie le trajet, qui devient actif et immédiatement visible aux utilisateurs validés.
4. Il peut ensuite modifier, désactiver, réactiver ou archiver ce trajet depuis « Mes trajets ».

### Demander un nouveau lieu

1. L'utilisateur ne trouve pas son lieu dans la liste active.
2. Il ouvre « Demander un lieu » et soumet son nom, avec une précision facultative.
3. La demande reçoit le statut `En attente`, apparaît dans l'espace administrateur et crée une notification interne pour l'administrateur.
4. Après validation administrative, tracée dans le journal, le lieu devient sélectionnable pour tous.

### Modifier son adresse

1. L'utilisateur validé modifie son adresse depuis son profil.
2. L'ancienne adresse validée reste l'adresse de référence et la nouvelle est enregistrée comme adresse à vérifier ; le compte reste pleinement utilisable.
3. La modification apparaît dans l'espace administrateur et crée une notification interne pour l'administrateur.
4. L'administrateur valide l'adresse ou la refuse selon l'un des deux cas prévus ; la décision est tracée dans le journal.
5. L'utilisateur reçoit l'information correspondante dans son espace sous forme de notification interne.

### Contacter le responsable de la plateforme

Le contact humain direct se fait à l'adresse « lesptitstrajetsdegh (at) gmail.com ». Remplacez « (at) » par « @ » pour nous écrire. Aucun formulaire de contact n'est prévu.

## 7. Parcours administrateur

### Validation d'un compte

1. L'administrateur ouvre la liste des inscriptions en attente.
2. Il consulte les informations nécessaires, dont l'adresse complète.
3. Il valide ou refuse la demande.
4. La décision est enregistrée dans le journal d'administration.

### Vérification d'une adresse modifiée

1. L'administrateur ouvre les modifications d'adresse à vérifier.
2. Il consulte l'ancienne adresse validée et la nouvelle adresse à vérifier.
3. Il valide la nouvelle adresse, demande une correction ou une précision, ou suspend le compte si l'utilisateur n'habite plus dans le village.
4. La décision est enregistrée dans le journal d'administration ; l'utilisateur en est informé dans son espace par notification interne.

### Gestion des lieux

1. L'administrateur ouvre les demandes de lieux en attente.
2. Il vérifie l'intitulé et évite les doublons éventuels.
3. Il active ou refuse la demande.
4. Un lieu activé devient disponible dans le formulaire de trajet.

### Gestion annuelle et modération

L'administrateur crée l'année scolaire suivante avant sa mise en service, y préencode les semaines de vacances scolaires disponibles pour les stages, définit une seule année active, puis archive l'année terminée. Il peut désactiver un trajet en cas d'erreur manifeste ou de non-respect des règles, et suspendre un compte si nécessaire.

## 8. Pages prévues

- Accueil public et connexion ;
- Inscription ;
- Écran d'attente de validation ;
- Centre de notifications utilisateur et administration ;
- Recherche/liste des trajets ;
- Détail d'un trajet avec révélation volontaire des coordonnées ;
- Création et modification de trajet ;
- Mes trajets ;
- Demande de lieu ;
- Mon profil ;
- Tableau de bord administrateur : comptes, lieux, modifications d'adresse, années scolaires, semaines de vacances scolaires, trajets et journal.

## 9. Confidentialité et sécurité

- L'application est privée : les données fonctionnelles ne sont accessibles qu'après validation du compte.
- L'adresse complète est réservée à l'administrateur. Elle ne doit ni apparaître dans les listes, ni dans les résultats de recherche, ni dans les données transmises à d'autres utilisateurs.
- Le téléphone et l'e-mail sont masqués jusqu'à une action explicite de l'utilisateur consultant un trajet.
- L'adresse e-mail est l'identifiant de connexion et n'est pas vérifiée automatiquement en V1. Elle ne peut pas être modifiée directement par l'utilisateur.
- Le contact humain direct du projet est indiqué sous la forme « lesptitstrajetsdegh (at) gmail.com » ; aucun e-mail automatique n'est envoyé.
- L'application ne collecte aucune donnée concernant les enfants : pas de nom, âge, école, photo ni profil enfant.
- Les mots de passe ne sont jamais stockés par l'application ; ils sont gérés par le fournisseur d'authentification.
- Chaque utilisateur ne peut modifier que son profil et ses trajets. Les règles d'accès doivent être appliquées côté serveur et dans la base de données, pas uniquement dans l'interface.
- Les échanges et accès d'administration doivent se faire via HTTPS.
- Une politique de confidentialité doit préciser la finalité des données, le responsable du traitement, la durée de conservation et les modalités d'accès, rectification et suppression.
- Une durée de conservation doit être décidée avant lancement, par exemple archivage des trajets à la fin de l'année scolaire puis suppression après une période définie, sauf obligation légale contraire.
- Les notifications internes sont conservées un an à compter de leur création.

## 10. Architecture technique V1 de référence

- Frontend : React + Vite.
- Hébergement : Cloudflare Pages Free.
- Couche serveur : Cloudflare Pages Functions Free.
- Base de données : Neon PostgreSQL Free.
- Authentification : Neon Auth / Better Auth, par e-mail et mot de passe.
- Aucune Neon Data API n'est exposée directement au navigateur ; les accès aux données passent par la couche serveur.
- PostgreSQL RLS reste une couche de protection supplémentaire.
- Contact humain : Gmail dédié du projet.
- Aucun e-mail automatique, SMTP ou service d'e-mail transactionnel.

## 11. Hors périmètre de la V1

Les éléments suivants ne seront pas développés dans cette première version :

- application Android ou iOS native ;
- GPS, géolocalisation, calcul d'itinéraires ou cartes ;
- profils ou données d'enfants ;
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
