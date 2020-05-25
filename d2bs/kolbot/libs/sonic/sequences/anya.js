/**
 *    @filename   anya.js
 *    @desc       rescue anya
 */

function anya(farm, clearPath) {
    if (Packet.checkQuest(37, 1)) {
        if (me.act != 5) {
			Town.goToTown(5);
        }

        Town.move("anya");
        Quest.talkTo("anya", "anya");
    }

    if (!Packet.checkQuest(37, 0) && farm) {
        return false;
    }

    if (Packet.checkQuest(37, 0) && !farm) {
        return true;
    }

    // custom function so we dont get multiple scrolls
    let receiveScroll = function() {
        let malah = getUnit(1, "malah");
		let timeout = getTickCount() + 10000;

        while (!malah && timeout < getTickCount()) {
            Town.move(portalspot);
            Packet.flash(me.gid);
            delay(me.ping * 2);

            malah = getUnit(1, "malah");
        }

        if (malah) {
			let timeout = getTickCount() + 10000;

            while (!me.getItem(646) && timeout < getTickCount()) {
                sendPacket(1, 0x31, 4, malah.gid, 4, 20132);
                delay((me.ping * 2) + 500);
            }
			
			if (!me.getItem(646)) {
				throw new Error("Unable to get item 646 at Malah");
			}

            return true;
        } else {
			throw new Error("Unable to find Malah");
		}

        return false;
    };

    me.overhead("starting anya");

    if (!Pather.checkWP(113)) {
        Pather.getWP(113, clearPath);
    } else {
        Pather.useWaypoint(113);
    }

    Pather.moveToExit(114, true, clearPath);
    Pather.moveToPreset(me.area, 2, 460, 0, 0, clearPath);

    let anya = getUnit(2, 558);

    if (anya) {
        Pather.moveToUnit(anya);
        sendPacket(1, 0x13, 4, 0x2, 4, anya.gid); // Rusher should be able to interact so quester can get the potion without entering
        delay(1000 + me.ping);
        me.cancel();
    }

    Town.goToTown();
    Quest.talkTo("malah", "malah");
    Pather.usePortal(114, me.name);

    anya = getUnit(2, 558);

    while (!anya.mode) {
        sendPacket(1, 0x13, 4, 0x2, 4, anya.gid);
        delay(me.ping);
    }

    Town.goToTown();
    receiveScroll();
    Quest.talkTo("anya", "anya");

    return true;
}
