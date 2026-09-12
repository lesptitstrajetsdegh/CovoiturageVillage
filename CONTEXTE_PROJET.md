# Contexte du projet Les P'tits trajets de Grand-Hallet

Projet bénévole destiné aux habitants d'un village belge d'environ 1200 habitants.

Nom affiché :
**Les P'tits trajets de Grand-Hallet**

Nom technique court :
`lesptitstrajetsdegh`

Slogan :
« La plateforme d'entraide des parents pour les trajets des enfants »

Objectif :
Les P'tits trajets de Grand-Hallet est une plateforme créée pour faciliter l'entraide entre les parents du village et les aider à organiser et mutualiser les trajets liés à l'école, aux activités extrascolaires et aux stages de leurs enfants.

L'objectif est de simplifier la vie des familles en permettant aux parents de se regrouper lorsque plusieurs d'entre eux effectuent les mêmes trajets, tout en limitant le nombre de déplacements et leur impact environnemental.

Principes :
- Pas un service de réservation.
- Pas de covoiturage domicile-travail ni de déplacements personnels.
- Pas de gestion détaillée des enfants.
- Pas de géolocalisation.
- Pas de coût financier pour l'administrateur si possible.

L'application doit rester simple, humaine et basée sur la confiance entre voisins.

## Trajets d'activités régulières

Les choix de sens sont :

- « Je fais uniquement l'aller » ;
- « Je fais uniquement le retour » ;
- « Je fais l'aller-retour dans la foulée ».

Ces choix décrivent ce que fait le parent pour le trajet concerné ; ils ne déterminent pas le nombre de trajets à encoder.

**Un aller et un retour sont toujours deux trajets distincts à encoder.**

## Règles de validation et notifications

## Authentification, contact et information

- L'adresse e-mail est le seul identifiant de connexion : aucun champ « identifiant » distinct n'existe.
- L'utilisateur crée son compte avec une adresse e-mail et un mot de passe. L'adresse e-mail n'est pas vérifiée automatiquement en V1 ; une note lui demande de vérifier attentivement l'adresse saisie.
- L'utilisateur ne peut pas modifier lui-même son adresse e-mail de connexion. En cas d'erreur, il contacte humainement le responsable de la plateforme par téléphone, en direct ou depuis une autre adresse e-mail ; le numéro de téléphone du profil peut servir à ce contact.
- La récupération d'un mot de passe oublié utilise la procédure intégrée au service d'authentification, avec l'envoi d'un lien de réinitialisation par e-mail.
- La V1 n'envoie pas d'e-mails automatiques pour les notifications ordinaires de la plateforme et n'utilise pas de service d'e-mail transactionnel dédié. Les notifications courantes sont enregistrées directement dans l'espace utilisateur ou administrateur. Les e-mails peuvent également être utilisés pour la récupération du mot de passe et pour le contact humain avec le responsable de la plateforme.
- Le contact se fait directement à l'adresse publique `lesptitstrajetsdegh (at) gmail.com`. Remplacez « (at) » par « @ » pour nous écrire. Aucun formulaire de contact n'est prévu dans l'application.

### Inscription d'un nouvel utilisateur

- Lorsqu'une personne crée un compte, celui-ci reçoit le statut `En attente`.
- Tant que l'administrateur n'a pas validé le compte, la personne ne peut pas accéder aux trajets.
- Une nouvelle inscription en attente est signalée dans l'espace administrateur, afin qu'elle puisse être vérifiée.
- Une notification interne est créée pour l'administrateur lorsqu'une inscription est en attente.

### Demande de nouveau lieu

- Lorsqu'un utilisateur validé demande la création d'un nouveau lieu, la demande reçoit le statut `En attente`.
- La demande apparaît dans l'espace administrateur et une notification interne est créée afin d'indiquer qu'elle doit être traitée.
- Le lieu ne peut être sélectionné dans un trajet qu'après sa validation par l'administrateur.

### Modification de l'adresse d'un utilisateur

- L'adresse complète sert à vérifier l'appartenance de l'utilisateur au village.
- Lorsqu'un utilisateur modifie son adresse, l'ancienne adresse validée reste l'adresse de référence jusqu'à validation de la nouvelle adresse.
- La nouvelle adresse est enregistrée comme une adresse à vérifier et passe en attente de vérification administrative.
- Cette modification est signalée dans l'espace administrateur par une notification interne.
- Le compte reste pleinement utilisable pendant la vérification administrative de la nouvelle adresse.
- La nouvelle adresse reste en attente et n'est considérée comme validée qu'après le contrôle de l'administrateur.
- Si la nouvelle adresse est refusée parce que l'utilisateur n'habite plus dans le village, son compte est suspendu et il n'a plus accès à la plateforme.
- Si la nouvelle adresse est refusée parce qu'elle nécessite une correction ou une précision, une notification interne en informe l'utilisateur, qui est invité à la modifier ; son compte reste utilisable.

### Décisions administratives

- Toute validation ou tout refus de compte, de lieu ou d'adresse est tracé dans le journal d'administration.
- Lorsque cela est pertinent, l'utilisateur concerné est informé de la décision au moyen d'une notification interne dans son espace.
- Lorsqu'une décision nécessite d'en informer l'utilisateur, une notification interne lui est créée.
- Les notifications internes sont le moyen officiel de notification. Elles sont enregistrées en base, associées à leur destinataire, dotées d'un type, d'un titre, d'un message, d'une date et d'un état lu/non lue ; elles peuvent référencer l'élément concerné et sont accessibles depuis la navigation avec un compteur de notifications non lues. Elles sont conservées un an à compter de leur création.
- Les notifications existent pour les utilisateurs et pour l'administrateur. Elles peuvent signaler une inscription validée ou refusée, une nouvelle adresse validée ou à corriger/préciser, un compte suspendu, une demande de lieu traitée, une nouvelle inscription, une nouvelle demande de lieu ou une nouvelle adresse à vérifier.
- Aucun système de messagerie interne n'est prévu : un utilisateur ne peut pas contacter directement un autre utilisateur par ce moyen.

## Message général d'information

«  Une plateforme bénévole et simple

Les P'tits trajets de Grand-Hallet est une initiative bénévole, proposée gratuitement aux familles du village. Pour rester simple et sans frais, la plateforme privilégie les notifications directement dans votre espace plutôt que les e-mails automatiques.

Pensez à consulter régulièrement vos notifications. »

Ce message est affiché lors de l'inscription et chaque fois qu'une intervention de l'administrateur est nécessaire, notamment lors d'une demande de modification d'adresse ou de création d'un nouveau lieu.

## Architecture technique V1 de référence

- Frontend : React + Vite.
- Hébergement : Cloudflare Pages Free.
- Couche serveur : Cloudflare Pages Functions Free.
- Base de données : Neon PostgreSQL Free.
- Authentification : Neon Auth / Better Auth, par e-mail et mot de passe.
- Le navigateur n'accède pas directement à Neon Data API : les accès aux données passent par la couche serveur.
- PostgreSQL RLS reste une couche de protection supplémentaire.
- Contact humain : Gmail dédié du projet.
- Aucun service d'e-mail automatique.

## Règles de fonctionnement — Les P'tits trajets de Grand-Hallet

Les P'tits trajets de Grand-Hallet repose sur une idée simple : s'entraider entre parents du village pour se simplifier la vie et prendre soin les uns des autres.

En utilisant la plateforme, je m'engage à :

- Faire preuve de respect, de courtoisie et de bienveillance envers les autres parents et leurs enfants.
- Respecter les arrangements convenus avec les autres familles et prévenir suffisamment tôt en cas d'empêchement.
- Prendre soin des enfants qui me sont confiés comme je souhaiterais que les autres parents prennent soin des miens.
- Respecter la confidentialité des informations auxquelles j'ai accès via la plateforme et ne pas communiquer les coordonnées d'un autre parent à des personnes extérieures.
- Utiliser la plateforme uniquement dans son objectif : l'entraide entre parents de Grand-Hallet pour les trajets liés à l'école, aux activités extrascolaires et aux stages des enfants.
- Régler directement entre parents les modalités de chaque trajet, dans un esprit de confiance et de bonne entente.

La plateforme facilite la mise en relation entre les familles, mais chaque trajet et chaque arrangement restent de la responsabilité des parents concernés.

Les Conditions d'utilisation complètes et la Politique de confidentialité sont publiées dans les documents dédiés. Lors de l'inscription, l'utilisateur doit :

- faire défiler le règlement jusqu'à la fin avant de pouvoir confirmer : « J'ai lu et j'accepte les règles de fonctionnement de la plateforme. » ;
- confirmer : « J'ai lu et j'accepte les Conditions d'utilisation. » ;
- être informé que la Politique de confidentialité explique l'utilisation de ses données et ses droits ; cette information ne constitue pas un consentement au traitement.

Le bouton de création du compte reste désactivé tant que les deux acceptations obligatoires ne sont pas cochées.

## Terminologie

- **Administrateur :** rôle de gestion dans l'application.
- **Responsable de la plateforme :** personne qui porte le projet.
- **Responsable du traitement :** personne au sens du RGPD.

Décisions validées :
- Application web responsive (pas d'application mobile native).
- Un compte = un adulte.
- Validation manuelle des inscriptions.
- Adresse visible uniquement par l'administrateur.
- Nom et prénom des parents visibles, ainsi que le nom de famille des enfants ; les coordonnées de contact restent masquées sauf lorsque l'utilisateur choisit d'afficher son téléphone.
- Chaque trajet est obligatoirement rattaché à une année scolaire.
- Chaque période de stage est obligatoirement rattachée à une année scolaire.
- Les familles organisent ensuite les arrangements directement entre elles.
