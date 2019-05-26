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
