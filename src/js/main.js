// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

var container = document.querySelector(".svg-container");

var $ = require("./lib/qsa");
var xhr = require("./lib/xhr");

var Plane = require("./planeSprite");

xhr("./assets/planes.svg", function(err, data) {
  container.innerHTML = data;

  var svg = container.querySelector("svg");
  svg.setAttribute("viewBox", "0 0 400 400");

  var groups = $("g[id]", svg);
  
  var planes = {};
  groups.forEach(function(group) {
    var id = group.getAttribute("id");
    var isDorsal = id.match(/dorsal/i);
    id = id.replace(/_(dorsal|side)_view/, "");
    var sprite = new Plane(group);
    if (!planes[id]) planes[id] = {};
    planes[id][isDorsal ? "dorsal" : "side"] = sprite;
    sprite.positionAt(200, 200, 30);
  });

  console.log(planes);

});