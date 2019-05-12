const html = "span> One-Punch Man <strong>02</strong> <span class";
const re = /span>\s(.*)\s<strong/;
const name = re.exec(html);
console.log(name);
