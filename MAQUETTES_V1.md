# Maquettes textuelles — V1

Ces maquettes décrivent des écrans web pensés d'abord pour un smartphone : une colonne, actions principales visibles, champs regroupés en blocs courts et navigation simple. Elles ne décrivent pas de code ni de nouvelles fonctionnalités.

## Navigation commune

- **Visiteur :** logo « Les P'tits trajets de Grand-Hallet », `Se connecter`, `Créer un compte`.
- **Compte en attente :** logo, accès à l'écran d'attente et aux informations de contact humain.
- **Utilisateur validé :** barre haute avec logo et menu : `Rechercher`, `Mes trajets`, `Demander un lieu`, `Notifications`, `Mon profil`, `Aide`.
- **Administrateur :** même navigation que l'utilisateur validé, avec l'entrée supplémentaire `Administration`.

L'entrée `Notifications` affiche un compteur de notifications non lues.

Les coordonnées d'un autre adulte ne sont jamais affichées par défaut. L'adresse complète n'est visible que dans les écrans d'administration nécessaires à la validation des comptes.

---

## 1. Accueil public

**Ce que voit le visiteur**

```text
[ Les P'tits trajets de Grand-Hallet ]

La plateforme d'entraide des parents pour les trajets des enfants

Les P'tits trajets de Grand-Hallet aide les parents du village
à organiser et mutualiser les trajets des enfants liés aux
activités extrascolaires et aux stages.

Regroupez-vous lorsque vous effectuez les mêmes trajets,
pour simplifier la vie des familles et limiter les déplacements.

Cette plateforme ne concerne pas les trajets domicile-travail
ni les déplacements personnels.

[ Se connecter ]
[ Créer un compte ]

Comment cela fonctionne ?
1. Créez votre compte.
2. Il est vérifié par l'administrateur.
3. Recherchez ou publiez un trajet.
4. Entrez directement en contact avec d'autres familles
   pour vous entraider.
```

- **Actions :** `Se connecter`, `Créer un compte`.
- **Champs et filtres :** aucun.
- **Visibilité :** accessible au visiteur non connecté. Aucun trajet, lieu, nom ou coordonnée d'utilisateur n'est affiché.

## 2. Inscription

**Ce que voit le visiteur**

```text
< Retour                 Créer un compte

Prénom *
[____________________________]
Nom complet *
[____________________________]
Adresse complète *
[____________________________]
E-mail *
[____________________________]
ℹ️ Vérifiez attentivement votre adresse e-mail : elle servira à vous connecter à la plateforme et ne sera pas vérifiée automatiquement.
Téléphone *
[____________________________]
Mot de passe *
[____________________________]

Votre adresse est utilisée uniquement pour vérifier
votre appartenance au village.

Votre compte sera soumis à validation administrative avant
l'accès aux trajets.

Règles de fonctionnement
[ Bloc défilant — faites défiler jusqu'à la fin ]
Les P'tits trajets de Grand-Hallet repose sur une idée simple :
s'entraider entre parents du village pour se simplifier la vie
et prendre soin les uns des autres.

En utilisant la plateforme, je m'engage à :
- Faire preuve de respect, de courtoisie et de bienveillance
  envers les autres parents et leurs enfants.
- Respecter les arrangements convenus avec les autres familles
  et prévenir suffisamment tôt en cas d'empêchement.
- Prendre soin des enfants qui me sont confiés comme je souhaiterais
  que les autres parents prennent soin des miens.
- Respecter la confidentialité des informations auxquelles j'ai accès
  via la plateforme et ne pas communiquer les coordonnées d'un autre
  parent à des personnes extérieures.
- Utiliser la plateforme uniquement dans son objectif : l'entraide
  entre parents de Grand-Hallet pour les trajets liés aux activités
  extrascolaires et aux stages des enfants.
- Régler directement entre parents les modalités de chaque trajet,
  dans un esprit de confiance et de bonne entente.

La plateforme facilite la mise en relation entre les familles,
mais chaque trajet et chaque arrangement restent de la responsabilité
des parents concernés.
[ Fin du règlement ]

(case inactive jusqu'à la fin du défilement)
☐ J'ai lu et j'accepte les règles de fonctionnement de la plateforme.

Conditions d'utilisation
[ Consulter les Conditions d'utilisation — nouvel onglet possible ]
☐ J'ai lu et j'accepte les Conditions d'utilisation.

Politique de confidentialité
[ Consulter la Politique de confidentialité — nouvel onglet possible ]
Cette politique vous informe sur l'utilisation de vos données et vos droits.
Sa consultation ne constitue pas un consentement au traitement de vos données.

[ Créer mon compte — désactivé tant que les deux cases ne sont pas cochées ]
```

- **Actions :** `Créer mon compte`, retour à l'accueil, ouverture possible des Conditions d'utilisation et de la Politique de confidentialité dans un nouvel onglet. La case d'acceptation des règles n'est activable qu'après le défilement complet du règlement. Le bouton `Créer mon compte` reste désactivé tant que les deux cases d'acceptation obligatoires ne sont pas cochées ; aucun défilement obligatoire supplémentaire n'est demandé pour les Conditions d'utilisation ou la Politique de confidentialité.
- **Champs :** prénom, nom complet, adresse complète, e-mail, téléphone, mot de passe, acceptation obligatoire des règles de fonctionnement et acceptation obligatoire des Conditions d'utilisation.
- **Visibilité :** accessible au visiteur. L'adresse n'est pas rendue visible aux autres utilisateurs.

## 3. Connexion et mot de passe oublié

```text
< Retour                 Se connecter

E-mail *
[____________________________]
Mot de passe *
[____________________________]

[ Se connecter ]

Mot de passe oublié ?
La récupération automatique par e-mail n'est pas disponible.
Contactez le responsable de la plateforme :
lesptitstrajetsdegh (at) gmail.com
Remplacez « (at) » par « @ » pour nous écrire.
```

Aucun lien de récupération automatique ni e-mail automatique n'est prévu.

## 4. Centre de notifications

```text
< Retour                 Notifications (2)

● Inscription validée                         18/08/2026
  Votre compte est maintenant validé.

○ Demande de lieu traitée                    12/08/2026
  La demande concernant la salle communale a été traitée.
  [ Voir l'élément concerné ]
```

Une notification affiche son titre, sa date, son état lue/non lue et, lorsque pertinent, une navigation vers l'élément concerné. La variante administrative liste par exemple les nouvelles inscriptions, demandes de lieu et adresses à vérifier. Le compteur indique les notifications non lues ; les notifications sont conservées un an.

## 5. Aide

«  Une plateforme bénévole et simple

Les P'tits trajets de Grand-Hallet est une initiative bénévole, proposée gratuitement aux familles du village. Pour rester simple et sans frais, la plateforme privilégie les notifications directement dans votre espace plutôt que les e-mails automatiques.

Pensez à consulter régulièrement vos notifications. »

## 3. En attente de validation administrative

**Ce que voit le compte en attente**

```text
[ Les P'tits trajets de Grand-Hallet ]

Votre demande est en cours de validation.

L'administrateur vérifie que vous habitez bien le village.
Vous pourrez accéder aux trajets après validation.

[ Se déconnecter ]
Contact humain : lesptitstrajetsdegh (at) gmail.com
```

- **Actions :** `Se déconnecter`. Contact humain : `lesptitstrajetsdegh (at) gmail.com`.
- **Champs et filtres :** aucun.
- **Visibilité :** réservé au compte `En attente`. Les trajets, lieux et coordonnées restent inaccessibles. Après validation ou refus, une information simple est affichée dans cet espace.

## 4. Recherche et liste des trajets

**Ce que voit l'utilisateur validé**

```text
[ Menu ]              Rechercher des trajets
Année scolaire active : 2026-2027

Type de transport
(•) Activité régulière   ( ) Stage de vacances

Lieu                       [ Tous les lieux       v ]
Jour de la semaine          [ Tous                 v ]
Heure approximative         [ --:-- ]
Marge acceptable            [ +/- ... minutes     v ]
Sens                        [ Tous                 v ]
Participation               [ Tous                 v ]

[ Rechercher ]

Trajets actifs
----------------------------------------
Marie Dupont
Lieu : Salle communale
Mardi • 17:30 • Je fais uniquement l'aller
Je propose un trajet
[ Voir le trajet ]
----------------------------------------
```

- **Actions :** ouvrir un résultat avec `Voir le trajet`, modifier les filtres.
- **Filtres communs :** type de transport, lieu, heure approximative, marge horaire, type de participation.
- **Filtres pour `Activité régulière` :** jour de la semaine et sens (`Je fais uniquement l'aller`, `Je fais uniquement le retour`, `Je fais l'aller-retour dans la foulée`). Un aller et un retour sont toujours deux trajets distincts à encoder.
- **Filtres pour `Stage de vacances` :** semaine de vacances scolaires et trajet `Matin` ou `Soir`. Le matin correspond au trajet village → lieu, le soir au trajet lieu → village.
- **Visibilité :** réservé aux utilisateurs validés et administrateurs. Seuls les trajets actifs de l'année scolaire active sont listés. Chaque carte affiche le prénom, le nom complet et les informations de trajet, mais pas les coordonnées ni l'adresse.

## 5. Détail d'un trajet

**Ce que voit l'utilisateur validé**

```text
< Résultats                 Détail du trajet

Marie Dupont

Activité régulière
Salle communale
Mardi • 17:30
Je fais uniquement l'aller
Je propose un trajet

Coordonnées masquées
[ Afficher les coordonnées ]

Les familles organisent ensuite leur arrangement
directement entre elles.
```

Pour un stage, le bloc central indique par exemple :

```text
Stage de vacances
Semaine du 3 au 7 août 2026
Salle communale
Matin • arrivée à 08:30
Je cherche une solution
```

- **Actions :** retour aux résultats ; `Afficher les coordonnées`.
- **Champs et filtres :** aucun filtre. Les informations visibles sont le créateur, le lieu, le type de transport, la période, l'heure, le sens ou matin/soir, et le type de participation.
- **Visibilité :** réservé aux utilisateurs validés et administrateurs. E-mail et téléphone ne sont affichés qu'après action explicite ; l'adresse complète n'est jamais affichée. Le propriétaire peut accéder à l'édition depuis `Mes trajets`, pas depuis ce détail de recherche.

## 6. Créer ou modifier un trajet d'activité régulière

**Ce que voit l'utilisateur validé**

```text
< Annuler              Ajouter un trajet

Type de transport
[ Activité régulière                         ]

Année scolaire *       [ 2026-2027          v ]
Lieu *                 [ Choisir un lieu    v ]
Jour *                 [ Choisir un jour    v ]
Heure au lieu *        [ --:-- ]

Sens *
( ) Je fais uniquement l'aller
( ) Je fais uniquement le retour
( ) Je fais l'aller-retour dans la foulée

Un aller et un retour sont toujours deux trajets distincts à encoder.
Les choix de sens décrivent ce que vous faites pour le trajet concerné ;
ils ne déterminent pas le nombre de trajets à encoder.

Vous déposez votre enfant et rentrez directement à Grand-Hallet ?
→ Pour l'aller : « Je fais l'aller-retour dans la foulée ».
→ Pour le retour : encodez également un trajet séparé et choisissez
  « Je fais l'aller-retour dans la foulée » si vous revenez directement
  après l'activité.

Vous restez sur place pendant l'activité ?
→ Pour l'aller : « Je fais uniquement l'aller ».
→ Pour le retour : « Je fais uniquement le retour ».

Dans les deux cas, vous encodez donc un trajet aller ET un trajet retour.

Participation *
( ) Je propose un trajet
( ) Je cherche une solution
( ) Je souhaite organiser une tournante entre parents

[ Publier le trajet ]
```

- **Actions :** sélectionner les valeurs, `Publier le trajet` ; en modification, enregistrer les changements. Le lieu est choisi parmi les lieux actifs ; si nécessaire, l'utilisateur passe par `Demander un lieu`.
- **Champs :** année scolaire, lieu actif, jour, heure au lieu, sens, type de participation.
- **Visibilité :** réservé au créateur du trajet validé ; un administrateur peut consulter et modérer les trajets, sans se substituer au créateur pour leur édition. Aucun champ relatif aux enfants, au nombre de places ou à l'adresse n'est présent.

## 7. Créer ou modifier un trajet de stage de vacances

**Ce que voit l'utilisateur validé**

```text
< Annuler              Ajouter un trajet

Type de transport
[ Stage de vacances                           ]

Année scolaire *       [ 2026-2027          v ]
Semaine de vacances *  [ Semaine du 3 au 7 août 2026 v ]
Lieu *                 [ Choisir un lieu    v ]

Trajet *
( ) Matin — village vers le lieu
    Heure d'arrivée au lieu * [ --:-- ]
( ) Soir — lieu vers le village
    Heure de départ du lieu * [ --:-- ]

Participation *
( ) Je propose un trajet
( ) Je cherche une solution
( ) Je souhaite organiser une tournante entre parents

[ Publier le trajet ]
```

- **Actions :** sélectionner les valeurs, `Publier le trajet` ; en modification, enregistrer les changements.
- **Champs :** année scolaire, semaine de vacances préencodée, lieu actif, trajet du matin ou du soir, heure appropriée et type de participation.
- **Visibilité :** réservé au créateur du trajet validé. Aucune sélection de jour, aucune disponibilité quotidienne, aucune option « Je fais l'aller-retour dans la foulée » et aucun nombre de places ne sont proposés. Un trajet couvre la semaine entière.

## 8. Mes trajets

**Ce que voit l'utilisateur validé**

```text
[ Menu ]                       Mes trajets

[ + Ajouter un trajet ]

Actifs
----------------------------------------
Activité régulière • Salle communale
Mardi • 17:30 • Je propose un trajet
[ Modifier ] [ Désactiver ] [ Archiver ]
----------------------------------------
Stage de vacances • Semaine du 3 au 7 août 2026
Matin • arrivée à 08:30
[ Modifier ] [ Désactiver ] [ Archiver ]

Désactivés
... [ Réactiver ] [ Modifier ] [ Archiver ]

Archivés
...
```

- **Actions :** `Ajouter un trajet`, `Modifier`, `Désactiver`, `Réactiver`, `Archiver` selon le statut.
- **Champs et filtres :** les trajets sont regroupés par statut ; chaque carte indique les informations propres au type de transport.
- **Visibilité :** l'utilisateur ne voit et ne gère que ses propres trajets. Les trajets actifs sont visibles dans la recherche générale ; les désactivés et archivés ne le sont pas.

## 9. Mon profil

**Ce que voit l'utilisateur validé**

```text
< Menu                         Mon profil

Prénom
[ Marie                       ]
Nom complet
[ Dupont                      ]
Adresse complète
[ Adresse validée de référence ]
Nouvelle adresse
[ ...                         ]

Si vous modifiez votre adresse, la nouvelle adresse est à vérifier.
Votre compte reste utilisable. L'adresse validée de référence reste
utilisée jusqu'à la validation de la nouvelle adresse.

Après décision, une information est affichée ici. Si une correction
ou une précision est demandée, vous pouvez modifier l'adresse ; votre
compte reste utilisable. Si vous n'habitez plus dans le village,
votre compte est suspendu et l'accès à la plateforme est retiré.
E-mail
[ marie@example.be            ]
Téléphone
[ ...                         ]

[ Enregistrer les modifications ]
```

- **Actions :** modifier et enregistrer ses coordonnées. Une modification d'adresse déclenche sa vérification administrative ; l'utilisateur est informé ici de la décision par notification interne.
- **Champs :** prénom, nom complet, adresse validée de référence, nouvelle adresse à vérifier, e-mail, téléphone.
- **Visibilité :** réservé au propriétaire du profil et à l'administrateur pour les besoins de validation. L'utilisateur ne peut jamais voir ou modifier le profil d'un autre adulte ; l'adresse n'est jamais publique.

## 10. Demander un nouveau lieu

**Ce que voit l'utilisateur validé**

```text
< Retour                 Demander un lieu

Nom du lieu *
[____________________________]
Précision facultative
[____________________________]

[ Envoyer la demande ]

La demande sera examinée par l'administrateur.
Le lieu n'est pas sélectionnable avant sa validation.
```

- **Actions :** `Envoyer la demande`, retour.
- **Champs :** nom du lieu obligatoire ; précision facultative.
- **Visibilité :** réservé aux utilisateurs validés et administrateurs. Les demandes en attente et refusées ne sont pas disponibles dans les formulaires de trajet.

## 11. Tableau de bord administrateur

**Ce que voit l'administrateur**

```text
[ Administration ]

À traiter
[ Comptes en attente : 3 ]
[ Demandes de lieu : 2 ]
[ Modifications d'adresse à vérifier : 1 ]

Notifications
[ Nouvelles inscriptions, demandes de lieu et adresses à vérifier ]
[ Notifications internes enregistrées dans l'espace administrateur ]

Gestion
[ Années scolaires et semaines de vacances ]
[ Trajets ]
[ Journal des décisions ]

Raccourcis
[ Valider les comptes ] [ Gérer les lieux ] [ Vérifier les adresses ]
```

- **Actions :** accéder aux comptes, lieux, modifications d'adresse, années scolaires et semaines de vacances, trajets et journal ; ouvrir les éléments à traiter.
- **Champs et filtres :** compteurs des comptes, lieux et adresses à traiter ; notification interne pour une nouvelle inscription, demande de lieu ou adresse à vérifier. La consultation des trajets peut être utilisée pour la modération.
- **Visibilité :** exclusivement administrateur. Les utilisateurs validés ne voient ni les compteurs, ni le journal, ni les données d'administration.

## 12. Validation des comptes et vérification des adresses par l'administrateur

**Ce que voit l'administrateur**

```text
< Administration           Comptes en attente

----------------------------------------
Marie Dupont
marie@example.be • 04...
[ Voir la demande ]
----------------------------------------

Demande de Marie Dupont
Prénom / nom : Marie Dupont
Adresse complète : ...
E-mail : marie@example.be
Téléphone : ...

[ Valider le compte ]
[ Refuser le compte ]
```

- **Actions :** consulter une demande, `Valider le compte`, `Refuser le compte`. L'administration peut aussi suspendre un compte selon les règles de la V1.
- **Champs et filtres :** liste des inscriptions en attente et détails nécessaires à la décision.
- **Visibilité :** exclusivement administrateur. L'adresse complète et les données de validation ne sont visibles à aucun autre rôle. Chaque décision est tracée dans le journal d'administration.

Pour une modification d'adresse, l'administration voit également :

```text
< Administration        Adresses à vérifier

Marie Dupont
Adresse validée de référence : ...
Nouvelle adresse à vérifier : ...

[ Valider la nouvelle adresse ]
[ Demander une correction ou une précision ]
[ Suspendre le compte : hors village ]
```

- **Actions :** valider la nouvelle adresse, demander une correction ou une précision, ou suspendre le compte lorsque l'utilisateur n'habite plus dans le village.
- **Décision :** chaque décision est tracée dans le journal. L'utilisateur reçoit une notification interne dans son espace.

## 13. Gestion administrative des lieux

**Ce que voit l'administrateur**

```text
< Administration             Demandes de lieux

En attente
----------------------------------------
Salle communale
Précision : entrée arrière
Demandé par : Marie Dupont
[ Voir ] [ Activer ] [ Refuser ]
----------------------------------------

Lieux actifs
[ Rechercher un lieu ]
... liste des lieux actifs ...
```

- **Actions :** examiner une demande, `Activer`, `Refuser` ; consulter les lieux actifs afin d'éviter les doublons. Une nouvelle demande apparaît dans l'administration et crée une notification interne ; la décision est tracée dans le journal.
- **Champs et filtres :** liste des demandes en attente et recherche parmi les lieux actifs.
- **Visibilité :** exclusivement administrateur pour les demandes et décisions. Un lieu activé devient sélectionnable par les utilisateurs validés ; un lieu en attente ou refusé ne l'est pas.

## 14. Gestion des années scolaires et des semaines de vacances

**Ce que voit l'administrateur**

```text
< Administration        Années et semaines de vacances

Années scolaires
2026-2027 • Active
du [ date ] au [ date ]
[ Gérer ]

[ Créer une année scolaire ]

Semaines de vacances — 2026-2027
[ Ajouter une semaine ]
----------------------------------------
Semaine du 3 au 7 août 2026
du 03/08/2026 au 07/08/2026 • Été
[ Modifier ]
----------------------------------------
```

Formulaire d'année scolaire :

```text
Libellé *       [ 2026-2027 ]
Date de début * [ jj/mm/aaaa ]
Date de fin *   [ jj/mm/aaaa ]
Statut           [ Préparation / Active / Archivée ]
[ Enregistrer ]
```

Formulaire de semaine de vacances :

```text
Année scolaire *       [ 2026-2027 v ]
Libellé *              [ Semaine du ... ]
Date de début *        [ jj/mm/aaaa ]
Date de fin *          [ jj/mm/aaaa ]
Période de vacances    [ Facultatif : Toussaint, Noël, Carnaval,
                          Printemps ou Été ]
[ Enregistrer ]
```

- **Actions :** créer et gérer les années scolaires ; préencoder et modifier les semaines de vacances scolaires.
- **Champs :** année scolaire : libellé, dates et statut. Semaine : année scolaire, libellé, dates et période facultative.
- **Visibilité :** exclusivement administrateur. Les utilisateurs validés voient uniquement les semaines de vacances préencodées lorsque le formulaire d'un trajet de stage le requiert ; ils ne peuvent pas les gérer.

## 15. Contact humain

Le contact se fait directement par e-mail à l'adresse publique :

`lesptitstrajetsdegh (at) gmail.com`

Remplacez « (at) » par « @ » pour nous écrire. Aucun formulaire de contact n'est prévu.
