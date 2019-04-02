# Starter setup for Hugo

## Setting up this theme

1) Simply git clone this repo

```
cd this/is/my/parent/repo
git clone https://linkofthisrepo.com projectname
cd projectname
```

2) Install all dependencies

```
npm install
```

3) Change the "themename" for your theme's name in config.toml, gulpfile.js, .gitignore, themes/themename, themes/themename/theme.toml, static/admin/config.yml

4) Generate your favicon and place that in the theme/themename/layouts/partials/head/metadata-favicons.html and in static/admin/index.html. The image files should go directly into static folder.

## Using this theme

1) All assets are built with Prepros. You could definitely integrate the assets building in the gulp pipeline. I find it easier with Prepros :) All assets are built from themes/themename/assets to themes/themename/static.
2) All images should be put in the themes/themename/source-images folder. The gulp pipeline will build different folder for our images (with different sizes) in themes/themename/static. I recommend keeping all images directly the sources-images folder, so that they will all be available in the Netlify CMS media center. 
3) You can find a lot of basic information to fill in the data/settings.yml. Please make sure that your themes/themename/layout/partials/head/metadata-schemaorg.html outputs correctly :)
4) Setup in the content folder is made thinking about Netlify CMS integration. All my singles pages that are directly on the root (/a-propos, /contact) are in singles. The "identifiant" is always the same as the name of the file. This is to help saving the file with Netlify CMS.
5) You can create redirects for your Netlify Hosting using the static/\_redirects file
6) Once hitting the production (HURRAY), you can use the "gulp build" as the build command. It will clean your images, rebuild them and build the hugo site with a hugo --cleanDestinationDir.
7) At the moment, don't forget to add the IS_PROD variable with a value of true to your hosting environment, so that you Tag Manager container is included. I recommend you to also add the HUGO_VERSION to your environment, to control which version of Hugo will be used.

## Needs to be done

- Basic Netlify CMS integration, right now there's only the files :) (in static/admin)
- Basic documentation for the Netlify CMS usage with this theme (in static/docs)
- Creating this theme for bilingual sites
- Create a submodule for the languages translation and integrate it to Netlify CMS