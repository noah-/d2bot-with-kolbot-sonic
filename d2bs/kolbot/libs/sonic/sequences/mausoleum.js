/**
*	@filename	Mausoleum.js
*	@author		kolton
*	@desc		clear Mausoleum
*/

function Mausoleum() {
	Town.doChores();
	Pather.useWaypoint(3);
	Precast.doPrecast(true);

	if (!Pather.moveToExit(17, true)) {
		throw new Error("Failed to move to Burial Grounds");
	}

	Pather.moveToPreset(17, 1, 805);
	Attack.kill(getLocaleString(3111)); // Blood Raven
	Pickit.pickItems();

	if (!Pather.moveToExit(19, true)) {
		return false;
	}

	Attack.clearLevel(Config.ClearType);

	// Crypt exit is... awkward
	if (!(Pather.moveToExit(17, true) && Pather.moveToPreset(17, 5, 6) && Pather.moveToExit(18, true))) {
		return false;
	}

	Attack.clearLevel(Config.ClearType);
	return true;
}