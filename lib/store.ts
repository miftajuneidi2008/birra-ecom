import { configureStore } from '@reduxjs/toolkit'
import productReducer from './features/product/productSlice'
import ratingSlice from './features/rating/ratingSlice'
import cartSlice from './features/cart/cartSlice'
import addressSlice from './features/address/addressSlice'
export const makeStore = configureStore({
    reducer: {
        product: productReducer,
        rating:ratingSlice,
        cart:cartSlice,
        address:addressSlice
    }
}) 


export type RootState = ReturnType<typeof makeStore.getState>
export type AppDispatch = typeof makeStore.dispatch