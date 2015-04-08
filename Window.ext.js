load('utils.js');

Window.prototype.moveInGrid = function(grid, dir) {
    var slot = grid.slotInDirection(this.frame(), dir);
    this.setFrame({
        x      : slot.x,
        y      : slot.y,
        width  : slot.width,
        height : slot.height
    });
};
