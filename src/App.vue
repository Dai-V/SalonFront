<script setup>
import SideNavbar from './components/SideNavbar.vue';


</script>



<template>
  <body>
  <SideNavbar />
  <RouterView />
  </body>
</template>

<style scoped>
body {
    padding-left: 250px;
}
</style>
