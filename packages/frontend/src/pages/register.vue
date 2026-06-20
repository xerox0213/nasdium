<script setup lang="ts">
import type { AlertProps, AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import { registerSchema } from "@nasdium/shared/schemas";
import * as z from "zod";
import { ref } from "vue";
import { useMutation } from "@tanstack/vue-query";
import { register } from "@/features/auth/auth.api";
import { HttpError } from "@/shared/errors/http-error";

definePage({
  name: "register",
});

// Validation schema
const schema = registerSchema
  .extend({
    confirmPassword: registerSchema.shape.password,
  })
  .refine((d) => d.confirmPassword == d.password, {
    path: ["confirmPassword"],
    error: "Password don't match",
  });

type Schema = z.infer<typeof schema>;

// Form fields
const fields: AuthFormField[] = [
  {
    name: "firstName",
    type: "text",
    label: "First name",
    placeholder: "Enter your first name",
    required: true,
  },
  {
    name: "lastName",
    type: "text",
    label: "Last name",
    placeholder: "Enter your last name",
    required: true,
  },
  {
    name: "email",
    type: "text",
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
  {
    name: "confirmPassword",
    type: "password",
    label: "Confirm password",
    placeholder: "Confirm your password",
    required: true,
  },
];

// Submission
const toast = useToast();
const alert = ref<AlertProps>();

const registerMutation = useMutation({
  mutationFn: async (credentials: Schema) => register(credentials),
  onError: (error) => {
    if (error instanceof HttpError && error.status == 409) {
      alert.value = {
        title: "Email already in use",
        description: "Try logging in instead.",
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
      title: "Welcome aboard 👋",
      description: "Account created successfully.",
      color: "success",
    });
  },
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  registerMutation.mutate(event.data);
};
</script>

<template>
  <UPage>
    <UPageBody>
      <UAuthForm
        title="Create an account"
        description="Enter your information below to create your account"
        icon="i-lucide-book-open-text"
        :fields="fields"
        :schema="schema"
        :validate-on="['change']"
        :submit="{
          label: 'Create account',
          loading: registerMutation.isPending.value,
        }"
        @submit="onSubmit"
      >
        <template #validation>
          <UAlert v-if="alert" v-bind="alert" />
        </template>

        <template #footer>
          <p>
            Already a member?
            <ULink :to="{ name: 'login' }" class="font-bold">Sign in</ULink>
          </p>
        </template>
      </UAuthForm>
    </UPageBody>
  </UPage>
</template>
