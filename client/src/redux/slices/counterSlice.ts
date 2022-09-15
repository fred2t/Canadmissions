import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
    count: number;
    counts: number[];
}

const initialState: State = {
    count: 0,
    counts: [],
};

export const slice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment: function (state) {
            state.count += 1;
            state.counts.push(state.count);
        },
        decrement: function (state) {
            state.count -= 1;
            state.counts.push(state.count);
        },

        incrementByAmount: function (state, action: PayloadAction<number>) {
            state.count += action.payload;
            state.counts.push(state.count);
        },
    },
});

export const { increment, decrement, incrementByAmount } = slice.actions;
export default slice.reducer;
