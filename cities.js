// Edit this file, then refresh the browser.
//
// A page is one block in the list below.
// 1. Put photos in images/<slug>/
// 2. Copy the Seattle block. Set name, slug, lat, lng, label, and blurb.
//    label is where the name sits on the map: n, s, e, w, ne, nw, se, sw.
// 3. Add spots. name is required. note and photo are optional.
//    Skip the period at the end of a note.
//    { name: "Place name", note: "short note", photo: "images/chicago/place.jpg" },
// A pin with no page is one line. Look up lat/lng, pick a label, refresh.
// { name: "Banff", lat: 51.18, lng: -115.57, label: "n" },

const cities = [
  {
    name: "Seattle",
    slug: "seattle",
    lat: 47.61,
    lng: -122.33,
    label: "nw",
    blurb: "I lived here for the summer in 2021 for an internship and most of these recs are from then. i've visited every year since then.",
    sections: [
      {
        title: "Places",
        spots: [
          { name: "Amazon Spheres", note: "need an Amazon employee to take you in", photo: "images/seattle/amazon-spheres.jpg" },
          { name: "Pike Place Market", photo: "images/seattle/pike-place.jpg" },
          { name: "Lake Union Park", photo: "images/seattle/lake-union-park.jpg" },
          { name: "UW", photo: "images/seattle/uw.jpg" },
          { name: "Gas Works Park", photo: "images/seattle/gas-works.jpg" },
          { name: "Kerry Park", photo: "images/seattle/kerry-park.jpg" },
          { name: "Arboretum / Japanese Garden", note: "across from each other, Bellevue Botanical Garden is better but further", photo: "images/seattle/arboretum.jpg" },
          { name: "Ravenna Park", note: "fav park in Seattle", photo: "images/seattle/ravenna-park.jpg" },
          { name: "Bainbridge Island", note: "nice views on the ferry, Mora's ice cream, take the ferry back at night", photo: "images/seattle/bainbridge.jpg" },
          { name: "Kinnear Park", note: "something to do in Queen Anne", photo: "images/seattle/kinnear-park.jpg" },
          { name: "Seward Park", note: "360 water views and nature trails, kinda far", photo: "images/seattle/seward-park.jpg" },
        ],
      },
      {
        title: "Food",
        spots: [
          { name: "Malatang", note: "hot pot", photo: "images/seattle/malatang.jpg" },
          { name: "Chi Mac", photo: "images/seattle/chi-mac.jpg" },
          { name: "The Alley", photo: "images/seattle/the-alley.jpg" },
          { name: "Molly Moon's", note: "ice cream flight", photo: "images/seattle/molly-moons.jpg" },
          { name: "Seattle's Best Tea", note: "heavy oolong tea with lychee jelly", photo: "images/seattle/seattles-best-tea.jpg" },
          { name: "Piroshky Piroshky", photo: "images/seattle/piroshky.jpg" },
          { name: "GH Pasta Co", note: "chili flakes with the pasta", photo: "images/seattle/gh-pasta.jpg" },
          { name: "Cafe on the Ave", photo: "images/seattle/cafe-on-the-ave.jpg" },
          { name: "Bangrak Market", note: "looks like a street market inside", photo: "images/seattle/bangrak.jpg" },
          { name: "Post Alley Pizza", note: "pepperoni with hot honey", photo: "images/seattle/post-alley-pizza.jpg" },
          { name: "Dough Zone", note: "cheap din tai fung, Yelp waitlist before" },
          { name: "Xi'an Noodles" },
          { name: "Bongos", note: "next to Green Lake Park" },
          { name: "Korean Bamboo" },
        ],
      },
      {
        title: "Things to do",
        spots: [
          { name: "Paddle boarding on Lake Union", note: "better than kayaking", photo: "images/seattle/paddle-boarding.jpg" },
          { name: "Bars in Capitol Hill", note: "the M" },
          { name: "Bus to Bellevue" },
          { name: "Hike at Mt. Rainier" },
          { name: "Markets", note: "Fremont flea market, Ballard farmers market" },
          { name: "Electric scooters by the piers at night" },
        ],
      },
    ],
  },
  { name: "Puerto Vallarta", lat: 20.65, lng: -105.23, label: "w" },
  { name: "NYC", lat: 40.71, lng: -74.01, label: "e" },
  { name: "SF", lat: 37.77, lng: -122.42, label: "w" },
  { name: "Chicago", lat: 41.88, lng: -87.63, label: "n" },
  { name: "South America", lat: -15.6, lng: -58.2, label: "e" },
  { name: "Mexico City", lat: 19.43, lng: -99.13, label: "e" },
  { name: "London", lat: 51.51, lng: -0.13, label: "ne" },
  { name: "Irvine", lat: 33.67, lng: -117.83, label: "sw" },
  { name: "South of France", lat: 42.6, lng: 3.7, label: "sw" },
  { name: "Banff", lat: 51.18, lng: -115.57, label: "n" },
  { name: "Scotland", lat: 56.49, lng: -4.2, label: "nw" },
  { name: "Japan", lat: 36.2, lng: 138.25, label: "e" },
  { name: "Korea", lat: 37.57, lng: 126.98, label: "w" },
  { name: "Beijing", lat: 39.9, lng: 116.41, label: "n" },
  { name: "Norway", lat: 60.47, lng: 8.47, label: "w" },
  { name: "Sweden", lat: 59.33, lng: 18.07, label: "e" },
  { name: "Switzerland", lat: 46.8, lng: 8.23, label: "ne" },
  { name: "Denmark", lat: 55.68, lng: 12.57, label: "s" },
  { name: "Easter Island", lat: -27.11, lng: -109.35, label: "e" },
  // Spread a little so both pins show. True centers: Maui 20.80, -156.33 and Oahu 21.44, -157.86.
  { name: "Maui", lat: 20.0, lng: -154.3, label: "se" },
  { name: "Oahu", lat: 22.3, lng: -160.0, label: "nw" },
];
