/**
 *    @filename   heart.js
 *    @desc       get the heart from act 3 sewers
 */

function heart(farm, clearPath) {
    // got the heart, got the flail, flail complete
    if (me.getItem(554) || me.getItem(174) || me.getQuest(18,0)) {
        return true;
    }

    me.overhead("starting heart");

    if (!Pather.checkWP(80)) {
        Pather.getWP(80, clearPath);
    } else {
        Pather.useWaypoint(80);
    }

    //Pather.journeyTo(92, clearPath);
    //Pather.moveToExit(93, true);
    Pather.journeyTo(93, clearPath);
	
	Pather.moveToPreset(me.area, 2, 405, 0, 0, false);

    if (Quest.getItem(554, 405)) {
        Quest.stashItem(554);
    }

    return me.getItem(554);
}
