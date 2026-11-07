<template>
  <div class="auth-form container bg-dark text-light py-5 rounded shadow-sm">
    <h2 class="text-center mb-4">Sign up to UFood</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group mb-3">
        <input 
          type="text" 
          v-model="name" 
          class="form-control" 
          placeholder="Name" 
          required 
          name="name" 
        />
        <input 
          type="text" 
          v-model="email" 
          class="form-control mt-2" 
          placeholder="Email" 
          required 
          name="email" 
        />
        <input 
          type="password" 
          v-model="password" 
          class="form-control mt-2" 
          placeholder="Password" 
          required
          name="password" 
        />
        <input 
          type="password" 
          v-model="password_confirmation" 
          class="form-control mt-2" 
          placeholder="Confirm your password" 
          required
          name="password-confirmation" 
        />
      </div>
      <p v-if="validationError" class="text-danger">{{ validationError }}</p>
      <button 
        type="submit" 
        class="btn btn-warning w-100 fw-bold"
        style="background-color: #E2850B; border: none; color: white;"
      >
        Sign up
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { signupUser } from "@/api/api";

export default defineComponent({
  name: 'SignupForm',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      validationError: '',
    };
  },
  methods: {
    async submitForm() {
      const response = await signupUser(this.name, this.email, this.password);
      if (response.status === 200) {
        this.$router.push('/login');
      } else {
        this.validationError = 'This user already exists.';
      }
    },
    async handleSubmit() {
      this.validationError = '';
      if (this.password !== this.password_confirmation) {
        this.validationError = 'Password do not match.';
      } else {
        await this.submitForm();
      }
    },
  },
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
</style>
