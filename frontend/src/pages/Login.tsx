import { useCallback, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import {
  appsAccountsRoutesLogin,
  appsAccountsRoutesRegister,
} from "../../generated/client";

function Login() {
  const [stage, setStage] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: () =>
      appsAccountsRoutesLogin({
        body: { email, password },
      }),
    onSuccess: (data) => {
      if (data?.data?.success) {
        window.location.href = "/todos";
      } else {
        alert(data?.data?.message);
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: () =>
      appsAccountsRoutesRegister({
        body: { email, password },
      }),
    onSuccess: (data) => {
      console.log(data);
      if (data?.data?.success) {
        alert("Registered. Please login with your email and password");
        setStage("login");
      } else {
        alert(data?.data?.message);
      }
    },
  });

  const isFormValid = useMemo(
    () =>
      email.length > 5 &&
      email.length < 20 &&
      password.length > 5 &&
      password.length < 20,
    [email, password],
  );

  const login = useCallback(() => {
    if (isFormValid) {
      loginMutation.mutate();
    }
  }, [isFormValid, loginMutation]);

  const register = useCallback(() => {
    if (isFormValid) {
      registerMutation.mutate();
    }
  }, [isFormValid, registerMutation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6">
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            {stage === "login" ? (
              <div className="text-sm">
                <a
                  onClick={() => setStage("register")}
                  className="font-medium text-gray-600 hover:text-gray-500 cursor-pointer"
                >
                  Register a new account
                </a>
              </div>
            ) : (
              <div className="text-sm">
                <a
                  onClick={() => setStage("login")}
                  className="font-medium text-gray-600 hover:text-gray-500 cursor-pointer"
                >
                  Already have an account? Login
                </a>
              </div>
            )}
          </div>

          <div>
            {stage === "login" ? (
              <button
                type="button"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={() => login()}
                disabled={!isFormValid || loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing In" : "Sign in"}
              </button>
            ) : (
              <button
                type="button"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={() => register()}
                disabled={!isFormValid || registerMutation.isPending}
              >
                {registerMutation.isPending ? "Registering" : "Register"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
