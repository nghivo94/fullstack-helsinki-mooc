import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice ({
    name: 'notification',
    initialState: '',
    reducers: {
        createNotification (state, action) {
            return action.payload
        },
        removeNotification (state, action) {
            return ''
        }
    }
})

export const { createNotification, removeNotification } = notificationSlice.actions

export const setNotification = (notification, timeout) => {
    return dispatch => {
        dispatch(createNotification(notification))
        setTimeout(() => {
            dispatch(removeNotification())
        }, timeout * 1000)
    }
}
export default notificationSlice.reducer