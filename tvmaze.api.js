// var got = require("got");
var promise = require("bluebird");
var request = promise.promisify(require("request"));

var provider = function (options) {
  var domain = "http://api.tvmaze.com";
  var singlesearch = "singlesearch";
  var shows = "shows";

  if (options) {
    domain = options.domain || domain;
  }

  function search(searchText) {
    return request({
      url: `${domain}/singlesearch/shows/?q=${searchText}`,
      json: true
    });
  }

  function nextepisode(show) {
    return request({
      url: `${show._links.nextepisode.href}`,
      json: true
    });
  }

  function prevepisode(show) {
    return request({
      url: `${show._links.previousepisode.href}`,
      json: true
    }).then(show => show.body)
      .then(nextShow => {
        nextShow.showName = show.name;
        return nextShow;
      });
  }

  return {
    search,
    nextepisode,
    prevepisode
  };
};

module.exports = function (options) {
  return new provider(options);
};
