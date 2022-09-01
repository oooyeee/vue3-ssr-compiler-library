<template>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <link rel="stylesheet" v-bind:href=csssource>
        <!-- <script defer type="module" src="/Home.vendor.js"></script> -->
        <script defer src="https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.37/vue.runtime.global.min.js"></script>
        <!-- <script defer type="module" v-bind:src=jssource></script> -->
        <!-- Make Sure, the compiled Home.ts -> dist/views/browser/Home.js is at server root folder -->
        <script defer src="/Home.js"></script>
    </head>

    <body>
        <div class="wrapper">
            <h1>hello from template :)</h1>
            <h2>passed prop hello: {{ hello }}</h2>
            <div id="isle"><Button v-bind:passed=passed /></div>
            <p>this is kek: {{ kek }}</p>
        </div>
    </body>

    </html>
</template>

<script setup lang="ts">
import Button from '../components/Button.vue';
defineProps(['hello', "jssource", "csssource", "passed"])

const kek = ["k", "e", "k"].join("--");

</script>
<style>
/*This style will not be compiled. Style should not be used in template, use <link rel="stylesheet"> in <head>*/
/*But, components styles will be compiled*/
</style>