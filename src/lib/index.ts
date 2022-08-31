import * as path from "path"
import * as fs from "fs"
import vue from "@vitejs/plugin-vue"
import { renderToString } from "@vue/server-renderer"
import { createSSRApp } from "vue"
import { build } from "vite"
import type { InlineConfig } from "vite"
import { splitVendorChunkPlugin } from 'vite'
import type { InputOption, ModuleFormat, RollupOutput } from "rollup"
import * as glob from "glob"

function getRelPath(childDir: string, parentDir: string) {
    return path.relative(parentDir, childDir).split("\\").join("/")
}

// Must be Full Paths
type DirectoriesConfig = {
    viewsSource: string
    viewsDist: string
    browserSource: string
    browserDist: string
}


type RollupCompileOptions = {
    external: string[],
    ssrFormat: ModuleFormat,
    browserFormat: ModuleFormat,
    globals: { [key: string]: string }
}


class VueToJsSSRCompiler {
    directories: DirectoriesConfig
    options: RollupCompileOptions
    constructor(directories: DirectoriesConfig, options: RollupCompileOptions) {
        this.directories = directories
        this.options = options
        console.log("===================== COMPILER INSTANCIATED =========================")
    }

    async render_all_views_for_ssr(): Promise<void> {
        let globs = path.join(this.directories.viewsSource, "/**/*.vue").split("\\").join("/")

        glob(globs, {}, async (err, files) => {
            files.forEach(async (file) => {
                let relpath = getRelPath(file, this.directories.viewsSource);
                relpath = path.join(path.dirname(relpath), path.basename(relpath, path.extname(relpath)) + ".js")
                let outPath = path.join(this.directories.viewsDist, relpath)
                await fs.promises.mkdir(path.dirname(outPath), { recursive: true })

                let vite_build_options: InlineConfig = {
                    plugins: [
                        vue()
                    ],
                    publicDir: false,
                    build: {
                        minify: false,
                        ssr: true,
                        write: false,
                        rollupOptions: {
                            input: { relpath: file },
                            output: {
                                format: this.options.ssrFormat ?? "cjs"
                            }
                        }
                    }
                }
                const { output } = await build(vite_build_options) as RollupOutput
                let code = output[0].code
                fs.writeFileSync(outPath, code, { flag: "w+" })
            })
        })
    }


    async render_all_views_for_browser(): Promise<void> {
        let globs = path.join(this.directories.browserSource, "/**/*.ts").split("\\").join("/")

        glob(globs, {}, async (err, files) => {
            files.forEach(async (file) => {
                let relpath = getRelPath(file, this.directories.browserSource);
                relpath = path.join(path.dirname(relpath), path.basename(relpath, path.extname(relpath)))
                let underscored_name = relpath.split("\\").join("/").split("/").join("_")
                let entry: InputOption = {}
                entry[underscored_name + ".js"] = file
                let vite_build_options: InlineConfig = {
                    configFile: false,
                    plugins: [
                        vue(),
                        splitVendorChunkPlugin()
                    ],
                    publicDir: false,
                    build: {
                        emptyOutDir: false,
                        minify: false,
                        manifest: underscored_name + ".manifest.json",
                        rollupOptions: {
                            input: entry,
                            external: this.options.external ?? ["@vue/runtime-dom"],
                            // external: ["lodash"],
                            output: {
                                dir: this.directories.browserDist,
                                // format: "iife", // maybe use this way if used with external
                                format: this.options.browserFormat ?? "iife",
                                entryFileNames: "[name]",
                                assetFileNames: `${underscored_name}.[ext]`,
                                chunkFileNames: `${underscored_name}.vendor.js`,
                                globals: {
                                    "@vue/runtime-dom": "Vue"
                                }
                            }
                        }
                    }
                }
                await build(vite_build_options)
            })
        })
    }
}

class TmplateBuilder {
    #map = new Map()
    #baseTemplateDir: string

    constructor(baseTemplateDir: string) {
        this.#baseTemplateDir = baseTemplateDir
    }

    async toHtmlString(templateFilePath: string, props: {[key: string]: any} = {}): Promise<string> {
        let template = this.#map.get(templateFilePath)
        if (!template) {
            let filepath = path.join(this.#baseTemplateDir, templateFilePath)
            if(__dirname) {
                template = await import(filepath)
            } else {
                template = await import("file://" + filepath)
            }
            console.log(template)
            this.#map.set(templateFilePath, template)
        }
        let html = await renderToString(createSSRApp(template.default, props))
        return "<!DOCTYPE html>" + html
    }
}

export {
    VueToJsSSRCompiler,
    TmplateBuilder
}


