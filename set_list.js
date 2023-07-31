const set_list = {
    get: function () {
        return {
            // 收割(主房间)
            harvester: {
                num: 7,
                body: [WORK, CARRY, MOVE],
            },
            // 挖矿(采矿分类)
            miner: {
                num: 3,
                body: [WORK, WORK, WORK, CARRY, MOVE],
            },
            // 升级()
            upgrader: {
                num: 1,
                body: [WORK, CARRY, MOVE],
            },
            // 建造()
            builder: {
                num: 2,
                body: [WORK, CARRY, MOVE],
            },
            // 修复()
            repairer: {
                num: 1,
                body: [WORK, CARRY, MOVE, MOVE],
            },
            // 收割(其他房间)
            outharvester: {
                num: 1,
                body: [WORK, CARRY, MOVE],
            },
            // 攻击者(其他房间)
            outattacker: {
                num: 1,
                body: [ATTACK, MOVE],
            },
            // 占领者(其他房间)
            outoccupier: {
                num: 0,
                body: [CLAIM, MOVE],
            },
        }
    }
}

module.exports = set_list;