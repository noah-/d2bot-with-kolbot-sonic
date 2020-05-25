/**
 *    @filename   chests.js
 *    @desc       pop chests in set areas
 */

function chests() {
    if (!Pather.accessToAct(3)) {
        return true;
    }

    // force buying without config.openchests
    Town.checkKeys = function () {
        if (me.classid === 6 || me.gold < 540 || (!me.getItem("key") && !Storage.Inventory.CanFit({sizex: 1, sizey: 1}))) {
            return 12;
        }

        var i,
            count = 0,
            key = me.findItems(543, 0, 3);

        if (key) {
            for (i = 0; i < key.length; i += 1) {
                count += key[i].getStat(70);
            }
        }

        return count;
    };

    // sometimes chests dont open for some reason
    Misc.openChest = function(unit) {
        // Skip invalid and Countess chests
        if (!unit || unit.x === 12526 || unit.x === 12565) {
            return false;
        }

        // already open
        if (unit.mode) {
            return true;
        }

        // locked chest, no keys
        if (me.classid !== 6 && unit.islocked && !me.findItem(543, 0, 3)) {
            return false;
        }

        for (let i = 0; i < 5; i += 1) {
            if (Pather.moveTo(unit.x + 1, unit.y + 2, 3) && getDistance(me, unit.x + 1, unit.y + 2) < 5) {
                break;
            }
        }

        let tick = getTickCount();

        if (getDistance(me, unit.x + 1, unit.y + 2) < 5) {
            while (getTickCount() - tick < 1000) {
                sendPacket(1, 0x13, 4, unit.type, 4, unit.gid);
                delay(me.ping);

                if (unit.mode) {
                    return true;
                }

                Packet.flash(me.gid);
            }
        }

        if (!me.idle) {
            Misc.click(0, 0, me.x, me.y); // Click to stop walking in case we got stuck
        }

        return false;
    };

    Town.buyKeys();

    const areas = [79, 80, 81];

    for (let area of areas) {
        Pather.journeyTo(area);
        Misc.openChestsInArea(area);
    }

    return true;
}
