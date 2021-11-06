<template>
  <div
      v-if="showLoginAlert"
      :class="loginAlertVariant"
      class="text-white text-center text-bold p-5 mb-4"
  >
    {{ loginAlertMessage }}
  </div>
  <VeeForm
      :validation-schema="loginSchema"
      @submit="login"
  >
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
    <button
        type="submit"
        :disabled="loginInSubmission"
        class="block w-full bg-purple-600 text-white py-1.5 px-3
        rounded transition hover:bg-purple-700"
    >Submit</button>
  </VeeForm>
</template>

<script>
// eslint-disable-next-line import/named
import { auth, signIn } from '../includes/firebase';

export default {
  name: 'LoginForm',
  data() {
    return {
      loginSchema: {
        email: 'required|email',
        password: 'required|min:3|max:32',
      },
      loginInSubmission: false,
      showLoginAlert: false,
      loginAlertVariant: 'bg-blue-500',
      loginAlertMessage: 'Please wait! We are logging you in.',
    };
  },
  methods: {
    login(formData) {
      if (formData) {
        this.showLoginAlert = true;
        this.loginInSubmission = true;
        this.loginAlertVariant = 'bg-blue-500';
        this.loginAlertMessage = 'Please wait! We are logging you in.';

        signIn(auth, formData.email, formData.password)
          .then((userCredential) => {
            this.loginAlertVariant = 'bg-green-500';
            this.loginAlertMessage = 'Success! You are logged in.';
            console.log(userCredential.user);
          })
          .catch((error) => {
            this.loginInSubmission = false;
            this.loginAlertVariant = 'bg-red-500';
            this.loginAlertMessage = error.message;
            console.log('error', error.code, error.message);
          });
      }
    },
  },
};
</script>
