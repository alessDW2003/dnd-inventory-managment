<script setup>
import { ref, onMounted } from "vue";
import { container } from "@/services/ServiceContainer";
import User from "@/domain/model/User";
import { useAuth } from "@/composables/useAuth";
import navbar from "@/components/navbar.vue";

const username = ref("");
const password = ref("");
const errorMessage = ref("");

const logInUseCase = container.getLogInUserUseCase();
const { login, isLoggedIn } = useAuth();

const logInUser = async () => {
  errorMessage.value = "";
  try {
    const loggedInUser = await logInUseCase.execute(
      new User(username.value, password.value)
    );

    if (loggedInUser && loggedInUser.token) {
      login(loggedInUser.token);
    } else {
      errorMessage.value = "Login failed, check credentials.";
    }
  } catch (err) {
    console.error(err);
    errorMessage.value = "Something went wrong";
  }
};

onMounted(() => {
  if (isLoggedIn()) {
    login(localStorage.getItem("JWT_token"));
  }
});
</script>

<template>
  <navbar />
  <div class="flex justify-center items-center mt-12 px-4">
    <div
      class="w-full max-w-md p-6 rounded-2xl shadow-lg bg-[#F5F1E6] border-2 border-[#D9B44A] dark:bg-[#1E1E1E] dark:border-[#7A3E9D]"
    >
      <h2
        class="text-2xl font-serif text-center mb-6 text-[#2E2A26] dark:text-[#EDEADE]"
      >
        Welcome back, Adventurer.
      </h2>

      <form @submit.prevent="logInUser" class="flex flex-col gap-4">
        <!-- Username -->
        <input
          v-model="username"
          placeholder="Username"
          class="p-3 rounded-md border focus:outline-none focus:ring-2 border-[#D9B44A] bg-white text-[#2E2A26] focus:ring-[#7A3E9D] dark:border-[#7A3E9D] dark:bg-[#2E2A26] dark:text-[#EDEADE] dark:focus:ring-[#D9B44A]"
        />

        <!-- Password -->
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          class="p-3 rounded-md border focus:outline-none focus:ring-2 border-[#D9B44A] bg-white text-[#2E2A26] focus:ring-[#7A3E9D] dark:border-[#7A3E9D] dark:bg-[#2E2A26] dark:text-[#EDEADE] dark:focus:ring-[#D9B44A]"
        />

        <!-- Error message -->
        <p
          v-if="errorMessage"
          class="text-red-600 dark:text-red-400 font-medium text-sm"
        >
          {{ errorMessage }}
        </p>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full py-3 rounded-lg font-semibold shadow-md transition-colors duration-200 bg-[#7A3E9D] text-white hover:bg-[#C97C5D] dark:bg-[#355E3B] dark:hover:bg-[#4B7A57] cursor-pointer"
        >
          Log in
        </button>
      </form>

      <!-- Register link -->
      <p class="mt-6 text-center text-sm text-[#2E2A26] dark:text-[#EDEADE]">
        No account?
        <router-link
          to="/register"
          class="font-semibold hover:underline text-[#355E3B] dark:text-[#D9B44A]"
        >
          Register here!
        </router-link>
      </p>
    </div>
  </div>
</template>
