<template>
  <div class="song-item border border-gray-200 p-3 mb-4 rounded">
    <div v-show="showForm">
      <div v-if="showAlert" :class="['text-white text-center font-bold p-4 mb-4', alert.variant]">
        {{ alert.message }}
      </div>
      <VeeForm :validation-schema="formSchema" :initial-values="item" @submit="save">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <VeeField name="modifiedName" :bails="false" #default="{ field, errors }">
            <input type="text"
                   class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
                   placeholder="Enter Song Title"
                   v-bind="field"
            />
            <div class="text-red-600 text-xs" v-for="(error, index) in errors" :key="index">
              {{error}}
            </div>
          </VeeField>
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <VeeField name="genre" :bails="false" #default="{ field, errors }">
            <input type="text"
                   class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
                   placeholder="Enter Genre"
                   v-bind="field"
            />
            <div class="text-red-600 text-xs" v-for="(error, index) in errors" :key="index">
              {{error}}
            </div>
          </VeeField>
        </div>
        <button
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-green-600"
            :disabled="inSubmission"
        >
          Submit
        </button>
        <button
            type="button"
            class="py-1.5 px-3 rounded text-white bg-gray-600"
            :disabled="inSubmission"
            @click.prevent="showForm = false"
        >
          Go Back
        </button>
      </VeeForm>
    </div>
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ item.modifiedName }}</h4>
      <button
          class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
          @click.prevent="remove"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
          class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
          @click.prevent="showForm = true"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'song-item',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      formSchema: {
        modifiedName: 'required',
        genre: 'alpha_spaces',
      },
      showForm: false,
      inSubmission: false,
      showAlert: false,
      alert: {
        variant: 'bg-blue-500',
        message: 'Please wait! Updating song info.',
      },
    };
  },

  methods: {
    async save(formData) {
      this.inSubmission = true;
      this.showAlert = true;
      this.alert = {
        variant: 'bg-blue-500',
        message: 'Please wait! Updating song info.',
      };

      try {
        await this.$store.dispatch('editSong', { ...formData, id: this.item.id });
        this.alert = {
          variant: 'bg-green-500',
          message: 'Success!',
        };
        this.inSubmission = false;
        this.showAlert = false;
      } catch (e) {
        this.inSubmission = false;
        this.alert = {
          variant: 'bg-red-500',
          message: e.message,
        };
      }
    },
    async remove() {
      await this.$store.dispatch('removeSong', this.item.id);
      this.$emit('remove', this.item);
    },
  },
};
</script>
