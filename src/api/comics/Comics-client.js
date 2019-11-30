const cheerio = require("cheerio");
const got = require("got");
const comicsInfo = got.extend({
  baseUrl: "https://getcomics.info"
});

class Comics {
  async queryComics(name) {
    try {
      const response = await comicsInfo(`/?s=${name}`);
      //   console.log(response.body);
      var data = this.extractDataFromQuery(response);
      console.log(data);
      console.log(data);
    } catch (error) {
      console.log(error.response.body);
      //=> 'Internal server error ...'
    }
  }

  extractDataFromQuery(response) {
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
    return data;
  }

  async getDownloadLinkFromPage(url) {
    const response = await got(url);
    return this.extractDownloadLinkFromPage(response);
  }

  extractDownloadLinkFromPage(response) {
    var $ = cheerio.load(response.body, {
      xmlMode: true
    });
    // console.log($).html());
    const dlUrl = $(".aio-red").attr("href");
    console.log(dlUrl);
    return dlUrl;
  }
}

module.exports = Comics;
