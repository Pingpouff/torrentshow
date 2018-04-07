var tvmaze = require("./tvmaze.api")();
var schedule = require("node-schedule");
var zooqle = require("./zooqle.api")();
var moment = require("moment");

var tvscheduler = function(options) {
  function scheduleEpisode(episode) {
    var date = episode.airdate;
    var airMoment = moment(episode.airstamp).add(moment.duration(6, "hours"));
    var season = ("0" + episode.season).slice(-2);
    var number = ("0" + episode.number).slice(-2);
    var requestName = `${episode.showName} s${season}e${number}`;
    console.log(airMoment.format("LLLL") + " : " + requestName);
    // var date = new Date(episode.airstamp);
    // var j = schedule.scheduleJob(airMoment, function() {
    //   console.log("The world is going to end today.");
    // });
  }

  function scheduleNextEpisode(name) {
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
  }

  return {
    scheduleNextEpisode,
    scheduleEpisode
  };
};

module.exports = function(options) {
  return new tvscheduler(options);
};
