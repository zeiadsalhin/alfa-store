import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

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
        // Create a new array to ensure reactivity
        const updatedItems = [...this.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        this.items = updatedItems;
      } else {
        // Create a new array to ensure reactivity
        this.items = [
          ...this.items,
          { product, selectedOption, quantity: 1, discountedPrice: this.discountedPrice } // Include discounted price
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

      // Save to Supabase
      await this.saveCartToSupabase();
    },

    async removeFromCart(index) {
      // Check if the index is within the valid range
      if (index >= 0 && index < this.items.length) {
        // Create a copy of the items array to ensure reactivity
        const updatedItems = [...this.items];
    
        // Decrement the quantity of the item at the specified index
        updatedItems[index] = {
          ...updatedItems[index],
          quantity: updatedItems[index].quantity - 1,
        };
    
        // Check if the quantity of the item has reached zero or less
        if (updatedItems[index].quantity <= 0) {
          // Remove the item from the array if quantity is zero or less (edge case)
          updatedItems.splice(index, 1);
        }
    
        // Update the items in the cart
        this.items = updatedItems;
    
        // Save the updated cart to Supabase
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
        discountedPrice: item.discountedPrice, // Include discounted price
      }));
console.log('CART ITEMS:', cartItems);

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
          console.error('Error fetching cart items:', error.message);
          // Handle error as needed
          return;
        }

        if (data && data.length > 0 && data[0].cart_items) {
          // Update local items with fetched cart items
          this.items = data[0].cart_items;
        } else {
          // No cart items found for the user
          this.items = [];
        }
      } catch (error) {
        console.error('Error fetching cart items:', error.message);
        // Handle error as needed
      }
    },

    setDiscountedPrice(discountedPrice) {
      this.discountedPrice = discountedPrice;
    },
  },
});
