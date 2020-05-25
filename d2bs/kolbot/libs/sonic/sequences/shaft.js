/**
 *    @filename   shaft.js
 *    @desc       get the shaft from maggot lair
 */

function shaft(farm, clearPath) {
    // skip if already have staff, full staff, or submitted staff
    if (Packet.checkQuest(10, 0) || me.getItem(92) || me.getItem(91)) {
        return true;
    }

    me.overhead("starting shaft");

    Pather.teleport = !!me.getSkill(54, 0);

    if (!Pather.checkWP(43)) {
        Pather.getWP(43, clearPath);
    } else {
        Pather.useWaypoint(43);
    }

    Pather.moveToExit([62, 63, 64], true, clearPath);

    if (me.area === 64) {
        Pather.moveToPreset(me.area, 2, 356,  0, 0, clearPath);

        if (Quest.getItem(92, 356)) {
            Quest.stashItem(521);
        }
    }

    return me.getItem(92);
}
