import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosinstance from "../../helpers/axiosInstance";
const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem("user")).token ? true : false,
  user: JSON.parse(localStorage.getItem("user")) || {},

  // data:
  //   localStorage.getItem("role") !== undefined
  //     ? localStorage.getItem("data")
  //     : {} || "",
};

export const createAccount = createAsyncThunk("/auth/register", async (data) => {
  try {

 
    const res = axiosinstance.post("/auth/register", data);
    console.log("the res", res);
    toast.promise(res, {
        pending: "wait! creating your account",
        success: (data) => {
        return data?.data?.message;
      },
      error: "Faild to create account",
    });

    return (await res).data;
  } catch (error) {
    toast(error.response?.data?.message);
    console.log(error.response?.data?.message);
  }
});
export const login = createAsyncThunk("/auth/login", async (data) => {
  try {
    const res = axiosinstance.post("user/login", data);
    console.log("the res", res);
    toast.promise(res, {
      loading: "wait! authentication in progress",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Faild to login",
    });

    return (await res).data;
  } catch (error) {
    toast(error.response?.data?.message);
  }
});

export const logout = createAsyncThunk("/auth/logout", async () => {
  try {
    const res = axiosinstance.get("user/logout");
    console.log("the res", res);
    toast.promise(res, {
      loading: "wait!, Logout in progress...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Faild to log-out",
    });

    return (await res).data;
  } catch (error) {
    toast(error.response?.data?.message);
  }
});

export const updateprofile = createAsyncThunk("/user/update", async (data) => {
  try {
    const res = axiosinstance.put(`/user/update/${data.id}`, data.data);

    toast.promise(res, {
      loading: "wait!, profile update in progress...",
      success: "Profile Updated Successfully",
      error: "Faild to update profile",
    });

    return (await res).data;
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
});

export const getUserData = createAsyncThunk("/user/details", async (id) => {
  console.log(id);
  try {
    const res = axiosinstance.get(`/user/me/${id}`);

    return (await res).data;
  } catch (error) {
    toast(error.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createAccount.fulfilled, (state, action) => {
        console.log(action);
      localStorage.setItem("user", JSON.stringify(action?.payload?.data));
      localStorage.setItem("isLoggedIn", true);
     
      state.isLoggedIn = true;
      state.user = action?.payload?.data;
    });
    // builder.addCase(login.fulfilled, (state, action) => {
    //   localStorage.setItem("data", JSON.stringify(action?.payload?.user));
    //   localStorage.setItem("isLoggedIn", true);
    //   localStorage.setItem("role", action?.payload?.user?.role);
    //   state.isLoggedIn = true;
    //   state.data = action?.payload?.user;
    //   state.role = action?.payload?.user?.role;
    // });
    // builder.addCase(logout.fulfilled, (state) => {
    //   localStorage.clear();
    //   state.data = {};
    //   state.isLoggedIn = false;
    //   state.role = "";
    // });
    // builder.addCase(getUserData.fulfilled, (state, action) => {
    //   if (!action?.payload?.user) {
    //     return;
    //   }
    //   localStorage.setItem("data", JSON.stringify(action?.payload?.user));
    //   localStorage.setItem("isLoggedIn", true);
    //   localStorage.setItem("role", action?.payload?.user?.role);
    //   state.isLoggedIn = true;
    //   state.data = action?.payload?.user;
    //   state.role = action?.payload?.user?.role;
    // });
  },
});

export const {} = authSlice.actions;
export default authSlice.reducer;
