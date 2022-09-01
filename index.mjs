import path from "path"
import fs from "fs"
import vue from "@vitejs/plugin-vue"
import { build, splitVendorChunkPlugin } from "vite"
import glob from "glob"
import { renderToString } from "@vue/server-renderer"
import { createSSRApp } from "vue"

function getRelPath(childDir, parentDir) {
    return path.relative(parentDir, childDir).split("\\").join("/")
}

class VueToJsSSRCompiler {
    directories;
    options;

    constructor(directories, options) {
        this.directories = directories
        this.options = options
    }

    async render_all_views_for_ssr() {
        let globs = path.join(this.directories.viewsSource, "/**/*.vue").split("\\").join("/")
        let files = glob.sync(globs)
        for (let file of files) {
            let relpath = getRelPath(file, this.directories.viewsSource);
            relpath = path.join(path.dirname(relpath), path.basename(relpath, path.extname(relpath)) + ".cjs") // ESM project should import commonjs with .cjs extension
            let outPath = path.join(this.directories.viewsDist, relpath)
            await fs.promises.mkdir(path.dirname(outPath), { recursive: true })
            const { output } = await build({
                plugins: [
                    vue()
                ],
                publicDir: false,
                build: {
                    minify: false,
                    ssr: true,
                    write: false,
                    cssCodeSplit: true,
                    rollupOptions: {
                        input: { relpath: file },
                        output: {
                            format: this.options.ssrFormat ?? "cjs",
                        }
                    }
                }
            })
            let code = output[0].code
            fs.writeFileSync(outPath, code, { flag: "w+" })
        }
    }


    async render_all_views_for_browser() {
        let globs = path.join(this.directories.browserSource, "/**/*.ts").split("\\").join("/")
        let files = glob.sync(globs)
        for (let file of files) {
            let relpath = getRelPath(file, this.directories.browserSource);
            relpath = path.join(path.dirname(relpath), path.basename(relpath, path.extname(relpath)))
            let underscored_name = relpath.split("\\").join("/").split("/").join("_")
            let entry = {}
            entry[underscored_name + ".js"] = file
            await build({
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
                        // should match with globals
                        external: this.options.external ?? ["@vue/runtime-dom"],
                        output: {
                            dir: this.directories.browserDist,
                            // format: "iife" produces single file, any extenal (vendor) library will be passed as variable in iife (see globals)
                            // external libraries must be included in html (or in this case, in .vue template file, in views folder)
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
            })
        }
    }
}


class ToHTMLBuilder {
    #map = new Map()
    #baseTemplateDir = null;

    constructor(baseTemplateDir) {
        this.#baseTemplateDir = baseTemplateDir
    }

    async toHtmlString(templateFilePath, props = null) {
        let template = this.#map.get(templateFilePath)
        if (!template) {
            let filepath = path.join(this.#baseTemplateDir, templateFilePath)
            template = await import("file://" + filepath)
            this.#map.set(templateFilePath, template)
        }
        let html = await renderToString(createSSRApp(template.default, props))
        return "<!DOCTYPE html>" + html
    }
}

export {
    VueToJsSSRCompiler,
    ToHTMLBuilder
}