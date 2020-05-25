/**
 *    @filename   ancients.js
 *    @desc       kill ancients
 */

function ancients(farm, clearPath) {
    if (!Packet.checkQuest(39, 0) && farm) {
        return false;
    }

    if (Packet.checkQuest(39, 0) && !farm) {
        return true;
    }

    // reroll ancients
    let checkAncients = function() {
        let monster = getUnit(1);

        if (monster) {
            do {
                if (!monster.getParent() && !Attack.canAttack(monster)) {
                    return false;
                }
            } while (monster.getNext());
        }

        return true;
    };

    let altar = function() {
        let tick = getTickCount();

        while (getTickCount() - tick < 5000) {
            if (getUnit(2, 546)) {
                break;
            }

            delay(20);
        }

        let altar = getUnit(2, 546);

        if (altar) {
            while (altar.mode != 2) {
                Pather.moveToUnit(altar);
                altar.interact();
                delay(200 + me.ping);
                me.cancel();
            }

            return true;
        }

        return false;
    };

    me.overhead("starting ancients");

    if (!Pather.checkWP(118)) {
        Pather.getWP(118, clearPath);
    } else {
        Pather.useWaypoint(118);
    }

    Pather.moveToExit(120, true, clearPath);

    Pather.moveTo(10048, 12628);

    let tempConfig = Misc.copy(Config);

    Config.MPBuffer = 25;
    Config.HPBuffer = 5;

    Town.visitTown();

    altar();
    //Pather.moveTo(x, x);

    while (!getUnit(1, 542)) {
        delay(50);
    }

    while (!checkAncients()) {
        Pather.makePortal(true);
        Town.fillTome(518);
        Pather.usePortal(120, me.name);
        altar();
        //Pather.moveTo(x, x);

        while (!getUnit(1, 542)) {
            delay(10);
        }
    }

    Config.LifeChicken = 20;
    Config.TownHP = 0;
    Config.TownCheck = false;
    Pather.teleport = true;
    Misc.updateConfig();

    Attack.clear(50);
    delay(5000);

    Config = tempConfig;
    Misc.updateConfig();

    return true;
}
