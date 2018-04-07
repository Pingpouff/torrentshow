var tvscheduler = require("./tvscheduler.api")();
var shows = require("./shows");
shows.forEach(tvscheduler.scheduleNextEpisode);
