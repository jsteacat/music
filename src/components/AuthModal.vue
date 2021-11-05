<template>
  <!-- Auth Modal -->
  <div id="modal" class="fixed z-10 inset-0 overflow-y-auto">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity" @click="toggleAuthModal">
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden
        shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">Your Account</p>
            <!-- Modal Close Button -->
            <div class="modal-close cursor-pointer z-50" @click="toggleAuthModal">
              <i class="fas fa-times"></i>
            </div>
          </div>

          <!-- Tabs -->
          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a
                href="#"
                :class="{
                  'hover:text-white text-white bg-blue-600': tab === 'login',
                  'hover:text-blue-600': tab === 'register'
                }"
                class="block rounded py-3 px-4 transition"
                @click.prevent="tab = 'login'"
              >
                Login
              </a>
            </li>
            <li class="flex-auto text-center">
              <a
                href="#"
                :class="{
                  'hover:text-white text-white bg-blue-600': tab === 'register',
                  'hover:text-blue-600': tab === 'login'
                }"
                class="block rounded py-3 px-4 transition"
                @click.prevent="tab = 'register'"
              >
                Register
              </a>
            </li>
          </ul>

          <!-- Login Form -->
          <VeeForm
              v-if="tab === 'login'"
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
                class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700"
            >
              Submit
            </button>
          </VeeForm>

          <!-- Registration Alert -->
          <div
              v-if="showRegAlert"
              :class="regAlertVariant"
              class="text-white text-center text-bold p-5 mb-4"
          >
            {{ regAlertMessage }}
          </div>

          <!-- Registration Form -->
          <VeeForm
              v-if="tab === 'register'"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'AuthModal',
  data() {
    return {
      tab: 'login',
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|min:3|max:100|email',
        age: 'required|min_value:18|max_value:120|',
        password: 'required|min:3|max:32',
        confirm_password: 'passwords_mismatch:@password',
        country: 'required|country_excluded:Excluded country',
        tos: 'tos',
      },
      loginSchema: {
        email: 'required|email',
        password: 'required|min:3|max:32',
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
    ...mapMutations(['toggleAuthModal']),
    register(formData) {
      this.showRegAlert = true;
      this.regInSubmission = true;
      if (formData) {
        this.regAlertVariant = 'bg-green-500';
        this.regAlertMessage = 'Success! Your account has been created.';
        setTimeout(() => {
          this.toggleAuthModal();
        }, 2000);
      }
    },
    login(formData) {
      console.log(formData);
    },
  },
};
</script>
