const horriblesubs = new (require("./horriblesubs"))();
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

const searchName = "parasyte";
const downloadAll = async function() {
  const eps = await horriblesubs.getAll(searchName,1, 13);
  console.log(eps);
  eps.forEach(ep => transmission
    .addUrlAsync(ep.magnet, {
      "download-dir": `/media/LaCie/Series/${searchName}/`
    })
    .then(result => {
      var id = result.id;
      console.log(`New ${searchName} Torrent added (ID:  ${id})`);
    }));
  //   console.log(
  //     episodes.map(function(ep) {
  //       return ep.number;
  //     })
  //   );
};
downloadAll();
