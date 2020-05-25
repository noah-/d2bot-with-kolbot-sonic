/**
 *    @filename   pindle.js
 *    @desc       kill pindleskin
 */

function pindle() {
    if (!Packet.checkQuest(37, 1) && !Packet.checkQuest(37, 0)) {
        return true;
    }

    let level = function() {
        switch (me.diff) {
            case 0:
                return 40;
            case 1:
                return 65;
            default:
                return 100;
        }
    };

    if (me.charlvl >= level()) {
        return true;
    }

    me.overhead("starting pindle");

    if (me.act != 5) {
        Town.goToTown(5);
    }

    Town.move("anya");

    if (!Pather.getPortal(121)) {
        let anya = getUnit(1, NPC.Anya);

        if (anya) {
            anya.openMenu();
            me.cancel();
        }
    }

    if (!Pather.usePortal(121)) {
        return true;
    }

    Pather.moveTo(10058, 13234);

    try {
        Attack.clear(15, 0, getLocaleString(22497));
    } catch (e) {
    }

    return true;
}
