#!/usr/bin/env node
"use strict";
var horriblesubs = new (require("./src/horriblesubs"))();
var tvmaze = require("./tvmaze.api")();
var zooqle = require("./zooqle.api")();
var moment = require("moment");
var promise = require("bluebird");
var Transmission = require("transmission");
var transmission = promise.promisifyAll(
  new Transmission({
    host: "192.168.1.25", // default 'localhost'
    port: 9091, // default 9091
    username: "", // default blank
    password: "", // default blank
    ssl: false, // default false use https
    url: "/transmission/rpc" // default '/transmission/rpc'
  })
);

var convertToDownloadConf = function(element) {
  var result = element;
  if (!result.name) {
    result = { name: result };
  }
  return result;
};

var davidSeries = require("./shows");
var auroreSeries = require("./aurore.shows");
const days = 1;

var download = async function(torrent) {
  const start = moment().subtract(days, "days");
  return tvmaze
    .search(torrent.name)
    .then(tvmaze.prevepisode)
    .then(
      zooqle.execIf(tvmaze.episodeAiredAfter(start), async function(ep) {
        if (torrent.type && torrent.type === "manga") {
          const lastEp = await horriblesubs.getLastest(torrent.name);
          console.log("dl " + torrent.name + " episode " + lastEp.number);
          return transmission
            .addUrlAsync(lastEp.magnet, {
              "download-dir": `/media/LaCie/Series/${torrent.name}/`
            })
            .then(result => {
              var id = result.id;
              console.log(`New ${torrent.name} Torrent added (ID:  ${id})`);
            });
        } else {
          return zooqle.getOne(ep, torrent.res).then(tor => {
            return transmission
              .addUrlAsync(tor.magnet, {
                "download-dir": `/media/LaCie/Series/${torrent.name}/${
                  torrent.name
                }.s0${ep.season}`
              })
              .then(result => {
                var id = result.id;
                console.log(`New ${torrent.name} Torrent added (ID:  ${id})`);
              });
          });
        }
      })
    );
};

davidSeries
  .concat(auroreSeries)
  .map(convertToDownloadConf)
  .forEach(download);
