<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <FileLoader
            ref="upload"
            :uploads="uploads"
            @upload="uploadToStorage"
        />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <SongItem
                v-for="song in songs"
                :key="song.id"
                :item="song"
                @remove="removeFromStorage"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {
  getDownloadURL, getStorage, ref, uploadBytesResumable, deleteObject,
} from 'firebase/storage';
import FileLoader from '../components/FileLoader.vue';
import SongItem from '../components/SongItem.vue';

const storage = getStorage();
const storageRef = ref(storage);
const folderRef = ref(storageRef, 'songs');

export default {
  name: 'manage-page',
  data() {
    return {
      uploads: [],
    };
  },

  computed: {
    songs() {
      // ради одного нет смысла тащить сюда mapState
      return this.$store.state.songs;
    },
  },

  methods: {
    uploadToStorage(evt) {
      this.uploads = [];
      const files = evt.dataTransfer ? [...evt.dataTransfer.files] : [...evt.target.files];

      files.forEach((file) => {
        if (file.type === 'audio/mpeg') {
          const singleRef = ref(folderRef, file.name);
          const task = uploadBytesResumable(singleRef, file);

          const uploadIndex = this.uploads.push({
            task,
            progress: 0,
            name: file.name,
            variant: 'bg-blue-400',
            icon: 'fas fa-spinner fa-spin',
            textClass: '',
          }) - 1;

          task.on('state_changed', (snapshot) => {
            this.uploads[uploadIndex].progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            );
          },
          (error) => {
            // Handle unsuccessful uploads
            console.warn(error);
            this.uploads[uploadIndex].variant = 'bg-red-400';
            this.uploads[uploadIndex].icon = 'fas fa-times';
            this.uploads[uploadIndex].textClass = 'text-red-400';
          },
          async () => {
            // Handle successful uploads on complete
            this.uploads[uploadIndex].variant = 'bg-green-400';
            this.uploads[uploadIndex].icon = 'fas fa-check';
            this.uploads[uploadIndex].textClass = 'text-green-400';

            const { uid, displayName } = this.$store.state.user;
            const song = {
              uid,
              displayName,
              originalName: task.snapshot.ref.name,
              modifiedName: task.snapshot.ref.name,
              genre: '',
              commentCount: 0,
            };

            song.url = await getDownloadURL(task.snapshot.ref);
            await this.$store.dispatch('createSong', song);
          });
        }
      });
    },

    removeFromStorage(item) {
      const desertRef = ref(storage, item.url);

      deleteObject(desertRef).then(() => {
        console.log('The file has been successfully deleted from the storage!');
      }).catch((error) => {
        console.warn(error);
      });
    },
  },

  async created() {
    await this.$store.dispatch('getSongList');
  },
  components: {
    FileLoader,
    SongItem,
  },
};
</script>
