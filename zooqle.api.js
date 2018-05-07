var promise = require("bluebird");
var request = promise.promisify(require("request"));
var cheerio = (cheerio = require("cheerio"));
var fs = require("fs");

var provider = function(options) {
  var domain = "https://zooqle.com";

  if (options) {
    domain = options.domain || domain;
  }

  function search(searchText, callback) {
    var url = domain + "/search?q=" + searchText + "&fmt=rss";
    console.log("searching [" + searchText + "] on zooqle.");
    return request({
      uri: url,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
      }
    })
      .then(function(response) {
        var $ = cheerio.load(response.body, {
          xmlMode: true
        });

        var data = [];

        $("channel item").each(function(index) {
          var sizeMatch = $(this)
            .children("description")
            .text()
            .match(/([0-9\.]+\s[G|M][B])/);
          var size;
          if (sizeMatch) {
            size = sizeMatch[0];
          }
          data[index] = {
            title: $(this)
              .children("title")
              .text(),
            link: $(this)
              .children("link")
              .text(),
            seeds: $(this)
              .children("torrent\\:seeds")
              .text(),
            peers: $(this)
              .children("torrent\\:peers")
              .text(),
            size: size,
            date: $(this)
              .children("pubDate")
              .text(),
            magnet: $(this)
              .children("torrent\\:magnetURI")
              .text(),
            verified: $(this)
              .children("torrent\\:verified")
              .text(),
            torrent: $(this)
              .children("enclosure")
              .attr("url")
          };
        });

        return promise.resolve(data).asCallback(callback);
      })
      .catch(function(error) {
        return promise.reject(error).asCallback(callback);
      });
  }

  function extractFileNameFromTorrent(filenameToParse) {
    // RegExp to extract the filename from Content-Disposition
    var regexp = /filename[^;\n=]*=((['"]).*?\2|[^;\n]*)/gi;
    return decodeURIComponent(
      /UTF-8\'\'?(.*)/gi.exec(regexp.exec(filenameToParse)[1])[1]
    );
  }

  function downloadTorrentFile(torrentInfo) {
    return request.get({
      uri: torrentInfo.torrent,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
      }
    });
  }

  function downloadOnFreebox(response) {
    // extract filename
    var filename = extractFileNameFromTorrent(
      response.headers["content-disposition"]
    );
    var filePath = `Z:/Download/TODO/${filename.replace(/ /g, "-")}`;
    // var filePath = `smb://freebox/disque%20dur/Download/TODO/${filename.replace(/ /g, "-")}`;
    console.log(`downloading ${filename} on ${filePath}`);
    response.pipe(fs.createWriteStream(filePath));
  }

  function searchAndDownloadOnFreebox(name) {
    if (name.season && name.number && name.showName) {
      console.log("searchText is episode");
      // format show name for request
      var season = ("0" + name.season).slice(-2);
      var number = ("0" + name.number).slice(-2);
      var name = `${name.showName} s${season}e${number}`;
    }
    return search(`${name} 720p ettv`)
      .then(data => data[0]) // select first result
      .then(downloadTorrentFile)
      .then(request => request.on("response", downloadOnFreebox));
  }

  return {
    search,
    downloadTorrentFile,
    extractFileNameFromTorrent,
    downloadOnFreebox,
    searchAndDownloadOnFreebox
  };
};

module.exports = function(options) {
  return new provider(options);
};
