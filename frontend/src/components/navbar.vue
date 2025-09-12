<script setup>
import { useAuth } from "@/composables/useAuth";

const { logout, isLoggedIn, getUsername } = useAuth();
</script>

<template>
  <nav class="h-[60px] bg-red-300">
    <button v-if="isLoggedIn()" @click="logout">Logout</button>
    <span v-if="isLoggedIn()">User: {{ getUsername() }}</span>
  </nav>
</template>
