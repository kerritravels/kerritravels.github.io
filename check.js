const assert = require("assert");
const fs = require("fs");
const vm = require("vm");

const context = {};
vm.createContext(context);
vm.runInContext(fs.readFileSync("cities.js", "utf8"), context);
vm.runInContext(fs.readFileSync("site.js", "utf8"), context);

const cities = vm.runInContext("cities", context);
const seattle = cities.find((city) => city.slug === "seattle");
const food = context.sectionHtml(seattle.sections.find((section) => section.title === "Food"));
assert.match(food, /<img src="images\/seattle\/malatang.jpg"/);
assert.match(food, /<div class="spot"><strong>Dough Zone/);
assert.ok(food.indexOf("malatang.jpg") < food.indexOf("Dough Zone"));

const escaped = context.sectionHtml({
  title: "A&B",
  spots: [{ name: "<b>", note: `it's "quoted"` }],
});
assert.match(escaped, /A&amp;B/);
assert.match(escaped, /&lt;b&gt;/);
assert.match(escaped, /it&#39;s &quot;quoted&quot;/);

for (const section of seattle.sections) {
  for (const spot of section.spots) {
    if (spot.note) assert.ok(!/[.]$/.test(spot.note), spot.name + ": " + spot.note);
  }
}
const kinnear = seattle.sections[0].spots.find((spot) => spot.name === "Kinnear Park");
assert.match(kinnear.note, /Queen Anne/);

const page = context.pageHtml(seattle);
assert.match(page, /class="blurb"/);
assert.match(page, /internship/);
assert.doesNotMatch(page.slice(0, page.indexOf("<section")), /<h1|Seattle|<img/);
const home = context.homeHtml();
assert.match(home, /images\/world.svg/);
assert.equal((home.match(/<a /g) || []).length, context.pages().length);
assert.match(home, /href="city.html\?city=seattle"/);
assert.match(home, /href="city.html\?city=chicago"/);
const chicago = cities.find((city) => city.slug === "chicago");
assert.match(chicago.blurb, /Michelle's apartment/);
assert.match(chicago.blurb, /lived there for 3 years/);
const zoo = chicago.sections.flatMap((section) => section.spots).find((spot) => spot.name === "Lincoln Park Zoo");
assert.match(zoo.note, /just sit and read then walk around and look at animals/);
assert.match(zoo.note, /3 times/);
const chicagoPlaces = chicago.sections[0].spots.map((spot) => spot.name);
assert.equal(chicagoPlaces.indexOf("Riverwalk"), chicagoPlaces.indexOf("Lincoln Park Zoo") + 1);
assert.ok(chicago.sections.some((section) => section.title === "Museum Campus" && section.spots.length === 3));
assert.match(home, /class="pin-name">Chicago</);
assert.match(home, /class="pin-name">Puerto Vallarta</);
for (const city of cities) {
  if (city.lat != null) assert.match(home, new RegExp(`class="pin-name">${city.name}<`));
}
assert.equal((home.match(/class="pin /g) || []).length, cities.filter((city) => city.lat != null).length);
assert.ok(fs.existsSync("images/world.svg"));

for (const city of cities) {
  for (const section of city.sections || []) {
    for (const spot of section.spots) {
      if (spot.photo) assert.ok(fs.existsSync(spot.photo), spot.photo);
    }
  }
}
assert.equal(context.pages().length, 3);
const nyc = cities.find((city) => city.slug === "nyc");
assert.deepEqual(
  nyc.sections[0].spots.slice(0, 4).map((spot) => spot.name),
  ["Riverside Park", "Central Park", "Bryant Park", "High Line"],
);
assert.match(nyc.blurb, /summer of 2024 and 2026/);
const broadway = nyc.sections.find((section) => section.title === "Broadway");
assert.deepEqual(broadway.spots.map((spot) => spot.name), ["Wicked", "Book of Mormon", "Hamilton"]);
assert.equal(broadway.spots[2].photo, "images/nyc/hamilton.jpg");
const events = nyc.sections.find((section) => section.title === "Events");
assert.equal(events.spots[0].name, "NYC Ballet");
assert.ok(!events.spots.some((spot) => spot.name === "Wicked"));
assert.ok(nyc.sections.findIndex((section) => section.title === "Broadway") < nyc.sections.findIndex((section) => section.title === "Events"));
const nycFood = nyc.sections.find((section) => section.title === "Food");
assert.equal(nycFood.spots[0].name, "pizza");
assert.equal(nycFood.spots[0].note, "lucia pizza but everyone loves lindustrie");
assert.match(nycFood.spots.find((spot) => spot.name === "chinese").note, /nai brother LiC/);
assert.match(nycFood.spots.find((spot) => spot.name === "japanese").note, /toribro ramen/);
assert.match(context.sectionHtml(nycFood), /<strong>pizza<\/strong><span>lucia pizza but everyone loves lindustrie<\/span>/);

const cluster = [
  { left: 100, top: 80, right: 120, bottom: 100 },
  { left: 180, top: 140, right: 200, bottom: 160 },
  { left: 260, top: 90, right: 280, bottom: 110 },
];
const outlier = { left: 900, top: 100, right: 920, bottom: 120 };
const framed = context.frameWindow([...cluster, outlier], 400, 300);
const seen = [...cluster, outlier].filter((p) => p.left >= framed.left && p.right <= framed.left + 400 && p.top >= framed.top && p.bottom <= framed.top + 300);
assert.equal(seen.length, 3);
assert.ok(seen.every((p) => cluster.includes(p)));

console.log("ok");
