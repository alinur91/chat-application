import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { reducer as userReducer} from "./user/userSlice";

const rootReducer = combineReducers({
  user: userReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
