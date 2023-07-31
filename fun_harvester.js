const fun_energy = require("fun_energy")
const creep_task = require("creep_task")

const fun_harvester = {
    run: function (creep) {
        // 临界点改变状态
        if (creep.memory.storing && creep.store[RESOURCE_ENERGY] == 0) {
            // 如果Creep的内存中正在储能且能量存储为0，则停止储能-!储能建筑
            creep.memory.storing = false;
        }
        if (!creep.memory.storing && creep.store.getFreeCapacity() == 0) {
            // 如果Creep的内存中未进行储能且存储空间已满，则开始储能->储能建筑
            creep.memory.storing = true;
            fun_energy.clear(creep)
        }

        // 判断工作状态
        if (creep.memory.storing) {    //储能->储能建筑

            // 建筑结构筛选函数
            function structure_filter(structure) {
                return (
                    structure.structureType == STRUCTURE_STORAGE ||
                    structure.structureType == STRUCTURE_TERMINAL ||
                    structure.structureType == STRUCTURE_CONTAINER ||
                    structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                // 选择建筑结构类型为:
                // STRUCTURE_CONTAINER()
                // STRUCTURE_EXTENSION()
                // STRUCTURE_SPAWN()
                // 且能量存储容量大于0
            }

            // 使用FIND_STRUCTURES查找房间内的所有目标建筑结构
            var target_structures = creep.room.find(FIND_STRUCTURES, { filter: structure => structure_filter(structure) })

            if (target_structures.length > 0) {    // 判断存在可以储能的STRUCTURES
                // 查找最近的目标建筑
                var targetPosition = new RoomPosition(creep.pos.x, creep.pos.y, creep.room.name);
                var target_structure = targetPosition.findClosestByPath(target_structures);

                if (creep.transfer(target_structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target_structure, { visualizePathStyle: { stroke: '#ffaa00' } });
                    // creep.say('📁')
                } else {
                    creep.say('📂')
                }
            } else {    //执行其他任务
                creep_task.run(creep)
            }
        } else {    // 充能
            fun_energy.run(creep)
        }
    }
}

module.exports = fun_harvester;