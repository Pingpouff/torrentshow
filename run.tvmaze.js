var tvmaze = require("./tvmaze.api")();
var zooqle = require("./zooqle.api")();
var moment = require("moment");

var compute = function(show) {
  console.log(show.body._links.nextepisode);
};

const download = function(name) {
  const start = moment().subtract(1, "days");
  // return tvmaze
  //   .search(name)
  //   .then(tvmaze.prevepisode)
  //   .then(zooqle.searchAndDownloadOnFreeboxIf(tvmaze.episodeAiredAfter(start)));
  return tvmaze
    .search(name)
    .then(tvmaze.prevepisode)
    .then(
      zooqle.execIf(tvmaze.episodeAiredAfter(start), ep =>
        zooqle
          .getOne(ep)
          .then(zooqle.downloadTorrentFile)
          .then(request => request.on("response", zooqle.download))
      )
    );
};

[
  "homeland",
  "game of thrones",
  "silicon valley",
  "modern familly",
  "westworld",
  "legion",
  "last week tonight"
].forEach(download);
