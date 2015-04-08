// XXX because there is no Screen.allScreens()

load('utils.js');

Screen.allScreensWithNames = function(getName) {
    // Window.allWindows() can be really slow
    utils.debug('Loading screens', 1);

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
        var screen = win.screen();
        if (screen) {
            addScreen(screen);
        } else {
            utils.debug(
                'Window has no screen: title=' + win.title()
                + ' app=' + win.app().title()
                + ' pid=' + win.app().pid);
        }
    });

    return screens;
};
