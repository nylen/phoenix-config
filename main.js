var loaded = {};
function load(fn) {
    if (!loaded[fn]) {
        require('phoenix/' + fn);
        loaded[fn] = true;
    }
}

load('utils.js');
load('Grid.js');
load('Screen.ext.js');

var modSwitch   = ['cmd'],
    modMoveGrid = ['alt', 'cmd'],
    modMoveFull = ['ctrl', 'alt', 'cmd'];

var splitLeftRight   = 6,
    splitTopBottom   = 7,
    splitMiddleLeft  = 4,
    splitMiddleRight = 8,
    margin = { x : 0, y : 0 };

var screens = Screen.allScreensWithNames(function(screen, frame) {
    if (frame.width == 2560 && frame.height == 1440) {
        return 'thunderbolt';
    } else if (frame.width == 1440 && frame.height == 900) {
        return 'retina';
    } else {
        throw new Error('Unrecognized screen: ' + JSON.stringify(frame));
    }
});

var grid1 = new Grid(screens, 12, {
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

var grid2 = new Grid(screens, 12, {
    thunderbolt : {
        left  : { x : [0,  6], y : [0, 12] },
        right : { x : [6, 12], y : [0, 12] }
    },
    retina : {
        full : { x : [0, 12], y : [0, 12] }
    }
});

var grid3 = new Grid(screens, 12, {
    thunderbolt : {
        full : { x : [0, 12], y : [0, 12] }
    },
    retina : {
        full : { x : [0, 12], y : [0, 12] }
    }
});

var spots = {
    gridSize     : 12,

    topLeft      : { x : [0,  6], y : [0,  7] },
    topRight     : { x : [6, 12], y : [0,  7] },

    bottomLeft   : { x : [0,  4], y : [7, 12] },
    bottomMiddle : { x : [4,  8], y : [7, 12] },
    bottomRight  : { x : [8, 12], y : [7, 12] },

    left  : { x : [0,  6], y : [0, 12] },
    right : { x : [6, 12], y : [0, 12] },
    full  : { x : [0, 12], y : [0, 12] }
};

Window.prototype.moveToSpot = function(frame, spot) {
    var win = this,
        pos = win.frame();

    pos.x = Math.ceil(frame.x + frame.width  * spot.x[0] / spots.gridSize);
    pos.y = Math.ceil(frame.y + frame.height * spot.y[0] / spots.gridSize);

    pos.width  = frame.width  * (spot.x[1] - spot.x[0]) / spots.gridSize - margin.x;
    pos.height = frame.height * (spot.y[1] - spot.y[0]) / spots.gridSize - margin.y;

    win.setFrame(pos);
    utils.debug(JSON.stringify(win.frame()));
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


// modMoveGrid + arrow keys moves windows around in the grid

['left', 'right', 'up', 'down'].forEach(function(dir) {
    api.bind(dir, modMoveGrid, function() {
        var win    = Window.focusedWindow(),
            screen = win.screen(),
            frame  = screen.frameWithoutDockOrMenu();
        win.moveToSpot(frame, win.getSpotInDirection(frame, dir));
    });
});


// modMoveFull + left / right move windows to left or right half of screen
// modMoveFull + up maximizes windows

['left', 'right', 'up'].forEach(function(dir) {
    api.bind(dir, modMoveFull, function() {
        var win    = Window.focusedWindow(),
            screen = win.screen(),
            frame  = screen.frameWithoutDockOrMenu();
        win.moveToSpot(frame, (dir == 'up' ? spots.full : spots[dir]));
    });
});
