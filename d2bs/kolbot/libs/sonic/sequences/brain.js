/**
 *    @filename   brain.js
 *    @desc       get the brain from flayer dungeon
 */

function brain(farm, clearPath) {
    // got the brain, got the flail, flail complete
    if (me.getItem(555) || me.getItem(174) || me.getQuest(18,0)) {
        return true;
    }

    me.overhead("starting brain");

    if (!Pather.checkWP(78)) {
        Pather.getWP(78, clearPath);
    } else {
        Pather.useWaypoint(78);
    }

    Pather.moveToExit(88, true, clearPath);

    // don't clear dungeon - too dangerous
    Pather.journeyTo(91);
    Pather.moveToPreset(me.area, 2, 406);

    if (Quest.getItem(555, 406)) {
        Quest.stashItem(555);
    }

    return me.getItem(555);
}
