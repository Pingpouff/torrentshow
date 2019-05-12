const cheerio = require("cheerio");
const horriblesubs = require("got").extend({
  baseUrl: "https://horriblesubs.info"
});

class Horriblesubs {
  async getLastest(value) {
    const episodes = await this.search(value);
    return episodes[0];
  }

  async search(value) {
    var data = [];
    try {
      const response = await horriblesubs(
        `api.php?method=search&value=${value}`
      );
      // console.log(response.body);
      const episodesPromise = await this.extractData(response);
      data = data.concat(episodesPromise);
    } catch (error) {
      console.log(error);
      // console.log(error.response.body);
      //=> 'Internal server error ...'
    }
    return Promise.all(data);
  }

  async extractData(response) {
    var $ = cheerio.load(response.body, {
      xmlMode: true
    });
    var data = [];
    $("a").each(function(index) {
      const line = {
        title: $(this).text(),
        url: $(this).attr("href")
      };
      data[index] = line;
    });
    // GET season ids
    const responses = await data
      .map(info => info.url)
      .map(this.getSeasonIdFromUrl);
    const seasonIds = new Set();
    for (const promise of responses) {
      seasonIds.add(await promise);
    }
    // GET episodes
    var episodes = new Array();
    for (const season of seasonIds) {
      let shows = await this.getShows(season);
      episodes = episodes.concat(shows);
    }
    return episodes;
  }

  async getShows(seasonId) {
    return this.searchShows(seasonId);
  }

  async searchShows(seasonId, searchEpisodeNb) {
    const episodes = [];
    try {
      let url = `api.php?method=getshows&type=show&mode=filter&showid=${seasonId}`;
      if (searchEpisodeNb) {
        url = url + `&value=${searchEpisodeNb}`;
      }
      const response = await horriblesubs(url);
      var $ = cheerio.load(response.body, {
        xmlMode: true
      });
      $(".rls-info-container").each(function(index) {
        const infoXml = $(this).children("a");
        const date = infoXml.find(".rls-date").text();
        const number = infoXml.children("strong").text();
        // extract name from html
        const name = /span>\s(.*)\s<strong/.exec(infoXml.html())[1];
        const magnet = $(this)
          .children(".rls-links-container")
          .children(".link-1080p")
          .children(".hs-magnet-link")
          .find("a")
          .attr("href");
        episodes[index] = {
          date,
          number,
          name,
          magnet
        };
      });
    } catch (error) {
      console.log(error);
      // console.log(error.response.body);
      //=> 'Internal server error ...'
    }
    return episodes;
  }

  async getSeasonIdFromUrl(url) {
    try {
      const response = await horriblesubs(url);
      // extract id from html
      var re = /(?:hs_showid\s\=\s)(\d*)\;/;
      const id = re.exec(response.body)[1];
      return id;
    } catch (error) {
      console.log(error.response.body);
      //=> 'Internal server error ...'
    }
  }
}

module.exports = Horriblesubs;
