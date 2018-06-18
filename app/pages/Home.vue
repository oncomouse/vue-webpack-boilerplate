<template>
  <div>
    <SampleView :samples="samples"/>
    <Button :action="addSampleEvent">Click Me</Button>
    <Button :action="resetEvent">Reset List</Button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import SampleView from '../components/Samples.vue';
import Button from '../components/Button.vue';

export default {
  components: { SampleView, Button },
  computed: mapState({
    samples: state => state.samples.samples,
  }),
  methods: {
    ...mapActions({
      addSample: 'samples/addSample',
      reset: 'samples/reset',
    }),
    /**
     * Event handler for triggering a reset.
     * @public
     */
    resetEvent() {
      this.reset();
    },
    /**
     * Event handler for requesting a new sample to be added.
     * @public
     */
    addSampleEvent() {
      this.addSample();
    },
  },
};
</script>
