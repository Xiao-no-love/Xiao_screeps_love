const set_list = require("set_list");
const set_fun = require("set_fun");

let creep_fun = {
    classification: function () {
        /* 获取creep列表 */
        var creep_list = set_list.get()

        for (const creep_type in creep_list) {
            var creep_type_list = _.filter(Game.creeps, (creep) => creep.memory.role == creep_type)
            // console.log(creep_type, creep_type_list.length);
            if (creep_type_list.length > 0) {
                for (const creep in creep_type_list) {
                    // console.log("creep_name", creep_type, creep_type_list[creep]);
                    set_fun[creep_type].run(creep_type_list[creep]);
                }
            }
        }
    }
}

module.exports = creep_fun;