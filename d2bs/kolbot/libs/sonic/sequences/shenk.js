/**
 *    @filename   shenk.js
 *    @desc       kill shenk
 */

function shenk(farm, clearPath) {
    if ((!Packet.checkQuest(35, 0) && !Packet.checkQuest(35, 1)) && farm) {
        return false;
    }

    if ((Packet.checkQuest(35, 0) || Packet.checkQuest(35, 1)) && !farm) {
        return true;
    }

    let level = function() {
        switch (me.diff) {
            case 0:
                return 32;
            case 1:
                return 50;
            default: // wont run hell
                return 1;
        }
    };

    if (me.charlvl >= level()) {
        return true;
    }

    me.overhead("starting shenk");

    if (!Pather.checkWP(111)) {
        Pather.getWP(111, clearPath);

        // killed shenk on way to wp
        if (Packet.checkQuest(35, 1)) {
            return true;
        }
    } else {
        Pather.useWaypoint(111);
    }

    Precast.doPrecast(true);
    Pather.moveTo(3846, 5120, 3, clearPath);
    //Attack.clear(30);
    Skill.usePvpRange = true;
    Attack.kill(getLocaleString(22435));
    Pickit.pickItems(50);

    return true;
}
