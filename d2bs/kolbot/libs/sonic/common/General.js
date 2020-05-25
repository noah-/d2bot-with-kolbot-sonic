/**
 *    @filename   General.js
 *    @desc       general functions for sonic
 */

const General = (function() {
    return {
        // update configs on game join
        initConfig: function() {
            Pather.teleport = me.charlvl >= 24;

            if (me.getSkill(39, 0) >= 1) {
                Config.AttackSkill[1] = 59; // Primary skill to bosses.
                Config.AttackSkill[2] = 45; // Primary untimed skill to bosses. Keep at -1 if Config.AttackSkill[1] is untimed skill.
                Config.AttackSkill[3] = 59; // Primary skill to others.
                Config.AttackSkill[4] = 55; // Primary untimed skill to others. Keep at -1 if Config.AttackSkill[3] is untimed skill.
            }

            if (!me.normal || (!me.classic && Pather.accessToAct(5))) {
                Config.Dodge = true;
                Config.DodgeRange = 15;
                Config.DodgeHP = 100;
            }

            if (me.hell && Pather.accessToAct(4)) {
                Config.MPBuffer = 2;
                Config.HPBuffer = 0;

                Config.Gamble = true;
                Config.GambleGoldStart = 2000000;
                Config.GambleGoldStop = 900000;
            }

            if (!me.classic) {
                Config.UseMerc = me.normal ? (Packet.checkQuest(2, 0) || Pather.accessToAct(2)) : true;
                Config.MercWatch = false;

                if (!me.hell) {
                    Config.TeleStomp = true;
                }
            }

            return true;
        },
        timeToFarm: function() {
            return Pather.accessToAct(me.normal ? 4 : 2);
        },
        goToNextDifficulty: function() {
            return Sequences.nextDifficulty[me.gametype][me.diff].every(r => eval(r));
        },
        shouldClearPath: function(sequence) {
            switch (sequence) {
                case "den":
                case "raven":
                    return me.normal;
                case "trist":
                    return (me.nightmare && me.charlvl < 33) || (me.normal && me.charlvl < 7);
                case "cave":
                case "tree":
                case "countess":
                case "andariel":
                case "radament":
                case "cube":
                case "amulet":
                    return (me.nightmare && me.charlvl < 36) || me.normal;
                case "summoner":
                case "duriel":
                    return (me.nightmare && me.charlvl < 38) || me.normal;
                case "shaft":
                    return me.normal;
                case "eye":
                case "brain":
                case "heart":
                    return me.nightmare && me.classic; // get levels
                default:
                    return false;
            }
        },
        // also xfers items to new merc
        // force rehire of merc even if type matches
        hireMerc: function(act, type, force, minLevel=2) {
            if (this.checkMercType(type) && !force) {
                return true;
            }

            const pAct = me.act;

            if (!Town.goToTown(act)) {
                if (me.act != pAct) {
                    Town.goToTown(pAct);
                }

                return false;
            }

	    addEventListener("gamepacket", mercPacket);

            Town.move(Town.tasks[me.act - 1]["Merc"]);
            Item.removeItemsMerc();

            Town.initNPC("Merc", "newMerc");

            for (let merc of Mercs) {
                for (let skill of merc.skills) {
                    if (skill.name == type && merc.level >= minLevel && merc.cost <= me.gold) {
                        merc.hire();
                    }
                }
            }

            removeEventListener("gamepacket", mercPacket);

            Item.autoEquipMerc();

            let list = [];
            let groundItem = getUnit(4);

            if (groundItem) {
                do {
                    list.push(copyUnit(groundItem));
                } while (groundItem.getNext())
            }

            let itemLoc;
            let cursorItem;

            list.filter(item => item.mode == (3 || 5))
                .forEach(function(i) {
                    for (let j = 0; j < 5; j += 1) {
                        if (getDistance(me, i) > 3) {
                            Pather.moveToUnit(i);
                        }

                        sendPacket(1, 0x16, 4, i.type, 4, i.gid, 4, 0x01);
                        delay(me.ping * 2 + 500);

                        cursorItem = getUnit(100);
                        itemLoc = Item.getBodyLoc(cursorItem)[0];

                        if (cursorItem){
                            if (Item.canEquipMerc(cursorItem, itemLoc)) {
                                Item.equipMerc(cursorItem, itemLoc);
                            } else {
                                Packet.dropItem(cursorItem);
                            }

                            break;
                        }
                    }
                });

            if (me.act != pAct) {
                Town.goToTown(pAct);
            }

            return true;
        },
        checkMercType: function(type) {
            const mercSkills = {
                "Cold Arrow": 11,
                "Prayer": 99,
                "Defiance": 104,
                "Holy Freeze": 114
            };

            if (!mercSkills.hasOwnProperty(type)) {
                return false;
            }

            if (!me.getMerc()) {
                Town.reviveMerc();
            }

            let merc = me.getMerc();

            return merc && merc.getSkill(mercSkills[type], 0);
        },
        runSequence: function(sequence, farm) {
            return sequence.every(function(s) {
                if (!isIncluded("sonic/sequences/" + s + ".js")) {
                    include("sonic/sequences/" + s + ".js");
                }

                let { respecLevel } = Account.get();

                // only need to respec once - in normal - fireball is better for trav
                if (!me.getQuest(41, 0) && ((me.charlvl >= respecLevel) && me.normal && me.getQuest(18, 0))) {
                    Quest.respec();
                }

                this.initConfig();

                Town.doChores();

                if (!me.classic && Pather.accessToAct(2)) {
                    if (me.normal) {
                        this.hireMerc(2, "Prayer");

                        // make sure our merc can get levels
                        if (Pather.accessToAct(5)) {
                            let merc = me.getMerc();

                            if (merc && merc.charlvl < 25 && me.charlvl >= 28) {
                                this.hireMerc(2, "Prayer", true, 25);
                            }
                        }
                    }

                    if (me.nightmare) {
                        this.hireMerc(2, "Holy Freeze");
                    }
                }

                return global[s](farm, this.shouldClearPath(s));
            }, this);
        }
    }
}());
