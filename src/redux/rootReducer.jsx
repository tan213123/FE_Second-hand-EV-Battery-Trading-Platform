import { combineReducers } from "@reduxjs/toolkit";
import memberReducer from "./memberSlice";
import adminReducer from "./adminSlice";
import authReducer from "./authSlice";
import profileReducer from "./profileSlice";

const rootReducer = combineReducers({
  member: memberReducer,
  admin: adminReducer,
  auth: authReducer,
  profile: profileReducer,
});

export default rootReducer;
