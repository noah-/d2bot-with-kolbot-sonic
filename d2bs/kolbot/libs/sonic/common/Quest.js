/**
 *    @filename   Quest.js
 *    @desc       quest related helper functions
 */

const Quest = (function() {
    return {
        useItem: function(classid) {
            let item = me.getItem(classid);

            if (item) {
                if (item.location === 7 && (!Town.goToTown() || !Town.openStash())) {
                    return false;
                }

                while (item) {
                    item.interact();
                    delay(100);

                    item = me.getItem(classid);
                }
            }

            return me.getItem(classid);
        },
        getItem: function(classid, chestid) {
            if (me.getItem(classid)) {
                return true;
            }

            let chest = getUnit(2, chestid);

            if (!chest) {
                return false;
            }

            Misc.openChest(chest);

            let item;
            let tick = getTickCount();

            while (getTickCount() - tick < 2000) {
                item = getUnit(4, classid);

                if (item) {
                    break;
                }

                delay(50);
            }

            // main reason for failure can be full invent
            // pickitems func makes room
            if (!Pickit.pickItem(item)) {
                Pickit.pickItems();
            }

            return me.getItem(classid);
        },
        stashItem: function (classid) {
            if (!me.getItem(classid)) {
                return false;
            }

            if (!me.inTown) {
                Town.goToTown();
            }

            let item = me.getItem(classid);

            while (item.location !== 7) {
                Storage.Stash.MoveTo(item);
                delay(me.ping);

                item = me.getItem(classid);
            }

            return true;
        },
        transmuteItems: function (result, ...classids) {
            if (me.getItem(result)) {
                return true;
            }

            if (!me.inTown) {
                Town.goToTown();
            }

            Town.openStash();

            if (me.findItems(-1, -1, 6)) {
                Cubing.emptyCube();
            }

            let item;

            for (let classid of classids) {
                item = me.getItem(classid);

                if (!item || !Storage.Cube.MoveTo(item)) {
                    return false;
                }
            }

            while (!Cubing.openCube()) {
                delay(me.ping * 2);
                Packet.flash(me.gid);
            }

            let success;
            let tick = getTickCount();

            while (getTickCount() - tick < 5000) {
                sendPacket(1, 0x4f, 2, 0x18, 2, 0, 2, 0); // transmute

                delay(me.ping + 50);

                success = me.getItem(result);

                if (success) {
                    Storage.Inventory.MoveTo(success);

                    if (Storage.Stash.CanFit(success)) {
                        Storage.Stash.MoveTo(success);
                    } 

                    break;
                }
            }

            for (let i = 0; i < 15; i += 1) {
                sendPacket(1, 0x4f, 2, 0x17, 2, 0, 2, 0); // close cube
                me.cancel();

                if (!getUIFlag(0x1A)) {
                    break;
                }

                delay(me.ping + 50);
            }

            return me.getItem(result);
        },
        insertStaff: function() {
            let staff = me.getItem(91);

            if (!staff) {
                if (Packet.checkQuest(10, 0)) { // inserted staff already
                    return true;
                }

                return false;
            }

            let orifice = getUnit(2, 152);

            if (!orifice) {
                return false;
            }
			
			if (staff.location === 6) {
				if (Storage.accessCube()) {
					if (Storage.Inventory.MoveTo(staff)) {						
						delay(200 + me.ping);
					}

					me.cancel();
				}
			}
			
			if (staff.location === 7) {
				Town.doChores();

				if (Town.openStash() && Storage.Inventory.CanFit(staff)) {
					Storage.Inventory.MoveTo(staff);
					Pather.usePortal(null, me.name);

					orifice = getUnit(2, 152);
				}				
			}
			
			if (orifice && staff.location == 3 && Misc.openChest(orifice) && Packet.itemToCursor(staff)) {
				submitItem();
				delay(200 + me.ping);
			}

            return !me.getItem(91);
        },
        smashCompellingOrb: function() {
            let flail = me.getItem(174);

            if (!flail) {
                return false;
            }

            if (flail.location == 7 || flail.location == 6) {
                Town.openStash();

                if (flail.location == 6) {
                    while (!Cubing.openCube()) {
                        delay(me.ping * 2);
                        Packet.flash(me.gid);
                    } 
                }
            }

            Item.equip(flail, 4, true);

            if (me.area != 83) {
                if (Pather.getPortal(83, me.name)) {
                    Pather.usePortal(83, me.name);
                } else {
                    Pather.useWaypoint(83);
                }
            }

            Pather.moveToPreset(me.area, 2, 404, 0, 0, false);

            let orb = getUnit(2, 404);

            if (orb) {
                while (me.getItem(174)) {
                    Pather.moveToUnit(orb, 0, 0, false);
                    Skill.cast(0, 0, orb);
                    orb.interact();

                    delay(me.ping + 1);
                }

                Town.goToTown();
                Pickit.pickItems();
                Item.autoEquip();
            }

            return !me.getItem(174);
        },
        respec: function() {
            if (!Packet.checkQuest(1, 0) || !Town.goToTown(1)) {
                return false;
            }

            me.overhead("time to respec");

            // stop autobuild so it doesn't add pre respec build stats
            let script = getScript("libs/sonic/tools/sonicbuild.js");

            if (script && script.running) {
                script.stop();
            }

            let preStats = me.getStat(4);

            while (preStats == me.getStat(4)) {
                Packet.entityAction("akara");
                delay((me.ping * 2) + 1000);
            }

            load("libs/sonic/tools/sonicbuild.js");

            preStats = me.getStat(5);

            // wait until all stats are spent
            for (let i = 0; i < 5; i += 1) {
                if (preStats > me.getStat(5)) {
                    preStats = me.getStat(5);
                    i = 0;
                }

                delay(1000);
            }

            me.overhead("respec complete");

            return true;
        },
		talkTo: function(name, spot, menuItem) {
			var npc = false;
			Town.move(spot);

			for (var i = 0; i < 10; i++) {
				npc = getUnit(1, name);
				
				if (npc) {
					break;
				}
				
				delay(200);
			}
			
			if (!npc || !npc.openMenu()) {
				return false;
			}

			if (menuItem) {
				return Misc.useMenu(menuItem);
			}

			me.cancel();
			return true;
		},
        changeAct: function(act) {
            let npc;
            let loc;

            switch (act) {
                case 2:
                    npc = "warriv";
                    loc = 40;
                    break;
                case 3:
                    npc = "meshif";
                    loc = 75;
                    break;
                case 5:
                    npc = "tyrael";
					loc = 109;
                    break;
            }

            let npcUnit = getUnit(1, npc);
			let timeout = getTickCount() + 3000;

            while (!npcUnit && timeout < getTickCount()) {
                Town.move(npc);
                Packet.flash(me.gid);
                delay(me.ping * 2 + 100);
                npcUnit = getUnit(1, npc);
            }

            if (npcUnit) {
                for (let i = 0; i < 5; i += 1) {
					sendPacket(1, 56, 4, 0, 4, npcUnit.gid, 4, loc);
                    delay(500 + me.ping);

                    if (me.act === act) {
                        break;
                    }
                }
            } else {
				throw new Error('Failed to move to ' + npc);
			}

            return me.act === act;
        }
    }
}());
