/**
 *    @filename   amulet.js
 *    @desc       get the viper amulet from claw viper
 */

function amulet(farm, clearPath) {
    // inserted staff and finished summoner
    if (Packet.checkQuest(10, 0) && Packet.checkQuest(13, 0)) {
        return true;
    }

    // have amulet/full staff or completed horadric quest
    if (me.getItem(521) || me.getItem(91) || Packet.checkQuest(10, 0)) {
        return true;
    }

    me.overhead("starting amulet");
	
	Pather.teleport = !!me.getSkill(54, 0);

    if (!Pather.checkWP(44)) {
        Pather.getWP(44, clearPath);
    } else {
        Pather.useWaypoint(44);
    }

    if (me.area === 44) {
        Pather.moveToExit([45, 58, 61], true, clearPath);

        if (me.area === 61) {
            if (clearPath) {
                let clearCoords = [
                    {"x": 15041, "y": 14020, "radius": 40},
                    {"x": 15045, "y": 14031, "radius": 40},
                    {"x": 15052, "y": 14033, "radius": 40},
                    {"x": 15061, "y": 14034, "radius": 40},
                    {"x": 15067, "y": 14043, "radius": 40},
                    {"x": 15069, "y": 14053, "radius": 40},
                    {"x": 15068, "y": 14064, "radius": 40},
                    {"x": 15059, "y": 14069, "radius": 40},
                    {"x": 15049, "y": 14071, "radius": 40},
                    {"x": 15051, "y": 14061, "radius": 40},
                    {"x": 15046, "y": 14055, "radius": 40}
                ];

                Skill.usePvpRange = true;

                Attack.clearCoordList(clearCoords);
            }

            if (!Quest.getItem(521, 149) || !Town.goToTown()) {
                return false;
            }

            Quest.stashItem(521);
            Quest.talkTo("drognan", "drognan");
        }
    }

    return me.getItem(521);
}
