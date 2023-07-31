const set_list = require("set_list");

let creep_spawn = {
    // 检查爬虫存活
    keep_live: function () {
        /* 获取creep列表 */
        var creep_list = set_list.get()

        // 遍历检查
        for (const creep_type in creep_list) {
            var type_creeps = creep_list[creep_type];
            // 如果缺失爬虫
            if (type_creeps.num > _.filter(Game.creeps, (creep) => creep.memory.role == creep_type).length) {
                console.log("Need ->", creep_type + " *", (type_creeps.num - _.filter(Game.creeps, (creep) => creep.memory.role == creep_type).length));
                // 检查具体缺失个体
                for (let tag = 1; tag < type_creeps.num + 1; tag++) {
                    if (Game.creeps[creep_type + '' + tag]) {
                        continue;
                    } else {
                        // 孵化
                        Game.spawns['Spawn1'].spawnCreep(type_creeps.body, (creep_type + '' + tag), { memory: { role: creep_type } })
                        return
                    }
                }
            }
        }
    }
}

module.exports = creep_spawn;