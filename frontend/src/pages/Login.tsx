import { useCallback, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, Paper, Text, TextInput } from "@mantine/core";
import { IconAt } from "@tabler/icons-react";

import {
  appsAccountsRoutesLogin,
  appsAccountsRoutesRegister,
} from "../../generated/client";

function Login() {
  const [stage, setStage] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [initials, setInitials] = useState("");

  const loginMutation = useMutation({
    mutationFn: () =>
      appsAccountsRoutesLogin({
        body: { email, password },
      }),
    onSuccess: (data) => {
      if (data?.data?.success) {
        window.location.href = "/logbooks";
      } else {
        alert(data?.data?.message);
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: () =>
      appsAccountsRoutesRegister({
        body: { email, password, name, initials },
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

  const isEmailValid = email.length >= 5 && email.length <= 20;
  const isPasswordValid = password.length >= 5 && password.length <= 20;
  const isNameValid = name.length >= 5 && name.length <= 20;
  const isInitialsValid = initials.length >= 2 && initials.length <= 5;
  const isLoginFormValid = useMemo(
    () => isEmailValid && isPasswordValid,
    [isEmailValid, isPasswordValid],
  );
  const isRegistrationFormValid = useMemo(
    () => isEmailValid && isPasswordValid && isNameValid && isInitialsValid,
    [isEmailValid, isPasswordValid, isNameValid, isInitialsValid],
  );

  const login = useCallback(() => {
    if (isLoginFormValid) {
      loginMutation.mutate();
    }
  }, [isLoginFormValid, loginMutation]);

  const register = useCallback(() => {
    if (isRegistrationFormValid) {
      registerMutation.mutate();
    }
  }, [isRegistrationFormValid, registerMutation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Paper shadow="xs" p="xl" className="max-w-md">
        <Text fw={500} size="lg" className="pb-4">
          Sign in to your account
        </Text>
        <TextInput
          leftSectionPointerEvents="none"
          leftSection={<IconAt size={16} />}
          label="Your Email"
          placeholder="Your Email"
          error={
            !isEmailValid ? "Email must be between 5 and 20 letters" : null
          }
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <TextInput
          type="password"
          rightSectionPointerEvents="none"
          rightSection={<IconAt size={16} />}
          label="Password"
          placeholder="Your Password"
          error={
            !isPasswordValid
              ? "Password must be between 5 and 20 letters"
              : null
          }
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        {stage === "register" ? (
          <>
            <TextInput
              label="Your name"
              placeholder="Your name"
              error={
                !isNameValid ? "Name must be between 5 and 20 letters" : null
              }
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <TextInput
              label="Initials"
              placeholder="Your Initials"
              error={
                !isInitialsValid
                  ? "Initials must be between 2 and 5 letters"
                  : null
              }
              value={initials}
              onChange={(e) => setInitials(e.currentTarget.value)}
            />
          </>
        ) : null}
        {stage === "login" ? (
          <>
            <div
              className="cursor-pointer text-gray-600 text-sm pt-4"
              onClick={() => setStage("register")}
            >
              Create a new account
            </div>
            <Button
              className="mt-4"
              disabled={!isLoginFormValid || loginMutation.isPending}
              onClick={login}
            >
              {loginMutation.isPending ? "Signing In.." : "Sign In"}
            </Button>
          </>
        ) : (
          <>
            <div
              className="cursor-pointer text-gray-600 text-sm pt-4"
              onClick={() => setStage("login")}
            >
              Already have an account? Sign In
            </div>
            <Button
              className="mt-4"
              disabled={!isRegistrationFormValid || registerMutation.isPending}
              onClick={register}
            >
              {registerMutation.isPending ? "Registering.." : "Register"}
            </Button>
          </>
        )}
      </Paper>
    </div>
  );
}

export default Login;
