<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <FileLoader ref="upload" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <SongItem v-for="song in songs" :key="song.id" :item="song" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import FileLoader from '../components/FileLoader.vue';
import SongItem from '../components/SongItem.vue';

export default {
  name: 'manage-page',
  // beforeRouteLeave(to, from, next) {
  //   this.$refs.upload.cancelUploads();
  //   next();
  // },
  data() {
    return {
      songs: [],
    };
  },
  async created() {
    this.songs = await this.$store.dispatch('getSongList');
  },
  components: {
    FileLoader,
    SongItem,
  },
};
</script>
