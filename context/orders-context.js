import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OrderContext = createContext();

// الحالة الابتدائية
const initialState = {
  store: null,
  orders: [],
};

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CART_FROM_STORAGE":
      return {
        ...state,
        store: action.payload.store,
        orders: action.payload.orders,
      };

    case "ADD_TO_CART": {
      const newItem = action.payload;
      const store = newItem.store;

      // تحقق إذا العنصر موجود بنفس الـ addons
      const existingIndex = state.orders.findIndex(
        (order) =>
          order.item.id === newItem.item.id &&
          JSON.stringify(order.addons?.map((a) => a?.id || a?.name).sort()) ===
            JSON.stringify(newItem.addons?.map((a) => a?.id || a?.name).sort())
      );

      // إذا موجود → زود الكمية وعدل السعر
      if (existingIndex !== -1) {
        const updatedOrders = [...state.orders];
        updatedOrders[existingIndex].quantity += newItem.quantity;
        updatedOrders[existingIndex].total = (
          parseFloat(updatedOrders[existingIndex].total) +
          parseFloat(newItem.total)
        ).toFixed(2);

        return {
          ...state,
          orders: updatedOrders,
        };
      }

      // إذا مش موجود → أضفه جديد
      return {
        ...state,
        orders: [...state.orders, newItem],
        store: store || state.store,
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        orders: state.orders.filter(
          (order) => order.item.id !== action.payload
        ),
      };

    case "UPDATE_QUANTITY": {
      const { itemId, quantity } = action.payload;

      if (quantity <= 0) {
        return {
          ...state,
          orders: state.orders.filter((order) => order.item.id !== itemId),
        };
      }

      return {
        ...state,
        orders: state.orders.map((order) =>
          order.item.id === itemId
            ? {
                ...order,
                quantity,
                total: (parseFloat(order.item.price) * quantity).toFixed(2),
              }
            : order
        ),
      };
    }

    case "DECREASE_QUANTITY": {
      const itemId = action.payload;
      const updatedOrders = state.orders
        .map((order) => {
          if (order.item.id === itemId) {
            const newQty = order.quantity - 1;
            return {
              ...order,
              quantity: newQty,
              total: (parseFloat(order.item.price) * newQty).toFixed(2),
            };
          }
          return order;
        })
        .filter((order) => order.quantity > 0);

      return {
        ...state,
        orders: updatedOrders,
      };
    }

    case "CLEAR_CART":
      return {
        store: null,
        orders: [],
      };

    default:
      return state;
  }
};

// المزود
export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // تحميل السلة من AsyncStorage عند أول تشغيل
  useEffect(() => {
    (async () => {
      try {
        const savedCart = await AsyncStorage.getItem("cart");
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          dispatch({ type: "SET_CART_FROM_STORAGE", payload: parsed });
        }
      } catch (e) {
        console.error("❌ Failed to load cart from storage", e);
      }
    })();
  }, []);

  // حفظ السلة في AsyncStorage عند أي تغيير
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(
          "cart",
          JSON.stringify({ store: state.store, orders: state.orders })
        );
      } catch (e) {
        console.error("❌ Failed to save cart to storage", e);
      }
    })();
  }, [state.orders, state.store]);

  // الدوال
  const addToCart = (order) =>
    dispatch({ type: "ADD_TO_CART", payload: order });

  const removeFromCart = (itemId) =>
    dispatch({ type: "REMOVE_FROM_CART", payload: itemId });

  const updateQuantity = (itemId, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity } });

  const decreaseQuantity = (itemId) =>
    dispatch({ type: "DECREASE_QUANTITY", payload: itemId });

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <OrderContext.Provider
      value={{
        store: state.store,
        orders: state.orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// hook للاستخدام
export const useOrder = () => useContext(OrderContext);
