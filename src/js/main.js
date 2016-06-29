// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

var container = document.querySelector(".svg-container");

var $ = require("./lib/qsa");
var xhr = require("./lib/xhr");
var { transform, transformOrigin } = require("./lib/prefixed");

const NS = "http://www.w3.org/2000/svg";

var generatePlaneLayer = function(group) {
  var offset = group.getBBox();
  var image = document.createElementNS(NS, "svg");
  image.setAttribute("viewBox", `${offset.x} ${offset.y} ${offset.width} ${offset.height}`);
  image.setAttribute("xlmns", NS);
  image.setAttribute("width", offset.width);
  image.setAttribute("height", offset.height);
  image.setAttribute("preserveAspectRatio", "xMidYMid meet");
  image.appendChild(group);
  image.setAttribute("class", "plane");
  image.style[transform] = "translate3d(0, 0, 0) rotate(0)";
  image.style[transformOrigin] = "50% 50%";
  image.bounds = offset;
  return image;
}

xhr("./assets/planes.svg", function(err, data) {
  container.innerHTML = data;

  var svg = container.querySelector("svg");

  var groups = $("g[id]", svg);
  
  var planes = {};
  groups.forEach(function(group) {
    var id = group.getAttribute("id");
    var isDorsal = id.match(/dorsal/i);
    id = id.replace(/_(dorsal|side)_view/, "");
    var sprite = generatePlaneLayer(group);
    if (!planes[id]) planes[id] = {};
    planes[id][isDorsal ? "dorsal" : "side"] = sprite;
    // sprite.element.appendChild(style.cloneNode());
    container.appendChild(sprite);
    if (isDorsal) sprite.style.display = "none";
  });

  svg.style.display = "none";

  // svg.parentElement.removeChild(svg);

  window.planes = planes;

  var sprites = Object.keys(planes).map(function(d) {
    var plane = planes[d];
    return {
      x: Math.random() * -800,
      y: Math.random() * window.innerHeight * .8 + 50,
      dx: Math.random() * 30 + 30,
      sprite: plane.side
    }
  });

  var last = 0;
  var update = function(now) {
    var elapsed = (now - last) / 1000;
    last = now;
    var bounds = container.getBoundingClientRect();
    sprites.forEach(function(s) {
      s.x += elapsed * s.dx;
      s.sprite.style[transform] = `translate3d(${s.x}px, ${s.y}px, 0)`;
      if (s.x > bounds.width) s.x = -s.sprite.bounds.width;
    });
    requestAnimationFrame(update);
  };

  requestAnimationFrame(update);



});