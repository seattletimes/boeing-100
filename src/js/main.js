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
    if (isDorsal) sprite.hide();
  });

  window.planes = planes;

  var sprites = Object.keys(planes).map(function(d) {
    var plane = planes[d];
    // plane.dorsal.hide();
    plane.side.positionAt(200, 200, -30);
    return {
      x: Math.random() * -800,
      y: Math.random() * 200 + 50,
      dx: Math.random() * 30 + 30,
      sprite: plane.side
    }
  });

  var last = 0;
  var update = function(now) {
    var elapsed = (now - last) / 1000;
    last = now;
    sprites.forEach(function(s) {
      s.x += elapsed * s.dx;
      s.sprite.positionAt(s.x, s.y);
      if (s.x > 600) s.x = -200;
    });
    requestAnimationFrame(update);
  };

  requestAnimationFrame(update);



});