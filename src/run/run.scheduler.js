var tvscheduler = require("../api/tvscheduler.api")();
var shows = require("../../config/shows");
shows.forEach(tvscheduler.scheduleNextEpisode);
