// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

var $ = require("./lib/qsa");
var xhr = require("./lib/xhr");
var closest = require("./lib/closest");
var dot = require("./lib/dot");
var { transform, transformOrigin } = require("./lib/prefixed");

var generatePlaneLayer = require("./generatePlane");
var planeHTML = dot.compile(require("./_planeDetail.html"));

var container = document.querySelector(".svg-container");
var aside = document.querySelector("aside.explore");
var frame = aside.querySelector(".plane-frame");
const stripView = /_(dorsal|side)_view/;

// Load the planes and generate layers
xhr("./assets/planes.svg", function(err, data) {
  container.innerHTML = data;

  var svg = container.querySelector("svg");
  var groups = $("g[id]", svg);

  // Extract each group and add to a sprite map  
  var views = {};
  groups.forEach(function(group) {
    var id = group.getAttribute("id");
    var isDorsal = id.match(/dorsal/i);
    var key = id.replace(stripView, "");
    var data = planeDetail[key];
    if (!data) {
      console.log("Missing data for ", key);
      group.parentElement.removeChild(group);
      return;
    }
    var sprite = generatePlaneLayer(group, id, isDorsal);
    group.removeAttribute("id");
    if (!views[key]) views[key] = {};
    //assign dorsal and side views to their proper places
    if (isDorsal) {
      var wrapper = document.createElement("div");
      wrapper.className = "plane-wrapper";
      if (planeDetail[key]) {
        wrapper.innerHTML += `<label>${planeDetail[key].model}</label>`;
      }
      wrapper.appendChild(sprite);
      frame.appendChild(wrapper);
      views[key].dorsal = sprite;
      sprite.classList.add("dorsal");
    } else {
      container.appendChild(sprite);
      views[key].side = sprite;
      sprite.classList.add("side");
    }
  });

  // Turn off the original SVG
  svg.style.display = "none";

  var reposition = function(plane) {
    plane.x = Math.random() * -800;
    plane.y = Math.random() * window.innerHeight * .8 + 50;
    plane.dx = Math.random() * 30 + 30;
    plane.r = Math.random() * -5;
  }

  // Place the planes in the sky for flyby animations
  var planes = Object.keys(views).map(function(d) {
    var sprite = views[d];
    var plane = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      r: -4,
      sprite: sprite.side,
      data: planeDetail[d]
    };
    reposition(plane);
    return plane;
  });

  //run animations
  var last;
  var timeout;
  var animate = function(now) {
    var elapsed = (now - (last || now)) / 1000;
    last = now;
    var bounds = container.getBoundingClientRect();
    planes.forEach(function(s) {
      s.x += elapsed * s.dx;
      s.y += elapsed * s.dy;
      s.sprite.style[transform] = `translate3d(${s.x}px, ${s.y}px, 0) rotate(${s.r}deg)`;
      if (s.x > bounds.width || s.y > window.innerHeight * .8) {
        reposition(s);
      }
    });
    timeout = requestAnimationFrame(animate);
  };

  var startAnimation = function() {
    last = 0;
    timeout = requestAnimationFrame(animate);
  }

  startAnimation();

  // Define the exploration interface

  var onScroll = function() {
    var bounds = aside.getBoundingClientRect();
    if (bounds.top < window.innerHeight / 2) {
      if (!timeout) return;
      cancelAnimationFrame(timeout);
      timeout = null;
      document.body.classList.add("exploring");
    } else {
      if (timeout) return;
      startAnimation();
      document.body.classList.remove("exploring");
    }
  };

  window.addEventListener("scroll", onScroll);
  onScroll();

  var detailModal = aside.querySelector(".plane-detail");

  aside.addEventListener("click", function(e) {
    var image = closest(e.target, "svg[id]:not(.close-up)");
    if (!image) return;
    var id = image.getAttribute("id").replace(stripView, "");
    var data = planeDetail[id];
    if (!data) {
      console.log("No plane data for ", id);
      return;
    }
    detailModal.innerHTML = planeHTML(data);
    detailModal.classList.add("ready");
    var reflow = detailModal.offsetWidth;
    detailModal.classList.add("show");
    var sideView = views[id].side.cloneNode(true);
    sideView.classList.remove("side");
    sideView.style[transform] = null;
    sideView.classList.add("landing", "close-up");
    detailModal.querySelector(".landing-pad").appendChild(sideView);
    reflow = detailModal.offsetWidth;
    sideView.classList.remove("landing");
    sideView.onload = e => console.log(e);
  });

  detailModal.addEventListener("click", function(e) {
    if (e.target.classList.contains("close") || e.target == detailModal) {
      detailModal.classList.remove("ready", "show");
    }
  });

});