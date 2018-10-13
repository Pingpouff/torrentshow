var promise = require("bluebird");
var request = promise.promisify(require("request"));
var cheerio = (cheerio = require("cheerio"));
var fs = require("fs");

var provider = function(options) {
  var domain = "https://getcomics.info";

  if (options) {
    domain = options.domain || domain;
  }

  function search(searchText, callback) {
    var url = domain + "/?s=" + searchText;
    console.log("searching [" + searchText + "] on comicsdl.");
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
        // console.log($.html());

        var data = [];
        $(".post-info").each(function(index) {
          data[index] = {
            title: $(this)
              .children(".post-title")
              .text(),
            url: $(this)
              .children(".post-title")
              .children("a")
              .attr("href")
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

  function download(comicInfo, callback) {
    return request({
      uri: comicInfo.url,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
      }
    })
      .then(function(response) {
        var $ = cheerio.load(response.body, {
          xmlMode: true
        });
        const dlUrl = $(
          $(".aio-pulse")
            .attr("title", "Download Now")
            .html()
        ).attr("href");
        return promise.resolve(dlUrl).asCallback(callback);
      })
      .then(function(url) {
        console.log("Downloading from " + url);
        return request({
          uri: url,
          resolveWithFullResponse: true,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
          }
        }).then(request => request.on("response", downloadFile));
      })
      .catch(function(error) {
        return promise.reject(error).asCallback(callback);
      });
    // .then(function(response) {
    //   var $ = cheerio.load(response.body, {
    //     xmlMode: true
    //   });
    //   // console.log($).html());
    //   const dlUrl = $(".aio-red").attr("href")

    //   return promise.resolve(dlUrl).asCallback(callback);
    // })
    // .catch(function(error) {
    //   return promise.reject(error).asCallback(callback);
    // });
  }

  function downloadFileFromUri(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
      request(uri)
        .pipe(fs.createWriteStream(filename))
        .on("close", callback);
    });
  }

  function downloadFileFromUriOld(response) {
    // console.log(response);
    // extract filename
    // var filename = extractFileNameFromTorrent(
    //   response.headers["content-disposition"]
    // );
    // console.log(filename);
    // var filePath = `./dl/${filename.replace(/ /g, "-")}`;
    // console.log(`downloading ${filename} on ${filePath}`);

    const fileName = "./dl/" + comicInfo.title + ".cbr";
    console.log("Downloaded " + fileName + response.size());
    return response.pipe(fs.createWriteStream(fileName.toString()));

    // const buffer = Buffer.from(response+"", "utf8")
    // fs.writeFileSync("/home/david/Dev/torrentshow/dl/test.cbr", response.body.toString());
  }

  function downloadFile(response) {
    console.log("test");
    // extract filename
    var filename = extractFileNameFromTorrent(
      response.headers["content-disposition"]
    );
    var filePath = `./dl/${filename.replace(/ /g, "-")}`;
    console.log(`downloading ${filename} on ${filePath}`);
    response.pipe(fs.createWriteStream(filePath));
  }

  return {
    search,
    download,
    downloadFile
  };
};

module.exports = function(options) {
  return new provider(options);
};
