<template>
  <v-img
    :alt="alt"
    :src="src"
    :lazy-src="lazySrc"
    :aspect-ratio="aspectRatio"
    :width="width"
    :height="height"
    :max-width="maxWidth"
    :max-height="maxHeight"
    class="grey lighten-2"
    contain=""
  >
    <template #placeholder="">
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular indeterminate="" color="grey lighten-3" />
      </v-row>
    </template>
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
    }
  }
}
</script>
