var creep_task = {
    run: function (creep) {
        // 储能
        var Harvester_task = creep.room.find(FIND_STRUCTURES, {
            filter: function (structure) {
                // 使用过滤器函数对找到的建筑结构进行筛选
                return (
                    structure.structureType == STRUCTURE_CONTAINER ||
                    structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (Harvester_task.length > 0) {
            if (creep.transfer(Harvester_task[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                // creep.say('📁')
                creep.moveTo(Harvester_task[0], { visualizePathStyle: { stroke: '#00dc91' } });
                return;
            }
        }

        // 修建
        var Builder_task = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (Builder_task.length > 0) {
            if (creep.build(Builder_task[0]) == ERR_NOT_IN_RANGE) {
                creep.say('🚧');
                creep.moveTo(Builder_task[0], { visualizePathStyle: { stroke: '#ff8982' } });
                return;
            }
        }

        // 修复
        const fun_repairer = require("fun_repairer")
        if (fun_repairer.fun(creep)) {
            return;
        }

        // 升级
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#aa8b66' } });
            return;
        }
    }

};

module.exports = creep_task;