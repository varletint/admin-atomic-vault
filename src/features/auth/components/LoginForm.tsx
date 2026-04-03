import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { loginSchema, type LoginInput } from "@/schemas/authSchema";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => {
        login(values, {
          onError: () => toast.error("Could not sign in"),
        });
      })}
      className="mx-auto flex w-full max-w-md flex-col gap-6"
    >
      <Input
        label="Email address"
        type="email"
        placeholder="you@company.com"
        autoComplete="email"
        autoFocus
        {...register("email")}
        error={errors.email?.message}
      />

      <div className="space-y-2">
        <div className="pw-field-wrapper relative w-full">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            {...register("password")}
            error={errors.password?.message}
          />
          <button
            type="button"
            className="pw-toggle absolute right-3 top-[38px] flex text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-heading)]"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="pt-1">
        <Button type="submit" className="w-full" isLoading={isLoggingIn}>
          Sign in
        </Button>
      </div>
    </form>
  );
}
