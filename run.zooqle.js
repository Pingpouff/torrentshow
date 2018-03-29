var zooqle = require("./zooqle")();
var fs = require("fs");

var downloadOnFreebox = function(data) {
  zooqle.downloadTorrentFile(data[0]).on("response", function(response) {
    // extract filename
    var filename = zooqle.extractFileNameFromTorrent(
      response.headers["content-disposition"]
    );
    var filePath = `Z:/Download/TODO/${filename.replace(/ /g, "-")}`;
    response.pipe(fs.createWriteStream(filePath));
  });
};

var logData = function(data) {
  console.log(JSON.stringify(data, null, 2));
};

var searchAndDownloadOnFreebox = function(search) {
  return zooqle.search(`${search} 720p ettv`).then(downloadOnFreebox);
};

// run
searchAndDownloadOnFreebox("dark");
