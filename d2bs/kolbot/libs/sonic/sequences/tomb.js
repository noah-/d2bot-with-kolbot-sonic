/**
 *    @filename   tomb.js
 *    @desc       clear all tombs to gain levels
 */

function tomb() {
    if (me.charlvl >= 24) {
        return true;
    }

    me.overhead("starting tomb");

    let tombId = [66, 67, 68, 69, 70, 71, 72];

    tombId.some(function(tomb) {
        if (!me.inTown) {
            Town.doChores();
        }

        Pather.useWaypoint(46);
        Pather.moveToExit(tomb, true, true);

        if (me.area == tomb) {
            for (let i = 0; i < 6; i += 1) {
                try {
                    let chest = getPresetUnit(me.area, 2, 397);
                    let orifice = getPresetUnit(me.area, 2, 152);

                    if (chest) {
                        if (Pather.moveToPreset(me.area, 2, 397,  0, 0, true)) {
                            break;
                        }
                    } else if (orifice) {
                        if (Pather.moveToPreset(me.area, 2, 152,  0, 0, true)) {
                            break;
                        }
                    }
                } catch (e) {
                }
            }

            Attack.clear(50);
            Pickit.pickItems();
            Town.doChores();
        }

        return me.charlvl >= 24;
    });

    return me.charlvl >= 24;
}
