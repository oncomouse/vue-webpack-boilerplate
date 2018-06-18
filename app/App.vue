<template>
  <div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="scss">
  @import "normalize-scss";
  
  @include normalize();
  
  @import "variables";
  
  html {
    font-family: $base-font;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: $header-font;
  }
</style>
