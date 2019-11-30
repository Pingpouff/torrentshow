const davidSeries = require("./david.shows");
const auroreSeries = require("./aurore.shows");

const convertToDownloadConf = function(element) {
  var result = element;
  if (!result.name) {
    result = { name: result };
  }
  return result;
};
const shows = davidSeries.concat(auroreSeries).map(convertToDownloadConf);
module.exports = shows;
