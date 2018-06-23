<template>
  <ul class="list">
    <li
      v-for="sample in samples"
      :key="makeKey(sample)"
    >
      {{ sample }}
    </li>
  </ul>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    /**
     * An array of strings to display:
     */
    samples: VueTypes.arrayOf(String).isRequired,
  },
  methods: {
    /**
     * Generate a key for template iteration.
     * @param {string} key
     * @public
     */
    makeKey: key => `${key}-${Math.random()}`,
  },
};
</script>

<style lang="scss" scoped>
  // A simple list item, with no list stylings.
  //
  // Styleguide app
  .list {
    list-style: none;
  }
</style>
