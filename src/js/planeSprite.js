class Plane {
  constructor(group) {
    this.element = group;
    this.offset = group.getBBox();
    this.positionAt(0, 0);
  }

  positionAt(x, y, r = 0) {
    var transform = {
      x: x - this.offset.x - this.offset.width / 2,
      y: y - this.offset.y - this.offset.height / 2
    };

    this.element.setAttribute("transform", `rotate(${r}) translate(${transform.x}, ${transform.y})`);
  }

}

module.exports = Plane;