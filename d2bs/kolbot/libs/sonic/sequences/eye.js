/**
 *    @filename   eye.js
 *    @desc       get the eye from spider lair
 */

function eye(farm, clearPath) {
    // got the eye, got the flail, flail complete
    if (me.getItem(553) || me.getItem(174) || Packet.checkQuest(18, 0)) {
        return true;
    }

    me.overhead("starting eye");

    Pather.journeyTo(85, clearPath);
    Pather.moveToPreset(85, 2, 407, 0, 0, clearPath);

    if (Quest.getItem(553, 407)) {
        Quest.stashItem(553);
    }

    return me.getItem(553);
}
