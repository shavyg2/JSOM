


//This will force the user to only use the settings that i want them to use.



export type configSetting = { [key: string]: (configSetting | string | (() => any)) }


export function queryParser(query: string) {
    function rip(query:string) {
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
export function PickOperator(config: configSetting, object: any) {


    function InternalOperation(config: configSetting, object: any) {
        let keys = Object.keys(config);
        let array_start
    }

}



export function Pick(config: configSetting) {
    return function (object: any) {
        return PickOperator(config, object);
    }
}



