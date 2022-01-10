<template>
  <div>
    <router-link
        :to="{ name: 'song', params: { id: song.id } }"
        class="font-bold block text-gray-600"
    >
      {{ song.modifiedName }}
    </router-link>
<!--    <span class="text-gray-500 text-sm">{{ song.displayName }}</span>-->
  </div>

  <div class="text-gray-600 text-lg">
    <span class="comments">
      <i class="fa fa-comments text-gray-600"></i>
      {{ song.commentCount }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'song-item',

  props: {
    song: {
      type: Object,
      required: true,
    },
  },
};
</script>
