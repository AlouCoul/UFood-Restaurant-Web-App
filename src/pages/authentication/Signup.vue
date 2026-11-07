<template>
    <div class="d-flex justify-content-center align-items-center my-5">
      <SignupForm/>
    </div>
  </template>
  
  <script lang="ts">
  import SignupForm from '@/components/authentication/SignupForm.vue';
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    components: {
      SignupForm,
    },
  });
  </script>
  