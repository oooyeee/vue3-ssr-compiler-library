"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TmplateBuilder = exports.VueToJsSSRCompiler = void 0;
const path = require("path");
const fs = require("fs");
const plugin_vue_1 = require("@vitejs/plugin-vue");
const server_renderer_1 = require("@vue/server-renderer");
const vue_1 = require("vue");
const vite_1 = require("vite");
const vite_2 = require("vite");
const glob = require("glob");
function getRelPath(childDir, parentDir) {
    return path.relative(parentDir, childDir).split("\\").join("/");
}
class VueToJsSSRCompiler {
    directories;
    options;
    constructor(directories, options) {
        this.directories = directories;
        this.options = options;
        console.log("===================== COMPILER INSTANCIATED =========================");
    }
    async render_all_views_for_ssr() {
        let globs = path.join(this.directories.viewsSource, "/**/*.vue").split("\\").join("/");
        glob(globs, {}, async (err, files) => {
            files.forEach(async (file) => {
                let relpath = getRelPath(file, this.directories.viewsSource);
                relpath = path.join(path.dirname(relpath), path.basename(relpath, path.extname(relpath)) + ".js");
                let outPath = path.join(this.directories.viewsDist, relpath);
                await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
                let vite_build_options = {
                    plugins: [
                        (0, plugin_vue_1.default)()
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
                };
                const { output } = await (0, vite_1.build)(vite_build_options);
                let code = output[0].code;
                fs.writeFileSync(outPath, code, { flag: "w+" });
            });
        });
    }
    async render_all_views_for_browser() {
        let globs = path.join(this.directories.browserSource, "/**/*.ts").split("\\").join("/");
        glob(globs, {}, async (err, files) => {
            files.forEach(async (file) => {
                let relpath = getRelPath(file, this.directories.browserSource);
                relpath = path.join(path.dirname(relpath), path.basename(relpath, path.extname(relpath)));
                let underscored_name = relpath.split("\\").join("/").split("/").join("_");
                let entry = {};
                entry[underscored_name + ".js"] = file;
                let vite_build_options = {
                    configFile: false,
                    plugins: [
                        (0, plugin_vue_1.default)(),
                        (0, vite_2.splitVendorChunkPlugin)()
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
                };
                await (0, vite_1.build)(vite_build_options);
            });
        });
    }
}
exports.VueToJsSSRCompiler = VueToJsSSRCompiler;
class TmplateBuilder {
    #map = new Map();
    #baseTemplateDir;
    constructor(baseTemplateDir) {
        this.#baseTemplateDir = baseTemplateDir;
    }
    async toHtmlString(templateFilePath, props = {}) {
        let template = this.#map.get(templateFilePath);
        if (!template) {
            let filepath = path.join(this.#baseTemplateDir, templateFilePath);
            if (__dirname) {
                template = await Promise.resolve().then(() => require(filepath));
            }
            else {
                template = await Promise.resolve().then(() => require("file://" + filepath));
            }
            console.log(template);
            this.#map.set(templateFilePath, template);
        }
        let html = await (0, server_renderer_1.renderToString)((0, vue_1.createSSRApp)(template.default, props));
        return "<!DOCTYPE html>" + html;
    }
}
exports.TmplateBuilder = TmplateBuilder;
