var { transform, transformOrigin } = require("./lib/prefixed");

const NS = "http://www.w3.org/2000/svg";

module.exports = function(group, id, isDorsal) {
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
  image.style[transformOrigin] = "50% 50%";
  image.bounds = offset;
  return image;
};