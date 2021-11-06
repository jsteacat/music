<template>
  <div
      v-if="showRegAlert"
      :class="regAlertVariant"
      class="text-white text-center text-bold p-5 mb-4"
  >
    {{ regAlertMessage }}
  </div>
  <VeeForm
      :validation-schema="schema"
      :initial-values="usedData"
      @submit="register"
  >
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <VeeField name="name" :bails="false" #default="{ field, errors }">
        <input
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                    transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Name"
            v-bind="field"
        >
        <div class="text-red-600 text-xs" v-for="(error, index) in errors" :key="index">
          {{error}}
        </div>
      </VeeField>
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <VeeField name="email" :bails="false" #default="{ field, errors }">
        <input
            type="email"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                    transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Email"
            v-bind="field"
        >
        <div class="text-red-600 text-xs" v-for="(error, index) in errors" :key="index">
          {{error}}
        </div>
      </VeeField>
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <VeeField name="age" :bails="false" #default="{ field, errors }">
        <input
            type="number"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                    transition duration-500 focus:outline-none focus:border-black rounded"
            v-bind="field"
        >
        <div class="text-red-600 text-xs" v-for="(error, index) in errors" :key="index">
          {{error}}
        </div>
      </VeeField>
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <VeeField name="password" :bails="false" #default="{ field, errors }">
        <input
            type="password"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                    transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Password"
            v-bind="field"
        >
        <div class="text-red-600 text-xs" v-for="(error, index) in errors" :key="index">
          {{error}}
        </div>
      </VeeField>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <VeeField name="confirm_password" :bails="false" #default="{ field, errors }">
        <input
            type="password"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                    transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Confirm Password"
            v-bind="field"
        >
        <div class="text-red-600 text-xs" v-for="(error, index) in errors" :key="index">
          {{error}}
        </div>
      </VeeField>
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <VeeField name="country" :bails="false" #default="{ field, errors }">
        <select
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                    transition duration-500 focus:outline-none focus:border-black rounded"
            v-bind="field">
          <option value="USA">USA</option>
          <option value="Mexico">Mexico</option>
          <option value="Germany">Germany</option>
          <option value="Excluded country">Excluded country</option>
        </select>
        <div class="text-red-600 text-xs" v-for="(error, index) in errors" :key="index">
          {{error}}
        </div>
      </VeeField>
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <VeeField
          type="checkbox"
          name="tos"
          value="1"
          class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <label class="inline-block">Accept terms of service</label>
      <ErrorMessage name="tos" class="text-red-600 text-xs block"/>
    </div>
    <button
        type="submit"
        :disabled="regInSubmission"
        class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700"
    >Submit</button>
  </VeeForm>
</template>

<script>
export default {
  name: 'RegisterForm',
  data() {
    return {
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|min:3|max:100|email',
        age: 'required|min_value:18|max_value:120|',
        password: 'required|min:6|max:32',
        confirm_password: 'passwords_mismatch:@password',
        country: 'required|country_excluded:Excluded country',
        tos: 'tos',
      },
      usedData: {
        country: 'USA',
      },
      regInSubmission: false,
      showRegAlert: false,
      regAlertVariant: 'bg-blue-500',
      regAlertMessage: 'Please wait! Your account is being created.',
    };
  },
  methods: {
    async register(formData) {
      if (formData) {
        this.showRegAlert = true;
        this.regInSubmission = true;
        this.regAlertVariant = 'bg-blue-500';
        this.regAlertMessage = 'Please wait! Your account is being created.';

        try {
          await this.$store.dispatch('register', formData);
          this.regAlertVariant = 'bg-green-500';
          this.regAlertMessage = 'Success! Your account has been created.';
        } catch (e) {
          this.regInSubmission = false;
          this.regAlertVariant = 'bg-red-500';
          this.regAlertMessage = e.message;
        }
      }
    },
  },
  // async created() {
  //   const querySnapshot = await getCollection(usersCollection);
  //   querySnapshot.forEach((doc) => {
  //     console.log(doc.id, ' => ', doc.data());
  //   });
  // },
};
</script>
