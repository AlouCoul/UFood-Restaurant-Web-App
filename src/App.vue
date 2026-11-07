<template>
  <div id="app">
    <navigation></navigation>
    <router-view></router-view>
  </div>
</template>

<script setup>
import navigation from './components/shared/Navigation.vue'
</script>

<style>
@import url('./styles/styles.css');
</style>
