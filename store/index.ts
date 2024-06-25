import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export const useMainStore = defineStore('main', {
  state: () => ({
    items: [],
    discountedPrice: null,
    checkoutPrice:null,
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
        const updatedItems = [...this.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        this.items = updatedItems;
      } else {
        this.items = [
          ...this.items,
          { product, selectedOption, quantity: 1, discountedPrice: product.discount_price }
        ];
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

      await this.saveCartToSupabase();
    },

    async removeFromCart(index) {
      if (index >= 0 && index < this.items.length) {
        const updatedItems = [...this.items];
        updatedItems[index] = {
          ...updatedItems[index],
          quantity: updatedItems[index].quantity - 1,
        };

        if (updatedItems[index].quantity <= 0) {
          updatedItems.splice(index, 1);
        }

        this.items = updatedItems;

        await this.saveCartToSupabase();
      } else {
        console.error('Invalid index or item does not exist:', index);
        // Handle error or edge case as needed
      }
    },

    async clearCart() {
      this.items = [];
      await this.saveCartToSupabase();
    },

    async saveCartToSupabase() {
      const supabase = useSupabaseClient();
      const user = useSupabaseUser();

      if (!user) {
        console.error('User not authenticated.');
        return;
      }

      const { data:userdata, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
        // Handle error as needed
        return;
      }

      // const supabaseUserId = data.session.user.id;

      const cartItems = this.items.map(item => ({
        product: { // Include the entire product object
          id: item.product.id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
        },
        quantity: item.quantity,
        selectedOption: item.selectedOption,
        discountedPrice: item.discountedPrice,
        
      }));

      try {
        const { data, error } = await supabase
          .from('users_cart')
          .upsert({
            uid: (userdata.session.user.id),
            cart_items: cartItems,
          }, { onConflict: ['uid'] });

        if (error) {
          console.error('Error saving cart items:', error.message);
        } else {
          // Optionally handle success message or clear cart locally
        }
      } catch (error) {
        console.error('Error saving cart items:', error.message);
      }
    },

    async fetchCartFromSupabase() {
      const supabase = useSupabaseClient();
      const user = useSupabaseUser();
      const { data, error } = await supabase.auth.getSession();
      const supabaseUserId = data.session.user.id;
      if (!user) {
        console.error('User not authenticated.');
        return;
      }
      try {
        const { data, error } = await supabase
          .from('users_cart')
          .select('cart_items')
          .eq('uid', supabaseUserId);

        if (error) {
          // console.error('Error fetching cart items:', error.message);
          return;
        }

        if (data && data.length > 0 && data[0].cart_items) {
          this.items = data[0].cart_items;
          
        } else {
          this.items = [];
        }
      } catch (error) {
        // console.error('Error fetching cart items:', error.message);
      }
    },

    setDiscountedPrice(discountedPrice) {
      this.discountedPrice = discountedPrice;
    },
    setCheckoutPrice(checkoutPrice) {
      this.checkoutPrice = checkoutPrice;
    },
  },
});
