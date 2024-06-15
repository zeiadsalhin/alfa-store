import { defineStore } from 'pinia';
import Swal from 'sweetalert2'
export const useMainStore = defineStore('main', {
  state: () => ({
    items: [],
    discountedPrice: null,
    orders: [],
  }),
  getters: {
    totalPrice() {
      return this.items.reduce((total, item) => {
        const itemPrice = item.product.price; // Adjust based on your product structure
        return total + itemPrice * item.quantity;
      }, 0);
    }
  },
  actions: {
    async addToCart(product, selectedOption) {
      const existingItemIndex = this.items.findIndex(item => item.product.id === product.id && item.selectedOption === selectedOption);
      if (existingItemIndex !== -1) {
        this.items[existingItemIndex].quantity++;
      } else {
        this.items.push({ product, selectedOption, quantity: 1 });
      }

      // Show success message
      Swal.fire({
        title: "Added successfully",
        icon: "success",
        toast: true,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });

      // Save to Supabase
      await this.saveCartToSupabase();
    },

    async removeFromCart(index) {
      if (index >= 0 && index < this.items.length) {
        this.items[index].quantity--;

        if (this.items[index].quantity === 0) {
          this.items.splice(index, 1);
        }

        // Save to Supabase
        await this.saveCartToSupabase();
      } else {
        console.error('Invalid index or item does not exist:', index);
        // Handle error or edge case as needed
      }
    },

    async clearCart() {
      this.items = []; // Clear local cart items

      // Clear cart items in Supabase
      await this.saveCartToSupabase();
    },

    async saveCartToSupabase() {
      const supabase = useSupabaseClient();
      const user = useSupabaseUser();

      if (!user) {
        console.error('User not authenticated.');
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
        // Handle error as needed
        return;
      }

      const supabaseUserId = data.session.user.id;

      const cartItems = this.items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.image,
        product_price: item.product.price,
        quantity: item.quantity,
        selectedOption: item.selectedOption,
      }));

      try {
        const { data, error } = await supabase
          .from('users_cart')
          .upsert({
            uid: supabaseUserId,
            cart_items: cartItems,
          }, { onConflict: ['uid'] });

        if (error) {
          console.error('Error saving cart items:', error.message);
          // Handle error as needed
        } else {
          // console.log('Cart items saved successfully:', data);
          // Optionally handle success message or clear cart locally
        }
      } catch (error) {
        console.error('Error saving cart items:', error.message);
        // Handle error as needed
      }
    },

    setDiscountedPrice(discountedPrice) {
      this.discountedPrice = discountedPrice;
    },
  },
});