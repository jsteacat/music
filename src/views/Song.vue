<template>
  <div v-if="song">
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
           style="background-image: url(../assets/img/song-header.png)">
      </div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button type="button" class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
        focus:outline-none">
          <i class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
          <div>{{ song.genre }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">Comments ({{ comments.length }})</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
              v-if="showCommentAlert"
              :class="commentAlertVariant"
              class="text-white text-center text-bold p-5 mb-4"
          >
            {{ commentAlertMessage }}
          </div>
          <VeeForm v-if="$store.state.isAuth" :validation-schema="schema" @submit="addComment">
            <VeeField as="textarea" name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
              duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."></VeeField>
            <ErrorMessage class="text-red-600" name="comment" />
            <button
                type="submit"
                :disabled="commentInSubmission"
                class="py-1.5 px-3 rounded text-white bg-green-600 block"
            >
              Submit
            </button>
          </VeeForm>
          <!-- Sort Comments -->
          <select
              v-if="song.commentCount > 3"
              class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded">
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul v-if="comments.length > 0" class="container mx-auto">
      <li
          v-for="comment in comments"
          :key="comment.id"
          class="p-6 bg-gray-50 border border-gray-200"
      >
        <div class="mb-5">
          <div class="font-bold">{{ comment.author }}</div>
          <time>{{ comment.created }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'song-page',

  data() {
    return {
      song: null,
      comments: [],
      schema: {
        comment: 'required|min:3',
      },
      commentInSubmission: false,
      showCommentAlert: false,
      commentAlertVariant: 'bg-blue-500',
      commentAlertMessage: 'Please wait! Comment is being created.',
    };
  },

  methods: {
    async addComment(formData, { resetForm }) {
      if (formData) {
        this.showCommentAlert = true;
        this.commentInSubmission = true;
        this.commentAlertVariant = 'bg-blue-500';
        this.commentAlertMessage = 'Please wait! Comment is being created.';

        const comment = {
          content: formData.comment,
          created: new Date().toString(),
          sid: this.$route.params.id,
        };

        try {
          const savedComment = await this.$store.dispatch('addComment', comment);
          this.comments.unshift(savedComment);
          this.commentAlertVariant = 'bg-green-500';
          this.commentAlertMessage = 'Comment added!';
          resetForm();
        } catch (e) {
          this.commentInSubmission = false;
          this.commentAlertVariant = 'bg-red-500';
          this.commentAlertMessage = e.message;
        }
      }
    },
  },

  async created() {
    this.song = await this.$store.dispatch('getSongById', this.$route.params.id);
    if (!this.song) await this.$router.push({ name: 'home' });
    this.comments = await this.$store.dispatch('getCommentsBySid', this.$route.params.id);
  },
};
</script>
