const horriblesubs = new (require("./horriblesubs"))();

const test = async function() {
  const lastEp = await horriblesubs.getLastest("one punch man");
  console.log(lastEp.number);
//   console.log(
//     episodes.map(function(ep) {
//       return ep.number;
//     })
//   );
};
test();
