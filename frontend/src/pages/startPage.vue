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
      errorMessage.value = "Login mislukt, controleer je gegevens.";
    }
  } catch (err) {
    console.error(err);
    errorMessage.value = "Er ging iets mis bij het inloggen.";
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
  <div class="mx-auto bg-white w-1/2 mt-8 p-3">
    <form @submit.prevent="logInUser" class="flex flex-col gap-2">
      <input v-model="username" placeholder="Username" />
      <input type="password" v-model="password" placeholder="Password" />
      <button type="submit" class="w-20 bg-blue-400 rounded-md cursor-pointer">
        Log in
      </button>

      <p v-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>

      <p>
        Nog geen account? Registreer
        <router-link to="/register" class="text-blue-500 underline"
          >hier</router-link
        >
      </p>
    </form>
  </div>
</template>
