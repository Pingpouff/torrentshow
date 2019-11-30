// var got = require("got");
var promise = require("bluebird");
var request = promise.promisify(require("request"));
var moment = require("moment");

var provider = function(options) {
  var domain = "http://api.tvmaze.com";
  var singlesearch = "singlesearch";
  var shows = "shows";

  if (options) {
    domain = options.domain || domain;
  }

  function search(searchText) {
    console.log("searching for: " + searchText);
    return request({
      url: `${domain}/singlesearch/shows/?q=${searchText}`,
      json: true
    }).then(show => show.body);
  }

  function nextepisode(show) {
    return request({
      url: `${show._links.nextepisode.href}`,
      json: true
    })
      .then(show => show.body)
      .then(nextShow => {
        nextShow.showName = name; // TODO should be kept as show object structure
        return nextShow;
      });
  }

  function prevepisode(show) {
    return request({
      url: `${show._links.previousepisode.href}`,
      json: true
    })
      .then(show => show.body)
      .then(nextShow => {
        nextShow.showName = show.name;
        return nextShow;
      });
  }
  function episodeAiredAfter(start) {
    return function(episode) {
      var airMoment = moment(episode.airstamp);
      return airMoment.isAfter(start);
    };
  }

  function episodeAiredDaysAgo(days) {
    const start = moment()
      .subtract(days, "days")
      .startOf("day");
    return episode => episodeAiredAfter(episode, start);
  }

  return {
    search,
    nextepisode,
    prevepisode,
    episodeAiredAfter
  };
};

module.exports = function(options) {
  return new provider(options);
};
