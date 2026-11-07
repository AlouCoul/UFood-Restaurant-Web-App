<template>
    <form class="container-fluid">
        <div class="row form-content">
            <span>
                <p class="error">{{ visitDateError }}</p>
                <label for="date" class="form-label">Visit date: </label>
                <input :disabled="isReadonly" id="date" v-model="date" type="date" class="form-control">
            </span>
            <span>
                <p class="error">{{  ratingError }}</p>
                <label for="rating" class="form-label">Rating: </label>
                <input :disabled="isReadonly" id="rating" v-model="rating" type="number" min="1" max="5" class="form-control">
            </span>
            <span>
                <label for="comment" class="form-label">Comment (optional): </label>
                <input :disabled="isReadonly" id="comment" v-model="comment" type="text" class="form-control">
            </span>
        </div>
        <div class="row justify-content-end form-footer">
            <span v-if="seeRestaurant" class="col-5">
                <router-link class="btn btn-dark full-width" :to="{name: 'Restaurant', params: { id: restaurantId }}">See restaurant</router-link>
            </span>
            <span class="col-3">
                <button type="button" class="btn btn-secondary full-width" @click="close">Close</button>
            </span>
            <span v-if="!isReadonly" class="col-3">
                <button type="button" class="btn btn-primary full-width" @click="submitForm">Submit</button>
            </span>
        </div>
    </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { rateRestaurant, VisitFormPayload } from './../../api/api'
import { createVisit } from '@/store/store';


  export default defineComponent({
    name: 'VisitedForm',
    data() {
        return {
            visitDateError: '',
            date: '',
            ratingError: '',
            rating: '',
            comment: ''
        }
    },
    props: {
        userId:{
            type: String,
            required: false,
        },
        restaurantId: {
            type: String,
            required: true
        },
        isReadonly: {
            type: Boolean,
            required: false,
            default: false
        },
        visitDate: {
            type: Date,
            required: false,
        },
        visitRating: {
            type: Number,
            required: false,
        },
        visitComment: {
            type: String,
            required: false,
            default: ''
        },
        seeRestaurant: {
            type: Boolean,
            required: false,
            default: true,
        }
    },
    methods: {

        close() {
            this.$emit('closed');
        },
        async submitForm() {
            if(!this.validateForm()) return;

            const payload: VisitFormPayload = {
                restaurant_id: this.restaurantId,
                comment: this.comment,
                rating: parseInt(this.rating),
                date: new Date(this.date),
            }

            const visit = await rateRestaurant(this.userId as string, payload);
            createVisit(payload as any);

            this.$emit('submitted');
        },
        validateForm(): boolean {
            const dateIsValid = this.validateDate();
            const ratingIsValid = this.validateRating();

            return dateIsValid && ratingIsValid;
        },
        validateDate(): boolean {
            this.visitDateError = '';

            const date = new Date(this.date);

            if(isNaN(date.getTime())) {
                this.visitDateError = 'Date cannot be empty and must be in a valid format.';
                return false;
            }

            if(date > new Date(Date.now())) {
                this.visitDateError = 'The date must be today or in the past.';
                return false;
            }

            return true;
        },
        validateRating(): boolean {
            this.ratingError = '';

            if(this.rating == null || this.rating === '') {
                this.ratingError = 'You must enter a rating.';
                return false;
            }

            if(Number.parseInt(this.rating) < 1 || Number.parseInt(this.rating) > 5) {
                this.ratingError = 'The rating must be between 1 and 5.';
                return false;
            }

            return true;
        },
        formatDate() {
            if(!this.visitDate) return

            const date = new Date(this.visitDate);

            const year = this.visitDate.getFullYear();
            const month = String(this.visitDate.getMonth() + 1).padStart(2, '0');
            const day = String(this.visitDate.getDate()).padStart(2, '0');

            this.date = `${year}-${month}-${day}`
        }
    },
    mounted() {
        if(this.visitRating)
            this.rating = this.visitRating.toString();

        this.comment = this.visitComment;
        this.formatDate();
    },
    emits: [
        'submitted',
        'closed'
    ]
  });
</script>
  
<style>

    .form-footer {
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .full-width {
        width: 100%;
    }

    .error {
        color: red;
    }
</style>
  