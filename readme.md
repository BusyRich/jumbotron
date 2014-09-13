# Jumbotron
Simple to use presentaiton software, built around a patched and extended version of [reveal.js](https://github.com/hakimel/reveal.js), designed with developers and workshops in mind.

## Install

    npm install -g jumbotron

This will add the `jumbotron` command to your system.

## Usage

Jumbotron's basic usage is as simple as adding some handlebars files to a directory, with a JSON configuration file. The `.hbs`

<pre>
my-root
  - deckOne.hbs
  - deckTwo.hbs
  - jumbotron.json
</pre>

### jumbotron.json

Bare minimun configuration looks like so.

    {
      "presentations": [
        {
          "title": "Deck One",
        },
        {
          "title": "Deck Two",
        }
      ]
    }

Each presentation can also provide `order`, `file`, and `url`. These control the order they should be sorted by, the filename of the presentation file, and an override for the server route used to load the presentation, respectively.

### Running the Server


To run these presentations, just run the `jumbotron` command from your presentations directory.

    cd my-root
    jumbotron
    ...
    info:    Jumbotron server listening on port 9209
    info:    Version: 0.1.0

### Accessing Your Presentations

This will make your presentations available via the server, with the URLs being implied based on the titles provided in the configuration, if no URL was given in the configuration. The URLs will be the title, converted to alpha-numeric only, lowercased, with dashes replacing spaces. So in our example going to `http://localhost:9209/deck-one` will open the first presentation.

The filenames of the presentations are also implied based on the titles. Filenames, if not provided in the configuration, will be an alpha-numeric, camal-case version of the title.
