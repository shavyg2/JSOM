export declare type configSetting = {
    [key: string]: (configSetting | string | (() => any));
};
export declare function queryParser(query: string): any;
export declare function PickOperator(config: configSetting, object: any): void;
export declare function Pick(config: configSetting): (object: any) => void;
