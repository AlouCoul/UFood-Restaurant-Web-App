<template>
    <v-card class="pa-2" outlined>
      <v-row @align="center">
        <!-- Image -->
        <v-avatar size="48">
          <img :src="imageUrl" alt="Avatar" />
        </v-avatar>

        <v-col>
          <div class="font-weight-bold">{{ user_name }}</div>
          <div class="text-caption">{{ user_email }}</div>
        </v-col>
  
        <!-- Bouton Abonnement -->
        <div>
            <slot></slot>
        </div>
      </v-row>
    </v-card>
  </template>
  
  <script>
  export default {
    props: {
      imageUrl: {
        type: String,
        default: ''
      },
      user_name: {
        type: String,
        required: false,
      },
      user_email: {
        type: String,
        default: 'email@example.com'
      }
    }
  }
  </script>
  
  <style scoped>
  .v-card {
    width: 100%;
    max-width: 400px;
  }
  </style>