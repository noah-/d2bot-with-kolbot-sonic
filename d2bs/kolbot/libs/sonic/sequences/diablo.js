/**
 *    @filename   diablo.js
 *    @desc       kill diablo
 */

function diablo(farm) {
    if (General.goToNextDifficulty()) {
        Account.update("difficulty", Misc.difficultyString[me.diff + 1]);
        return false;
    }

    if (!Packet.checkQuest(26, 0) && farm) {
        return false;
    }

    if (Packet.checkQuest(26, 0) && !farm) {
        return true;
    }

    Config.ScanShrines = [];

    const bosses = [
        "Grand Vizier of Chaos",
        "Infector of Souls",
        "Lord De Seis"
    ];

    let getLayout = function (seal, value) {
        let sealPreset = getPresetUnit(108, 2, seal);

        if (!seal) {
            throw new Error("Seal preset not found");
        }

        if (sealPreset.roomy * 5 + sealPreset.y === value || sealPreset.roomx * 5 + sealPreset.x === value) {
            return 1;
        }

        return 2;
    };

    let getSeal = (name) => {
        switch (name) {
            case "Grand Vizier of Chaos":
                return [395, 396];
            case "Lord De Seis":
                return [394];
            case "Infector of Souls":
                return [393, 392];
            default:
                return false;
        }
    };

    // x,y to move to after popping seal to attack from
    let getSealAttackPos = (name) => {
        switch(name) {
            case "Grand Vizier of Chaos":
                if (getLayout(396, 5275) == 1) {
                    return { x: 7680, y: 5276};
                }

                break;
            case "Infector of Souls":
                if (getLayout(392, 7893) == 1) {
                    return { x: 7872, y: 5298};
                }

                break;
        }

        return { x: me.x, y: me.y };
    };

    let openSeal = (id) => {
        let seal;
        let tick;

        for (let retry = 0; retry < 5; retry += 1) {
            Pather.moveToPreset(108, 2, id, id === 394 ? 5 : 2, id === 394 ? 5 : 0);
            Attack.clear(20);

            seal = getUnit(2, id);
            tick = getTickCount();

            while (getTickCount() - tick < 5000) {
                if (seal) {
                    break;
                }

                delay(50);
            }

            if (!seal) {
                throw new Error("Failed to open seal: " + id);
            }

            tick = getTickCount();

            while (getTickCount() - tick < 1000) {
                sendPacket(1, 0x13, 4, 0x2, 4, seal.gid);

                if (seal.mode) {
                    return true;
                }

                delay(100);
            }
        }

        return false;
    };

    let killBoss = (name) => {
        let boss;
        let tick = getTickCount();
        let time = (name == "Diablo" ? 60000 : 5000);

        while (getTickCount() - tick < time) {
            boss = getUnit(1, name);

            if (boss) {
                //preAttack(2);
                break;
            }

            delay(50);
        }

        if (!Attack.canAttack(boss)) {
            Config.TeleStomp = true;
            Attack.clear(20, 0, name);
        }

        return Attack.kill(boss);
    };

    let diabloPrep = () => {
        let tick = getTickCount();

        while (getTickCount() - tick < 30000) {
            if (getTickCount() - tick >= 8000) {
                if ([56, 59, 64].indexOf(Config.AttackSkill[1]) > -1) {
                    if (me.getState(121)) {
                        delay(500);
                    } else {
                        Skill.cast(Config.AttackSkill[1], 0, 7793, 5293);
                    }
                }
            }

            if (getUnit(1, 243)) {
                return true;
            }

            delay(150);
        }

        throw new Error("Diablo not found");
    };

    // use some static coords to improve survivability - kill at a long range
    let getPathTo = (name) => {
        switch (name) {
            case "Grand Vizier of Chaos":
                if (getLayout(396, 5275) == 1) {
                    return [
                        {"x":7778,"y":5290,"radius":40},
                        {"x":7765,"y":5287,"radius":40},
                        {"x":7756,"y":5295,"radius":40},
                        {"x":7742,"y":5295,"radius":40},
                        {"x":7731,"y":5296,"radius":40},
                        {"x":7722,"y":5301,"radius":40},
                        {"x":7702,"y":5296,"radius":40},
                        {"x":7683,"y":5293,"radius":40}
                    ];
                } else {
                    return [
                        {"x":7781,"y":5292,"radius":40},
                        {"x":7771,"y":5288,"radius":40},
                        {"x":7763,"y":5299,"radius":40},
                        {"x":7754,"y":5298,"radius":40},
                        {"x":7743,"y":5295,"radius":40},
                        {"x":7732,"y":5294,"radius":40},
                        {"x":7727,"y":5290,"radius":40},
                        {"x":7726,"y":5315,"radius":40},
                        {"x":7714,"y":5315,"radius":40},
                        {"x":7699,"y":5317,"radius":40},
                        {"x":7688,"y":5317,"radius":40},
                        {"x":7676,"y":5316,"radius":40},
                        {"x":7663,"y":5309,"radius":40},
                        {"x":7655,"y":5296,"radius":40}
                    ];
                }
            case "Infector of Souls":
                if (getLayout(392, 7893) == 1) {
                    return [
                        {"x":7802,"y":5271,"radius":40},
                        {"x":7813,"y":5280,"radius":40},
                        {"x":7820,"y":5293,"radius":40},
                        {"x":7829,"y":5294,"radius":40},
                        {"x":7838,"y":5296,"radius":40},
                        {"x":7846,"y":5282,"radius":40},
                        {"x":7857,"y":5300,"radius":40},
                        {"x":7866,"y":5300,"radius":40},
                        {"x":7879,"y":5299,"radius":40},
                        {"x":7889,"y":5304,"radius":40},
                        {"x":7900,"y":5305,"radius":40},
                        {"x":7910,"y":5301,"radius":40}
                    ];
                } else {
                    return [
                        {"x":7816,"y":5278,"radius":40},
                        {"x":7825,"y":5288,"radius":40},
                        {"x":7834,"y":5294,"radius":40},
                        {"x":7846,"y":5298,"radius":40},
                        {"x":7855,"y":5297,"radius":40},
                        {"x":7863,"y":5289,"radius":40},
                        {"x":7867,"y":5285,"radius":40},
                        {"x":7873,"y":5278,"radius":40},
                        {"x":7884,"y":5278,"radius":40},
                        {"x":7894,"y":5278,"radius":40},
                        {"x":7903,"y":5275,"radius":40},
                        {"x":7910,"y":5276,"radius":40},
                        {"x":7920,"y":5271,"radius":40},
                        {"x":7928,"y":5274,"radius":40},
                        {"x":7937,"y":5279,"radius":40},
                        {"x":7940,"y":5288,"radius":40},
                        {"x":7940,"y":5297,"radius":40},
                        {"x":7940,"y":5307,"radius":40},
                        {"x":7938,"y":5315,"radius":40},
                        {"x":7931,"y":5319,"radius":40},
                        {"x":7923,"y":5321,"radius":40}
                    ];
                }
            case "Lord De Seis":
                if (getLayout(394, 7773) == 1) {
                    return [
                        {"x":7787,"y":5285,"radius":40},
                        {"x":7787,"y":5270,"radius":40},
                        {"x":7789,"y":5259,"radius":40},
                        {"x":7790,"y":5249,"radius":40},
                        {"x":7783,"y":5242,"radius":40},
                        {"x":7770,"y":5235,"radius":40},
                        {"x":7769,"y":5204,"radius":40},
                        {"x":7786,"y":5196,"radius":40},
                        {"x":7808,"y":5200,"radius":40},
                        {"x":7818,"y":5192,"radius":40},
                        {"x":7821,"y":5182,"radius":40},
                        {"x":7819,"y":5156,"radius":40},
                        {"x":7801,"y":5154,"radius":40}
                    ]
                } else {
                    return [
                        {"x":7784,"y":5270,"radius":40},
                        {"x":7787,"y":5257,"radius":40},
                        {"x":7790,"y":5250,"radius":40},
                        {"x":7794,"y":5241,"radius":40},
                        {"x":7803,"y":5230,"radius":40},
                        {"x":7810,"y":5217,"radius":40},
                        {"x":7811,"y":5204,"radius":40},
                        {"x":7797,"y":5201,"radius":40},
                        {"x":7774,"y":5196,"radius":40},
                        {"x":7774,"y":5178,"radius":40},
                        {"x":7777,"y":5160,"radius":40},
                        {"x":7787,"y":5151,"radius":40}
                    ]
                }
            case "Star":
                return [
                    {"x":7795,"y":5553,"radius":40},
                    {"x":7794,"y":5539,"radius":40},
                    {"x":7794,"y":5525,"radius":40},
                    {"x":7795,"y":5511,"radius":40},
                    {"x":7794,"y":5501,"radius":40},
                    {"x":7781,"y":5497,"radius":40},
                    {"x":7767,"y":5490,"radius":40},
                    {"x":7767,"y":5478,"radius":40},
                    {"x":7768,"y":5464,"radius":40},
                    {"x":7768,"y":5452,"radius":40},
                    {"x":7772,"y":5439,"radius":40},
                    {"x":7781,"y":5431,"radius":40},
                    {"x":7788,"y":5423,"radius":40},
                    {"x":7777,"y":5414,"radius":40},
                    {"x":7767,"y":5398,"radius":40},
                    {"x":7767,"y":5388,"radius":40},
                    {"x":7768,"y":5379,"radius":40},
                    {"x":7771,"y":5367,"radius":40},
                    {"x":7770,"y":5360,"radius":40},
                    {"x":7786,"y":5351,"radius":40},
                    {"x":7797,"y":5347,"radius":40},
                    {"x":7794,"y":5331,"radius":40}
                ];
        }

        return [];
    };

    let checkClear = function () {
        let monster = getUnit(1);

        if (monster) {
            do {
                // no mercs
                if (!monster.dead && monster.classid != 243 && !monster.getParent()) {
                    return false;
                }
            } while (monster.getNext());
        }

        return true;
    };

    let runBoss = function(b) {
        let path =  getPathTo(b);

        if (me.nightmare) {
            Config.Dodge = true;
            Config.DodgeRange = 15;
            Config.DodgeHP = 70;
        }

        Attack.clearCoordList(path, 5);

        let seals = getSeal(b);

        seals.every(function(s) {
            return openSeal(s);
        });

        let { x, y } = getSealAttackPos(b);

        Pather.teleportTo(x, y);

        if (b == "Infector of Souls") {
            Pather.teleport = true;
            Config.Dodge = true;
            Config.DodgeRange = 30;
            Config.DodgeHP = 100;
        }

        if (b == "Lord De Seis") {
            Pather.teleport = true;
            Config.Dodge = true;
            Config.DodgeRange = 15;
            Config.DodgeHP = 100;
            Skill.usePvpRange = false; // can be a issue with seis

            if (getLayout(394, 7773) == 1) {
                Pather.moveTo(7809, 5158);
                Pather.moveTo(7811, 5238);
                Pather.moveTo(7793, 5248);
            } else {
                Pather.moveTo(7813, 5182);
                Pather.moveTo(7800, 5198);
            }
        }

        if (killBoss(b)) {
            Attack.clear(50);
            Pickit.pickItems(50);

            Pather.teleport = true;
            Pather.moveTo(7791, 5294);

            if (me.normal) {
                Pather.teleport = false;
            }

            if (b == "Infector of Souls") {
                Config.Dodge = false;
                Config.DodgeRange = 15;
            }

            return true;
        }

        return false;
    };

    // diablo in normal can do lots of damage
    // chicken to town on particular diablo modes
    /*
    modes:
    4, 5 - melee attacks
    7 - fire bolt
    8 - fire ring
    10 - fire blast
     */
    let weakenDiablo = (weakenAmount) => {
        let tick;
        let attackCount = 0;
        let target = getUnit(1, "Diablo");
        let staticRange = Math.floor((me.getSkill(42, 1) + 4) * 2 / 3);

        while (attackCount < 600 && Attack.checkMonster(target)) {
            Misc.townCheck();

            if (!target || !copyUnit(target).x) {
                target = getUnit(1, "Diablo");

                if (!target) {
                    break;
                }
            }

            if (target.hp * 100 / 128 <= weakenAmount) {
                break;
            }

            if (target.mode == 7 || target.mode == 10) {
                tick = getTickCount();

                Town.goToTown();
                Town.doChores();

                while (getTickCount - tick < 3e3) {
                    delay(25);
                }

                Pather.usePortal(108, me.name);
            }

            if (getDistance(me, target) > staticRange || checkCollision(me, target, 0x4)) {
                Attack.getIntoPosition(target, staticRange, 0x4);
            }

            // cast frost nova if dia isn't frozen
            if (!target.getState(11)) {
                Skill.cast(44, 1);
            }

            Skill.cast(42, 0);

            attackCount += 1;
        }

        return true;
    };

    let killDiablo = () => {
        // remove diablo from ignored list for dodging
        Attack.getMonsterCount = function (x, y, range, list) {
            var i,
                fire,
                count = 0,
                ignored = [];

            for (i = 0; i < list.length; i += 1) {
                if (ignored.indexOf(list[i].classid) === -1 && this.checkMonster(list[i]) && getDistance(x, y, list[i].x, list[i].y) <= range) {
                    count += 1;
                }
            }

            fire = getUnit(2, "fire");

            if (fire) {
                do {
                    if (getDistance(x, y, fire.x, fire.y) <= 4) {
                        count += 100;
                    }
                } while (fire.getNext());
            }

            return count;
        };

        let tick;
        let merc;
        let target = getUnit(1, "Diablo");

        Config.AttackSkill[2] = -1;
        Config.TownHP = 0; // race conditions with going to town

        while (Attack.checkMonster(target)) {
            Misc.townCheck();

            me.overhead("Diablo life: " + (target.hp * 100 / 128));

            if (!target || !copyUnit(target).x) {
                target = getUnit(1, "Diablo");

                if (!target) {
                    break;
                }
            }

            merc = me.getMerc();

            if (getDistance(me, target) < 45) {
                Attack.deploy(target, 40, 5, 50);
            }

            if (merc && getDistance(merc, target) < 30) {
                Pather.teleportTo(me.x, me.y, 1);
            }

            if (target.mode == 7 || target.mode == 10) {
                tick = getTickCount();

                Town.doChores();

                while (getTickCount - tick < 3e3) {
                    delay(25);
                }

                Pather.usePortal(108, me.name);
            }

            ClassAttack.doAttack(target, false);
        }

        if (!target || !copyUnit(target).x) {
            return true;
        }

        if (target.hp > 0 && target.mode !== 0 && target.mode !== 12) {
            throw new Error("Failed to kill " + target.name + errorInfo);
        }

        return true;
    };
	
    if (!Pather.checkWP(107)) {
        Pather.getWP(107, false);
    } else {
        Pather.useWaypoint(107);
    }

    Precast.doPrecast(true);

    // move to entrance
    Pather.moveTo(7802, 5569);
    Pather.moveTo(7774, 5305);

    if (me.normal) {
        Pather.teleport = false;
    }

    Config.Dodge = false;
    Config.PickRange = 20;
    Skill.usePvpRange = true;

    Attack.clear(30);

    /*  It's better to move straight to star  */
    // move to star from entrance
    //let entranceToStar = getPathTo("Star");
   //Attack.clearCoordList(entranceToStar, true);

    if (!bosses.every(b => runBoss(b))) {
        return false;
    }

    Pather.teleport = true;
    Pather.moveTo(7792, 5327);

    if (!checkClear()) {
        return false;
    }
	
	const questKill = !Packet.checkQuest(26, 0);

    Skill.usePvpRange = true;
    Config.UseMerc = false;
    Pather.moveTo(7827, 5321);
    diabloPrep();
    killDiablo();

	Pickit.pickItems(50);

    if (General.goToNextDifficulty()) {
        Account.update("difficulty", Misc.difficultyString[me.diff + 1]);
        return false;
    }
	
	if (questKill) {
        if (!me.classic) {
            Town.goToTown();
            Quest.talkTo("tyrael", "tyrael");
            Quest.changeAct(5);
        } else {
            D2Bot.restart();
        }
	}	

    return true;
}
