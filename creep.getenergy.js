var creepGetenergy = {
    run: function (creep) {

        /** 参数调整! **/
        // 最大距离
        var Max_distance = 20
        /*
            获取能量的目标
            a. -> creep.room.find(FIND_SOURCES_ACTIVE)
                在creep所在的房间中搜索激活的资源
            b. -> _.filter(Game.creeps, (creep) => creep.memory.role == 'Energy_extend');
                在creep中搜索memory.role为Energy_extend的creep(采运分离)
         */
        // var Energy_construct = creep.room.find(FIND_SOURCES_ACTIVE)
        var Energy_construct = creep.room.find(FIND_SOURCES_ACTIVE).concat(_.filter(Game.creeps, (creep) => creep.memory.role == 'energyextend').filter(creep => creep.memory.extendin == "Up!"));

        // 如果内存中有目标点
        if (Array.isArray(creep.memory.destination)) {

            // 获取 Creep 一格范围内的单位
            var units = creep.pos.findInRange(FIND_MY_CREEPS, 1, {
                filter: (unit) => unit.memory.extendin == "Up!"
            });
            if (units.length) {
                if (creep.store.getFreeCapacity() > 0) {
                    creep.say('⚡', true)
                }
            } else {
                if (creep.pos.x == creep.memory.destination[0] && creep.pos.y == creep.memory.destination[1]) {
                    // 获取目标点最近的source
                    var targetPosition = new RoomPosition(creep.memory.destination[0], creep.memory.destination[1], creep.room.name);
                    var target_source = targetPosition.findClosestByPath(creep.room.find(FIND_SOURCES));
                    // 判断是否到达范围
                    if (creep.harvest(target_source) == ERR_NOT_IN_RANGE) {
                        this.clear(creep)
                    } else {
                        // 到达则提示获取能量
                        creep.say('⚡', true)
                    }
                } else {
                    creep.say('💨', true)
                    creep.moveTo(creep.memory.destination[0], creep.memory.destination[1], { visualizePathStyle: { stroke: '#ffaa00' } })
                }
            }
        }

        // 如果没有目标点
        else {
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

            // 获取房间地形
            var room_terrain = creep.room.getTerrain();

            // 储存所有空位
            var source_points = [];

            // 查找所有获取能量的建筑
            for (var source of Energy_construct) {
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

                    // 无墙壁
                    if (wall_select == 0 || wall_select != TERRAIN_MASK_WALL) {
                        // 添加到source_points
                        source_points.push([round_point[0], round_point[1]]);
                    }
                }
            }

            // console.log("source_points", source_points);

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
                // creep.say('❌')
                // 不存在则提示休眠
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
                // 判断距离超过20!
                if (min_distance > Max_distance) {
                    creep.say('💤', true)
                }
                // 太远了不去
                else {
                    // 提示寻路成功
                    creep.say('⚡ ' + min_pos[0] + "-" + min_pos[1], true)
                    // 设定destination坐标
                    creep.memory.destination = [min_pos[0], min_pos[1]]
                    // 前进!!!
                    creep.moveTo(creep.memory.destination[0], creep.memory.destination[1], { visualizePathStyle: { stroke: '#ffaa00' } })
                }
            }
        }
    },
    clear: function (creep) {
        // 移除目标点
        creep.memory.destination = "none";
    }

};

module.exports = creepGetenergy;
