// simple node.js server
// Customizable random fiction generator.

var Http = require('http');
var IpfsApi = require('ipfs-api');
var Async = require('async');
var Fs = require('fs');

var ipfsDaemon = IpfsApi({ host: 'localhost' });
var serverPort = 2271;

// example
// localhost:2271?grammar=Qm279h2v093vh09cefc098g9cx0t

Async.parallel(
  // Named parallel calls:
  {
    page: function(callback) {
      Fs.readFile('generatorUi.html', callback);
    },
    defaultGrammar: function(callback) {
      Fs.readFile('defaultGrammar.txt', callback);
    }
  },

  // Completion callback:
  function(error, resultObj) {
    if (error) return console.log(error);

    console.log('typeof .page is ' + typeof resultObj.page + ' and it == null? ' + (resultObj.page == null));
    console.log('typeof .resultObj is ' + typeof resultObj.defaultGrammar + ' and it == null? ' + (resultObj.defaultGrammar == null));

    initServer(resultObj.page, resultObj.defaultGrammar);
  }
);

var initServer = function (page, defaultGrammar) {
  var server = Http.createServer(function (request, response) {
    var grammar = defaultGrammar;

    // If the client is asking for a specific grammar's hash.
    if (request.query && request.query.grammar) {
      ipfsDaemon.cat(request.query.grammar, function(error, result) {
        if(error || !result) return console.error(error);

        // If it comes back as a stream
        if(result.readable) {
          // TODO
          console.log('grammar is a stream');
        } else {
          grammar = result;
        }
      });
    }

    // Send the HTTP header 
    // HTTP Status: 200 : OK
    // Content Type: text/plain
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(htmlWithGrammar(page, grammar));
  });

  server.listen(serverPort);

  // Console will print the message
  console.log('Server running at http://127.0.0.1:' + serverPort + '/');
};

var htmlWithGrammar = function(html, grammar) {
  var grammarPlaceholder = 'GRAMMAR_PLACEHOLDER';
  return html.replace(grammarPlaceholder, grammar);
};
