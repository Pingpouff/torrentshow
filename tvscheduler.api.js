var tvmaze = require("./tvmaze.api")();
var schedule = require("node-schedule");
var zooqle = require("./zooqle.api")();
var moment = require("moment");

var tvscheduler = function(options) {
  function scheduleEpisode(episode) {
    // format show name for request
    var season = ("0" + episode.season).slice(-2);
    var number = ("0" + episode.number).slice(-2);
    var requestName = `${episode.showName} s${season}e${number}`;
    // manage schedule air date
    var date = episode.airdate;
    var airMoment = moment(episode.airstamp).add(moment.duration(6, "hours"));
    console.log(`scheduled ${requestName} on ${airMoment.format("LLLL")}`);
    schedule.scheduleJob(airMoment.toDate(), function() {
      zooqle.searchAndDownloadOnFreebox(requestName);
      scheduleNextEpisode(episode.showName);
    });
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
