#!/usr/bin/env node
"use strict";
var tvmaze = require("./tvmaze.api")();
var zooqle = require("./zooqle.api")();
var moment = require("moment");
var promise = require("bluebird");
var Transmission = require("transmission");
var transmission = promise.promisifyAll(
  new Transmission({
    host: "192.168.1.3", // default 'localhost'
    port: 9091, // default 9091
    username: "", // default blank
    password: "", // default blank
    ssl: false, // default false use https
    url: "/transmission/rpc" // default '/transmission/rpc'
  })
);

var davidSeries = require("./shows");
var auroreSeries = require("./aurore.shows");
const days = 1;

var download = function(name) {
  const start = moment().subtract(days, "days");
  return tvmaze
    .search(name)
    .then(tvmaze.prevepisode)
    .then(
      zooqle.execIf(tvmaze.episodeAiredAfter(start), ep =>
        zooqle.getOne(ep).then(tor => {
          return transmission
            .addUrlAsync(tor.magnet, {
              "download-dir": `/media/LaCie/Series/${name}`
            })
            .then(result => {
              var id = result.id;
              console.log(`New ${name} Torrent added (ID:  ${id})`);
            });
        })
      )
    );
};

davidSeries.concat(auroreSeries).forEach(download);
