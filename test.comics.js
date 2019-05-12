// var comics = require("./comics.api")();

// var cheerio = (cheerio = require("cheerio"));
// var promise = require("bluebird");
// var request = promise.promisify(require("request"));

const url = "https://getcomics.info/other-comics/annihilator-1-6/";
// request({
//     uri: url,
//     resolveWithFullResponse: true,
//     headers: {
//       "Origin":"https://getcomics.info",
//       "User-Agent":
//         "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
//     }
//   // }).then(request => request.on("response", downloadFile));
// }).then(comics.downloadFile);

var client = new (require("./Comics-client"));
// client.queryComics("saga");
client.getDownloadLinkFromPage(url);