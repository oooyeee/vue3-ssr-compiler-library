(function(runtimeDom) {
  "use strict";
  var __vite_style__ = document.createElement("style");
  __vite_style__.innerHTML = "button[data-v-707516e7] {\r\n    border: 1px solid cyan;\n}";
  document.head.appendChild(__vite_style__);
  const _sfc_main = /* @__PURE__ */ runtimeDom.defineComponent({
    __name: "Button",
    props: ["passed"],
    setup(__props) {
      const count = runtimeDom.ref(0);
      return (_ctx, _cache) => {
        return runtimeDom.openBlock(), runtimeDom.createElementBlock("button", {
          onClick: _cache[0] || (_cache[0] = ($event) => count.value++)
        }, "Passed: " + runtimeDom.toDisplayString(__props.passed) + ". Clicked " + runtimeDom.toDisplayString(count.value) + " times.", 1);
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
  const Button = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-707516e7"]]);
  console.log("watch in console");
  runtimeDom.createApp(Button, { passed: "::passed msg::" }).mount("#isle", true);
})(Vue);
