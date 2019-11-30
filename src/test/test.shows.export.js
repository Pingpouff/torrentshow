#!/usr/bin/env node
"use strict";

var convertToDownloadConf = function(element) {
  var result = element;
  if (!result.name) {
    result = { name: result };
  }
  return result;
};

var davidSeries = require("../../config/shows");
console.log(davidSeries.map(convertToDownloadConf));
