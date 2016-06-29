// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

var container = document.querySelector(".svg-container");

var $ = require("./lib/qsa");
var xhr = require("./lib/xhr");
var closest = require("./lib/closest");
var { transform, transformOrigin } = require("./lib/prefixed");

const NS = "http://www.w3.org/2000/svg";
const stripView = /_(dorsal|side)_view/;

var generatePlaneLayer = function(group, id, isDorsal) {
  var offset = group.getBBox();
  var image = document.createElementNS(NS, "svg");
  image.setAttribute("viewBox", `${offset.x} ${offset.y} ${offset.width} ${offset.height}`);
  image.setAttribute("xlmns", NS);
  image.setAttribute("width", offset.width);
  image.setAttribute("height", offset.height);
  image.setAttribute("preserveAspectRatio", "xMidYMid meet");
  image.appendChild(group);
  image.setAttribute("class", "plane");
  image.setAttribute("id", id);
  image.setAttribute("data-view", isDorsal ? "dorsal" : "side");
  image.style[transform] = "translate3d(0, 0, 0) rotate(0)";
  image.style[transformOrigin] = "50% 50%";
  image.bounds = offset;
  return image;
};

xhr("./assets/planes.svg", function(err, data) {
  container.innerHTML = data;

  var svg = container.querySelector("svg");

  var groups = $("g[id]", svg);
  
  var sprites = {};
  groups.forEach(function(group) {
    var id = group.getAttribute("id");
    var isDorsal = id.match(/dorsal/i);
    var key = id.replace(stripView, "");
    var sprite = generatePlaneLayer(group, id, isDorsal);
    group.removeAttribute("id");
    if (!sprites[key]) sprites[key] = {};
    sprites[key][isDorsal ? "dorsal" : "side"] = sprite;
    // sprite.element.appendChild(style.cloneNode());
    container.appendChild(sprite);
    if (isDorsal) sprite.style.display = "none";
  });

  svg.style.display = "none";

  // svg.parentElement.removeChild(svg);

  window.sprites = sprites;

  var reposition = function(plane) {
    plane.x = Math.random() * -800;
    plane.y = Math.random() * window.innerHeight * .8 + 50;
    plane.dx = Math.random() * 30 + 30;
    plane.r = Math.random() * -4;
  }

  var planes = Object.keys(sprites).map(function(d) {
    var sprite = sprites[d];
    var position = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      r: -4,
      sprite: sprite.side,
      views: sprite,
      data: planeDetail[d]
    };
    if (!planeDetail[d]) console.log("Missing plane data: ", d);
    reposition(position);
    return position;
  });

  var last;
  var timeout;
  var update = function(now) {
    var elapsed = (now - (last || now)) / 1000;
    last = now;
    var bounds = container.getBoundingClientRect();
    planes.forEach(function(s) {
      s.x += elapsed * s.dx;
      s.y += elapsed * s.dy;
      s.sprite.style[transform] = `translate3d(${s.x}px, ${s.y}px, 0) rotate(${s.r}deg)`;
      if (s.x > bounds.width || s.y > window.innerHeight * .8) {
        s.x = Math.random() * -800 - s.sprite.bounds.width;
        s.y = Math.random() * window.innerHeight * .8 + 50;
      }
    });
    timeout = requestAnimationFrame(update);
  };

  var start = function() {
    last = 0;
    timeout = requestAnimationFrame(update);
  }

  start();

  container.addEventListener("click", function(e) {
    var image = closest(e.target, "svg[id]");
    var id = image.getAttribute("id").replace(stripView, "");
    var data = planeDetail[id];
    console.log(id, data);
  })

});