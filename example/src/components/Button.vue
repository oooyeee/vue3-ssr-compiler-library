<script setup lang="ts">
import { ref } from 'vue'
defineProps(["passed"])

const count = ref(0)

</script>

<template>
  <button @click="count++">Passed: {{ passed }}. Clicked {{ count }} times.</button>
</template>

<style scoped src="./Button.css">
/*Could be also SASS*/
</style>