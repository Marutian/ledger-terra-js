<template>
  <div id="app">
    <a href="http://zondax.ch">
      <img
        alt="Vue logo"
        src="./assets/logo.png"
        width="300"
      >
    </a>
    <h1>Terra - Ledger integration example</h1>
    <TerraLedger msg="Minimal Terra+Ledger delegation example" />
  </div>
</template>

<script>
import TerraLedger from './components/TerraLedger.vue';

export default {
    name: 'App',
    components: {
        TerraLedger,
    },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
