var comics = require("./comics.api")();

var cheerio = (cheerio = require("cheerio"));

comics
  .search("Black Science")
  .then(comicInfos => {
    console.log(comicInfos[0].title+' found');
    return comics.download(comicInfos[0]);
  })
  // .then(function(response) {
  //   console.log(response.body)
  //   var $ = cheerio.load(response.body, {
  //     xmlMode: true
  //   });
  //   // console.log($).html());
  //   const dlUrl = $(".aio-red").attr("href");
  //   console.log(dlUrl);
  //   // return promise.resolve(dlUrl).asCallback(callback);
  // });
// .catch(function(error) {
//   return promise.reject(error).asCallback(callback);
// });
