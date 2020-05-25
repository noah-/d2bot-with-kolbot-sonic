/**
 *    @filename   izual.js
 *    @desc       kill izual
 */

function izual(farm, clearPath) {
    if (Packet.checkQuest(25, 1)) {
        if (Town.goToTown(4)) {
            Quest.talkTo("tyrael", "tyrael");
        }
    }

    if (!Packet.checkQuest(25, 0) && (farm || me.lightningResist < 75 && (me.charlvl < 80 && me.hell))) {
        return false;
    }

    if (Packet.checkQuest(25, 0) && !farm) {
        return true;
    }

    // may need a custom function for normal
    // check for other monsters when attacking
    // this function isnt really needed since i added blizzard inbetween static
    let killIzual = function() {
        let attackCount = 0;
        let target = getUnit(1, 256);

        while (attackCount < 600 && Attack.checkMonster(target) && Attack.skipCheck(target)) {
            Misc.townCheck();

            if (!target || !copyUnit(target).x) { // Check if unit got invalidated, happens if necro raises a skeleton from the boss's corpse.
                break;
            }

            if (attackCount > 0 && attackCount % 15 === 0 && Skill.getRange(Config.AttackSkill[1]) < 4) {
                Packet.flash(me.gid);
            }

            if (!ClassAttack.doAttack(target, attackCount % 15 === 0)) {
                break;
            }

            if (Attack.getMonsterCount(me.x, me.y, 15, Attack.buildMonsterList()) > 1) {
                me.overhead("clearing!");
                Attack.clear(15);
            }

            attackCount += 1;
        }

        ClassAttack.afterAttack();

        if (!target || !copyUnit(target).x) {
            return true;
        }

        if (target.hp > 0 && target.mode !== 0 && target.mode !== 12) {
            throw new Error("Failed to kill " + target.name);
        }

        return true;
    };

    me.overhead("starting izual");

    if (clearPath && me.normal) {
        Pather.teleport = false;
    }

    if (!Pather.checkWP(106)) {
        Pather.getWP(106, clearPath);
    } else {
        Pather.useWaypoint(106);
    }

    Pather.moveToPreset(105, 1, 256, 20, 0, clearPath);

    if (!me.hell) {
        Attack.deploy(getUnit(1, 256), 35, 5, 9);
        Attack.clear(30);
        Pather.moveToPreset(105, 1, 256, 20, 0, clearPath);
    }

    try {
        Attack.kill(256);
    } catch (e) {}

    Pickit.pickItems();

    if (!Packet.checkQuest(25, 0)) {
        Town.goToTown();
        Quest.talkTo("tyrael", "tyrael");
    }

    return true;
}
