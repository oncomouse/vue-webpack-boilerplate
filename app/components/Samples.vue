<template>
  <ul class="list">
    <li v-for="sample in samples" v-bind:key="makeKey(sample)">
      {{sample}}
    </li>
  </ul>
</template>

<script>
import { map } from 'ramda';

export default {
  name: 'SampleView',
  props: ['samples'],
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
