var creepGetenergy = require('creep.getenergy');

var roleBuilder = {

	run: function (creep) {
		// 如果Creep的内存中正在建造且能量存储为0，则停止建造
		if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.building = false;
		}
		// 如果Creep的内存中未进行建造且存储空间已满，则开始建造
		if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
			creep.memory.building = true;
		}

		// 如果Creep的内存中正在建造，则寻找建筑地点并建造
		if (creep.memory.building) {
			// 清除占用的目标点
			creepGetenergy.clear(creep);
			// 提示
			creep.say('🚧', true);
			var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			if (targets.length > 0) {
				if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
				}
			}
			else {
				var creepFindtask = require('creep.findtask');
				creepFindtask.run(creep);
			}
		}
		// 如果Creep的内存中未进行建造，则寻找能源并采集
		else {
			// 获取资源
			creepGetenergy.run(creep);
		}
	}
};

module.exports = roleBuilder;