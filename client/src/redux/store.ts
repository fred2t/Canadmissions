import { configureStore } from "@reduxjs/toolkit";

import aestheticSlice from "./slices/aestheticSlice";
import clientSlice from "./slices/clientSlice";
import contentSlice from "./slices/contentSlice";
import counterSlice from "./slices/counterSlice";

const store = configureStore({
    reducer: {
        counter: counterSlice,

        aesthetic: aestheticSlice,
        client: clientSlice,
        content: contentSlice,
    },

    // required to store sockets & ReCAPTCHA controller
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
