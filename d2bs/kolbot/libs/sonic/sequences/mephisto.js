/**
 *    @filename   mephisto.js
 *    @desc       travel to durance and kill mephisto
 */

function mephisto(farm) {
    if (!Pather.accessToAct(4) && farm) {
        return false;
    }

    if (Pather.accessToAct(4) && !farm) {
        return true;
    }

    let dodgeKillMephisto = function () {
        var i, angle, angles,
            pos = {},
            attackCount = 0,
            meph = getUnit(1, 242);

        if (!meph) {
            throw new Error("Mephisto not found!");
        }

        while (attackCount < 300 && Attack.checkMonster(meph)) {
            //if (getUnit(3, 276)) {
            if (meph.mode === 5) {
                //if (attackCount % 2 === 0) {
                angle = Math.round(Math.atan2(me.y - meph.y, me.x - meph.x) * 180 / Math.PI);
                angles = me.y > meph.y ? [-30, -60, -90] : [30, 60, 90];

                for (i = 0; i < angles.length; i += 1) {
                    //pos.dist = Math.round(getDistance(me, meph));
                    pos.dist = 18;
                    pos.x = Math.round((Math.cos((angle + angles[i]) * Math.PI / 180)) * pos.dist + meph.x);
                    pos.y = Math.round((Math.sin((angle + angles[i]) * Math.PI / 180)) * pos.dist + meph.y);

                    if (Attack.validSpot(pos.x, pos.y)) {
                        me.overhead("move, bitch!");
                        Pather.moveTo(pos.x, pos.y);

                        break;
                    }
                }
            }

            if (ClassAttack.doAttack(meph) < 2) {
                break;
            }

            attackCount += 1;
        }

        return (meph.mode === 0 || meph.mode === 12);
    };

    let monsterCheck = function() {
        let monster = getUnit(1);

        if (monster) {
            do {
                if (!monster.getParent && monster.classid != 242 && getDistance(me, monster) < 15) {
                    return monster;
                }
            } while (monster.getNext())
        }

        return false;
    };

    let lureMephisto = function() {
        Pather.teleport = false;

        delay(350);
        Pather.moveTo(17567, 8070);

        let mephisto = getUnit(1, 242);

        if (!mephisto) {
            throw new Error("Mephisto not found.");
        }

        delay(350);
        Pather.moveTo(17577, 8074);
        delay(550);
        Pather.moveTo(17584, 8080);
        delay(550);
        Pather.moveTo(17588, 8089);
        delay(550);

        Pather.teleport = true;

        Pather.moveTo(17600, 8089);
        delay(500);
        Pather.moveTo(17610, 8094);
        Attack.clear(10);
        delay(500);
        Pather.moveTo(17610, 8094);

        let distance = getDistance(me, mephisto);
        let count = 0;

        while (distance > 35) {
            count += 1;

            Pather.moveTo(17600, 8095);
            delay(150);
            Pather.moveTo(17584, 8091);
            delay(150);
            Pather.moveTo(17575, 8086);
            delay(150);
            Pather.moveTo(17563, 8072);
            delay(350);
            Pather.moveTo(17575, 8086);
            delay(350);
            Pather.moveTo(17584, 8091);
            delay(1200);
            Pather.moveTo(17600, 8095);
            delay(550);
            Pather.moveTo(17610, 8094);
            delay(2500);
            Attack.clear(10);
            Pather.moveTo(17610, 8094);

            distance = getDistance(me, mephisto);

            if (count >= 5) {
                return false;
            }
        }

        return true;
    };

    let killMephisto = function() {
        let check;
        let moveBack = 0;
        let attackCount = 0;
        let target = getUnit(1, 242);

        Skill.usePvpRange = true;

        let pre = Config.AttackSkill[2];
        Config.AttackSkill[2] = -1;

        while (attackCount < 300 && Attack.checkMonster(target) && Attack.skipCheck(target)) {
            Misc.townCheck();

            if (!target || !copyUnit(target).x) { // Check if unit got invalidated, happens if necro raises a skeleton from the boss's corpse.
                target = getUnit(1, 242);

                if (!target) {
                    break;
                }
            }

            check = monsterCheck();

            if (check) {
                if (me.hell && !Attack.canAttack(check) && !me.classic) {
                    return false;
                }
            }

            Attack.clear(15);

            // Stay in position - this function is used for moat trick
            if (getDistance(me, 17610, 8094) > 5) {
                Pather.moveTo(17610, 8094);
                moveBack += 1;
            }

            if (attackCount > 0 && attackCount % 15 === 0 && Skill.getRange(Config.AttackSkill[1]) < 4) {
                Packet.flash(me.gid);
            }

            if (moveBack > 3) {
                break;
            }

            if (!ClassAttack.doAttack(target, attackCount % 15 === 0)) {
                break;
            }

            attackCount += 1;
        }

        Skill.usePvpRange = false;
        Config.AttackSkill[2] = pre;

        ClassAttack.afterAttack();

        if (!target || !copyUnit(target).x) {
            return true;
        }

        return target.hp > 0 && target.mode !== 0 && target.mode !== 12;
    };

    me.overhead("starting mephisto");

    if (!Pather.checkWP(101)) {
        Pather.getWP(101, false);
    } else {
        Pather.useWaypoint(101);
    }

    Precast.doPrecast();
    Pather.moveToExit(102, true);
    Pather.moveTo(17566, 8069);
    delay(350);

    Config.UseMerc = false;

    if (me.charlvl >= 80 || (!lureMephisto() || !killMephisto())) {
        Attack.kill(242);
    }

    /*
    try {
        lureMephisto();
        killMephisto();
    } catch (e) {
        Attack.kill(242);
    }*/

    Pickit.pickItems();
    Pather.moveTo(17590, 8068);
    delay(1500);
    Pather.moveTo(17601, 8070);
    Pather.usePortal(null);

    return me.act == 4;
}
