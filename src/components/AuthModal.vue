<template>
  <!-- Auth Modal -->
  <div :class="['fixed z-10 inset-0 overflow-y-auto', { hidden: !authModalShow }]" id="modal">
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
          <form v-if="tab === 'login'">
            <!-- Email -->
            <div class="mb-3">
              <label class="inline-block mb-2">Email</label>
              <input
                  type="email"
                  class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                  placeholder="Enter Email"
              />
            </div>
            <!-- Password -->
            <div class="mb-3">
              <label class="inline-block mb-2">Password</label>
              <input
                  type="password"
                  class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                  placeholder="Password"
              />
            </div>
            <button
                type="submit"
                class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700"
            >
              Submit
            </button>
          </form>
          <!-- Registration Form -->
          <VeeForm v-if="tab === 'register'" :validation-schema="schema" @submit="register">
            <!-- Name -->
            <div class="mb-3">
              <label class="inline-block mb-2">Name</label>
              <VeeField
                  type="text"
                  name="name"
                  class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                  placeholder="Enter Name"
              />
              <ErrorMessage name="name">
                <p class="text-red-600">Name is not valid!</p>
              </ErrorMessage>
            </div>
            <!-- Email -->
            <div class="mb-3">
              <label class="inline-block mb-2">Email</label>
              <VeeField
                  type="email"
                  name="email"
                  class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                  placeholder="Enter Email"
              />
              <ErrorMessage name="email">
                <p class="text-red-600">Email is not valid!</p>
              </ErrorMessage>
            </div>
            <!-- Age -->
            <div class="mb-3">
              <label class="inline-block mb-2">Age</label>
              <VeeField
                  type="number"
                  name="age"
                  class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
              />
              <ErrorMessage name="age">
                <p class="text-red-600">Age is not valid!</p>
              </ErrorMessage>
            </div>
            <!-- Password -->
            <div class="mb-3">
              <label class="inline-block mb-2">Password</label>
              <VeeField
                  type="password"
                  name="password"
                  class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                  placeholder="Password"
              />
              <ErrorMessage name="password">
                <p class="text-red-600">Password is not valid!</p>
              </ErrorMessage>
            </div>
            <!-- Confirm Password -->
            <div class="mb-3">
              <label class="inline-block mb-2">Confirm Password</label>
              <VeeField
                  type="password"
                  name="confirm_password"
                  class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                  placeholder="Confirm Password"
              />
              <ErrorMessage name="confirm_password">
                <p class="text-red-600">Passwords is not equals!</p>
              </ErrorMessage>
            </div>
            <!-- Country -->
            <div class="mb-3">
              <label class="inline-block mb-2">Country</label>
              <VeeField
                  as="select"
                  name="country"
                  class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
              >
                <option value="USA">USA</option>
                <option value="Mexico">Mexico</option>
                <option value="Germany">Germany</option>
                <option value="Excluded country">Excluded country</option>
              </VeeField>
              <ErrorMessage name="country">
                <p class="text-red-600">Country is not valid!</p>
              </ErrorMessage>
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
              <ErrorMessage name="tos" class="block">
                <p class="text-red-600">Accept terms of service!</p>
              </ErrorMessage>
            </div>
            <button
                type="submit"
                class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700"
            >
              Submit
            </button>
          </VeeForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'AuthModal',
  data() {
    return {
      tab: 'login',
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|min:3|max:100|email',
        age: 'required|min_value:18|max_value:100|',
        password: 'required|min:3|max:100',
        confirm_password: 'confirmed:@password',
        country: 'required|excluded:Excluded country',
        tos: 'required',
      },
    };
  },
  computed: {
    ...mapState(['authModalShow']),
  },
  methods: {
    ...mapMutations(['toggleAuthModal']),
    register(formData) {
      if (formData) {
        this.toggleAuthModal();
      }
    },
  },
};
</script>
