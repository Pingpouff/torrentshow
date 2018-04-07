var tvmaze = require("./tvmaze.api")();
var schedule = require("node-schedule");
var shows = require("./shows");
console.log(shows);
var scheduleEpisode = function(episode) {
  var date = episode.airdate;
  var season = ("0" + episode.season).slice(-2);
  var number = ("0" + episode.number).slice(-2);
  var requestName = `${episode.showName} s${season}e${number}`;
  console.log(date + " : " + requestName);
  console.log(new Date(episode.airstamp));
};
var scheduleNextEpisode = function(name) {
  //   console.log(name);
  tvmaze
    .search(name)
    .then(show => show.body)
    .then(tvmaze.nextepisode)
    .then(show => show.body)
    .then(nextShow => {
      nextShow.showName = name;
      return nextShow;
    })
    .then(scheduleEpisode);
  // .then(console.log);
};
shows.forEach(scheduleNextEpisode);
// var date = new Date(2018, 03, 06, 23, 50, 0);
// var j = schedule.scheduleJob(date, function() {
//   console.log("The world is going to end today.");
// });
