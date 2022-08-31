import type { ModuleFormat } from "rollup";
declare type DirectoriesConfig = {
    viewsSource: string;
    viewsDist: string;
    browserSource: string;
    browserDist: string;
};
declare type RollupCompileOptions = {
    external: string[];
    ssrFormat: ModuleFormat;
    browserFormat: ModuleFormat;
    globals: {
        [key: string]: string;
    };
};
declare class VueToJsSSRCompiler {
    directories: DirectoriesConfig;
    options: RollupCompileOptions;
    constructor(directories: DirectoriesConfig, options: RollupCompileOptions);
    render_all_views_for_ssr(): Promise<void>;
    render_all_views_for_browser(): Promise<void>;
}
declare class TmplateBuilder {
    #private;
    constructor(baseTemplateDir: string);
    toHtmlString(templateFilePath: string, props?: {
        [key: string]: any;
    }): Promise<string>;
}
export { VueToJsSSRCompiler, TmplateBuilder };
