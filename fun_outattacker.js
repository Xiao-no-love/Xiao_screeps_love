var fun_outattacker = {
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

            // 获取敌对creep
            var enemies = creep.room.find(FIND_HOSTILE_CREEPS);
            // 获取敌对建筑
            var buildings = creep.room.find(FIND_HOSTILE_STRUCTURES);

            // 如果存在敌对 creep，则对其进行攻击
            if (enemies.length > 0) {
                const closestEnemy = creep.pos.findClosestByRange(enemies);
                if (creep.attack(closestEnemy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestEnemy, { visualizePathStyle: { stroke: '#ff1f1f' } });
                } else if (creep.attack(closestEnemy) == 0) {
                    creep.say("⚔")
                }
            } else if (buildings.length > 0) {
                const closestBuilding = creep.pos.findClosestByRange(buildings);
                if (creep.attack(closestBuilding) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestBuilding, { visualizePathStyle: { stroke: '#ff1f1f' } });
                } else if (creep.attack(closestBuilding) == 0) {
                    creep.say("⚔")
                }
            } else {
                // 否则对传入的 creep 进行 say("safe") 操作
                creep.say("safe");
            }

            // 以下为采矿代码
            // var sources = creep.room.find(FIND_SOURCES_ACTIVE)
            // if (sources.length > 0) {
            //     var targetPosition = new RoomPosition(creep.pos.x, creep.pos.y, creep.room.name);
            //     var target_source = targetPosition.findClosestByPath(creep.room.find(FIND_SOURCES));
            //     console.log("target_source", creep.harvest(target_source));
            //     if (creep.harvest(target_source) === ERR_NOT_IN_RANGE) {
            //         creep.moveTo(target_source);
            //     }
            // }
        }
    }
}

module.exports = fun_outattacker;