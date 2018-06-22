<template>
  <button @click.prevent="action">
    <slot /> <!--@slot Default for any children passed.-->
  </button>
</template>

<script>
import { identity } from 'ramda';
import VueTypes from 'vue-types';

export default {
  name: 'Button',
  props: {
    /**
     * A function that gets called with the click event.
     */
    action: VueTypes.func.def(identity).isRequired,
  },
};
</script>


<style lang="scss" scoped>
@import "../variables";

// A button that changes color when hovered over.
//
// :hover     - Reverse foreground and background colors
//
// Styleguide app
button {
  background: $buttonForegroundColor;
  border: 1px solid $buttonBackgroundColor;
  color: $buttonBackgroundColor;
  padding: 10px 30px;
  margin: 0 10px;
  outline: none;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    color: $buttonForegroundColor;
    background-color: $buttonBackgroundColor;
  }
}
</style>
