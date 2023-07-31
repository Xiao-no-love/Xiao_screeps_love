var fun_outharvester = {
    run: function (creep) {
        // 检查 creep 是否已经挖满矿石
        if (creep.store.getFreeCapacity() === 0) {
            // 如果挖满了，返回原房间
            creep.moveTo(Game.spawns['Spawn1'].room.controller);
            creep.upgradeController(Game.spawns['Spawn1'].room.controller);
            return;
        }

        // 获取下面房间的名称
        var bottomRoomName = Game.map.describeExits(Game.spawns['Spawn1'].room.name)[BOTTOM];
        // console.log(bottomRoomName);

        if (bottomRoomName) {
            if (creep.room != Game.spawns['Spawn1'].room) {
                var sources = creep.room.find(FIND_SOURCES_ACTIVE)
                if (sources.length > 0) {
                    var targetPosition = new RoomPosition(creep.pos.x, creep.pos.y, creep.room.name);
                    var target_source = targetPosition.findClosestByPath(creep.room.find(FIND_SOURCES));
                    if (creep.harvest(target_source) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target_source);
                    }
                }
            } else {
                creep.moveTo(new RoomPosition(25, 25, bottomRoomName));
            }
        } else {
            // 如果下面房间不存在，则返回原房间
            creep.moveTo(Game.spawns['Spawn1'].room.controller);
            creep.upgradeController(Game.spawns['Spawn1'].room.controller);
            return;
        }
    }
}

module.exports = fun_outharvester;