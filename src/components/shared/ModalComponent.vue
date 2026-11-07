<template>
    <div v-if="isVisible" class="modal fade show d-block" tabindex="-1" aria-labelledby="labeledBy" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.5);" @click.self="closeModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" :id="labeledBy">{{ title }}</h1>
            <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
          </div>

          <div class="modal-body">
            <slot></slot>
        </div>

        </div>
      </div>
    </div>
  </template>

  <script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'ModalComponent',
    data() {
        return {
            isVisible: false
        }
    },
    props: {
      id: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      labeledBy: {
        type: String,
        default: '',
      },
      withClose: {
        type: Boolean,
        default: true,
      },
      withSave: {
        type: Boolean,
        default: true,
      },
    },
    methods: {
        openModal() {
            this.isVisible = true;
        },
        closeModal() {
            this.$emit('close');
            this.isVisible = false;
        },
        submitForm() {
            this.$emit('submit');
            this.closeModal();
        }
    },
    emits: [
        'submit',
        'close'
    ],
  });
  </script>

  <style scoped>
  .modal.show {
    display: block;
  }

  .modal.fade {
    transition: opacity 0.3s ease;
    opacity: 1;
  }
  </style>
