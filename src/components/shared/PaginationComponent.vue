<template>
    <div id="pagination">
        <slot></slot>
        <div class="numbers-container">
            <a v-if="showDotsStart" href="#pagination" 
               @click="changePage(1)" 
               class="numbers" 
               :class="active === 0 ? 'active' : ''">
               1
            </a>
            
            <span v-if="showDotsStart">...</span>
            
            <!-- Display page numbers around the current page -->
            <a href="#pagination" 
               v-for="(index) in visiblePages" 
               :key="index"
               @click="changePage(index)"
               class="numbers" 
               :class="index === active + 1 ? 'active' : ''">
               {{ index }}
            </a>
            
            <span v-if="showDotsEnd">...</span>
            
            <a v-if="showDotsEnd" href="#pagination" 
               @click="changePage(totalPages)" 
               class="numbers" 
               :class="active === totalPages - 1 ? 'active' : ''">
               {{ totalPages }}
            </a>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'PaginationComponent',
    data() {
        return {
            active: 0
        };
    },
    props: {
        length: {
            type: Number,
            required: true
        }
    },
    computed: {
        totalPages() {
            return this.length;
        },
        visiblePages() {
            const pageRange = 5;
            let startPage = this.active - Math.floor(pageRange / 2);
            let endPage = this.active + Math.floor(pageRange / 2);

            if (startPage < 1) {
                startPage = 1;
                endPage = Math.min(pageRange, this.totalPages);
            }

            if (endPage > this.totalPages) {
                endPage = this.totalPages;
                startPage = Math.max(this.totalPages - pageRange + 1, 1);
            }

            const pages: number[] = [];
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            return pages;
        },
        showDotsStart() {
            return this.visiblePages[0] > 2;
        },
        showDotsEnd() {
            return this.visiblePages[this.visiblePages.length - 1] < this.totalPages - 1;
        }
    },
    methods: {
        changePage(index: number) {
            this.active = index - 1;
            this.$emit('pageChanged', this.active);
        }
    },
    emits: ['pageChanged']
});
</script>

<style scoped>
#pagination .numbers-container {
    display: flex;
    justify-content: center;
}

.numbers {
    padding: 5px 10px;
    cursor: pointer;
}

.numbers.active {
    text-decoration: underline;
}
</style>
