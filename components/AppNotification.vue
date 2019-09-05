<template>
  <v-snackbar :value="message !== null" :color="kind" @input="$notify">
    {{ message }}
    <v-btn text="" @click="$notify">
      {{ $t('close') }}
    </v-btn>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('notification', ['isError', 'kind', 'message'])
  }
}
</script>
