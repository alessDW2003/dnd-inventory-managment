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
  <div class="flex justify-center items-center mt-12">
    <div
      class="bg-[#F5F1E6] border-2 border-[#D9B44A] rounded-2xl shadow-lg w-full max-w-md p-6"
    >
      <h2 class="text-2xl font-serif text-center text-[#2E2A26] mb-6">
        Welcome back, Adventurer.
      </h2>

      <form @submit.prevent="logInUser" class="flex flex-col gap-4">
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

        <!-- Error message -->
        <p v-if="errorMessage" class="text-red-600 font-medium text-sm">
          {{ errorMessage }}
        </p>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full py-3 rounded-lg bg-[#7A3E9D] text-white font-semibold hover:bg-[#C97C5D] transition-colors duration-200 shadow-md"
        >
          Log in
        </button>
      </form>

      <!-- Register link -->
      <p class="mt-6 text-center text-sm text-[#2E2A26]">
        No account?
        <router-link
          to="/register"
          class="text-[#355E3B] font-semibold hover:underline"
        >
          Register here!
        </router-link>
      </p>
    </div>
  </div>
</template>
