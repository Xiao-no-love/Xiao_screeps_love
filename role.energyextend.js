var roleHarvester = {
    run: function (creep) {
        if (Array.isArray(creep.memory.extendin)) {
            if (creep.pos.x == creep.memory.extendin[0] && creep.pos.y == creep.memory.extendin[1]) {
                creep.memory.extendin = "Up!";
                creep.say('UpUp!!!', true);
            } else {
                creep.moveTo(creep.memory.extendin[0], creep.memory.extendin[1], { visualizePathStyle: { stroke: '#ffaa00' } })
                creep.say('🚩', true)
            }
            return;
        } else if (creep.memory.extendin == "Up!") {
            // 获取目标点最近的source
            var targetPosition = new RoomPosition(creep.memory.extendin_pos[0], creep.memory.extendin_pos[1], creep.room.name);
            var target_source = targetPosition.findClosestByPath(creep.room.find(FIND_SOURCES));
            var creep_carry = creep.pos.findInRange(FIND_MY_CREEPS, 1, {
                filter: (unit) => Array.isArray(unit.memory.destination)
            });
            if (creep_carry.length) {
                creep_carry = creep_carry[0]
            } else {
                creep_carry = 'None';
            }
            if (creep_carry != 'None' && creep_carry.store.getFreeCapacity() <= creep.store[RESOURCE_ENERGY]) {
                var value = creep.transfer(creep_carry, RESOURCE_ENERGY)
                // console.log("creep_carry.length", creep_carry, "value", value);
            }
            else {
                creep.harvest(target_source)
            }

            return;
        }
        // 获取房间地形
        var room_terrain = creep.room.getTerrain();

        // 储存所有空位
        var source_points = [];

        // 查找所有获取能量的建筑
        for (var source of creep.room.find(FIND_SOURCES_ACTIVE)) {
            var source_x = source.pos.x * 1 + 0, source_y = source.pos.y * 1 + 0;

            // 八个方位检测
            var round_points = [
                [source_x + 1, source_y + 1], [source_x + 1, source_y + 0], [source_x + 1, source_y - 1],
                [source_x + 0, source_y + 1], [source_x + 0, source_y - 1],
                [source_x - 1, source_y + 1], [source_x - 1, source_y + 0], [source_x - 1, source_y - 1]
            ]

            // 循环检测八个方位
            for (let i = 0; i < round_points.length; i++) {
                var round_point = round_points[i];
                var wall_select = room_terrain.get(round_point[0], round_point[1]);

                var found_creeps = creep.room.lookForAt(LOOK_CREEPS, round_point[0], round_point[1])

                // 无墙壁
                if ((wall_select == 0 || wall_select != TERRAIN_MASK_WALL) && !(found_creeps.length && found_creeps[0].getActiveBodyparts(ATTACK) == 0)) {
                    // 添加到source_points
                    source_points.push([round_point[0], round_point[1]]);
                }
            }
        }
        // console.log("source", source_points);

        // 储存已经占用的点
        var creep_points = [];
        for (var name in Game.creeps) {
            if (Array.isArray(Game.creeps[name].memory.destination)) {
                creep_points.push(Game.creeps[name].memory.destination);
            }
            if (Array.isArray(Game.creeps[name].memory.extendin_pos)) {
                creep_points.push(Game.creeps[name].memory.extendin_pos);
            }
        }
        // console.log("creep_points", creep_points);

        // 除去已被使用的点
        creep_points.forEach(creep_point => {
            // 初始化下标
            var index = -1;

            // 内循环空点位
            for (let base = 0; base < source_points.length; base++) {
                var r = source_points[base];
                // 判断元素内容重复
                if (creep_point[0] == r[0] && creep_point[1] == r[1]) {
                    index = base;
                    break
                }
            }

            // 下标不为-1
            if (index !== -1) {
                // 移除重复元素
                source_points.splice(index, 1);
            }
        })



        // 判断剩余空位存在
        if (source_points.length < 1) {
            creep.say('💤', true)
        }
        // 存在则继续下一步
        else {
            // 获取距离最近的点
            var min_distance = Number.MAX_VALUE, min_pos;
            // 计算最小值
            source_points.forEach(point_pos => {
                // 计算距离
                var point_distance = creep.pos.getRangeTo(point_pos[0], point_pos[1]);
                // 比较
                if (point_distance < min_distance) {
                    // 修改最小值
                    min_distance = point_distance;
                    min_pos = point_pos;
                }
            });
            // 提示寻路成功
            creep.say('⚡ ' + min_pos[0] + "-" + min_pos[1], true)
            // 设定destination坐标
            creep.memory.extendin = [min_pos[0], min_pos[1]]
            creep.memory.extendin_pos = [min_pos[0], min_pos[1]]
            // 前进!!!
            creep.moveTo(creep.memory.extendin[0], creep.memory.extendin[1], { visualizePathStyle: { stroke: '#ffaa00' } })
        }
    }
};

module.exports = roleHarvester;