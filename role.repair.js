var creepGetenergy = require('creep.getenergy');

var roleRepair = {
    run: function (creep) {
        // 检查当前Creep的存储空间是否可用
        // console.log("creep.store", creep.store[RESOURCE_ENERGY], creep.store.getFreeCapacity());
        // if (creep.store.getFreeCapacity() > 0) {
        if (creep.store[RESOURCE_ENERGY] < 1) {
            // 获取资源
            creepGetenergy.run(creep);
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });

            if (targets.length > 0) {
                creep.say('🔧', true)
                targets.sort((a, b) => a.hits - b.hits);
                if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            } else {
                var creepFindtask = require('creep.findtask');
                creepFindtask.run(creep);
            }
        }
    }
};

module.exports = roleRepair;