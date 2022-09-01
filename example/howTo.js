const path = require("path")
const fs = require("fs")
const { ToHTMLBuilder, VueToJsSSRCompiler } = require("../index.js")

const example_dir = __dirname;

async function Run() {
    let root = __dirname

    let ssrTemplatesDir = path.join(root, "dist/views/ssr")

    let compiler = new VueToJsSSRCompiler({
        viewsSource: path.join(root, "src/views"),
        browserSource: path.join(root, "src/views"),
        viewsDist: ssrTemplatesDir,
        browserDist: path.join(root, "dist/views/browser")
    }, {
        external: ["@vue/runtime-dom"],
        ssrFormat: "cjs",
        browserFormat: "iife",
        globals: {
            "@vue/runtime-dom": "Vue"
        }
    });

    await compiler.render_all_views_for_ssr();
    await compiler.render_all_views_for_browser();

    let builder = new ToHTMLBuilder(ssrTemplatesDir);

    let html = await builder.toHtmlString("Home.js", {
        hello: "::hello msg::", // prop passed to Home.vue
        passed: "::passed msg::", // prop passed to Button component
        csssource: "/Home.css", // on web root
        jssource: "/Home.js" // js file compiled for browser, on web root
    })

    console.log("=============== HTML ===============")
    console.log(html);
    console.log("=============== BUILDING FOR SSG ===============");
    fs.writeFileSync(path.join(example_dir, "./wwwroot/produced_html.html"), html, { flag: "w+" });
    fs.copyFileSync(path.join(example_dir, "./dist/views/browser/Home.js"), path.join(example_dir, "./wwwroot/Home.js"))
    console.log("=============== Run static server in ./example/wwwroot folder ===============");
}

Run();