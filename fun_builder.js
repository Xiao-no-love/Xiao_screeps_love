const fun_energy = require("fun_energy")
const creep_task = require("creep_task")

const fun_builder = {
    run: function (creep) {
        // 临界点改变状态
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            // 如果Creep的内存中正在建造且能量存储为0，则停止建造-!目标建筑
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            // 如果Creep的内存中未进行建造且存储空间已满，则开始建造->目标建筑
            creep.memory.building = true;
            fun_energy.clear(creep)
        }

        // 判断工作状态
        if (creep.memory.building) {    //建造->目标建筑
            // 使用FIND_CONSTRUCTION_SITES查找房间内的所有目标建筑结构
            var target_structures = creep.room.find(FIND_CONSTRUCTION_SITES);

            if (target_structures.length > 0) {    // 判断存在需要建造的STRUCTURES
                // 查找最近的目标建筑
                var targetPosition = new RoomPosition(creep.pos.x, creep.pos.y, creep.room.name);
                var target_structure = targetPosition.findClosestByPath(target_structures);

                if (creep.build(target_structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target_structure, { visualizePathStyle: { stroke: '#ffaa00' } });
                } else {
                    creep.say('🚧')
                }
            } else {    //执行其他任务
                creep_task.run(creep)
            }
        } else {    // 获取资源
            fun_energy.run(creep)
        }
    }
}

module.exports = fun_builder;