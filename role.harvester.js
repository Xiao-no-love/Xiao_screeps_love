var creepGetenergy = require('creep.getenergy');

var roleHarvester = {
    run: function (creep) {
        // 检查当前Creep的存储空间是否可用
        // console.log("creep.store", creep.store[RESOURCE_ENERGY], creep.store.getFreeCapacity());
        // if (creep.store.getFreeCapacity() > 0) {
        if (creep.store.getFreeCapacity() > 0) {
            // 获取资源
            creepGetenergy.run(creep);
        } else {
            // 如果存储空间满了
            // 清除占用的目标点
            creepGetenergy.clear(creep);
            // 查找可以提供能量的STRUCTURES
            var targets = creep.room.find(FIND_STRUCTURES, {
                // 使用`FIND_STRUCTURES`查找房间内的所有建筑结构
                filter: function (structure) {
                    // 使用过滤器函数对找到的建筑结构进行筛选
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        // 选择建筑结构类型为`STRUCTURE_EXTENSION`或`STRUCTURE_SPAWN`且它们的能量存储容量大于0
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            // 存在可以提供能量的STRUCTURES
            if (targets.length > 0) {
                // 如果Creep不在targets[0]的范围内，则移动到targets[0]的位置
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    creep.say('📁', true)
                } else {
                    creep.say('📂', true)
                }
            } else {
                // creep.say('💤', true)
                var creepFindtask = require('creep.findtask');
                creepFindtask.run(creep);
            }
        }
    }
};

module.exports = roleHarvester;