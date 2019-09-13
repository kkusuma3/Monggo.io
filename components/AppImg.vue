<template>
  <v-img
    class="grey lighten-5"
    :alt="alt"
    :src="src"
    :lazy-src="lazySrc"
    :aspect-ratio="aspectRatio"
    :width="width"
    :height="height"
    :max-width="maxWidth"
    :max-height="maxHeight"
    :contain="contain"
    :gradient="gradient"
  >
    <template #placeholder="">
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular indeterminate="" color="grey lighten-3" />
      </v-row>
    </template>
    <slot />
  </v-img>
</template>

<script>
export default {
  name: 'AppImg',
  props: {
    alt: {
      type: String,
      required: true,
      default: ''
    },
    src: {
      type: String,
      required: true,
      default: ''
    },
    lazySrc: {
      type: String,
      default: ''
    },
    aspectRatio: {
      type: [String, Number],
      default: ''
    },
    width: {
      type: [String, Number],
      default: ''
    },
    height: {
      type: [String, Number],
      default: ''
    },
    maxWidth: {
      type: [String, Number],
      default: ''
    },
    maxHeight: {
      type: [String, Number],
      default: ''
    },
    contain: {
      type: Boolean,
      default: true
    },
    gradient: {
      type: String,
      default: ''
    }
  }
}
</script>
