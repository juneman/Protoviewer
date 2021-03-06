var w = 600,
    h = 300;

var year = 2008;
data.yearIdx = function(year) { return 2008-year; }

var scale = pv.Geo.scale()
    .domain({lng: -128, lat: 24}, {lng: -64, lat: 50})
    .range({x: 0, y: 0}, {x: w, y: h});

// Colors by ColorBrewer.org, Cynthia A. Brewer, Penn State.
var col = function(v) {
  if (v < 17) return "#008038";
  if (v < 20) return "#A3D396";
  if (v < 23) return "#FDD2AA";
  if (v < 26) return "#F7976B";
  if (v < 29) return "#F26123";
  if (v < 32) return "#E12816";
  return "#B7161E";
};

// Find the centroid for each state
us_lowres.forEach(function(c) {
  c.code = c.code.toUpperCase();
  c.centLatLon = centroid(c.borders[0]);
});

// Add the main panel
var vis = new pv.Panel()
    .width(w)
    .height(h)
    .top(30)
    .bottom(20);

// Add a panel for each state
var state = vis.add(pv.Panel)
    .data(us_lowres);

// Add a panel for each state land mass
state.add(pv.Panel)
    .data(function(c) { return c.borders; })
	.add(pv.Line)
    .data(function(l) { return l; })
    .left(scale.x)
    .top(scale.y)
    .fillStyle(function(d, l, c) { return col(data[c.code].obese[data.yearIdx(year)]); })
    .lineWidth(1)
    .strokeStyle("white")
    .antialias(false);

// Add a label with the state code in the middle of every state
vis.add(pv.Label)
    .data(us_lowres)
    .left(function(c) { return scale(c.centLatLon).x; })
    .top(function(c) { return scale(c.centLatLon).y; })
    .text(function(c) { return c.code; })
    .textAlign("center")
    .textBaseline("middle");

// Add the color bars for the color legend
vis.add(pv.Bar)
    .data(pv.range(14, 32.1, 3))
    .bottom(function(d) { return this.index * 12; })
    .height(10)
    .width(10)
    .left(5)
    .fillStyle(function(d) { return col(14 + 3 * this.index); })
    .lineWidth(null)
	.anchor("right").add(pv.Label)
    .textAlign("left")
    .text(function(d) { return d + " - " + (d + 3) + "%"; });

vis.render();
