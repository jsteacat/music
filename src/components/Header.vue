<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
          class="text-white font-bold uppercase text-2xl mr-4"
          exact-active-class="no-active"
          :to="{ name: 'home' }"
      >
        Music
      </router-link>

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
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">Manage</router-link>
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
    ...mapMutations(['toggleAuthModalState', 'toggleAuthState', 'setCurrentUser']),
    logout() {
      const auth = getAuth();
      signOut(auth).then(() => {
        this.setCurrentUser(null);
        this.toggleAuthState({
          router: this.$router,
          route: this.$route,
        });
      }).catch((error) => {
        console.warn(error);
      });
    },
  },
};
</script>
