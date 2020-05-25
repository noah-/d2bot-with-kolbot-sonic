/**
 *    @filename   lamessen.js
 *    @desc       complete lamessen
 */

function lamessen() {
    if (Packet.checkQuest(17, 0)) {
        return true;
    }

	print("starting lam essen");

	Town.doChores();

	var stand, book, alkor;

	if (!Pather.checkWP(80)) {
		Pather.getWP(80);
	} else {
		Pather.useWaypoint(80);
	}

	Precast.doPrecast(true);

	if (!Pather.moveToExit(94, true) || !Pather.moveToPreset(me.area, 2, 193)) {
		throw new Error();
	}

	stand = getUnit(2, 193);

	Misc.openChest(stand);
	delay(300);

	book = getUnit(4, 548);

	Pickit.pickItem(book);
	Town.goToTown();
	Town.move(NPC.Alkor);

	alkor = getUnit(1, NPC.Alkor);

	alkor.openMenu();
	me.cancel();

	return true;
}
