var tvmaze = require("./tvmaze.api")();
var compute = function(show) {
  console.log(show.body._links.nextepisode);
};
tvmaze
  .search("silicon valley")
  .then(show => show.body)
  .then(tvmaze.nextepisode)
  .then(console.log);
