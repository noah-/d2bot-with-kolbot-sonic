/**
 *    @filename   radament.js
 *    @desc       kill radament
 */

function radament(farm, clearPath) {
    if (Packet.checkQuest(9, 1)) {
        Town.goToTown(2);
        Quest.talkTo("atma", "atma");

        return true;
    }

    if (Packet.checkQuest(9, 0)) {
        return true;
    }

    me.overhead("starting radament");

    if (!Pather.checkWP(48)) {
        Pather.getWP(48, clearPath);
    } else {
        Pather.useWaypoint(48);
    }

    Pather.moveToExit(49, true, clearPath);

    if (!Pather.moveToPreset(49, 2, 355, 5, 0, clearPath))	{
        throw new Error('Failed to move to radament');
    }

    // dont bother if immune
    if (!Attack.canAttack(getUnit(1, 229))) {
        return true;
    }

    try {
        Attack.clear(15, 0, 229);
    } catch (e) {
        Attack.clear(20);
    }

    Pickit.pickItems();

    if (!me.inTown) {
        Town.goToTown();
    }

    Quest.talkTo("atma", "atma");
    delay(me.ping + 1000);

    return Packet.checkQuest(9, 0);
}
