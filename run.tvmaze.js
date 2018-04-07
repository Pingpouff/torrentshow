var tvmaze = require("./tvmaze.api")();
var promise = require("bluebird");
var request = promise.promisify(require("request"));

var compute = function(show) {
  console.log(show.body._links.nextepisode);
};
tvmaze
  .search("suits")
  .then(show => show.body)
  .then(tvmaze.nextepisode)
  .then(console.log);

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
