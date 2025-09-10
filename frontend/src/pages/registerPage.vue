<script setup>
import { ref } from "vue";
import { container } from "@/services/ServiceContainer";
import User from "@/domain/model/User";
const username = ref("");
const password = ref("");

const registerUserUseCase = container.getRegisterUserUseCase();
const registerUser = async () => {
  await registerUserUseCase.execute(new User(username.value, password.value));
};
</script>

<template>
  <form @submit.prevent="submit">
    <input v-model="username" placeholder="Username" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="registerUser">Register</button>
  </form>
</template>
