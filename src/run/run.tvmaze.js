#!/usr/bin/env node
"use strict";
var tvmaze = require("../api/tvmaze/tvmaze.api")();
var zooqle = require("../api/zooqle/zooqle.api")();
var moment = require("moment");
var series = require("../../config/shows");

const convertToDownloadConf = function(element) {
  var result = element;
  if (!result.name) {
    result = { name: result };
  }
  return result;
};

const execIf = function(conditionalFunction, execFunc, execParam) {
  return function(execParam) {
    const log = execParam.showName;
    if (conditionalFunction(execParam)) {
      console.log("[V]" + log);
      return execFunc(execParam);
    } else {
      console.log("[X]" + log);
      return execParam;
    }
  };
};

const download = function(show) {
  const start = moment().subtract(1, "days");
  return tvmaze
    .search(show.name)
    .then(tvmaze.prevepisode)
    .then(execIf(tvmaze.episodeAiredAfter(start), console.log));
};

series.map(convertToDownloadConf).forEach(download);
