<script setup>
import { ref } from "vue";
import { container } from "@/services/ServiceContainer";
import User from "@/domain/model/User";
import { useRouter } from "vue-router";
const username = ref("");
const password = ref("");
const passwordCheck = ref("");
const router = useRouter();
const registerUserUseCase = container.getRegisterUserUseCase();
const registerUser = async () => {
  try {
    await registerUserUseCase.execute(new User(username.value, password.value));
    router.push("/home");
  } catch (err) {
    console.error(err);
  }
};
</script>

<template>
  register page dikke boktor eeeeee testee eeeee
  <form @submit.prevent="submit">
    <input v-model="username" placeholder="Username" />
    <input type="password" v-model="password" placeholder="Password" />
    <input
      type="password"
      v-model="passwordCheck"
      placeholder="Password check"
    />
    <button @click="registerUser">Registreer</button>
  </form>
</template>
