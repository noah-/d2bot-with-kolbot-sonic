/**
 *    @filename   cave.js
 *    @desc       clear cave in cold plains
 */

function cave(farm, clearPath) {
    let level = function() {
        switch (me.diff) {
            case 0:
                return 7;
            case 1:
                return 30;
            default: // wont run hell
                return 1;
        }
    };

    if (me.charlvl >= level()) {
        return true;
    }

    me.overhead("starting cave");

    if (!Pather.checkWP(3)) {
        Pather.getWP(3, true);
    } else {
        Pather.useWaypoint(3);
    }

    Precast.doPrecast(true);

    if (!Pather.moveToExit([9, 13], true, clearPath)) {
        return false;
    }

    if (me.area === 13) {
        // Cave level 2 is a static map
        // Avoid calling Attack.clearLevel() until function is improved
        let clearCoords = [
            {"x":7549,"y":12554,"radius":10},
            {"x":7560,"y":12551,"radius":10},
            {"x":7573,"y":12550,"radius":10},
            {"x":7576,"y":12563,"radius":10},
            {"x":7586,"y":12564,"radius":10},
            {"x":7596,"y":12567,"radius":10},
            {"x":7596,"y":12578,"radius":10},
            {"x":7606,"y":12559,"radius":10},
            {"x":7612,"y":12549,"radius":10},
            {"x":7611,"y":12540,"radius":10},
            {"x":7608,"y":12528,"radius":10},
            {"x":7595,"y":12529,"radius":10},
            {"x":7588,"y":12519,"radius":10},
            {"x":7574,"y":12520,"radius":10},
            {"x":7564,"y":12523,"radius":10},
            {"x":7568,"y":12567,"radius":10},
            {"x":7565,"y":12574,"radius":10},
            {"x":7560,"y":12583,"radius":10},
            {"x":7554,"y":12578,"radius":10},
            {"x":7546,"y":12573,"radius":10},
            {"x":7537,"y":12573,"radius":10},
            {"x":7528,"y":12574,"radius":10},
            {"x":7519,"y":12575,"radius":10},
            {"x":7510,"y":12566,"radius":10},
            {"x":7510,"y":12584,"radius":10},
            {"x":7514,"y":12593,"radius":10},
            {"x":7521,"y":12595,"radius":10},
            {"x":7526,"y":12600,"radius":10},
            {"x":7525,"y":12606,"radius":10},
            {"x":7535,"y":12596,"radius":10},
            {"x":7543,"y":12596,"radius":10},
            {"x":7550,"y":12596,"radius":10},
            {"x":7557,"y":12595,"radius":10},
            {"x":7556,"y":12605,"radius":10},
            {"x":7556,"y":12611,"radius":10},
            {"x":7566,"y":12608,"radius":10},
            {"x":7580,"y":12613,"radius":10},
            {"x":7589,"y":12610,"radius":10},
            {"x":7594,"y":12601,"radius":10},
            {"x":7600,"y":12601,"radius":10}
        ];

        Attack.clearCoordList(clearCoords, 10);

        return true;
    }

    return false;
}
