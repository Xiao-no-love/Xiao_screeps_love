const fun_energy = require("fun_energy")

const fun_repairer = {
    run: function (creep) {
        // 临界点改变状态
        if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            // 如果Creep的内存中正在修复且能量存储为0，则停止修复-!目标建筑
            creep.memory.repairing = false;
        }
        if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            // 如果Creep的内存中未进行修复且存储空间已满，则开始修复->目标建筑
            creep.memory.repairing = true;
            fun_energy.clear(creep)
        }

        // 判断工作状态
        if (creep.memory.repairing) {    //修复->目标建筑
            if (!this.fun(creep)) {
                // 执行其他任务
                // 升级
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#aa8b66' } });
                    return;
                }
            }
        } else {    // 获取资源
            fun_energy.run(creep)
        }
    },
    fun: function (creep) {

        // 修复
        if (Array.isArray(creep.memory.Repair_PT)) {
            var targetPosition = new RoomPosition(creep.memory.Repair_PT[0], creep.memory.Repair_PT[1], creep.room.name);
            var recent_source = targetPosition.findClosestByPath(creep.room.find(FIND_STRUCTURES));
            // console.log("recent_source", recent_source);
            if (creep.repair(recent_source) == ERR_NOT_IN_RANGE) {
                creep.say('🔨' + creep.memory.Repair_PT[0] + "-" + creep.memory.Repair_PT[1])
                creep.moveTo(recent_source, { visualizePathStyle: { stroke: '#00c5fc' } });
            } else {
                creep.memory.Repair_PT = "None"
            }
            return true;
        } else {
            var Repair_task = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });
            // 储存已被使用点位
            var creep_points = [];
            // 循环所有creep
            for (var name in Game.creeps) {
                // 存在目标点位
                if (Array.isArray(Game.creeps[name].memory.Repair_PT)) {
                    creep_points.push(Game.creeps[name].memory.Repair_PT);
                }
            }
            // 除去已被使用的点
            creep_points.forEach(creep_point => {
                // 检查存在相同元素
                for (let base = 0; base < Repair_task.length; base++) {
                    var target_repair = Repair_task[base];
                    // 判断元素内容重复
                    if (creep_point[0] == target_repair.pos.x && creep_point[1] == target_repair.pos.y) {
                        Repair_task.splice(base, 1);
                        break
                    }
                }
            })
            if (Repair_task.length > 0) {
                Repair_task.sort((a, b) => (a.hits / a.hitsMax) - (b.hits / b.hitsMax));
                creep.memory.Repair_PT = [Repair_task[0].pos.x, Repair_task[0].pos.y]
                if (creep.repair(Repair_task[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Repair_task[0], { visualizePathStyle: { stroke: '#00c5fc' } });
                }
                return true;
            } else {
                return false
            }
        }
    }
}

module.exports = fun_repairer;