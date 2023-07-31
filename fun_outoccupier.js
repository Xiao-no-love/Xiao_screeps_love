/*
控制creep
等级不够。。。
*/

var fun_outoccupier = {
    run: function (creep) {
        // 检查是否在自己房间
        if (creep.room == Game.spawns['Spawn1'].room) {    //不在自己房间
            // 获取下面房间的名称
            var bottomRoomName = Game.map.describeExits(Game.spawns['Spawn1'].room.name)[BOTTOM];
            // 下面房间存在
            if (bottomRoomName) {
                // 前往下面房间#ff1f1f
                creep.moveTo(new RoomPosition(25, 25, bottomRoomName), { visualizePathStyle: { stroke: '#ff1f1f' } });
            } else {
                // 如果下面房间不存在，则返回原房间
                creep.moveTo(Game.spawns['Spawn1'].room.controller);
                creep.upgradeController(Game.spawns['Spawn1'].room.controller);
                return;
            }
        } else {    //不在自己房间
            if (creep.room.controller && !creep.room.controller.owner) {
                if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                } else if (creep.claimController(creep.room.controller) == OK) {
                    creep.say('🏁')
                } else {
                    // console.log("claimController", creep.claimController(creep.room.controller));
                }
            }
        }
    }
}

module.exports = fun_outoccupier;