function debug(message) {
    api.alert(message, 5);
}

var modSwitch = ['cmd'],
    modMove   = ['alt', 'cmd'];

var splitLeftRight   = 6,
    splitTopBottom   = 7,
    splitMiddleLeft  = 4,
    splitMiddleRight = 8,
    margin = { x : 0, y : 0 };

var spots = {
    gridSize     : 12,

    topLeft      : { x : [0,  6], y : [0,  7] },
    topRight     : { x : [6, 12], y : [0,  7] },

    bottomLeft   : { x : [0,  4], y : [7, 12] },
    bottomMiddle : { x : [4,  8], y : [7, 12] },
    bottomRight  : { x : [8, 12], y : [7, 12] }
};

Window.prototype.moveToSpot = function(frame, spot) {
    var win = this,
        pos = win.frame();

    pos.x = Math.ceil(frame.x + frame.width  * spot.x[0] / spots.gridSize);
    pos.y = Math.ceil(frame.y + frame.height * spot.y[0] / spots.gridSize);

    pos.width  = frame.width  * (spot.x[1] - spot.x[0]) / spots.gridSize - margin.x;
    pos.height = frame.height * (spot.y[1] - spot.y[0]) / spots.gridSize - margin.y;

    win.setFrame(pos);
    debug(JSON.stringify(win.frame()));
};

Window.prototype.positionInGrid = function(frame) {
    var win = this,
        pos = win.frame();

    return {
        x : (pos.x - frame.x) * spots.gridSize / frame.width,
        y : (pos.y - frame.y) * spots.gridSize / frame.height,

        width  : pos.width  * spots.gridSize / frame.width,
        height : pos.height * spots.gridSize / frame.height
    };
}

Window.prototype.getSpotInDirection = function(frame, dir) {
    var win = this,
        pos = win.positionInGrid(frame);

    if (dir == 'left') {

        if (pos.y < splitTopBottom) {
            // In top half of screen -> top left
            return spots.topLeft;
        } else {
            // In bottom half of screen
            if (pos.x >= splitMiddleRight) {
                // and right third -> bottom middle
                return spots.bottomMiddle;
            } else {
                // and elsewhere -> bottom left
                return spots.bottomLeft;
            }
        }

    } else if (dir == 'right') {

        if (pos.y < splitTopBottom) {
            // In top half of screen -> top right
            return spots.topRight;
        } else {
            // In bottom half of screen
            if (pos.x < splitMiddleLeft) {
                // and left third -> bottom middle
                return spots.bottomMiddle;
            } else {
                // and elsewhere -> bottom right
                return spots.bottomRight;
            }
        }

    } else if (dir == 'up') {

        if (pos.x < splitLeftRight) {
            // In left half of screen -> top left
            return spots.topLeft;
        } else {
            // In right half of screen -> top right
            return spots.topRight;
        }

    } else if (dir == 'down') {

        if (pos.x < splitMiddleLeft) {
            // In left third of screen -> bottom left
            return spots.bottomLeft;
        } else if (pos.x < splitMiddleRight) {
            // In middle third of screen -> bottom middle
            return spots.bottomMiddle;
        } else {
            // In right third of screen -> bottom right
            return spots.bottomRight;
        }

    }

    throw new Error('Whoops, no return value');
};


// modMove + arrow keys moves windows around in the grid

['left', 'right', 'up', 'down'].forEach(function(dir) {
    api.bind(dir, modMove, function() {
        var win    = Window.focusedWindow(),
            screen = win.screen(),
            frame  = screen.frameWithoutDockOrMenu();
        win.moveToSpot(frame, win.getSpotInDirection(frame, dir));
    });
});
