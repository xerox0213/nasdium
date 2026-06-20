<script setup lang="ts">
import { login } from "@/features/auth/auth.api";
import { HttpError } from "@/shared/errors/http-error";
import { loginSchema } from "@nasdium/shared/schemas";
import type { AlertProps, AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import { useMutation } from "@tanstack/vue-query";
import { useHead } from "@unhead/vue";
import { ref } from "vue";
import * as z from "zod";

definePage({
  name: "login",
});

useHead({
  title: "Log in",
});

// Validation schema
type Schema = z.infer<typeof loginSchema>;

// Form fields
const fields: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Enter your password",
    required: true,
  },
];

// Submission
const toast = useToast();
const alert = ref<AlertProps>();

const loginMutation = useMutation({
  mutationFn: async (credentials: Schema) => login(credentials),
  onError: (error) => {
    if (error instanceof HttpError && error.status == 401) {
      alert.value = {
        title: "Invalid credentials",
        description: "Check your email and password, then try again.",
        color: "error",
        variant: "subtle",
      };
    } else {
      alert.value = {
        title: "Something went wrong",
        description: "Please try again.",
        color: "error",
        variant: "subtle",
      };
    }
  },
  onSuccess: () => {
    alert.value = undefined;
    toast.add({
      title: "Welcome back 👋",
      description: "You're now signed in.",
      color: "success",
    });
  },
});

const onSubmit = (event: FormSubmitEvent<Schema>) => {
  loginMutation.mutate(event.data);
};
</script>

<template>
  <UPage>
    <UPageBody>
      <UAuthForm
        title="Log in to your account"
        description="Enter your email and password below to log in"
        icon="i-lucide-book-open-text"
        :validate-on="['change']"
        :fields="fields"
        :schema="loginSchema"
        :submit="{ label: 'Log in', loading: loginMutation.isPending.value }"
        @submit="onSubmit"
      >
        <template #validation>
          <UAlert v-if="alert" v-bind="alert" />
        </template>

        <template #footer>
          <p>
            New here?
            <ULink :to="{ name: 'register' }" class="font-bold">
              Create an account
            </ULink>
          </p>
        </template>
      </UAuthForm>
    </UPageBody>
  </UPage>
</template>
