/**
 *    @filename   trist.js
 *    @desc       clear tristam
 */

function trist(farm, clearPath) {
    let level = function() {
        switch (me.diff) {
            case 0:
                return 15;
            case 1:
                return 37;
            default: // wont run hell
                return 1;
        }
    };

    if (me.charlvl >= level()) {
        return true;
    }

    me.overhead("starting trist");

    // Saved cain in this game, should be a portal up
    if (me.act == 1) {
        if (Pather.getPortal(38)) {
            Pather.usePortal(38, me.name);
        }
    }

    if (me.area != 38) {
        if (!Pather.checkWP(4)) {
            Pather.getWP(4, true);
        } else {
            Pather.useWaypoint(4);
        }

        if (!Pather.moveToPreset(me.area, 1, 737, 0, 0, clearPath)) {
            return false;
        }

        try {
            Attack.clear(15, 0, getLocaleString(2872)); // rak
        } catch (e) {
            Attack.clear(20);
        }

        Pather.usePortal(38);
    }

    if (me.area === 38) {
        let clearCoords = [
            {"x":25176,"y":5128,"radius":20},
            {"x":25175,"y":5145,"radius":20},
            {"x":25171,"y":5159,"radius":20},
            {"x":25166,"y":5178,"radius":20},
            {"x":25173,"y":5192,"radius":20},
            {"x":25153,"y":5198,"radius":20},
            {"x":25136,"y":5189,"radius":20},
            {"x":25127,"y":5167,"radius":20},
            {"x":25120,"y":5148,"radius":20},
            {"x":25101,"y":5136,"radius":20},
            {"x":25119,"y":5106,"radius":20},
            {"x":25121,"y":5080,"radius":20},
            {"x":25119,"y":5061,"radius":20},
            {"x":4933,"y":4363,"radius":20}
        ];

        Attack.clearCoordList(clearCoords);
    }

    return true;
}
