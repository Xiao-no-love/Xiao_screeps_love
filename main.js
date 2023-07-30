var roleHarvester = require('role.harvester');
var roleRepair = require('role.repair');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleEnergyextend = require('role.energyextend');
var roleOutharvester = require('role.outharvester');
var tick_rec = 0;

module.exports.loop = function () {
    // 获取creep列表
    var energyextends = _.filter(Game.creeps, (creep) => creep.memory.role == 'energyextend');
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var outharvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'outharvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');

    // 孵化creep设定
    if (Game.spawns['Spawn1'].store[RESOURCE_ENERGY] >= 300) {
        // 初始化爬虫参数
        var newNameEnd = '-', spawnCreepItem = [WORK, CARRY, MOVE];
        // 检测能否制造大爬
        if (Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], 'test', { memory: { role: 'harvester' }, dryRun: true }) == 0) {
            newNameEnd = '-Big-';
            spawnCreepItem = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
        }

        // harvester数量限制
        if (harvesters.length < 5) {
            // 创建harvester
            var newName = 'Harvester' + newNameEnd + Game.time;
            Game.spawns['Spawn1'].spawnCreep(spawnCreepItem, newName, { memory: { role: 'harvester' } })
        }
        // outharvester数量限制
        else if (outharvesters.length < 2) {
            var newName = 'Outharvester' + newNameEnd + Game.time;
            Game.spawns['Spawn1'].spawnCreep(spawnCreepItem, newName, { memory: { role: 'outharvester' } })
        }
        // energyextend数量限制
        else if (energyextends.length < 3 && Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, CARRY, MOVE], newName, { memory: { role: 'energyextend' }, dryRun: true })) {
            // 创建energyextends
            newName = 'energyextend' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, CARRY, MOVE], newName, { memory: { role: 'energyextend' } })
        }
        // upgrader数量限制
        else if (upgraders.length < 1) {
            var newName = 'Upgrader' + newNameEnd + Game.time;
            Game.spawns['Spawn1'].spawnCreep(spawnCreepItem, newName, { memory: { role: 'upgrader' } })
        }
        // builder数量限制
        else if (builders.length < 1) {
            var newName = 'Builder' + newNameEnd + Game.time;
            Game.spawns['Spawn1'].spawnCreep(spawnCreepItem, newName, { memory: { role: 'builder' } })
        }
        // repair数量限制
        else if (repairs.length < 1) {
            var newName = 'Repair' + newNameEnd + Game.time;
            Game.spawns['Spawn1'].spawnCreep(spawnCreepItem, newName, { memory: { role: 'repair' } })
        }
    }

    // 清除死亡creep
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing creep ->', name);
        }
    }

    // 孵化creep设定
    if (Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        spawningCreep.memory.destination = "none";
        if (spawningCreep.memory.role == 'energyextend') {
            spawningCreep.memory.extendin = "none";
        }
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            { align: 'left', opacity: 0.8 });
    }

    // creep功能设定
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
            // roleUpgrader.run(creep);
            // roleBuilder.run(creep);
            // roleRepair.run(creep);
            continue;
        }
        if (creep.memory.role == 'outharvester') {
            roleOutharvester.run(creep);
            // roleUpgrader.run(creep);
            // roleBuilder.run(creep);
            // roleRepair.run(creep);
            continue;
        }
        if (creep.memory.role == 'upgrader') {
            // roleHarvester.run(creep);
            roleUpgrader.run(creep);
            // roleBuilder.run(creep);
            // roleRepair.run(creep);
            continue;
        }
        if (creep.memory.role == 'builder') {
            // roleHarvester.run(creep);
            // roleUpgrader.run(creep);
            roleBuilder.run(creep);
            // roleRepair.run(creep);
            continue;
        }
        if (creep.memory.role == 'repair') {
            // roleHarvester.run(creep);
            // roleUpgrader.run(creep);
            // roleBuilder.run(creep);
            roleRepair.run(creep);
            continue;
        }
        if (creep.memory.role == 'energyextend') {
            roleEnergyextend.run(creep);
            continue;
        }
    }

    // tick检查
    if (tick_rec < 10) {
        tick_rec += 1
    } else {
        tick_rec = 0
        console.log(`Harvesters: ${harvesters.length}  Upgraders: ${upgraders.length}  Builders: ${builders.length}  Repair: ${repairs.length}  energyextend: ${energyextends.length}`);
    }
}