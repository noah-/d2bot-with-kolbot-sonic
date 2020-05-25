/**
 *    @filename   andariel.js
 *    @desc       kill andariel and move to act 2
 */

function andariel(farm, clearPath) {
    if (Packet.checkQuest(6, 1)) {
        Quest.talkTo("warriv", "warriv");
        Quest.changeAct(2);
    }

    if (!Pather.accessToAct(2) && farm) {
        return false;
    }

    if (Pather.accessToAct(2) && !farm) {
        return true;
    }

    me.overhead("starting andariel");

    if (!Pather.checkWP(35)) {
        Pather.getWP(35, clearPath);
    } else {
        Pather.useWaypoint(35);
    }

    Precast.doPrecast(true);

    Pather.moveToExit([36, 37], true, clearPath);

    if (clearPath) {
        let clearCoords = [
            {"x":22592,"y":9640,"radius":20},
            {"x":22567,"y":9631,"radius":20},
            {"x":22528,"y":9639,"radius":20},
            {"x":22566,"y":9587,"radius":20},
            {"x":22547,"y":9577,"radius":20}
        ];

        Attack.clearCoordList(clearCoords, 10);
    } else {
        Pather.moveTo(22563, 9556);
    }

    try {
        Attack.kill(156);
    } catch (e) {
        Attack.clear(30);
    }

    Pickit.pickItems();
    Town.goToTown();

    // quest kill
    if (!farm) {
        Quest.talkTo("warriv", "warriv");
        Quest.changeAct(2);
    }

    return Pather.accessToAct(2);
}
