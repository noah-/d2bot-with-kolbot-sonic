/**
 *    @filename   baal.js
 *    @desc       kill baal
 */


// TODO sort clear list to kill c/i monsters in throne first
function baal(farm, clearPath) {
    if (!Packet.checkQuest(40, 0) && farm) {
        return false;
    }

    if (General.goToNextDifficulty()) {
        Account.update("difficulty", Misc.difficultyString[me.diff + 1]);
        return false;
    }

    if (Packet.checkQuest(40, 0) && !farm) {
        return true;
    }

    let clearThrone = function () {
        let pos = [
            { x: 15097, y: 5054 }, { x: 15085, y: 5053 },
            { x: 15085, y: 5040 }, { x: 15098, y: 5040 },
            { x: 15099, y: 5022 }, { x: 15086, y: 5024 }
        ];
        return pos.forEach((node) => {
            Pather.moveTo(node.x, node.y);
            Attack.clear(30);
        })
    };

    let preattack = function () {
        switch (me.classid) {
            case 1:
                if ([56, 59, 64].indexOf(Config.AttackSkill[1]) > -1) {
                    if (me.getState(121)) {
                        delay(50);
                    } else {
                        Skill.cast(Config.AttackSkill[1], 0, 15093, 5024);
                    }
                }

                return true;
            case 3: // Paladin
                if (Config.AttackSkill[3] !== 112) {
                    return false;
                }

                if (getDistance(me, 15093, 5029) > 3) {
                    Pather.moveTo(15093, 5029);
                }

                if (Config.AttackSkill[4] > 0) {
                    Skill.setSkill(Config.AttackSkill[4], 0);
                }

                Skill.cast(Config.AttackSkill[3], 1);

                return true;
            case 5: // Druid
                if (Config.AttackSkill[3] === 245) {
                    Skill.cast(Config.AttackSkill[3], 0, 15093, 5029);

                    return true;
                }

                break;
            case 6:
                if (Config.UseTraps) {
                    let check = ClassAttack.checkTraps({x: 15093, y: 5029});

                    if (check) {
                        ClassAttack.placeTraps({x: 15093, y: 5029}, 5);

                        return true;
                    }
                }

                break;
        }

        return false;
    };

    let checkThrone = function () {
        let monster = getUnit(1);

        if (monster) {
            do {
                if (Attack.checkMonster(monster) && monster.y < 5080) {
                    switch (monster.classid) {
                        case 23:
                        case 62:
                            return 1;
                        case 105:
                        case 381:
                            return 2;
                        case 557:
                            return 3;
                        case 558:
                            return 4;
                        case 571:
                            return 5;
                        default:
                            Attack.getIntoPosition(monster, 10, 0x4);
                            Attack.clear(15);

                            return false;
                    }
                }
            } while (monster.getNext());
        }

        return false;
    };

    let clearWaves = function () {
        let boss;
        let tick = getTickCount();

        MainLoop:
            while (true) {
                if (getDistance(me, 15116, 5026) > 3) {
                    Pather.moveTo(15116, 5026);
                }

                if (!getUnit(1, 543)) {
                    break;
                }

                Misc.townCheck();

                switch (checkThrone()) {
                    case 1:
                        Attack.clearClassids(23, 62);
                        //Attack.clear(40);

                        tick = getTickCount();

                        break;
                    case 2:
                        boss = getUnit(1, "Achmel the Cursed");

                        if (boss && !Attack.canAttack(boss)) {
                            me.overhead("immune achmel");
                            return false;
                        }

                        Attack.clearClassids(105, 381);
                        //Attack.clear(40);

                        tick = getTickCount();

                        break;
                    case 4:
                        Attack.clearClassids(558);
                        //Attack.clear(40);

                        tick = getTickCount();

                        break;
                    case 3:
                        Attack.clearClassids(557);
                        //Attack.clear(40);

                        tick = getTickCount();

                        break;
                    case 5:
                        boss = getUnit(1, "Lister the Tormentor");

                        if (boss && !Attack.canAttack(boss)) {
                            me.overhead("immune lister");
                            return false;
                        }

                        Attack.clearClassids(571);
                        //Attack.clear(40);

                        break MainLoop;
                    default:
                        if (getTickCount() - tick < 7e3) {
                            if (me.getState(2)) {
                                Skill.setSkill(109, 0);
                            }
                        }

                        if (getTickCount() - tick > 20000) {
                            tick = getTickCount();
                            clearThrone();
                        }

                        if (!preattack()) {
                            delay(50);
                        }

                        break;
                }

                delay(10);
            }

        return true;
    };

    let unSafeCheck = function (soulAmount, totalAmount) {
        let soul = getUnit(1, 641);
        let count = 0;

        if (soul) {
            do {
                if (getDistance(me, soul) < 45) {
                    count += 1;
                }
            } while (soul.getNext());
        }

        if (count > soulAmount) {
            return true;
        }

        let monster = getUnit(1);

        if (monster) {
            do {
                if (!monster.getParent() && monster.classid != 641 && getDistance(me, monster) < 45) {
                    count += 1;
                }
            } while (monster.getNext());
        }

        return count > totalAmount;
    };

    me.overhead("starting baal");

    if (!Pather.checkWP(129)) {
        Pather.getWP(129, clearPath);
    } else {
        Pather.useWaypoint(129);
    }

    Precast.doPrecast(true);

    if (!Pather.moveToExit([130, 131], true, clearPath)) {
        return false;
    }

    Pather.moveTo(15095, 5029, 5, clearPath);
    Pather.moveTo(15113, 5040, 5, clearPath);

    // souls hurt
    if (unSafeCheck(8, 20) && me.lightningResist < 70 && me.nightmare) {
        return false;
    }

    Attack.clear(15);
    clearThrone();

    if (!clearWaves()) {
        return false;
    }

    clearThrone(); // double check

    Pather.moveTo(15090, 5008);
    Precast.doPrecast(true);

    while (getUnit(1, 543)) {
        delay(500);
    }

    Pather.usePortal(null, null, getUnit(2, 563));
    Pather.moveTo(15134, 5923);

    const questKill = !Packet.checkQuest(40, 0);

    Config.CastStatic = Attack.getStaticAmount();
    Config.StaticList = ["Baal"];

    Attack.kill(544);
    Pickit.pickItems();

    if (General.goToNextDifficulty()) {
        Account.update("difficulty", Misc.difficultyString[me.diff + 1]);
        return false;
    }

    if (questKill) {
        D2Bot.restart();
    }

    return true;
}
