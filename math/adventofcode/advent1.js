// advent of code day 1

var IpfsApi = require('ipfs-api');

var ipfsDaemon = IpfsApi({ host: 'localhost' });

var parensHash = 'QmP8sdhrEPsX2CaoYNVT53Li7BTyEtUDfy6vAzu17J7oss';

ipfsDaemon.cat(parensHash, function(error, result) {
  if(error || !result) return console.error(error);

  console.log('middle of ipfs cat');

  streamToString(result, countBrackets);

  // If it comes back as a stream
  // if(result.readable) {
  //   streamToString(result, countBrackets); 
  // } else {
  //   console.log(countBrackets(result, '(', ')'));
  // }
});

// Decided to collect this so i can have fun with functional code later.
var streamToString = function(stream, nextFunction) {
  var string = '';

  console.log('middle of streamToString');

  stream.on('readable', function(buffer) {
    console.log('stream on readable i guess');

    // TODO
    if (! buffer) { return; }

    console.log('in readable, seems to be readable');

    string += buffer.read().toString();
  });

  stream.on('end', function() {
    console.log('stream on end i guess');

    console.log(nextFunction(string, '(', ')'));
  });
};

var sum = function(array) {
  return array.reduce(function(a,b) { return a + b; });
};

var countBrackets = function(string, leftBracket, rightBracket) {
  console.log('top of countBrackets');

  if (! leftBracket) {
    // Default to parentheses
    leftBracket = '(';
    rightBracket = ')';
  }

  return sum(
    s.split('').map(function(c) {
      return (c == leftBracket ? 1 :
        (c == rightBracket ? -1 :
          0)
      );
    })
  );
}; // Speaking of counting brackets, nice and confusing huh?
