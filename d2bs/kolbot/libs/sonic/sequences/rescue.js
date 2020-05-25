function rescue() {
	function value(a, b) {
		return getDistance(me, a) - getDistance(me, b);
	}

	if (me.gametype === 0) {
		return true;
	}
 
	if (me.getQuest(36, 0) || me.getQuest(36, 1)) {
		return true;
	}

	me.overhead("starting rescue");
	Town.doChores();

	if (!Pather.journeyTo(111)) {
		print("Failed to move to Frigid Highlands");
		return false;
	}

	var units = getPresetUnits(111, 2, 473);
	var monsters = [];

	for (var i = 0; i < units.length; i++) {
		monsters[i] = {
			"x" : units[i].roomx * 5 + units[i].x,
			"y" : units[i].roomy * 5 + units[i].y,
			"classid" : 434,
			"type" : 1
		};
	}

	while (monsters.length > 0) {
		monsters.sort(value);
		let loc = monsters.shift();
		Pather.moveTo(loc.x, loc.y);
		let unit = getUnit(loc.type, loc.classid);
		if (unit) {
			while (unit.mode !== 12) {
				ClassAttack.doAttack(unit, false);
				delay(200 + 2 * me.ping);
			}
		} else {
			print("Failed to move to Frigid Highlands");
			return false;
		}
		delay(3000);
	}

	Town.goToTown(5);
	Town.move(NPC["Qual-Kehk"]);
	var npc = getUnit(1, "Qual-Kehk");
	npc.openMenu();
	me.cancel();
	return true;
};