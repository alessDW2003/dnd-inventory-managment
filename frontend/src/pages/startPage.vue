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
    // Als er al een geldig token is → meteen naar home
    login(localStorage.getItem("JWT_token"));
  }
});
</script>

<template>
  <navbar />
  <form @submit.prevent="logInUser">
    <input v-model="username" placeholder="Username" />
    <input type="password" v-model="password" placeholder="Password" />
    <button type="submit">Log in</button>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <p>
      Nog geen account? registreer
      <router-link to="/register">hier</router-link>
    </p>
  </form>
</template>
