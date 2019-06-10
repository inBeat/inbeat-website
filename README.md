# Website for inBeat project

## Setting up

1) Simply git clone this repo

```
cd this/is/my/parent/repo
git clone https://github.com/felixdb/inbeat-website
cd inbeat-website
```

2) Install all dependencies

```
npm install
```

## Usage

### Building assets

You can watch changes and build assets on the fly with:

```
gulp watch
```

It will build your css, js and images of different sizes.

### Blog

There are some shortcodes built for the blog.

#### Capture Widget

Please don't forget to add the popup to the page. The option is in the admin, on the article's page and is named "Include popup style 1". For now, please keep the popupid as in the example, e.g "bite-style-1". 

**You can also control the text of the popup itself in the Autres > Popup in the admin.**

```
{{% capturewidget smalltitle="FREE DOWNLOADABLE LIST" title="Want More Influencer Marketing Inspiration" linktext="Download All Influencers Now →" popupid="bite-style-1" %}}
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat nostrum dolorem sit adipisci quae quasi aliquam maiores id obcaecati sapiente assumenda, alias dolore earum, dignissimos eligendi voluptatem quaerat sed et.
{{% /capturewidget %}}
```

#### Protip

```
{{% protip %}}
This will output a pale blue box with a Protip title.
{{% /protip %}}
```

#### Quote

```
{{% quote %}}
This will output a cool and styled text in blockquote
{{% /quote %}}
```

#### Tweet (coming straight from Hugo.io)

This will output a styled tweet, to enhance your article.

```
{{< tweet 1111327309640990721 >}}
```

#### Responsive Image

This will make usage of automatically size images to output a responsive srcset in an <img> tag.

```
{{< responsiveimg src="test-2-inbeat.jpg" alt="Test" >}}
```

#### Sidenote

```
{{< sidenote >}}
This will output a smaller note in the next, a bit like quick note.
{{< /sidenote >}}
```
