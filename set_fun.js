const set_fun = {
    // 收割(主房间)
    harvester: {
        run: function (creep) {
            const fun_harvester = require("fun_harvester")
            fun_harvester.run(creep);
        }
    },
    // 升级()
    upgrader: {
        run: function (creep) {
            const fun_upgrader = require("fun_upgrader")
            fun_upgrader.run(creep);
        }
    },
    // 建造()
    builder: {
        run: function (creep) {
            const fun_builder = require("fun_builder")
            fun_builder.run(creep);
        }
    },
    // 修复()
    repairer: {
        run: function (creep) {
            const fun_repairer = require("fun_repairer")
            fun_repairer.run(creep);
        }
    },
    // 挖矿(采矿分类)
    miner: {
        run: function (creep) {
            const fun_miner = require("fun_miner")
            fun_miner.run(creep);
        }
    },
    // 收割(其他房间)
    outharvester: {
        run: function (creep) {
            const fun_outharvester = require("fun_outharvester")
            fun_outharvester.run(creep);
        }
    },
    // 攻击者(其他房间)
    outattacker: {
        run: function (creep) {
            const fun_outattacker = require("fun_outattacker")
            fun_outattacker.run(creep);
        }
    },
    // 攻击者(其他房间)
    outoccupier: {
        run: function (creep) {
            const fun_outoccupier = require("fun_outoccupier")
            fun_outoccupier.run(creep);
        }
    },
}

module.exports = set_fun;