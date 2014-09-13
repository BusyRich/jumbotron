// Jumbotron Reveal.js extentions
Reveal.addEventListener('ready', function(event) {

  // update the URL hash so sharing presentation links is easy
  Reveal.addEventListener('slidechanged', function( event ) {
    window.location.hash = '/' + event.indexh + '/' + event.indexv;
  });

  // a few utility functions for code block setup
  var util = {
    lineRegex: /\n+/g,
    lineCount: function(str) {
      util.lineRegex.lastIndex = 0; // resets the regex "cursor" position
      return str
        .replace('\r', '') // remove any \r characters
        .split(util.lineRegex).length; // count the number of newline gaps
    },

    // grammatically correct language names
    languages: {
      'javascript': 'JavaScript',
      'css': 'CSS',
      'html': 'HTML',
      'ruby': 'Ruby',
      'python': 'Pyhton',
      'bash': 'Bash'
    }
  };

  // highlight and label code blocks
  $('pre').each(function() {
    var $pre = $(this),
        fragmented = (typeof $pre.attr('jt-code-fragment') === 'string'),
        blurring = (typeof $pre.attr('jt-code-blur') === 'string'),
        language = $pre.attr('jt-code-lang') || 'no-highlight',
        filename =  $pre.attr('jt-code-file');

    // blurring requires fragmented code blocks
    if(blurring) {
      fragmented = true;
    }

    $pre.find('code').each(function() {
      var $code = $(this);

      $code.addClass('hljs')
        .addClass(language)
        .attr('data-trim', '');

      // translate jt-frag attributes to data-fragment-index attributes
      if(typeof $code.attr('jt-frag') === 'string') {
        $code.attr('data-fragment-index', $code.attr('jt-frag'));
        $code.removeAttr('jt-frag');
      }

      if(language !== 'no-highlight') {
        $code.html(hljs.highlight(language, $code.text()).value);
      }

      if(fragmented) {
        $code.addClass('fragment');
      }
    });

    // add the code block footer
    var footerText = util.lineCount($pre.text()) + ' lines';

    if(language !== 'no-highlight') {
      footerText += ' of ' + util.languages[language];
    }

    if(typeof filename === 'string' && filename.length > 0) {
      footerText = filename + ' - ' + footerText;
    }

    if(typeof $pre.attr('jt-no-footer') !== 'string') {
      $pre.append($('<div/>').addClass('code-footer').text(footerText));
    }

    if(blurring) {
      $pre.append($('<code/>').attr('jt-clear-blur','').addClass('fragment'));
    }
  });

  // set up fragment highlighting
  var toggleFragment = function($frag) {
    if(typeof $frag.parent().attr('jt-code-blur') !== 'string') {
      return;
    }

    if(typeof $frag.attr('jt-clear-blur') === 'string') {
      return $frag.parent().find('code').removeClass('blurred');
    }

    if($frag.is('code') && $frag.hasClass('fragment')) {
      $frag.parent()
        .find('code').addClass('blurred')
        .filter('.current-fragment').removeClass('blurred');
    }
  };

  Reveal.addEventListener('fragmentshown', function(evt) {
    toggleFragment($(evt.fragment));
  });

  Reveal.addEventListener('fragmenthidden', function(evt) {
    toggleFragment($(evt.fragment));
  });
});
