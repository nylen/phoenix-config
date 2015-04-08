// XXX because there is no Screen.allScreens()

load('utils.js');

Screen.allScreensWithNames = function(getName) {
    var windows = Window.allWindows(),
        screens = {};

    function addScreen(screen) {
        if (!screen.name) {
            screen.name = getName(screen, screen.frameIncludingDockAndMenu());
            screens[screen.name] = screen;
            utils.debug('Found screen: ' + screen.name, 1);
            return true;
        } else {
            return false;
        }
    }

    windows.forEach(function(win) {
        addScreen(win.screen());
    });

    return screens;
};
