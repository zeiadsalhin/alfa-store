import { defineStore } from 'pinia';
import Swal from 'sweetalert2'
export const useMainStore = defineStore('main', {
  state: () => ({
    items: [],
    orders: [],
  }),
  actions: {
    increment() {
      this.counter++;
    },
    addToCart(product) {
       const existingItemIndex = this.items.findIndex(item => item.product.id === product.id);
       if (existingItemIndex !== -1) {
         this.items[existingItemIndex].quantity++;
       } else {
         this.items.push({ product, quantity: 1 });
       }
      Swal.fire({
        title: "Added successfully",
        icon: "success",
        timer: 1000,
        timerProgressBar: true,

    })
    },
    removeFromCart(index) {
      this.items[index].quantity--;

      if (this.items[index].quantity === 0) {
        this.items.splice(index, 1);
      }
    },
    clearCart() {
      this.items = [];
    },
  },
});
