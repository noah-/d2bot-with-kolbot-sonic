/**
 *	@filename	Storage.js
 *	@desc		manage inventory, belt, stash, cube
 */

// Use packets to move item
// have a sorting parameter, location will already be 3 so we bypass that check if sorting
Storage.Inventory.MoveTo = function(item, sorting) {
    if (item.mode === 3) {
        return false;
    }

    if (item.location === 3 && !sorting) {
        return true;
    }

    let spot = Storage.Inventory.FindSpot(item);

    if (!spot) {
        return false;
    }

    if (item.location === 6) {
        while (!Cubing.openCube()) {
            delay(me.ping * 2);
            Packet.flash(me.gid);
        }
    }

    if (Packet.itemToCursor(item)) {
        for (let i = 0; i < 15; i += 1) {
            // 18 [DWORD id] [DWORD xpos] [DWORD ypos] [DWORD buffer]
            sendPacket(1, 0x18, 4, item.gid, 4, spot.y, 4, spot.x, 4, 0x00);

            let tick = getTickCount();

            while (getTickCount() - tick < Math.max(1000, me.ping * 2 + 200)) {
                if (!me.itemoncursor) {
                    return true;
                }

                delay(10);
            }
        }
    }

    return false;
};

// Use packets to move item
Storage.Stash.MoveTo = function(item) {
    if (item.mode === 3) {
        return false;
    }

    if (item.location === 7) {
        return true;
    }

    let spot = Storage.Stash.FindSpot(item);

    if (!spot) {
        return false;
    }

    while (!Town.openStash()) {
        Packet.flash(me.gid);
        delay(me.ping * 2);
    }

    if (Packet.itemToCursor(item)) {
        for (let i = 0; i < 15; i += 1) {
            // 18 [DWORD id] [DWORD xpos] [DWORD ypos] [DWORD buffer]
            sendPacket(1, 0x18, 4, item.gid, 4, spot.y, 4, spot.x, 4, 0x04);

            let tick = getTickCount();

            while (getTickCount() - tick < Math.max(1000, me.ping * 2 + 200)) {
                if (!me.itemoncursor) {
                    return true;
                }

                delay(10);
            }
        }
    }

    return false;
};
