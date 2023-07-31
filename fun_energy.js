const fun_energy = {
    run: function (creep) {
        // 判断存在Energy_PT
        if (Array.isArray(creep.memory.Energy_PT)) {

            // 判断到达点位
            if (creep.pos.x == creep.memory.Energy_PT[0] && creep.pos.y == creep.memory.Energy_PT[1]) {

                if (creep.memory.wait_energy == true) {
                    // 到达点位等待获取能量
                    creep.say('⚡')
                } else {

                    // 寻找最近source
                    var targetPosition = new RoomPosition(creep.memory.Energy_PT[0], creep.memory.Energy_PT[1], creep.room.name);
                    var recent_source = targetPosition.findClosestByPath(creep.room.find(FIND_SOURCES));
                    // 如果获取能量失败则等待
                    if (creep.harvest(recent_source) == ERR_NOT_IN_RANGE) {
                        // console.log("harvest", creep.harvest(recent_source));
                        creep.memory.wait_energy = true;
                    }
                }
            }
            // 还没到达目标点位
            else {
                // // move至目标点位
                // creep.say('💨')
                creep.moveTo(creep.memory.Energy_PT[0], creep.memory.Energy_PT[1], { visualizePathStyle: { stroke: '#ffaa00' } })
            }

        } else {
            // 优先获取掉落资源
            var resource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            if (resource != null && resource[0] != undefined) {
                creep.say("->♻")
                console.log("pickup", creep.pickup(resource[0]), resource[0]);
                if (creep.pickup(resource[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource[0]);
                } else {
                    creep.say(">♻<")
                }
            } else {

                // 获取能量的目标
                var Energy_construct = creep.room.find(FIND_SOURCES_ACTIVE).concat(_.filter(Game.creeps, (creep) => Array.isArray(creep.memory.target_source_id)))

                // 储存所有空位
                var source_points = [];

                // 查找所有获取能量的目标
                for (var source of Energy_construct) {
                    // 获取房间地形
                    var room_terrain = creep.room.getTerrain();
                    var source_x = source.pos.x * 1 + 0, source_y = source.pos.y * 1 + 0;

                    // 设定八个方位
                    var round_points = [
                        [source_x + 1, source_y + 1], [source_x + 1, source_y + 0], [source_x + 1, source_y - 1],
                        [source_x + 0, source_y + 1], [source_x + 0, source_y - 1],
                        [source_x - 1, source_y + 1], [source_x - 1, source_y + 0], [source_x - 1, source_y - 1]
                    ]

                    // 循环检测八个方位
                    for (let i = 0; i < round_points.length; i++) {
                        var round_point = round_points[i];

                        // 查找该点位地图信息
                        var wall_select = room_terrain.get(round_point[0], round_point[1]);

                        // 查找该点位存在creep信息
                        var found_creeps = creep.room.lookForAt(LOOK_CREEPS, round_point[0], round_point[1])

                        // 判断点位不为墙壁且不存在creep
                        if (wall_select == 0 && found_creeps.length == 0) {

                            // 添加到source_points
                            source_points.push([round_point[0], round_point[1]]);
                        }
                    }
                }

                // 储存已被使用点位
                var creep_points = [];

                // 循环所有creep
                for (var name in Game.creeps) {
                    // 存在目标点位
                    if (Array.isArray(Game.creeps[name].memory.Energy_PT)) {
                        creep_points.push(Game.creeps[name].memory.Energy_PT);
                    }
                }

                // 自身去重
                var source_end_point = [];
                for (var i = 0; i < source_points.length; i++) {
                    var isDuplicate = false;
                    for (var j = 0; j < source_end_point.length; j++) {
                        if (source_points[i][0] == source_end_point[j][0] && source_points[i][1] == source_end_point[j][1]) {
                            isDuplicate = true;
                            break;
                        }
                    }
                    if (!isDuplicate) {
                        source_end_point.push(source_points[i]);
                    }
                }

                // 除去已被使用的点
                creep_points.forEach(creep_point => {

                    // 检查存在相同元素
                    for (let base = 0; base < source_end_point.length; base++) {
                        var r = source_end_point[base];

                        // 判断元素内容重复
                        if (creep_point[0] == r[0] && creep_point[1] == r[1]) {
                            source_end_point.splice(base, 1);
                            break
                        }
                    }
                })

                // 判断存在点位
                if (source_end_point.length < 1) {
                    var resource = creep.room.find(FIND_SOURCES_ACTIVE);
                    if (resource.length) {
                        if (creep.pickup(resource[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(resource[0]);
                        } else {
                            creep.say("♻")
                        }
                    } else {
                        // 无点位则提示等待
                        creep.say("💫")
                    }
                    return
                } else {
                    // 获取距离最近的点
                    var Min_distance = Number.MAX_VALUE, min_pos = [];

                    // 循环计算最小值
                    source_end_point.forEach(point_pos => {

                        // 计算距离
                        var point_distance = creep.pos.getRangeTo(point_pos[0], point_pos[1]);
                        // 比较
                        if (point_distance < Min_distance) {
                            // 修改最小值
                            Min_distance = point_distance;
                            // 赋值
                            min_pos[0] = point_pos[0];
                            min_pos[1] = point_pos[1];
                        }
                    });

                    // 提示寻路成功
                    creep.say('⚡ ' + min_pos[0] + "-" + min_pos[1])

                    // 设定Energy_PT坐标
                    creep.memory.Energy_PT = [min_pos[0], min_pos[1]]
                    creep.moveTo(creep.memory.Energy_PT[0], creep.memory.Energy_PT[1], { visualizePathStyle: { stroke: '#ffaa00' } })
                }
            }
        }
    },
    clear: function (creep) {
        creep.memory.Energy_PT = "None"
        creep.memory.wait_energy = false
    }
}

module.exports = fun_energy;