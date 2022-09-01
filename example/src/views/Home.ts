import { createApp } from "@vue/runtime-dom";
// import { createApp } from "vue"
import type { Component, CreateAppFunction } from "vue";

import Button from '../components/Button.vue';

console.log("watch in console")

// On server "passed" variable = "::passed msg::". Making sure its the same for consistency
createApp(Button as unknown as Component, { passed: "::passed msg::" }).mount("#isle", true)