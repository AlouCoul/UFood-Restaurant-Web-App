<template>
  <div>
    <div id="ribbon_container" class="container p-0">
      <div id="ribbon_carousel" class="carousel slide">
        <div class="carousel-inner d-flex">
          <swiper :slides-per-view="slidesPerView" :space-between="0" :pagination="{ clickable: true }" @swiper="onSwiper" @slideChange="onSlideChange">
            <swiper-slide v-for="(image, index) in resto.pictures" :key="index">
              <div id="carousel_img_container">
                <img :src="image" class="d-block w-100 rounded" alt="Restaurant Image" style="height: 50vh; object-fit: cover;" />
              </div>
            </swiper-slide>
          </swiper>
          <button @click="slidePrev" class="carousel-control-prev">
            <span class="carousel-control-prev-icon"></span>
          </button>
          <button @click="slideNext" class="carousel-control-next">
            <span class="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>
      <div class="row text-center my-4" id="resto_infos">
        <div class="col">
          <h1>{{ resto.name }}</h1>
          <div class="d-flex justify-content-center mb-2">
            <span v-for="i in 5" :key="i" class="position-relative me-1">
              <i class="bi bi-star-fill text-muted"></i>
              <span class="position-absolute top-0 start-0 overflow-hidden" :style="{ width: getStarWidth(i, resto.rating) + '%' }">
                <i class="bi bi-star-fill text-warning"></i>
              </span>
            </span>
          </div>
          <div id="resto_status">
            <div v-if="getRestaurantStatus(resto)" class="d-inline-flex align-items-center gap-2 text-success">
              <span class="badge bg-success">Open</span>
            </div>
            <div v-else class="d-inline-flex align-items-center gap-2 text-danger">
              <span class="badge bg-danger">Closed</span>
            </div>
          </div>
          <div>{{ '$'.repeat(resto.priceRange) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import { RestaurantPoco } from '@/pocos/RestaurantPoco';

export default defineComponent({
  name: "RestoRibbon",
  props: {
    resto: {
      type: Object as () => RestaurantPoco,
      required: false,
      default: () => ({}),
    },
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      slidesPerView: 3,
      swiper: null as any,
    };
  },
  methods: {
    onSwiper(swiperInstance: any) {
      this.swiper = swiperInstance;
    },
    onSlideChange() {},
    slideNext() {
      if (this.swiper) {
        this.swiper.slideNext();
      }
    },
    slidePrev() {
      if (this.swiper) {
        this.swiper.slidePrev();
      }
    },
    getSlidesPerView(): number {
      return window.innerWidth > 768 ? 3 : 1;
    },
    onResize() {
      this.slidesPerView = this.getSlidesPerView();
    },
    getStarWidth(index: number, rating: number): number {
      const completeStar = index;
      if (rating >= completeStar) {
        return 100;
      } else if (rating >= completeStar - 1 && rating < completeStar) {
        return (rating - (completeStar - 1)) * 100;
      }
      return 0;
    },
    getRestaurantStatus(res: any): boolean {
      const weekDay = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const now = new Date();
      const currentDay = now.getDay();
      const currentHour = now.getHours();
      const openHours = res?.opening_hours?.[weekDay[currentDay]];

      if (!openHours) {
        return false;
      }

      const [openingTime, closingTime] = openHours.split("-");
      const openingHour = parseInt(openingTime.substring(0, 2), 10);
      const closingHour = closingTime.startsWith("00") ? 24 : parseInt(closingTime.substring(0, 2), 10);

      return currentHour >= openingHour && currentHour < closingHour;
    },
  },
  mounted() {
    this.slidesPerView = this.getSlidesPerView();
    window.addEventListener('resize', this.onResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize);
  },
});
</script>

<style scoped>
#carousel_img_container img {
  border-radius: 8px;
}
#resto_infos h1 {
  font-size: 2rem;
}
</style>
