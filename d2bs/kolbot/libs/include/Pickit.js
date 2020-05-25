/**
 *	@filename	Pickit.js
 *	@desc		handle item pickup
 */


// POINTS BASED PICKIT CHANGES
// Returns:
// -1 - Needs iding
// 0 - Unwanted
// 1 - NTIP wants
// 2 - Cubing wants
// 3 - Runeword wants
// 4 - Pickup to sell (triggered when low on gold)
Pickit.checkItem = function (unit) {
    var rval = NTIP.CheckItem(unit, false, true);

    if ((unit.classid === 617 || unit.classid === 618) && Town.repairIngredientCheck(unit)) {
        return {
            result: 6,
            line: null
        };
    }

    if (CraftingSystem.checkItem(unit)) {
        return {
            result: 5,
            line: null
        };
    }

    if (Cubing.checkItem(unit)) {
        return {
            result: 2,
            line: null
        };
    }

    if (Runewords.checkItem(unit)) {
        return {
            result: 3,
            line: null
        };
    }

    // POINTS BASED PICKIT
    if ((NTIP.GetMercTier(unit) > 0 || NTIP.GetTier(unit) > 0) && !unit.getFlag(0x10)) {
        return {
            result: -1,
            line: null
        };
    }

    // POINTS BASED PICKIT
    if ((NTIP.GetMercTier(unit) > 0 || NTIP.GetTier(unit) > 0) && unit.getFlag(0x10)) {
        if (Item.autoEquipCheck(unit)) {
            //print("Char need: " + unit.name);
            return {
                result: 1,
                line: "Equip char tier: " + NTIP.GetTier(unit)
            };
        }

        if (Item.autoEquipCheckMerc(unit)) {
            //print("Merc need: " + unit.name);
            return {
                result: 1,
                line: "Equip merc tier: " + NTIP.GetMercTier(unit)
            };
        }
        //print("Ã¿c4Checking " + Pickit.itemColor(unit) + unit.name + " Ã¿c0 vs no Tier pickit.");
        return NTIP.CheckItem(unit, NTIP_CheckListNoTier, true);
    }

    // only pick all gold piles if really low on gold
    if (rval.result === 0 && Town.ignoredItemTypes.indexOf(unit.itemType) === -1 && unit.itemType !== 39 && me.gold < Config.LowGold) {
        // Gold doesn't take up room, just pick it up
        if (unit.classid === 523 && (me.gold < Config.LowGold / 4)) {
            return {
                result: 4,
                line: null
            };
        }

        if ((unit.getItemCost(1) / (unit.sizex * unit.sizey) >= 10)) {
            return {
                result: 4,
                line: null
            };
        }
    }

    return rval;
};

// Pick scrolls if under level 7 without a tomb
Pickit.canPick = function (unit) {
    var tome, charm, i, potion, needPots, buffers, pottype, myKey, key;

    switch (unit.classid) {
    case 92: // Staff of Kings
    case 173: // Khalim's Flail
    case 521: // Viper Amulet
    case 546: // Jade Figurine
    case 549: // Cube
    case 551: // Mephisto's Soulstone
    case 552: // Book of Skill
    case 553: // Khalim's Eye
    case 554: // Khalim's Heart
    case 555: // Khalim's Brain
        if (me.getItem(unit.classid)) {
            return false;
        }

        break;
    }

    switch (unit.itemType) {
    case 4: // Gold
        if (me.getStat(14) === me.getStat(12) * 10000) { // Check current gold vs max capacity (cLvl*10000)
            return false; // Skip gold if full
        }

        break;
    case 22: // Scroll
        tome = me.getItem(unit.classid - 11, 0); // 518 - Tome of Town Portal or 519 - Tome of Identify, mode 0 - inventory/stash

        if (tome) {
            do {
                if (tome.location === 3 && tome.getStat(70) === 20) { // In inventory, contains 20 scrolls
                    return false; // Skip a scroll if its tome is full
                }
            } while (tome.getNext());
        } else if (me.charlvl > 7) {
            return false; // Don't pick scrolls if there's no tome
        }

        break;
    case 41: // Key (new 26.1.2013)
        if (me.classid === 6) { // Assassins don't ever need keys
            return false;
        }

        myKey = me.getItem(543, 0);
        key = getUnit(4, -1, -1, unit.gid); // Passed argument isn't an actual unit, we need to get it

        if (myKey && key) {
            do {
                if (myKey.location === 3 && myKey.getStat(70) + key.getStat(70) > 12) {
                    return false;
                }
            } while (myKey.getNext());
        }

        break;
    case 82: // Small Charm
    case 83: // Large Charm
    case 84: // Grand Charm
        if (unit.quality === 7) { // Unique
            charm = me.getItem(unit.classid, 0);

            if (charm) {
                do {
                    if (charm.quality === 7) {
                        return false; // Skip Gheed's Fortune, Hellfire Torch or Annihilus if we already have one
                    }
                } while (charm.getNext());
            }
        }

        break;
    case 76: // Healing Potion
    case 77: // Mana Potion
    case 78: // Rejuvenation Potion
        needPots = 0;

        for (i = 0; i < 4; i += 1) {
            if (typeof unit.code === "string" && unit.code.indexOf(Config.BeltColumn[i]) > -1) {
                needPots += Pickit.beltSize;
            }
        }

        potion = me.getItem(-1, 2);

        if (potion) {
            do {
                if (potion.itemType === unit.itemType) {
                    needPots -= 1;
                }
            } while (potion.getNext());
        }

        if (needPots < 1 && Pickit.checkBelt()) {
            buffers = ["HPBuffer", "MPBuffer", "RejuvBuffer"];

            for (i = 0; i < buffers.length; i += 1) {
                if (Config[buffers[i]]) {
                    switch (buffers[i]) {
                    case "HPBuffer":
                        pottype = 76;

                        break;
                    case "MPBuffer":
                        pottype = 77;

                        break;
                    case "RejuvBuffer":
                        pottype = 78;

                        break;
                    }

                    if (unit.itemType === pottype) {
                        if (!Storage.Inventory.CanFit(unit)) {
                            return false;
                        }

                        needPots = Config[buffers[i]];
                        potion = me.getItem(-1, 0);

                        if (potion) {
                            do {
                                if (potion.itemType === pottype && potion.location === 3) {
                                    needPots -= 1;
                                }
                            } while (potion.getNext());
                        }
                    }
                }
            }
        }

        if (needPots < 1) {
            potion = me.getItem();

            if (potion) {
                do {
                    if (potion.itemType === unit.itemType && ((potion.mode === 0 && potion.location === 3) || potion.mode === 2)) {
                        if (potion.classid < unit.classid) {
                            potion.interact();
                            needPots += 1;

                            break;
                        }
                    }
                } while (potion.getNext());
            }
        }

        if (needPots < 1) {
            return false;
        }

        break;
    case undefined: // Yes, it does happen
        print("undefined item (!?)");

        return false;
    }

    return true;
};

// Add range parameter
Pickit.pickItems = function (range=Config.PickRange) {
    var status, item, canFit,
        needMule = false,
        pickList = [];

    Town.clearBelt();

    if (me.dead) {
        return false;
    }

    while (!me.idle) {
        delay(40);
    }

    item = getUnit(4);

    if (item) {
        do {
            if ((item.mode === 3 || item.mode === 5) && getDistance(me, item) <= range) {
                pickList.push(copyUnit(item));
            }
        } while (item.getNext());
    }

    while (pickList.length > 0) {
        if (me.dead) {
            return false;
        }

        pickList.sort(Pickit.sortItems);

        // Check if the item unit is still valid and if it's on ground or being dropped
        if (copyUnit(pickList[0]).x !== undefined && (pickList[0].mode === 3 || pickList[0].mode === 5) &&
            (Pather.useTeleport || me.inTown || !checkCollision(me, pickList[0], 0x1))) { // Don't pick items behind walls/obstacles when walking
            // Check if the item should be picked
            status = Pickit.checkItem(pickList[0]);

            //  && Item.autoEquipCheck(pickList[0]) pbp

            if (status.result && Pickit.canPick(pickList[0])) {
                // Override canFit for scrolls, potions and gold
                canFit = Storage.Inventory.CanFit(pickList[0]) || [4, 22, 76, 77, 78].indexOf(pickList[0].itemType) > -1;

                // Try to make room with FieldID
                if (!canFit && Config.FieldID && Town.fieldID()) {
                    canFit = Storage.Inventory.CanFit(pickList[0]) || [4, 22, 76, 77, 78].indexOf(pickList[0].itemType) > -1;
                }

                // Try to make room by selling items in town
                if (!canFit) {
                    // Check if any of the current inventory items can be stashed or need to be identified and eventually sold to make room
                    if (Pickit.canMakeRoom()) {
                        print("\xFFc7Trying to make room for " + Pickit.itemColor(pickList[0]) + pickList[0].name);

                        // Go to town and do town chores
                        if (Town.visitTown()) {
                            // Recursive check after going to town. We need to remake item list because gids can change.
                            // Called only if room can be made so it shouldn't error out or block anything.

                            return Pickit.pickItems();
                        }

                        // Town visit failed - abort
                        print("\xFFc7Not enough room for " + Pickit.itemColor(pickList[0]) + pickList[0].name);

                        return false;
                    }

                    // Can't make room - trigger automule
                    Misc.itemLogger("No room for", pickList[0]);
                    print("\xFFc7Not enough room for " + Pickit.itemColor(pickList[0]) + pickList[0].name);

                    needMule = true;
                }

                // Item can fit - pick it up
                if (canFit) {
                    Pickit.pickItem(pickList[0], status.result, status.line);
                }
            }
        }

        pickList.shift();
    }

    // Quit current game and transfer the items to mule
    if (needMule && AutoMule.getInfo() && AutoMule.getInfo().hasOwnProperty("muleInfo") && AutoMule.getMuleItems().length > 0) {
        scriptBroadcast("mule");
        scriptBroadcast("quit");
    }

    return true;
};
