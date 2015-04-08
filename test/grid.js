var mocha = require('mocha'),
    must  = require('must');

var Grid = require('../Grid');

describe('Grid', function() {
    var retina = {
            x : 12,
            y : 8
        },
        grid;

    beforeEach(function() {
        var screens = {
            thunderbolt : {
                frameWithoutDockOrMenu : function() {
                    return {
                        x      : 0,
                        y      : 0,
                        width  : 12,
                        height : 12
                    };
                }
            },
            retina : {
                frameWithoutDockOrMenu : function() {
                    return {
                        x      : retina.x,
                        y      : retina.y,
                        width  : 12,
                        height : 12
                    };
                }
            }
        };

        grid = new Grid(screens, 12, {
            thunderbolt : {
                topLeft     : { x : [0,  6], y : [0,  6] },
                topRight    : { x : [6, 12], y : [0,  6] },
                bottomLeft  : { x : [0,  6], y : [6, 12] },
                bottomRight : { x : [6, 12], y : [6, 12] }
            },
            retina : {
                full : { x : [0, 12], y : [0, 12] }
            }
        });
    });

    it('calculates overlap between intervals', function() {
        function checkOverlap(x1, w1, x2, w2, expected) {
            Grid._overlap('x', 'w', { x:x1, w:w1 }, { x:x2, w:w2 }).must.eql(expected);
        }

        checkOverlap(1, 3,  6, 3,  -2);
        checkOverlap(6, 3,  1, 3,  -2);

        checkOverlap(2, 3,  1, 3,  +2);
        checkOverlap(1, 3,  2, 3,  +2);

        checkOverlap(1, 3,  2, 2,  +2);
        checkOverlap(2, 2,  1, 3,  +2);
    });

    function checkSlot(x, y, dir, expected) {
        it(dir + ' from x=' + x + ' y=' + y + ' == ' + expected, function() {
            var slot = grid.slotInDirection({ x : x, y : y }, dir);
            slot.name.must.eql(expected);
        });
    }

    checkSlot( 0,  0, 'left', 'topLeft');
    checkSlot( 4,  4, 'left', 'topLeft');
    checkSlot( 6,  0, 'left', 'topLeft');
    checkSlot( 8,  0, 'left', 'topLeft');
    checkSlot( 8,  4, 'left', 'topLeft');
    checkSlot(12,  8, 'left', 'bottomRight');
    checkSlot(12, 12, 'left', 'bottomRight');
    checkSlot(13,  8, 'left', 'bottomRight');
    checkSlot(13, 12, 'left', 'bottomRight');
    checkSlot(13,  8, 'left', 'bottomRight');
    checkSlot( 0,  6, 'left', 'bottomLeft');
    checkSlot( 4, 12, 'left', 'bottomLeft');
    checkSlot( 6,  6, 'left', 'bottomLeft');
    checkSlot( 8,  6, 'left', 'bottomLeft');
    checkSlot( 8, 12, 'left', 'bottomLeft');
    checkSlot(12, 14, 'left', 'bottomRight');
    checkSlot(12, 20, 'left', 'bottomRight');
    checkSlot(13, 14, 'left', 'bottomRight');
    checkSlot(13, 12, 'left', 'bottomRight');

    checkSlot( 0,  0, 'right', 'topRight');
    checkSlot( 4,  4, 'right', 'topRight');
    checkSlot( 6,  0, 'right', 'full');
    checkSlot( 8,  0, 'right', 'full');
    checkSlot( 8,  4, 'right', 'full');
    checkSlot(12,  0, 'right', 'full');
    checkSlot(12,  4, 'right', 'full');
    checkSlot(13,  8, 'right', 'full');
    checkSlot(13, 12, 'right', 'full');
    checkSlot(13, 12, 'right', 'full');
    checkSlot( 0,  6, 'right', 'bottomRight');
    checkSlot( 4, 12, 'right', 'bottomRight');
    checkSlot( 6,  6, 'right', 'full');
    checkSlot( 8,  6, 'right', 'full');
    checkSlot( 8, 12, 'right', 'full');
    checkSlot(12,  6, 'right', 'full');
    checkSlot(12, 12, 'right', 'full');
    checkSlot(13, 14, 'right', 'full');
    checkSlot(13, 12, 'right', 'full');
    checkSlot(13, 20, 'right', 'full');

    checkSlot( 0,  0, 'up', 'topLeft');
    checkSlot( 4,  4, 'up', 'topLeft');
    checkSlot( 6,  0, 'up', 'topRight');
    checkSlot( 8,  0, 'up', 'topRight');
    checkSlot( 8,  4, 'up', 'topRight');

    checkSlot(12,  0, 'up', 'topRight');
    checkSlot(12,  8, 'up', 'bottomRight');
    checkSlot(13,  8, 'up', 'bottomRight');
    checkSlot(13, 12, 'up', 'bottomRight');
    checkSlot( 0,  6, 'up', 'topLeft');
    checkSlot( 4, 12, 'up', 'topLeft');
    checkSlot( 6,  6, 'up', 'topRight');
    checkSlot( 8,  6, 'up', 'topRight');
    checkSlot( 8, 12, 'up', 'topRight');
    checkSlot(12,  6, 'up', 'topRight');
    checkSlot(12, 12, 'up', 'bottomRight');
    checkSlot(13, 14, 'up', 'bottomRight');
    checkSlot(13, 12, 'up', 'bottomRight');
    checkSlot(13, 20, 'up', 'bottomRight');
});
