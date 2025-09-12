<script setup>
import { useAuth } from "@/composables/useAuth";

const { logout, isLoggedIn, getUsername } = useAuth();
</script>

<template>
  <nav class="h-[60px] flex items-center gap-4 bg-red-300">
    <img src="../../img/redDragon.png" alt="red dragon" class="h-12 w-auto" />
    <button v-if="isLoggedIn()" @click="logout">Logout</button>
    <span v-if="isLoggedIn()">User: {{ getUsername() }}</span>
  </nav>
</template>
