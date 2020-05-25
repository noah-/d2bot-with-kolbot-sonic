/**
 *    @filename   summoner.js
 *    @desc       kill summoner
 */

function summoner(farm, clearPath) {	
    if ((Packet.checkQuest(13, 0) && Pather.checkWP(46)) && !farm) {
        return true;
    }

    if (!Packet.checkQuest(13, 0) && farm) {
        return false;
    }
	
	// staff not inserted and don't have full staff
    if (!Packet.checkQuest(10, 0) && !me.getItem(91)) {
        if (!Quest.transmuteItems(91, 92, 521)) {
            return false;
        }
    }

    me.overhead("starting summoner");

    let skipPalace = me.getSkill(54, 0);

    if (skipPalace) {
        Pather.teleport = true;
    }

    // There's a spot in palace that walking always gets stuck on
    if (!Pather.checkWP(52)) {
        Pather.getWP(52, clearPath);
    }

    if (!Pather.checkWP(74)) {
        if (me.area != 52) {
            Pather.useWaypoint(52);
        }
        // pathing gets stuck 90% of times, we can follow a static path here
        Pather.moveTo(10099, 6722, 3, clearPath);
        Pather.moveTo(10119, 6739, 3, clearPath);
        Pather.getWP(74, clearPath);
    } else {
        Pather.useWaypoint(74);
    }

    if (me.area === 74) {
        let target = getPresetUnit(me.area, 2, 357);

        if (me.normal) {
            if (getPath(me.area, me.x, me.y, target.roomx * 5 + target.x, target.roomy * 5 + target.y, 0, 10).length === 0) {
                print('Looking for a better telepad layout');
                return false;
            }

            Pather.teleport = false;
        }

        let spot = {};

        switch (target.roomx * 5 + target.x) {
            case 25011:
                spot = {x: 25081, y: 5446};
                break;
            case 25866:
                spot = {x: 25830, y: 5447};
                break;
            case 25431:
                switch (target.roomy * 5 + target.y) {
                    case 5011:
                        spot = {x: 25449, y: 5081};
                        break;
                    case 5861:
                        spot = {x: 25458, y: 5841};
                        break
                }

                break
        }

        Pather.moveToUnit(spot, 0, 0, clearPath);

        Skill.usePvpRange = true;

        try {
            Attack.kill(250);
        } catch (e) {
            Attack.clear(20);
        }

        Skill.usePvpRange = false;
        Pather.moveToPreset(me.area, 2, 357, 0, 0, true);
        Pickit.pickItems();

        if (!farm) {
            let journal = getUnit(2, 357);

            for (let i = 0; i < 5; i += 1) {
                Pather.moveToUnit(journal);
                journal.interact();
                delay(2000);
                me.cancel();

                if (Pather.getPortal(46)) {
                    break;
                }
            }

            Pather.usePortal(46);

            if (me.area === 46) {
                Pather.getWP(46, true);
                Pather.useWaypoint(40);
            }
        }
    }

    return true;
}
