/**
 *    @filename   cain.js
 *    @desc       open tristam and rescue cain
 */

function cain() {
    if (Packet.checkQuest(4, 1)) {
        Quest.talkTo("akara", "akara");
    }

    if (Packet.checkQuest(4, 0)) {
        return true;
    }

    me.overhead("starting cain");

    if (me.getItem(524)) {
        Quest.talkTo("akara", "akara");
    }

    if (!Pather.checkWP(4)) {
        Pather.getWP(4, true);
    } else {
        Pather.useWaypoint(4);
    }

    if (!Pather.moveToPreset(me.area, 1, 737, 20, 0, true)) {
        return false;
    }

    try {
        Attack.clear(15, 0, getLocaleString(2872)); // rak
    } catch (e) {
        Attack.clear(20);
    }

    if (me.getItem(525)) { //key to cairn stones
        let stone;

        for (let i = 0; i < 5; i += 1) {
            for (let j = 17; j < 22; j += 1) {
                stone = getUnit(2, j);

                if (stone) {
                    Misc.openChest(stone);
                    Attack.clear(10);
                }
            }
        }
    }

    let tick = getTickCount();

    while (!Pather.getPortal(38) && getTickCount() - tick < 40e3) { //wait up to 40 seconds
        Attack.clear(10);
        delay(50);
    }

    if (!Pather.getPortal(38)) {
        return false;
    }

    for (let i = 0; i < 10; i += 1) {
        if (Pather.usePortal(38)) {
            break;
        }

        delay(100);
    }

    if (me.area === 38) {
        let clearCoords = [
            {"x":25166,"y":5108,"radius":10},
            {"x":25164,"y":5115,"radius":10},
            {"x":25163,"y":5121,"radius":10},
            {"x":25158,"y":5126,"radius":10},
            {"x":25151,"y":5125,"radius":10},
            {"x":25145,"y":5129,"radius":10},
            {"x":25142,"y":5135,"radius":10}
        ];

        Attack.clearCoordList(clearCoords);

        let cage = getUnit(2, 26);

        if (cage && Misc.openChest(cage)) {
            Town.goToTown();

            if (Packet.checkQuest(4, 1)) {
                Quest.talkTo("akara", "akara");
            }
        }
    }

    return Packet.checkQuest(4, 0);
}
