import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Cadmiss } from "../../utils/namespaces";

interface State {
    selectedCommunity: Cadmiss.SchoolDetails | null;

    // storing in redux for persisting state after a scope change
    // for when the user
    savedPost: Cadmiss.NewPost;
}

const initialState: State = {
    selectedCommunity: null,
    savedPost: { title: "", bodyMetadata: "" },
};

export const slice = createSlice({
    name: "content",
    initialState,
    reducers: {
        setSelectedSchool: function (
            state,
            { payload }: PayloadAction<Cadmiss.SchoolDetails | null>
        ) {
            state.selectedCommunity = payload;
        },

        savePost: function (
            state,
            { payload }: PayloadAction<(prevSavedPost: Cadmiss.NewPost) => Cadmiss.NewPost>
        ) {
            state.savedPost = payload(state.savedPost);
        },
    },
});

export const { setSelectedSchool, savePost } = slice.actions;

export default slice.reducer;
