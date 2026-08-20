# Registre des traitements RGPD — Les P'tits trajets de Grand-Hallet

Responsable du traitement : [Prénom NOM]  
Adresse e-mail de contact : lesptitstrajetsdegh (at) gmail.com

| Traitement | Base juridique | Finalité | Données | Accès / destinataires | Conservation |
|---|---|---|---|---|---|
| Création / gestion du compte | 6.1.b | Fournir le service | identité, e-mail, téléphone, données de compte | utilisateur concerné, administration, prestataires nécessaires | compte actif ; désactivé : 1 an |
| Vérification du village | 6.1.f | Vérifier l'appartenance à Grand-Hallet | adresse, identité, statut | administrateur uniquement | selon les règles du compte |
| Gestion des trajets | 6.1.b | Publier/rechercher/gérer les trajets | données relatives aux trajets | utilisateurs validés selon le fonctionnement prévu, administrateur | jusqu'à ouverture de N+2 |
| Affichage des coordonnées | 6.1.f | Permettre la prise de contact | téléphone, e-mail | utilisateur validé après action volontaire | selon le compte concerné |
| Gestion des lieux | 6.1.b | Permettre la gestion des lieux nécessaires au service | données du lieu et demandeur | administrateur / utilisateurs selon statut du lieu | selon le statut du lieu |
| Modification d'adresse | 6.1.f | Vérifier que l'utilisateur réside toujours dans le village | ancienne adresse validée, nouvelle adresse, statut | administrateur + utilisateur concerné | donnée provisoire jusqu'à résolution |
| Journal administratif | 6.1.f | Traçabilité et sécurité administrative | identité, action, date, décision | administrateur uniquement | 1 an |
| Notifications internes (rattachées à la gestion du compte / administration) | 6.1.b et/ou 6.1.f selon la notification | Informer l'utilisateur ou l'administration dans l'application | destinataire, type, titre, message, date, statut lu/non lu, référence éventuelle | destinataire et administration selon le rôle | 1 an à compter de la création |
| Authentification / fonctionnement technique | 6.1.b | Faire fonctionner le service | identifiants et données techniques nécessaires | prestataires nécessaires | selon le prestataire |
| Sécurité / prévention des abus | 6.1.f | Sécuriser le service | journaux techniques nécessaires | administration / prestataires nécessaires | selon le besoin et le prestataire |

## Tests d'intérêt légitime

### 1. Vérification de l'appartenance au village

- **Intérêt légitime poursuivi :** réserver l'accès à la plateforme aux habitants de Grand-Hallet afin de préserver son objet local.
- **Nécessité :** la vérification de l'adresse est nécessaire pour vérifier le respect de cette condition d'accès.
- **Mise en balance et garanties :** l'adresse est accessible uniquement au responsable du traitement lorsqu'il exerce le rôle applicatif d'administrateur ; elle n'est jamais affichée aux autres utilisateurs. L'accès est limité à cette finalité.
- **Conclusion :** le traitement est mis en œuvre sous réserve de ces garanties et du respect des droits des personnes.

### 2. Affichage des coordonnées

- **Intérêt légitime poursuivi :** permettre aux parents de se contacter afin d'organiser les trajets.
- **Nécessité :** les coordonnées sont nécessaires à la prise de contact directe, l'application ne prévoyant pas de messagerie interne.
- **Mise en balance et garanties :** accès réservé aux utilisateurs validés ; affichage uniquement après action volontaire ; aucune publication publique ; interdiction de diffusion à des tiers.
- **Conclusion :** le traitement est mis en œuvre sous réserve de ces garanties et du respect des droits des personnes.

## Prestataires et sécurité

L'architecture de référence repose sur Cloudflare Pages Free et Cloudflare Pages Functions Free, Neon PostgreSQL Free et Neon Auth / Better Auth. Les données ne sont pas exposées directement au navigateur via Neon Data API ; les accès passent par la couche serveur et PostgreSQL RLS reste une protection supplémentaire. Les informations contractuelles, paramètres de configuration et éventuels transferts hors EEE restent à vérifier : [à compléter]. Aucun service d'e-mail automatique, SMTP ou transactionnel n'est retenu.

L'adresse e-mail est l'identifiant du compte et n'est pas vérifiée automatiquement. La récupération automatique du mot de passe par e-mail n'est pas prévue. Le contact humain se fait à « lesptitstrajetsdegh (at) gmail.com ».
