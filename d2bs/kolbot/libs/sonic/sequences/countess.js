/**
 *    @filename   countess.js
 *    @desc       kill countess
 */

function countess(farm, clearPath) {
    let level = function() {
        switch (me.diff) {
            case 0:
                return 15;
            case 1:
                return me.classic ? 37 : 99;
            default: // wont run hell
                return 1;
        }
    };

    if (me.charlvl >= level() && farm) {
        return true;
    }

    if (Packet.checkQuest(5, 0) && !farm) {
        return true;
    }

    me.overhead("starting countess");

    if (!Pather.checkWP(6)) {
        Pather.getWP(6, clearPath);
    } else {
        Pather.useWaypoint(6);
    }

    Pather.moveToExit([20, 21, 22, 23, 24, 25], true, clearPath);
    Pather.moveToPreset(me.area, 2, 580,  0, 0, clearPath);

    try {
        Attack.clear(20, 0, getLocaleString(2875)); // The Countess
    } catch (e) {
    }

    Pickit.pickItems();

    return true;
}
