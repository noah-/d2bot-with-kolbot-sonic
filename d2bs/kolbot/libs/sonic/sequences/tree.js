/**
 *    @filename   tree.js
 *    @desc       get scroll from tree in dark wood
 */

function tree() {
    if (Packet.checkQuest(4, 4)) {
        return true;
    }

    // Already got scroll or key
    if (me.getItem(524) || me.getItem(525)) {
        return true;
    }

    me.overhead("starting tree");

    if (!Pather.checkWP(5)) {
        Pather.getWP(5, true);
    } else {
        Pather.useWaypoint(5);
    }

    Precast.doPrecast(true);

    if (!Pather.moveToPreset(me.area, 1, 738, 0, 0, true)) {
        return false;
    }

    Attack.clear(20);

    return Quest.getItem(524, 30);
}
