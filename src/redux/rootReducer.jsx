import { combineReducers } from "@reduxjs/toolkit";
import memberReducer from "./memberSlice";
import adminReducer from "./adminSlice";
import authReducer from "./authSlice";
import profileReducer from "./profileSlice";
import packageReducer from "./packageSlice";

const rootReducer = combineReducers({
  member: memberReducer,
  admin: adminReducer,
  auth: authReducer,
  profile: profileReducer,
  package: packageReducer
});

export default rootReducer;
