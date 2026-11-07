<template>
  <div class="auth-form container bg-dark text-light py-5 rounded shadow-sm">
    <h2 class="text-center mb-4">Login to UFood</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group mb-3">
        <input 
          type="text" 
          v-model="email" 
          class="form-control" 
          placeholder="Email" 
          required 
          name="email" 
          aria-label="Email address" 
        />
        <input 
          type="password" 
          v-model="password" 
          class="form-control mt-2" 
          placeholder="Password" 
          required
          name="password" 
        />
      </div>
      <p v-if="validationError" class="text-danger">{{ validationError }}</p>
      <button 
        type="submit" 
        class="btn btn-warning w-100 fw-bold"
        style="background-color: #E2850B; border: none; color: white;"
      >
        Login
      </button>
    </form>
    <div class="text-center mt-3">
      <router-link to="/signup" class="text-link ">
        Don't have an account ? Sign up !
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { loginUser } from "@/api/api";

export default defineComponent({
  name: 'LoginForm',
  props: {
    mode: {
      type: String,
      default: 'login',
    }
  },
  data() {
    return {
      email: '',
      password: '',
      validationError: '',
    };
  },
  computed: {
    isSignup() {
      return this.mode === 'signup';
    },
  },
  methods: {
    async submitForm() {
      const result = await loginUser(this.email, this.password);
      if (result.status != 401) {
        this.$emit('userSelected', result.data.email);
      } else {
        this.validationError = 'Email or password incorrect. Please retry or create an account.';
      }
    },
    async handleSubmit() {
      this.validationError = '';
      await this.submitForm();
    },
  },
  emits: ['userSelected'],
});
</script>

<style scoped>
.auth-form {
  max-width: 400px;
}

.auth-form h2 {
  font-size: 1.8rem;
  font-weight: bold;
}

.text-danger {
  color: #ff6b6b;
}

.text-link {
  color: rgb(212, 212, 212);
}
</style>
