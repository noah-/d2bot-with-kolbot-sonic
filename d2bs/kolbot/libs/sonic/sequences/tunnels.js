/**
 *    @filename   tunnels.js
 *    @desc       clear ancient tunnels in lost city
 */

function tunnels() {
    Config.TeleStomp = false;

    me.overhead("starting tunnels");

    if (!Pather.checkWP(44)) {
        Pather.getWP(44);
    } else {
        Pather.useWaypoint(44);
    }

    Precast.doPrecast(true);

    //if (!Pather.moveToExit(65, true)) {
    if (!Pather.journeyTo(65, false)) {
        return true;
    }

    Attack.clearLevel();

    // Super chest
    Pather.moveToPreset(me.area, 2, 397);
    Misc.openChest(getUnit(2, 397));
    Pickit.pickItems();

    return true;
}
