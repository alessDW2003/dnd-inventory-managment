<script setup>
import { ref } from "vue";
import { container } from "@/services/ServiceContainer";
import User from "@/domain/model/User";
import { useRouter } from "vue-router";
import navbar from "@/components/navbar.vue";

const username = ref("");
const password = ref("");
const passwordCheck = ref("");
const errorMessage = ref("");
const router = useRouter();

const registerUserUseCase = container.getRegisterUserUseCase();

const registerUser = async () => {
  errorMessage.value = "";

  if (password.value !== passwordCheck.value) {
    errorMessage.value = "Passwords don't match.";
    return;
  }

  try {
    await registerUserUseCase.execute(new User(username.value, password.value));
    router.push("/");
  } catch (err) {
    console.error(err);
    errorMessage.value = "Register failed, try again.";
  }
};
</script>

<template>
  <navbar />
  <div class="flex justify-center items-center mt-12">
    <div
      class="bg-[#F5F1E6] border-2 border-[#D9B44A] rounded-2xl shadow-lg w-full max-w-md p-6"
    >
      <h2 class="text-2xl font-serif text-center text-[#2E2A26] mb-6">
        Register your character
      </h2>

      <form @submit.prevent="registerUser" class="flex flex-col gap-4">
        <!-- Username -->
        <input
          v-model="username"
          placeholder="Username"
          class="p-3 rounded-md border border-[#D9B44A] bg-white focus:outline-none focus:ring-2 focus:ring-[#7A3E9D]"
        />

        <!-- Password -->
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          class="p-3 rounded-md border border-[#D9B44A] bg-white focus:outline-none focus:ring-2 focus:ring-[#7A3E9D]"
        />

        <!-- Password Check -->
        <input
          type="password"
          v-model="passwordCheck"
          placeholder="Confirm password"
          class="p-3 rounded-md border border-[#D9B44A] bg-white focus:outline-none focus:ring-2 focus:ring-[#7A3E9D]"
        />

        <!-- Error -->
        <p v-if="errorMessage" class="text-red-600 font-medium text-sm">
          {{ errorMessage }}
        </p>

        <!-- Button -->
        <button
          type="submit"
          class="w-full py-3 rounded-lg bg-[#7A3E9D] text-white font-semibold hover:bg-[#C97C5D] transition-colors duration-200 shadow-md"
        >
          Register
        </button>
      </form>

      <!-- Terug naar login -->
      <p class="mt-6 text-center text-sm text-[#2E2A26]">
        Already have an account?
        <router-link
          to="/"
          class="text-[#355E3B] font-semibold hover:underline"
        >
          Log in here
        </router-link>
      </p>
    </div>
  </div>
</template>
