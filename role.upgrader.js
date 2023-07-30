var creepGetenergy = require('creep.getenergy');

var roleUpgrader = {

    run: function (creep) {

        // 如果Creep的内存中正在升级且能量存储为0，则停止升级并提示Eat
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
        }
        // 如果Creep的内存中未进行升级且存储空间已满，则开始升级
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
        }

        // 如果Creep的内存中正在升级，则尝试升级控制器
        if (creep.memory.upgrading) {
            // 清除占用的目标点
            creepGetenergy.clear(creep);
            // 提示
            creep.say('🔄', true);
            // 升级控制器
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        // 如果Creep的内存中未进行升级，则寻找能源并采集
        else {
            // 获取资源
            creepGetenergy.run(creep);
        }
    }
};

module.exports = roleUpgrader;