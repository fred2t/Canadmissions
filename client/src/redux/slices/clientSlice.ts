import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ReCAPTCHA from "react-google-recaptcha";

interface State {
    // client traits
    usingAdBlock: boolean;
    clientIsRobot: boolean;

    // toolkits to use on client
    // reCAPTCHA: ReCAPTCHA | null;
    // googleSSOButton: HTMLDivElement | null;

    // client state
    temporaryUsername: string;
    signingUp: boolean;
    loggingIn: boolean;
    changingPassword: boolean;
    pickingUsername: boolean;
    loggedIn: boolean;

    clientId: number | null;
    clientUsername: string | null;
}

const initialState: State = {
    usingAdBlock: false,
    clientIsRobot: false,

    // reCAPTCHA: null,
    // googleSSOButton: null,

    temporaryUsername: "",
    signingUp: false,
    loggingIn: false,
    changingPassword: false,
    pickingUsername: false,
    loggedIn: false,

    clientId: null,
    clientUsername: null,
};

export const slice = createSlice({
    name: "client",
    initialState,
    reducers: {
        // setReCAPTCHA: function (state, action: PayloadAction<ReCAPTCHA>) {
        //     state.reCAPTCHA = action.payload;
        // },

        // setGoogleSSOButton: function (state, action: PayloadAction<HTMLDivElement>) {
        //     state.googleSSOButton = action.payload;
        // },

        setUsingAdBlock: function (state, action: PayloadAction<boolean>) {
            state.usingAdBlock = action.payload;
        },

        markClientAsRobot: function (state) {
            state.clientIsRobot = true;
        },

        startSigningUp: function (state) {
            state.loggingIn = false;
            state.signingUp = true;
        },

        stopSigningUp: function (state) {
            state.signingUp = false;
        },

        startLoggingIn: function (state) {
            state.loggingIn = true;
        },

        stopLoggingIn: function (state) {
            state.loggingIn = false;
        },

        startChangingPassword: function (state) {
            state.loggingIn = false;
            state.changingPassword = true;
        },

        stopChangingPassword: function (state) {
            state.changingPassword = false;
        },

        startPickingUsername: function (
            state,
            { payload: temporaryUsername }: PayloadAction<string>
        ) {
            state.temporaryUsername = temporaryUsername;
            state.signingUp = false;
            state.loggingIn = false;
            state.pickingUsername = true;
        },

        changeUsername: function (state, { payload: newUsername }: PayloadAction<string | null>) {
            state.pickingUsername = false;
            state.loggedIn = true;
            state.clientUsername = newUsername ?? state.clientUsername;
        },

        logIn: function (
            state,
            { payload }: PayloadAction<{ clientId: number; clientUsername: string }>
        ) {
            state.loggedIn = true;
            state.loggingIn = false;
            state.signingUp = false;
            state.clientId = payload.clientId;
            state.clientUsername = payload.clientUsername;
        },

        logOut: function (state) {
            state.loggedIn = false;
            state.clientId = null;
            state.clientUsername = null;
        },
    },
});

export const {
    // setReCAPTCHA,
    // setGoogleSSOButton,
    setUsingAdBlock,
    logIn,
    logOut,
    startLoggingIn,
    startSigningUp,
    stopLoggingIn,
    stopSigningUp,
    startChangingPassword,
    stopChangingPassword,
    startPickingUsername,
    changeUsername,
    markClientAsRobot,
} = slice.actions;

export default slice.reducer;
