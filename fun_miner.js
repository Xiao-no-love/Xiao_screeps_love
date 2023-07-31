const fun_miner = {
    run: function (creep) {
        // 检查miner初始化
        if (creep.memory.target_source_id == "None") {
            creep.say('...')
            if (creep.memory.Energy_PT == "None") {

                // 获取房间地形
                var room_terrain = creep.room.getTerrain();

                // 储存所有空位
                var source_points = [];

                // 查找所有获取能量的建筑
                for (var source of creep.room.find(FIND_SOURCES_ACTIVE)) {
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

                // 除去已被使用的点
                creep_points.forEach(creep_point => {

                    // 检查存在相同元素
                    for (let base = 0; base < source_points.length; base++) {
                        var r = source_points[base];

                        // 判断元素内容重复
                        if (creep_point[0] == r[0] && creep_point[1] == r[1]) {
                            source_points.splice(base, 1);
                            break
                        }
                    }
                })

                // 判断存在点位
                if (source_points.length < 1) {
                    // 无点位则提示等待
                    creep.say("Wait Point")
                    return
                } else {
                    // 获取距离最近的点
                    var Min_distance = Number.MAX_VALUE, min_pos = [];

                    // 循环计算最小值
                    source_points.forEach(point_pos => {

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
            else {
                if (Array.isArray(creep.memory.Energy_PT)) {
                    if (creep.pos.x == creep.memory.Energy_PT[0] && creep.pos.y == creep.memory.Energy_PT[1]) {
                        var near_source_pos = new RoomPosition(creep.memory.Energy_PT[0], creep.memory.Energy_PT[1], creep.room.name);
                        var near_source = near_source_pos.findClosestByPath(creep.room.find(FIND_SOURCES));
                        creep.memory.target_source_id = [near_source.pos.x, near_source.pos.y]
                    } else {
                        creep.say('🚩')
                        creep.moveTo(creep.memory.Energy_PT[0], creep.memory.Energy_PT[1], { visualizePathStyle: { stroke: '#ffaa00' } })
                    }
                } else {
                    creep.memory.Energy_PT = "None"
                }
            }
        }
        // 正常运行
        else {
            // 临界点改变状态
            if (creep.memory.mining && creep.store[RESOURCE_ENERGY] == 0) {
                // 如果Creep的内存中正在送能且能量存储为0，则停止送能-!wait_creep
                creep.memory.mining = false;
            }
            if (!creep.memory.mining && creep.store.getFreeCapacity() == 0) {
                // 如果Creep的内存中未进行送能且存储空间已满，则开始送能->wait_creep
                creep.memory.mining = true;
            }
            // 判断工作状态
            if (creep.memory.mining) {    //送能->wait_creep

                // 获取所有等待充能的creep
                var wait_creep = creep.pos.findInRange(FIND_MY_CREEPS, 1, {
                    filter: (harvester) => harvester.memory.wait_energy
                });
                // 有等待的creep
                if (wait_creep.length) {
                    wait_creep = wait_creep[0]
                    var end_value = creep.transfer(wait_creep, RESOURCE_ENERGY, wait_creep.store.getFreeCapacity() > creep.store[RESOURCE_ENERGY] ? creep.store[RESOURCE_ENERGY] : wait_creep.store.getFreeCapacity())
                    if (end_value != 0) {
                        console.log("Error -> transfer", wait_creep, "value", end_value);
                    }
                    return;
                }
                // 无等待的creep , 休息
                else {
                    creep.say("💤")
                }
            }
            else {    //补充能量
                var sourcePos = new RoomPosition(creep.memory.target_source_id[0], creep.memory.target_source_id[1], creep.room.name);
                var target_source = sourcePos.lookFor(LOOK_SOURCES)[0];
                creep.harvest(target_source)
            }
        }
    }
}

module.exports = fun_miner;