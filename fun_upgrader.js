const fun_energy = require("fun_energy")

const fun_upgrader = {
    run: function (creep) {
        // 临界点改变状态
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            // 如果Creep的内存中正在升级且能量存储为0，则停止升级-!控制中心
            creep.memory.upgrading = false;
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            // 如果Creep的内存中未进行升级且存储空间已满，则开始升级->控制中心
            creep.memory.upgrading = true;
            fun_energy.clear(creep)
        }

        // 判断工作状态
        if (creep.memory.upgrading) {    //升级->控制中心
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#63be0c' } });
            }
        } else {    // 获取资源
            fun_energy.run(creep)
        }
    }
}

module.exports = fun_upgrader;