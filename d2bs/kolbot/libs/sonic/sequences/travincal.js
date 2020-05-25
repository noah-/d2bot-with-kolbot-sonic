/**
 *    @filename   travincal.js
 *    @desc       defeat council member, make flail, smash orb
 */

function travincal() {
    if (Packet.checkQuest(18, 0)) {
        return true;
    }

    me.overhead("starting travincal");

    if (!me.getItem(174) && !me.getItem(173)) {
        if (!Pather.checkWP(83)) {
            Pather.getWP(83, false);
        } else {
            Pather.useWaypoint(83);
        }

        let attackPos = {
            x: me.x + 76,
            y: me.y - 67
        };

        Pather.moveToUnit(attackPos);

        if (me.hell && !me.classic) {
            let member = getUnit(1, "Ismail Vilehand");

            if (member && !Attack.canAttack(member)) {
                return false;
            }

            Config.UseMerc = false;

            Attack.kill(member);
        } else {
            Attack.clear(30);
        }

        Pickit.pickItems();
        Pather.moveToUnit(attackPos);
        Pickit.pickItems();
    }

    if (!Quest.transmuteItems(174, 553, 554, 555, 173) || !Quest.smashCompellingOrb()) {
        return false;
    }

    if (!me.inTown) {
        Town.goToTown();
    }

    Quest.talkTo("cain", "cain");

    return Packet.checkQuest(18, 0, 2000);
}
