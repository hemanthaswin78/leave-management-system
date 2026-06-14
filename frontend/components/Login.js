import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const login = async () => {
    const res = await axios.post(
      "https://leave-management-backend-rmgs.onrender.com/api/auth/login",
      {
        username,
        password
      }
    );

    localStorage.setItem(
      "token",
      res.data.token
    );

    router.push("/dashboard");
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Username"
        onChange={(e) =>
          setUsername(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button onClick={login}>
        Login
      </button>
    </div>
  );
}