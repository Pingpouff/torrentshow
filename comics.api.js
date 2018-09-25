var promise = require("bluebird");
var request = promise.promisify(require("request"));
var cheerio = (cheerio = require("cheerio"));

var provider = function(options) {
  var domain = "https://getcomics.info";

  if (options) {
    domain = options.domain || domain;
  }

  function search(searchText, callback) {
    var url = domain + "/?s=" + searchText;
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
        // console.log($).html());

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

  function download(comicInfo) {
    console.log(comicInfo);
    return request.get({
      uri: comicInfo.url,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
      }
    })
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

  return {
    search,
    download
  };
};

module.exports = function(options) {
  return new provider(options);
};
