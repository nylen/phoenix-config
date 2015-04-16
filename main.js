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
load('Window.ext.js');

var modSwitch   = ['cmd'],
    modMoveGrid = ['alt', 'cmd'],
    modMoveFull = ['ctrl', 'alt', 'cmd'];

var screens = Screen.allScreensWithNames(function(screen, frame) {
    // utils.debug(JSON.stringify(frame));
    if (frame.width == 2560 && frame.height == 1440) {
        return 'thunderbolt';
    } else if (frame.width == 1440 && frame.height == 900) {
        return 'retina';
    } else {
        throw new Error('Unrecognized screen: ' + JSON.stringify(frame));
    }
});

if (screens.thunderbolt) {
    withThunderbolt();
} else {
    withoutThunderbolt();
}

function withThunderbolt() {
    // Config if Thunderbolt screen is present: 3 grid layouts (5-square,
    // left/right, full); always use full retina screen

    var grid1 = new Grid(screens, 12, {
        thunderbolt : {
            topLeft      : { x : [0,  6], y : [0,  7] },
            topRight     : { x : [6, 12], y : [0,  7] },
            bottomLeft   : { x : [0,  4], y : [7, 12] },
            bottomMiddle : { x : [4,  8], y : [7, 12] },
            bottomRight  : { x : [8, 12], y : [7, 12] }
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

    // modMoveGrid + arrow keys moves windows around in the 5-square grid
    // (grid1)

    ['left', 'right', 'up', 'down'].forEach(function(dir) {
        api.bind(dir, modMoveGrid, function() {
            Window.focusedWindow().moveInGrid(grid1, dir);
        });
    });

    // modMoveFull + left / right move windows to left or right half of screen
    // (grid2)

    ['left', 'right'].forEach(function(dir) {
        api.bind(dir, modMoveFull, function() {
            Window.focusedWindow().moveInGrid(grid2, dir);
        });
    });

    // modMoveFull + up maximizes windows (grid3)

    api.bind('up', modMoveFull, function() {
        Window.focusedWindow().moveInGrid(grid3, 'up');
    });
}

function withoutThunderbolt() {
    // Config if Thunderbolt screen is not present: 3 grid layouts on retina
    // screen (left/right, top/bottom, full)

    var grid1 = new Grid(screens, 12, {
        retina : {
            left  : { x : [0,  6], y : [0, 12] },
            right : { x : [6, 12], y : [0, 12] }
        }
    });

    var grid2 = new Grid(screens, 12, {
        retina : {
            top    : { x : [0, 12], y : [0,  6] },
            bottom : { x : [0, 12], y : [6, 12] }
        }
    });

    var grid3 = new Grid(screens, 12, {
        retina : {
            full : { x : [0, 12], y : [0, 12] }
        }
    });

    // modMoveGrid + left / right move windows to left or right half of screen
    // (grid1)

    ['left', 'right'].forEach(function(dir) {
        api.bind(dir, modMoveGrid, function() {
            Window.focusedWindow().moveInGrid(grid1, dir);
        });
    });

    // modMoveGrid + up / down move windows to top or bottom half of screen
    // (grid2)

    ['up', 'down'].forEach(function(dir) {
        api.bind(dir, modMoveGrid, function() {
            Window.focusedWindow().moveInGrid(grid2, dir);
        });
    });

    // modMoveFull + up maximizes windows (grid3)

    api.bind('up', modMoveFull, function() {
        Window.focusedWindow().moveInGrid(grid3, 'up');
    });
}
