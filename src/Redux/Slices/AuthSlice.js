import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosinstance from "../../helpers/axiosInstance";
const storeUserInString = localStorage.getItem("user");

const storedUser =
  storeUserInString == "undefined" || !storeUserInString
    ? {}
    : JSON.parse(storeUserInString);
console.log("The stored user is", storedUser);

const initialState = {
  isLoggedIn: storedUser.token ? true : false,
  user: storedUser,
};

export const createAccount = createAsyncThunk(
  "/auth/register",
  async (data) => {
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
  }
);
export const login = createAsyncThunk("/auth/login", async (data) => {
  try {
    const loading = toast.loading("Authentication is inn process!");
    const res = await axiosinstance.post("/auth/login", data);
    console.log("the res is ", res);

    if (res.data.success) {
      toast.dismiss();
      toast.success(res.data.message);
    }

    return (await res).data;
  } catch (error) {
    toast.dismiss();
    toast(error.response?.data?.error);
  }
});
// export const login = createAsyncThunk("/auth/login", async (data) => {
//   try {
//     const res = axiosinstance.post("/auth/login", data);
//     console.log("the res is " , res);
//     toast.promise(res, {

//         pending: "wait! authentication in progress",
//       success:"login successfull",
//       error: (error)=>{
//         console.log("The error is " , error);
//         return error.response?.data?.error
//       }
//     });
//     console.log("the res", res.payload.data.message);

//     return (await res).data;
//   } catch (error) {
//     console.log("The error in catch  " , error);
//     toast(error.response?.data?.error);
//   }
// });

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

export const updateprofile = createAsyncThunk(
  "/profile/update-profile",
  async (data) => {
    console.log("varad");
    console.log("varad", data.token);
    try {
      const res = await axiosinstance.post(
        `/profile/update-profile/${data.userId}`,
        data.formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${data.token}`,
          },
        }
      );

      console.log(res.data);
      return (await res).data;
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }
);

export const updateState = createAsyncThunk("/user/details", async (id) => {
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
    builder.addCase(login.fulfilled, (state, action) => {
      localStorage.setItem("user", JSON.stringify(action?.payload?.data));
      localStorage.setItem("isLoggedIn", true);
      state.isLoggedIn = true;
      state.user = action?.payload?.data;
    });
    builder.addCase(updateprofile.fulfilled, (state, action) => {
      console.log(action);
      if (action?.payload?.success === true) {
        const userInsession = localStorage.getItem("user");
        const user = JSON.parse(userInsession);
        user.user = action?.payload?.data;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", true);
        state.isLoggedIn = true;
        state.user.user = action?.payload?.data;
      }
    });
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
