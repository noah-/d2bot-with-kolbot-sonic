/**
 *    @filename   raven.js
 *    @desc       kill bloodraven
 */

function raven(farm, clearPath) {
    if (Packet.checkQuest(2, 1)) {
        Packet.entityAction('kashya', 'kashya', 92);
        Town.initNPC("Merc", "getMerc");
    }

    if (!Packet.checkQuest(2, 0) && farm) {
        return false;
    }

    if (Packet.checkQuest(2, 0) && !farm) {
        return true;
    }

    me.overhead("starting raven");

    if (!Pather.checkWP(3)) {
        Pather.getWP(3, clearPath);
    } else {
        Pather.useWaypoint(3);
    }

    Pather.moveToExit(17, true, clearPath);
    Pather.moveToPreset(me.area, 1, 805, 0, 0, clearPath);

    const questKill = !Packet.checkQuest(2, 0);

    Attack.clear(15, 0, getLocaleString(3111));
    Pickit.pickItems();

    if (questKill) {
        Pather.makePortal(true);

        if (!Packet.checkQuest(2, 0)) {
            Packet.entityAction('kashya', 'kashya', 92);
            Town.initNPC("Merc", "getMerc");
        }
    }

    return true;
}
