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
import { always } from 'ramda';

export default {
  name: 'SampleView',
  props: {
    samples: {
      type: Array,
      default: always([]),
    },
  },
  methods: {
    makeKey: key => `${key}-${Math.random()}`,
  },
};
</script>

<style lang="scss" scoped>
  .list {
    list-style: none;
  }
</style>
