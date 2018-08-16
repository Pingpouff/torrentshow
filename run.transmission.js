var tvmaze = require("./tvmaze.api")();
var zooqle = require("./zooqle.api")();
var moment = require("moment");
var promise = require("bluebird");
var Transmission = require("transmission");
var transmission = promise.promisifyAll(new Transmission({
  host: "localhost", // default 'localhost'
  port: 9091, // default 9091
  username: "", // default blank
  password: "", // default blank
  ssl: false, // default false use https
  url: "/transmission/rpc" // default '/transmission/rpc'
}));
// var transPro = promise.promisifyAll(transmission);
var series = require("./shows");

var download = function(name) {
  const start = moment().subtract(10, "days");
  return tvmaze
    .search(name)
    .then(tvmaze.prevepisode)
    .then(
      zooqle.execIf(tvmaze.episodeAiredAfter(start), ep =>
        zooqle.getOne(ep).then(tor =>
          transmission.addUrlAsync(tor.magnet).then(result => {
            var id = result.id; 
            console.log("Just added a new torrent.");
            console.log("Torrent ID: " + id);
          })
        )
      )
    );
};

series.forEach(download);