<template>
  <Toast></Toast>

  <img alt="Vue logo"  src="./assets/logo.png" style="  position: fixed;
                                                        top: 0px;
                                                        z-index:-10;
                                                        left: 0px;
                                                        right: 0px;
                                                        bottom: 0;
                                                        margin: auto;
                                                        width: -webkit-fill-available;
                                                        opacity: 0.15;
                                                        ">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Toast from 'primevue/toast';



export default {
  name: 'App',
  components: {
    'HelloWorld':HelloWorld,
    'Toast':Toast
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}


</style>
