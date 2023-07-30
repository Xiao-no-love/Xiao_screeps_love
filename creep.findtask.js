var creepFindtask = {
    run: function (creep) {
        // 储能
        var Harvester_task = creep.room.find(FIND_STRUCTURES, {
            // 使用`FIND_STRUCTURES`查找房间内的所有建筑结构
            filter: function (structure) {
                // 使用过滤器函数对找到的建筑结构进行筛选
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    // 选择建筑结构类型为`STRUCTURE_EXTENSION`或`STRUCTURE_SPAWN`且它们的能量存储容量大于0
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (Harvester_task.length > 0) {
            // 如果Creep不在targets[0]的范围内，则移动到targets[0]的位置
            if (creep.transfer(Harvester_task[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.say('📁', true)
                creep.moveTo(Harvester_task[0], { visualizePathStyle: { stroke: '#00dc91' } });
                return;
            }
        }

        // 修建
        var Builder_task = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (Builder_task.length > 0) {
            if (creep.build(Builder_task[0]) == ERR_NOT_IN_RANGE) {
                creep.say('🚧', true);
                creep.moveTo(Builder_task[0], { visualizePathStyle: { stroke: '#ff8982' } });
                return;
            }
        }

        // 修复
        var Repair_task = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        });
        if (Repair_task.length > 0) {
            Repair_task.sort((a, b) => a.hits - b.hits);
            if (creep.repair(Repair_task[0]) == ERR_NOT_IN_RANGE) {
                creep.say('🔧', true);
                creep.moveTo(Repair_task[0], { visualizePathStyle: { stroke: '#00c5fc' } });
                return;
            }
        }

        // 升级
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#aa8b66' } });
            return;
        }
    }

};

module.exports = creepFindtask;