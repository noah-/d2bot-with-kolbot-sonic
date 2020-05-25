/**
 *    @filename   den.js
 *    @desc       clear den and complete quest
 */

function den(farm, clearPath) {
    if (Packet.checkQuest(1, 1)) {
        Packet.entityAction("akara", "akara", 76);
    }

    if (Packet.checkQuest(1, 0)) {
        return true;
    }

    me.overhead("starting den");

    if (!Pather.moveToExit([2, 8], true, clearPath)) {
        return false;
    }

    for (let i = 0; i < 3; i += 1) {
        if (me.area == 8) {
            Attack.clearLevel();

            if (Packet.checkQuest(1, 1) || Packet.checkQuest(1, 0)) {
                try {
                    Town.goToTown();
                } catch (e) {
                    Pather.moveToExit([2, 1], true, clearPath);
                }

                if (me.area == 1) {
                    Quest.talkTo("akara", "akara");
                }

                return true;
            }
        }
    }

    return false;
}
