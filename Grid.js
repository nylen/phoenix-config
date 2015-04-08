function Grid(screens, gridSize, slots) {
    var self = this;

    self.slots = [];

    Object.keys(slots).forEach(function(slotScreen) {
        if (screens[slotScreen]) {
            Object.keys(slots[slotScreen]).forEach(function(slotName) {
                var slot  = slots[slotScreen][slotName],
                    frame = screens[slotScreen].frameWithoutDockOrMenu();
                self.slots.push({
                    screen : slotScreen,
                    name   : slotName,
                    x      : slot.x[0] * frame.width  / gridSize + frame.x,
                    y      : slot.y[0] * frame.height / gridSize + frame.y,
                    width  : (slot.x[1] - slot.x[0]) * frame.width  / gridSize,
                    height : (slot.y[1] - slot.y[0]) * frame.height / gridSize
                });
            });
        }
    });
}

function firstMatch(filter) {
    var predicates = [].slice.call(arguments, 1);
    for (var i = 0; i < predicates.length; i++) {
        var arr = filter(predicates[i]);
        if (arr.length) {
            return arr[0];
        }
    }
    return null;
}


Grid._overlap = function(start, len, src, dst) {
    if (dst[start] < src[start]) {
        return Grid._overlap(start, len, dst, src);
    }
    if (src[start] + src[len] < dst[start]) {
        return src[start] + src[len] - dst[start];
    } else {
        return Math.min(src[start] + src[len], dst[start] + dst[len]) - dst[start];
    }
};

Grid._overlapX = function(src, dst) {
    return Grid._overlap('x', 'width', src, dst);
};

Grid._overlapY = function(src, dst) {
    return Grid._overlap('y', 'height', src, dst);
};

Grid.prototype.slotInDirection = function(frame, dir) {
    var self = this;

    // Return an object with parameters that help answer the question "is dst
    // to the DIR of src"
    function score(src, dst) {
        // Calculate variables needed to build a score between two slots
        // If dir is left or right, then x is the primary dimension
        // If dir is up   or down , then y is the primary dimension
        var distance1, // Distance between two grid squares in primary dimension (<0 = wrong direction)
            overlap1,  // Overlap  between two grid squares in primary dimension
            distance2, // Distance between two grid squares in secondary dimension (absolute value)
            overlap2;  // Overlap  between two grid squares in secondary dimension

        if (dir == 'left') {
            distance1 = src.x - dst.x;
            distance2 = Math.abs(src.y - dst.y);
            overlap1  = Grid._overlapX(src, dst);
            overlap2  = Grid._overlapY(src, dst);
        } else if (dir == 'right') {
            distance1 = dst.x - src.x;
            distance2 = Math.abs(src.y - dst.y);
            overlap1  = Grid._overlapX(src, dst);
            overlap2  = Grid._overlapY(src, dst);
        } else if (dir == 'up') {
            distance1 = src.y - dst.y;
            distance2 = Math.abs(src.x - dst.x);
            overlap1  = Grid._overlapY(src, dst);
            overlap2  = Grid._overlapX(src, dst);
        } else if (dir == 'down') {
            distance1 = dst.y - src.y;
            distance2 = Math.abs(src.x - dst.x);
            overlap1  = Grid._overlapY(src, dst);
            overlap2  = Grid._overlapX(src, dst);
        }

        var toReturn = {
            src : src,
            dst : dst,
            distance1 : distance1,
            distance2 : distance2,
            overlap1  : overlap1,
            overlap2  : overlap2
        };

        return toReturn;
    }

    function filterCurrentSlot(cmp) {
        return self.slots.filter(function(slot) {
            return (
                frame.x >= slot.x && cmp(frame.x, slot.x + slot.width) &&
                frame.y >= slot.y && cmp(frame.y, slot.y + slot.height));
        });
    }

    var currentSlot = firstMatch(
        filterCurrentSlot,
        function(a, b) {
            return a < b;
        },
        function(a, b) {
            return a <= b;
        });

    if (!currentSlot) {
        throw new Error(
            'Impossible window position: x=' + frame.x + ' y=' + frame.y);
    }


    var candidates = self.slots.filter(function(slot) {
        // We return the current slot as a last resort so exclude it from the
        // candidates for now
        return slot !== currentSlot;
    }).map(function(slot) {
        // Score each slot
        return score(currentSlot, slot);
    }).filter(function(slot) {
        // Ensure that we always move at least a little in the correct direction
        return slot.distance1 > 0;
    });

    // The following comments are written as though we are moving left/right
    // (dimension 1 is x and dimension 2 is y).

    // Sort slots by:
    //  - distance2 ascending (prefer slots that are at same y value)
    //  - overlap1 descending (prefer slots that are closer together horizontally)
    //  - overlap2 ascending (the more vertical overlap, the better)

    candidates.sort(function(a, b) {
        return (
            a.distance2 - b.distance2 ||
            b.overlap1  - a.overlap1 ||
            a.overlap2  - b.overlap2);
    });

    var toReturn = firstMatch(
        candidates.filter.bind(candidates),
        // Find a slot with some vertical overlap
        function(slot) {
            return slot.overlap2 >= 0;
        },
        // Find a slot with no vertical overlap ??
        function(slot) {
            return true;
        });

    if (toReturn) {
        return toReturn.dst;
    } else {
        // No match -> return the same slot again as a last resort
        // [not currently possible]
        return currentSlot;
    }
};


if (typeof module != 'undefined') {
    module.exports = Grid;
}
