const creep_spawn = require("creep_spawn");
const creep_fun = require("creep_fun");
const set_spawn = require("set_spawn");

module.exports.loop = function () {

    // 检查爬虫存活
    creep_spawn.keep_live();



    // 爬虫孵化初始化
    if (Game.spawns['Spawn1'].spawning) {
        var spawning_creep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        // memory初始化
        const memort_list = set_spawn.list()
        for (const memory_item in memort_list) {
            var memory_value = memort_list[memory_item];
            spawning_creep.memory[memory_item] = memory_value;
        }
        // 提示孵化爬虫名字
        Game.spawns['Spawn1'].room.visual.text('✨' + spawning_creep.name, Game.spawns['Spawn1'].pos.x, Game.spawns['Spawn1'].pos.y - 1, { align: 'left', opacity: 1 });
    }

    // 清除死亡爬虫内存
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing creep ->', name);
        }
    }

    // creep功能设定
    creep_fun.classification()

    // tick检查
    // if (tick_rec < 10) {
    //     tick_rec += 1
    // } else {
    //     tick_rec = 0
    //     console.log(`Harvesters: ${harvesters.length}  Upgraders: ${upgraders.length}  Builders: ${builders.length}  Repair: ${repairs.length}  energyextend: ${energyextends.length}`);
    // }
}