"use strict";
const vue = require("vue");
const serverRenderer = require("vue/server-renderer");
const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
  __name: "Button",
  __ssrInlineRender: true,
  props: ["passed"],
  setup(__props) {
    const count = vue.ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${serverRenderer.ssrRenderAttrs(_attrs)} data-v-707516e7>Passed: ${serverRenderer.ssrInterpolate(__props.passed)}. Clicked ${serverRenderer.ssrInterpolate(count.value)} times.</button>`);
    };
  }
});
const Button_css_vue_type_style_index_0_src_707516e7_scoped_707516e7_lang = "";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("example/src/components/Button.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Button = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-707516e7"]]);
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  __name: "Home",
  __ssrInlineRender: true,
  props: ["hello", "jssource", "csssource", "passed"],
  setup(__props) {
    const kek = ["k", "e", "k"].join("--");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<html${serverRenderer.ssrRenderAttrs(vue.mergeProps({ lang: "en" }, _attrs))}><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title><link rel="stylesheet"${serverRenderer.ssrRenderAttr("href", __props.csssource)}><!-- <script defer type="module" src="/Home.vendor.js"><\/script> --><script defer src="https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.37/vue.runtime.global.min.js"><\/script><!-- <script defer type="module" v-bind:src=jssource><\/script> --><!-- Make Sure, the compiled Home.ts -> dist/views/browser/Home.js is at server root folder --><script defer src="/Home.js"><\/script></head><body><div class="wrapper"><h1>hello from template :)</h1><h2>passed prop hello: ${serverRenderer.ssrInterpolate(__props.hello)}</h2><div id="isle">`);
      _push(serverRenderer.ssrRenderComponent(Button, { passed: __props.passed }, null, _parent));
      _push(`</div><p>this is kek: ${serverRenderer.ssrInterpolate(vue.unref(kek))}</p></div></body></html>`);
    };
  }
});
const Home_vue_vue_type_style_index_0_lang = "";
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("example/src/views/Home.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
module.exports = _sfc_main;
