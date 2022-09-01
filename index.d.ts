import type { InlineConfig } from "vite"
import type { ModuleFormat } from "rollup"

declare type ToTemplate_Directories = {
    viewsSource: string
    viewsDist: string
    browserSource: string
    browserDist: string
}

declare type ToTemplate_Options = {
    external: string[]
    ssrFormat: ModuleFormat
    browserFormat: ModuleFormat
    globals: {
        [key: string]: string
    }
}

declare class VueToJsSSRCompiler {
    directories: ToTemplate_Directories
    options: ToTemplate_Options
    
    constructor(directories: ToTemplate_Directories, options: ToTemplate_Options)

    render_all_views_for_ssr(): Promise<void>
    render_all_views_for_browser(): Promise<void>
}

declare type Data = {
    [key: string]: unknown
}

declare class ToHTMLBuilder {
    private map: Map
    private baseTemplateDir: string

    constructor(baseTemplateDir: string)

    toHtmlString(templateFilePath: string, props?: Data | null | undefined): Promise<string>
}