<template>
  <div class="file-loader bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
                border-gray-400 text-gray-400 transition duration-500 hover:text-white
                hover:bg-green-400 hover:border-green-400 hover:border-solid"
           :class="{ 'text-white bg-green-400 border-green-400 border-solid': isDragover }"
           @drag.prevent.stop=""
           @dragstart.prevent.stop=""
           @dragend.prevent.stop="isDragover = false"
           @dragover.prevent.stop="isDragover = true"
           @dragenter.prevent.stop="isDragover = true"
           @dragleave.prevent.stop="isDragover = false"
           @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div v-for="(upload, index) in uploads" :key="index" class="mb-4">
        <!-- File Name -->
        <div :class="upload.textClass" class="font-bold text-sm">
          <i :class="upload.icon"></i> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
              :style="{ width: upload.progress + '%' }"
              :class="upload.variant"
              class="transition-all progress-bar"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDownloadURL, getStorage, ref, uploadBytesResumable,
} from 'firebase/storage';

const storage = getStorage();
const storageRef = ref(storage);
const folderRef = ref(storageRef, 'songs');

// TODO: добавление нового раздела + выбор раздела перед загрузкой файлов

export default {
  name: 'file-loader',
  data() {
    return {
      isDragover: false,
      uploads: [],
    };
  },
  methods: {
    upload(evt) {
      this.isDragover = false;
      const files = [...evt.dataTransfer.files];
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
  },
};
</script>
