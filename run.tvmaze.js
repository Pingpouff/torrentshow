var tvmaze = require("./tvmaze.api")();
var promise = require("bluebird");
var request = promise.promisify(require("request"));
var zooqle = require("./zooqle.api")();
var moment = require("moment");

var compute = function(show) {
  console.log(show.body._links.nextepisode);
};
const start = moment().subtract(1, "days");
const downloadIfAfter = function(episode) {
  const log = "Last " + episode.showName;
  if (tvmaze.episodeAiredAfter(episode, start)) {
    console.log(log + " aired not so long ago download.");
    return zooqle.searchAndDownloadOnFreebox(episode);
  } else {
    console.log(log + " is too old.");
  }
};

const download = function(name) {
  tvmaze
    .search(name)
    .then(show => show.body)
    .then(tvmaze.prevepisode)
    .then(downloadIfAfter);
};

[
  "homeland",
  "game of thrones",
  "silicon valley",
  "modern familly",
  "westworld"
].forEach(download);
// .then(console.log);

// request({
//   url: "https://zooqle.com/qss/suis",
//   headers: {
//     accept: "application/json, text/javascript, */*; q=0.01",
//     referer: "https://zooqle.com"
//   }
// }).then(console.log);

// request({
//   url: "https://zooqle.com/tv/modern-family-13h/",
//   headers: {
//     accept: "application/json, text/javascript, */*; q=0.01",
//     referer: "https://zooqle.com"
//   }
// }).then(console.log);
