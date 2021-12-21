<template>
  <div class="song-item border border-gray-200 p-3 mb-4 rounded">
    <div v-show="showForm">
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
        <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600">
          Submit
        </button>
        <button
            type="button"
            class="py-1.5 px-3 rounded text-white bg-gray-600"
            @click.prevent="showForm = false"
        >
          Go Back
        </button>
      </VeeForm>
    </div>
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ item.modifiedName }}</h4>
      <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right">
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
    };
  },
  methods: {
    async save(formData) {
      console.log(formData);
      this.showForm = false;
    },
  },
};
</script>
