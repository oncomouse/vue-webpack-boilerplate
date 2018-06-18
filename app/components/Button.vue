<template>
  <button @click.prevent="action">
    <slot />
  </button>
</template>

<script>
import { identity } from 'ramda';

export default {
  props: {
    action: {
      type: Function,
      default: identity,
      required: true,
    },
  },
};
</script>


<style lang="scss" scoped>
@import "../variables";

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
