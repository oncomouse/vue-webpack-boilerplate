<template>
  <div>
    <router-view/>
  </div>
</template>

<script>
/**
 * Define the App component, which hooks router-view to a global stylesheet.
 * In most situations, do not edit these <script> or <template> tags.
 */
import './global.scss';

export default {
  name: 'App',
};

</script>
