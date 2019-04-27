#!/usr/bin/env node
"use strict";

var convertToDownloadConf = function(element) {
  var result = element;
  if (!result.name) {
    result = { name: result };
  }
  return result;
};

var davidSeries = require("./shows");
console.log(davidSeries.map(convertToDownloadConf));
