<script setup>
import { ref } from "vue";
import { container } from "@/services/ServiceContainer";
import User from "@/domain/model/User";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

const logInUseCase = container.getLogInUserUseCase();

const logInUser = async () => {
  errorMessage.value = "";
  try {
    const loggedInUser = await logInUseCase.execute(
      new User(username.value, password.value)
    );

    if (loggedInUser) {
      router.push("/home");
    } else {
      errorMessage.value = "Login mislukt, controleer je gegevens.";
    }
  } catch (err) {
    console.error(err);
    errorMessage.value = "Er ging iets mis bij het inloggen.";
  }
};
</script>

<template>
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
