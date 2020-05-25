/**
 *    @filename   Sonic.js
 *    @desc       ingame script for sonic
 */

function Sonic() {
    if (General.timeToFarm()) {
        General.runSequence(Sequences.magicfind[me.gametype][me.diff], true);
    }

    return General.runSequence(Sequences.quest[me.gametype][me.diff]);
}
