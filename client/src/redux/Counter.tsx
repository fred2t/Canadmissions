import { useState } from "react";

import { useAppSelector, useAppDispatch } from "./hooks";
import { decrement, increment, incrementByAmount } from "./slices/counterSlice";

export default function Counter() {
    const { count, counts } = useAppSelector((state) => state.counter);
    const dispatch = useAppDispatch();

    const onIncrement = () => {
        dispatch(increment());
    };

    return (
        <div>
            <button onClick={onIncrement}>Increment</button>
            <div>{count}</div>
            <button onClick={() => dispatch(decrement())}>Decrement</button>

            <p>{JSON.stringify(counts)}</p>
        </div>
    );
}
