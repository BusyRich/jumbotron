# Jumbotron
Simple to use presentaiton software, built around a patched and extended version of [reveal.js](https://github.com/hakimel/reveal.js), designed with developers and workshops in mind.

Jumbotron provides a CLI (command line interface), built with Node.js, that you use to run your presentations, or helps you bundle your presentations for sharing and/or deployment. Some of the awesome features include:

* Support for all Reveal.js Syntax
* Syntax Highlighting by Default (using [HighlightJS](https://highlightjs.org/))
* Client-side extensions for better code presentaiton
* Master/follower presentation sharing (multiplex)
* PDF exporting
* Utilizes [handlebars](http://handlebarsjs.com/)
* easy bundling for external deploys

## Install

```
$ npm install -g jumbotron
```

This will add the `jumbotron` command to your system.

## Quick Start

### 1. Create a Deck

First build some Reveal.js slides, but you only need to put the `section` tags in the files. Jumbotron will wrap your sections in the right markup.

Make sure you use the `.hbs` file extension for your files.

<pre>
my-jumbo-project
  - deckOne.hbs
  - deckTwo.hbs
</pre>

### 2. Add a jumbotron.json

This configuration file is used to identify and load your presentations. The filenames and urls for each presentation can be inferred from the title you set, so sometimes thats all you need.

```javascript
{
  "presentations": [
    {"title":"Deck One"},
    {"title":"Deck Two"}
  ]
}
```

You can find out more about the configuration file below.

### View Your Presentations

Start the Jumbotron server

```
$ cd my-jumbo-project
$ jumbotron
...
info:    Jumbotron server listening on port 9209
info:    Version: 0.1.0
```

Your presentations will be available at _localhost:9209_ by default. The URL for each presentation will be an alphanumeric version of the title, with "-"s replacing the spaces. With the configuration above, the presentations would accessible via _localhost:9209/deck-one_ and _localhost:9209/deck-two_.

## Configuration

```javascript
{
  // css file to load for every presentation
  // maps to "/public/css/myCSS.css" in your project directory
  "css": "myCSS"

  // the theme to use with HighlightJS
  // maps to "/public/css/github.css"
  // https://github.com/isagalaev/highlight.js/tree/master/src/styles
  "hljsTheme": "github"

  presentations: [
    {
      "title": "My Slide Deck",

      // filename of the presentation file
      // maps from the root of the project directory
      "file": "mySlideDeck",

      // the url to associate with the presentation
      // no leading slash required
      "url": "my-slide-deck",

      // used to order the presentations array
      // no specific use yet
      "order": 2
    }
  ]
}
```

## Displaying Code Blocks

Jumbotron extends the basic functionality of Reveal.js for code blocks. Each block gets its own footer that displays related information, such as the number of lines, language, and even a filename if provided.

Jumbotron also adds a few shortcuts and extras to help presenting code easy.

### Code Language

Use the `jt-code-lang` attribute on the `pre` to set the lanaguage for the code in the block. This sets the language for HighlightJS and what is displayed in the block footer.

```html
<pre jt-code-lang="javascript"><code>var thing = 'thing';</code></pre>
```

To disable sytax highlighting and remove the language from the footer, simply omit the `jt-code-lang` attribute.

### Fragmented Blocks

Jumbotron allows you to break up your code blocks so you can display only some code at a time. It does this by aliasing some Reveal.js functionality. More specifically it makes it easier to use fragments for code blocks.

You split up your code using multiple `code` tags and adding the `jt-code-fragment` attribute to the parent `pre` tag. Don't forget the `jt-code-lang` tag.

```html
<pre jt-code-lang="javascript" jt-code-fragment><code>var thing = 'thing';</code><code>

var funct = function() {
    return 'function called!';
};</code></pre>
```

On each `code` tag, you can set a `jt-frag` attribute that denotes the order in which the code will be displayed. This is useful for step-by-step instructions, as well as showing code in ways that make more sense than just thrown on a slide. The order does not have to be linear either. It is not required, but considered best practice to set `ft-frag` on an "all or none" basis.

The following code example will show the variable, then the function, then what is inside the function.

```html
<pre jt-code-lang="javascript" jt-code-fragment><code jt-frag="0">var thing = 'thing';</code><code jt-frag="1">

var funct = function() {</code><code jt-frag="2">
    return 'function called!';</code><code jt-frag="1">
};</code></pre>
```

Jumbotron also allows you to highlight the currently presented code by "blurring" out the surrounding code. This makes it much easier to follow more complex code blocks. Simply replace the `jt-code-fragment` attribute with `jt-code-blur`.

```html
<pre jt-code-lang="javascript" jt-code-blur><code jt-frag="0">var thing = 'thing';</code><code jt-frag="1">

var funct = function() {</code><code jt-frag="2">
    return 'function called!';</code><code jt-frag="1">
};</code></pre>
```

Try it all out for yourself to see how awesome it is.

### Code Block Footers

Besides the language, you can also provide an arbitrary filename to display in the code block footer. Adding the `jt-code-file` attribute to the `pre` tag will set the filename to put in the footer. This attribute has no other significance beyond displaying text in the footer.

```html
<pre jt-code-lang="javascript" jt-code-file="variable.js"><code>var thing = 'thing';</code></pre>
```

If you would like to hide the code footer altogether, you can use the `jt-no-footer` attribute on the `pre` tag. Keep in mind this will not disable syntax highlighting.

```html
<pre jt-code-lang="javascript" jt-no-footer><code>var thing = 'thing';</code></pre>
```

You can also set some CSS for `.reveal pre .code-footer` to hide the footers globally, or to give it your own look if that is your sort of thing.

## Using Master/Follower

Jumbotron allows you to share your presentations with others, in real-time, but control the navigation so your viewers can follow along as you present. This feature does not require any configuration or file changes, just some query parameters.

First you need to do is initalize a presentation as the master. You do this by adding `master` to the query string of the presentation URL, IE _localhost:9209/deck-two?master_. This will make this presentation instance the controller, and create a unique token which is used by the follower presentation instances. You can access/view the token by inspecting the Reveal.js initialization on the page (developer tools, etc.).

Inspecting the JavaScript of the page can be silly, so you can also add an `id` query parameter that will be used as the token, to make it easier to keep track of the token. Often, the full master URL will be something like _localhost:9209/deck-two?master&id=12345_.

For any presentation instances you want to follow the master, you simply add the `follow` and `id` query parameters, where the `id` matches the master's token. Here is an example follower URL _localhost:9209/deck-two?follow&id=12345_.

There is no limit to the number of followers a master can have. Just make sure all the ids match up.

## PDF Export

_Note: You must be using [Google Chrome](https://www.google.com/chrome/browser/) to use the PDF export._

To get your presentations as PDFs, simply add the `print-pdf` query parameter (_localhost:9209/deck-two?print-pdf_) to the URL and use the **print to PDF** print option.

_Note: The styles of the slides will change a little, into a more "printable" style._

If you are having trouble, you can follow the [instructions](https://github.com/hakimel/reveal.js#pdf-export) in the Reveal.js documentation. Jumbotron does not change any of it's functionality, so the instructions are applicable here.

## Deploying/Bundling

The Jumbotron CLI allows you bundle your presentations in two ways. You can bundle them with a Jumbotron server for cloud deployment, or bundle them into portable HTML and JS files. You use the `bundle` command in both cases.

### Jumbotron Server Deployment

```
jumbotron bundle
```

This will bundle the presentations, along with a jumbotron server, into a _jumbotron-bundle_ directory wherever the command is run. The advantage of bundling with a Jumbotron server is maintaining the master/follower features, which can come in handy.

This bundle is also deployment ready (includes a package.json and server script), meaning you can take this bundle and deploy it via any Node.js PaaS.

### Portable Bundle

```
jumbotron bundle -p
```

The `-p` (`--portable`) parameter will bundle your presentations into HTML, CSS, and JavaScript. This eliminates the need for a server or deployment, simply open one of the HTML files and you can view your presentation. However, while much easier to share, you loose any extra features beyond presentation displaying (master/follower, pdf exports, etc.).

Just like the normal bundlle, all the files will be saved to a _jumbotron-bundle_ directory.

## Documentation TODO

* CLI Docs
* Context available in handlebars files
* In-Code Usage
* Running the Tests
