class Plane {
  constructor(group) {
    this.element = group;
    this.offset = group.getBBox();
    this.positionAt(0, 0);
    this.animating = false;
    this.queue = [];
  }

  positionAt(x, y, r = 0) {
    var reset = {
      x: -this.offset.x - this.offset.width / 2,
      y: -this.offset.y - this.offset.height / 2
    };

    this.element.setAttribute("transform", `translate(${x}, ${y}) rotate(${r}) translate(${reset.x}, ${reset.y})`);
  }

  animateTo(x, y, r) {
    this.queue.push({ x, y, r });
    if (!this.animating) this.startAnimation();
  }

  startAnimation() {
    
  }

}

module.exports = Plane;