Choses à respecter lors de la conception d’une nouvelle page

### Le concept de mot-clé

Votre page est organisée autour d'un mot-clé que vous choisissez. Vous devez vous mettre dans la peau des gens qui vont faire une recherche sur Google pour votre article. Quel mot-clé utiliseront-ils?

#### Le titre SEO

Votre titre doit contenir votre mot-clé, sous sa forme recherchée. Pour les titres SEO, nous ajoutons automatiquement **| Clinique Tandem** après votre titre, comme ça vous sortirez automatiquement si la personne vous spécifie dans sa recherche.

#### La description SEO

Votre description doit contenir votre mot-clé, ainsi que quelques variations que vous pouvez générer sur le site [LSI](http://lsigraph.com/). Vous n'avez qu'à entrer votre mot-clé, et choisir parmi les options proposées. Vous devez faire des phrases complètes contenant ces mots.

#### Les liens

Votre lien doit absolument contenir votre mot-clé, et être lisible. N'utilisez aucun caractère spécial dans le lien.

### Hiérarchie des titres sur la page

#### H1 (titre)

Chaque page devrait avoir une seule balise <h1>. La balise doit contenir le mot clé visé sur la page (il faut toujours penser à ce que l’usager rechercherait dans Google. Par exemple, un usager qui est concerné par sa posture pourrait écrire « comment avoir une bonne posture »). Dans le cas de nos articles, le titre que vous donnez est automatiquement un H1. Soyez certain de bien le choisir :) En markdown, il est représenté par un \#.

#### H2

Chaque page devrait avoir au moins une balise <h2>. 
La balise <H2> agit comme un sous-titre et aura pour objectif de renforcer le h1 mentionné ci-dessus, tout en sous-divisant le contenu. En markdown, il est représenté par un \#\#.

#### H3

Ajouter si vous sentez le besoin de diviser votre contenu de façon plus granulaire. En markdown, il est représenté par un \#\#\#.
N.B. On modifie souvent les H3 pour inclure des mots clés pour lesquels notre site web sort déjà dans les moteurs de recherche. C’est un travail de référencement continue qui permet au site web d’augmenter son trafic.

### Les liens internes et externes

Il est important de renvoyer vos pages à :

1.	D’autres pages de votre site qui couvrent le même sujet de façon générale
2.	D’autres sources externes qui sont perçues comme « autorités » dans votre industrie (  i.e. www.ordredespodiatres.qc.ca/)

Vous trouverez les ratios à respecter ci-dessous quant à la structure des liens

#### Nombre de liens internes (renvoyant vers d’autres pages de votre site web) – Ratio 

1:250 mots pour les pages de moins de 1000 mots 
1:300 mots pour les pages avec 1000-2000 mots 
1:400 mots pour les pages avec 2000-3000 mots 
1:500 mots pour les pages avec 3000 mots et plus 

#### Nombre de liens externes (renvoyant vers des sources externes dans le but de renforcir votre contenu) – Ratio

1:500 mots pour un contenu inférieur ou égal à 1000 mots 
1:1000 mots pour 1000-3000 mots 
1:500 mots pour 3000 mots +

#### Comment faire un lien en Markdown ?

Vous devez utiliser la structure suivante : \[Hugo\]\(https://gohugo.io\). Dans l'outil Markdown de vos articles, vous pouvez tout simplement surligner le texte et utiliser l'outil de lien dans la haut de la boîte.

```hint|directive
Lorsque que vous faites un lien interne ou externe, assurez-vous que le texte du lien \[Texte du lien\]\(https://ceciestvotrelien.com\) soit cohérent avec la source vers laquelle vous renvoyée.
```

### Exemple appliqué

![référencement](docs/exemple-referencement.png)
 
1.	H1 | le mot clé est présent dans celui-ci
2.	Lien interne vers la page http://www.cryos.com/fasciite-plantaire-quels-sont-les-symptomes-et-les-traitements-disponibles/
3.	H2 pour sous-diviser le texte
4.	Lien externe vers https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4400011/


> L’utilisation de h3 aurait pu être pertinente dans le présent cas, mais n’était pas nécessaire. Dans votre cas, vous n'utiliserez jamais de H3
