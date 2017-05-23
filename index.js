"use strict";
//This will force the user to only use the settings that i want them to use.
Object.defineProperty(exports, "__esModule", { value: true });
function queryParser(query) {
    function rip(query) {
        if (typeof query === "string") {
            if (~query.indexOf(",")) {
                return query.split(",").map(rip);
            }
            if (~query.indexOf(".")) {
                return query.split(".").map(rip);
            }
        }
        return query;
    }
    return rip(query);
}
exports.queryParser = queryParser;
function PickOperator(config, object) {
    function InternalOperation(config, object) {
        var keys = Object.keys(config);
        var array_start;
    }
}
exports.PickOperator = PickOperator;
function Pick(config) {
    return function (object) {
        return PickOperator(config, object);
    };
}
exports.Pick = Pick;
//# sourceMappingURL=index.js.map