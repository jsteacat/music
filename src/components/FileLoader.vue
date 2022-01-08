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
      <input type="file" multiple @change="upload($event)" />
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
export default {
  name: 'file-loader',
  props: {
    uploads: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isDragover: false,
    };
  },
  methods: {
    upload(evt) {
      this.isDragover = false;
      this.$emit('upload', evt);
    },
    cancelUploads() {
      this.uploads.forEach((upload) => {
        upload.task.cancel();
      });
    },
  },
  beforeUnmount() {
    this.cancelUploads();
  },
};
</script>
