<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link class="text-white font-bold uppercase text-2xl mr-4" to="/">Music</router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li v-if="!$store.state.isAuth">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModalState">
              Login / Register
            </a>
          </li>
          <template v-else>
            <li>
              <a class="px-2 text-white" href="#">Manage</a>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logout">Logout</a>
            </li>
          </template>
        </ul>
      </div>

    </nav>
  </header>
</template>

<script>
import { mapMutations } from 'vuex';
import { getAuth, signOut } from 'firebase/auth';

export default {
  name: 'AppHeader',
  methods: {
    ...mapMutations(['toggleAuthModalState', 'toggleAuthState']),
    logout() {
      const auth = getAuth();
      signOut(auth).then(() => {
        this.toggleAuthState();
      }).catch((error) => {
        console.log(error);
      });
    },
  },
};
</script>
