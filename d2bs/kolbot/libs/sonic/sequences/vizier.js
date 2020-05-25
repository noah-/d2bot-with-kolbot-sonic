/**
 *    @filename   vizier.js
 *    @desc       kill vizier in chaos sanc
 */

function vizier() {
    if (!Pather.accessToAct(4)) {
        return true
    }

    if (me.hell && me.charlvl < 70 && me.fireResist < 85) {
        return true;
    }

    let openSeal = function(id) {
        let seal;
        let tick;

        for (let retry = 0; retry < 5; retry += 1) {
            Pather.moveToPreset(108, 2, id, id === 394 ? 5 : 2, id === 394 ? 5 : 0);

            if (retry > 3) {
                Attack.clear(10);
            }

            seal = getUnit(2, id);
            tick = getTickCount();

            while (getTickCount() - tick < 5000) {
                if (seal) {
                    break;
                }

                delay(50);
            }

            if (!seal) {
                throw new Error('Failed to open seal: ' + id);
            }

            tick = getTickCount();

            while (getTickCount() - tick < 1000) {
                sendPacket(1, 0x13, 4, 0x2, 4, seal.gid);

                if (seal.mode) {
                    return true;
                }

                delay(50);
            }
        }

        return false;
    };

    me.overhead("starting vizier");

    if (!Pather.checkWP(107)) {
        Pather.getWP(107);
    } else {
        Pather.useWaypoint(107);
    }

    Precast.doPrecast(true);

    if (!openSeal(396)) {
        return true;
    }

    let tick = getTickCount();
    let monster;
    let boss;

    while (getTickCount() - tick < 5000) {
        boss = getUnit(1, "Grand Vizier of Chaos");

        if (boss) {
            break;
        }

        monster = Attack.getNearestMonster();

        if (monster) {
            if (getDistance(me, monster) < 5) {
                Skill.cast(44, 0);
            }

            ClassAttack.doAttack(monster);
        } else {
            Skill.cast(Config.AttackSkill[1], 0);
        }

        delay(50);
    }

    try {
        Attack.kill("Grand Vizier of Chaos");
    } catch(e) {}

    Pickit.pickItems();

    return true;
}
