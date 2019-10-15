<template>
  <div id="app">
    <a href="http://zondax.ch">
      <img
        alt="Vue logo"
        src="./assets/logo.png"
        width="300"
      >
    </a>
<<<<<<< HEAD
    <h1>Terra - Ledger integration example</h1>
    <TerraLedger msg="Minimal Terra+Ledger delegation example" />
=======
    <h1>Cosmos - Ledger integration example</h1>
    <CosmosLedger msg="Minimal Cosmos+Ledger delegation example" />
>>>>>>> cee52c334407072d7d337487d0a0f9645c493cca
  </div>
</template>

<script>
<<<<<<< HEAD
import TerraLedger from './components/TerraLedger.vue';
=======
import CosmosLedger from './components/CosmosLedger.vue';
>>>>>>> cee52c334407072d7d337487d0a0f9645c493cca

export default {
    name: 'App',
    components: {
<<<<<<< HEAD
        TerraLedger,
=======
        CosmosLedger,
>>>>>>> cee52c334407072d7d337487d0a0f9645c493cca
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
