// scraping spacebattles so i can read it offline

var Cheerio = require('cheerio');
var request = require('request');

function processHtml (error, response, html) {
  if (error) { return console.error(error); }

  var parsedHtml = Cheerio.load(html);
  output = parsedHtml;
}

var uri = 'https://forums.spacebattles.com/threads/prt-department-sixty-four-thread-iii-worm-quest.310039/';
request(uri, processHtml);

var output = undefined;



