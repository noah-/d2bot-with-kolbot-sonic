/**
 *    @filename   cube.js
 *    @desc       get cube from halls of dead
 */

function cube() {
    if (me.getItem(549)) {
        return true;
    }

    me.overhead("starting cube");

    if (!Pather.checkWP(57)) {
        Pather.getWP(57, true);
    } else {
        Pather.useWaypoint(57);
    }

    Pather.moveToExit(60, true, true);
    Pather.moveToPreset(me.area, 2, 354, 0, 0, true);
    Attack.clear(20);
    Quest.getItem(549, 354);

    return me.getItem(549);
}
