/**
 *    @filename   duriel.js
 *    @desc       kill duriel
 */

function duriel(farm, clearPath) {
    let killDuriel = function () {
        Pather.teleport = true;

        var i, target;

        for (i = 0; i < 3; i += 1) {
            target = getUnit(1, 211);

            if (target) {
                break;
            }

            delay(500);
        }

        if (!target) {
            throw new Error("Duriel not found.");
        }

        for (i = 0; i < 900; i += 1) {
            Misc.townCheck();
            ClassAttack.doCast(target, Config.AttackSkill[1], Config.AttackSkill[2]);

            if (target.dead) {
                return true;
            }

            if (getDistance(me, target) <= 10) {
                Pather.moveTo(22638, me.y < target.y ? 15722 : 15693);
            }
        }

        return target.dead;
    };

    if (!Packet.checkQuest(14, 0) && farm) {
        return false;
    }

    if (Packet.checkQuest(14, 0) && !farm) {
        return true;
    }
	
	// staff not inserted and don't have full staff
    if (!Packet.checkQuest(10, 0) && !me.getItem(91)) {
        if (!Quest.transmuteItems(91, 92, 521)) {
            return false;
        }
    }

    // duriel dead - need to talk to jerhyn
    if (Packet.checkQuest(14, 3)) {
        Quest.talkTo("jerhyn", "jerhyn");
    }

    // duriel dead - talked to jerhyn - need to talk to meshif
    if (Packet.checkQuest(14, 4)) {
        Quest.talkTo("meshif", "meshif");

        return Quest.changeAct(3);
    }

    // need teleport to skip duriel
    if (me.charlvl < 18) {
        return true;
    }

    me.overhead("starting duriel");

    Pather.useWaypoint(46);

    let durielTomb = getRoom().correcttomb;

    if (!Pather.moveToExit(durielTomb, true, clearPath)) {
        throw new Error("Failed to move to duriels tomb");
    }

    if (me.area === durielTomb) {
        Pather.moveToPreset(me.area, 2, 152, 0, 0, clearPath);

        if (!farm) {
            Attack.clear(20);
            Pather.moveToPreset(me.area, 2, 152);

            if (Quest.insertStaff()) {
                if (!getUnit(2, 100)) {
                    if (Town.goToTown()) {
                        let tick = getTickCount();

                        Town.doChores();

                        while (getTickCount() - tick < 15e3) { // wait in town for 15 sec until chamber opens
                            delay(500);
                        }
                    }
                }
            }
        }

        if (me.area != durielTomb) {
            Pather.usePortal(durielTomb, me.name);
        }

        for (let i = 0; i < 20; i += 1) {
            if (getUnit(2, 100)) {
                break
            }

            delay(200);
        }

        let chamber = getUnit(2, 100);

        if (chamber) {
            for (let i = 0; i < 5; i += 1) {
                if (me.area == chamber.area) {
                    Skill.cast(43, 0, chamber);
                }

                if (me.area === 73) {
                    break;
                }
            }
        }
		
        if (me.area !== 73 && !Pather.useUnit(2, 100, 73)) {
            Attack.clear(10);
            Pather.useUnit(2, 100, 73);
        }

        if (me.area === 73) {
            Pather.teleport = true;

            if (!farm) {
                killDuriel();
                Pickit.pickItems();
                Pather.moveTo(22627, 15713);
                Pather.moveTo(22609, 15706); // skip duriel

                /*
                delay(200);

                for (let i = 0; i < 3; i += 1) {
                    if (me.x <= 22608) { // success
                        me.overhead("!Can't touch this");

                        break;
                    } else { //retry
                        Pather.moveTo(22648, 15720);
                        delay(1000);

                        Pather.moveTo(22627, 15713);
                        Pather.moveTo(22609, 15706);
                    }
                }*/

                Pather.moveTo(22579, 15706);
                Pather.moveTo(22577, 15649);
                Pather.moveTo(22574, 15622);
                Pather.moveTo(22576, 15599);

                RetryLoop:
                for (let i = 0; i < 3; i += 1) {
                    const npc = getUnit(1, getLocaleString(1013)); // Tyrael

                    if (npc) {
                        for(let j = 0; j < 5; j += 1) {
                            Pather.moveTo(npc.x, npc.y);
                            npc.interact();
                            delay(1000);

                            if (Pather.getPortal(null))	{
                                break RetryLoop;
                            }
                        }

                        break;
                    }

                    delay(500);
                }

                if (me.area === 73 && Pather.getPortal(null)) {
                    Pather.usePortal(null);
                }

                if (!me.inTown) {
                    Town.goToTown();
                }

                if (me.inTown) {
                    if (!Quest.talkTo("jerhyn", "palace")) {
                        throw new Error("failed to talk to jerhyn");
                    }

                    if (!Quest.talkTo("meshif", "meshif")) {
                        throw new Error("failed to talk to meshif");
                    }

                    if (!Quest.changeAct(3)) {
                        throw new Error("failed to move to act 3");
                    }
                }
            } else {
                killDuriel();
                Pickit.pickItems();
            }
        }
    }

    return Pather.accessToAct(3);
}
