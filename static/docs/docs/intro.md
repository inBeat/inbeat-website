# Formation pour le site web de Clinique Tandem

> À titre informatif, ce site est bâti par le générateur de site statique [Hugo](https://gohugo.io) et héberger sur [Netlify](https://www.netlify.com/). Vous utiliserez [Netlify CMS](https://www.netlifycms.org/) pour contrôler le contenu de votre site (système de gestion de contenu). Ce document se veut une formation sur l'utilisation de Netlify CMS, de l'authentification à la modification du contenu. Bienvenu dans un nouveau monde!

## Terminologie

Pour que tout le monde soit sur la même longueur d'onde, voici quelques termes utilisés tout au long de ce document:

- *CMS* : Système de gestion de contenu, comme par exemple Wordpress. C'est tout le rouage qui permet de modifier le contenu de site web au travers un tableau de bord.
- *Switch vrai/faux* : Voici un exemple de switch active ![switch](docs/switch.png) et non-active ![switch-non](docs/switch-non.png)
- *build* : Terme utilisé pour représenter l'action de Netlify quand il prend les données que vous lui soumettez et il bâti la nouvelle version de votre site

## Qu'est-ce qu'un site statique? 

Ceci sera la seule partie technique de cette formation, mais bien importante à comprendre. Un site statique **ne possède pas** de base de données, ce n'est **pas** Wordpress. Il faut donc comprendre cette nouvelle dynamique. Lorsque vous effectuez des modifications sur votre site, notre serveur ainsi qu'Hugo (non, ce n'est pas le nom d'une personne :)) **rebâti le site en entier** et remplace le précédent. 

#### Les implications sont:

- Il y a un délai entre le moment où vous publiez les changements en ligne, et le moment où vous verrez ces changements (on parle de 25 secondes normalement, pas 4 minutes).
- Si vous avez fait une erreur, le nouveau site ne sera tout simplement pas bâti. La plupart du temps, vous serez notifié directement dans votre tableau de bord. Sinon, vous recevrez un courriel de Netlify mentionnant que le "build" a échoué.
- Votre site est beaucoup plus sécuritaire et beaucoup plus rapide qu'un site Wordpress. De plus, il ne nécessite aucun entretien et ne sera jamais "hacké".

## Ce que vous pourrez faire avec votre CMS

Voici les éléments que vous pourrez modifer/ajouter:

- Toutes les pages (modification)
- Ressources --> Mieux Comprendre (ajout de pages)
- Formations (modification + ajout)
- Services (modification + ajout)
- Membres de l'équipe (modification + ajout)
- Information sur l'entreprise (modification seulement)

Cette formation abordera chacun de ses éléments. N'hésitez pas à me contacter vous avez des questions [felix.deblois@akiamarketing.ca](mailto:felix.deblois@akiamarketing.ca) ou 514-638-3539.

## Concepts important

### Identifiant

Tout au long de votre aventure dans le CMS, vous croiserez souvent le champ "identifiant". Il faut comprendre que cet identifiant est unique **pour des éléments du même type**, et peut seulement contenir des chiffres, des lettres et des - (par exemple, 02-article-test, clinique-en-example, testeur-de-jeu). Par unique, je veux dire **unique à une entité, à un élément multilingue**. Voici des exemples pour illustrer ce concept:

- Deux articles différents **ne doivent pas** avoir le même identifiant.
- La version française d'un article et la version anglaise d'un article **ont le même identifiant**.

Je vais élaborer sur ce sujet dans la section Modification

### Flow de travail

J'utilise une fonctionnalité qui permet de travailler sur des changements avant de les mettre officiellement en ligne. Vous verrez que lorsque vous cliquer sur "Save" sur une page que vous avez modifié, cette modification est envoyée dans le champ "Draft" (Brouillon). Une fois satisfait, si vous voulez que quelqu'un d'autre l'approuve, vous pouvez le déplacer dans "Waiting for Review" (Révision). Une fois prêt, vous pouvez le déplacer dans "Waiting to go live". **Vous devez absolument cliquer sur "Publish Now" pour chaque élément que vous voulez publier.**