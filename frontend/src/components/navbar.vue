<script setup>
import { useAuth } from "@/composables/useAuth";

const { logout, isLoggedIn, getUsername } = useAuth();
</script>

<template>
  <nav
    class="h-[60px] flex items-center justify-between px-6 shadow-md border-b-4 border-[#D9B44A] bg-[#F5F1E6]"
  >
    <!-- Logo & titel -->
    <div class="flex items-center gap-3">
      <img
        src="../../img/redDragon.png"
        alt="red dragon"
        class="h-12 w-auto drop-shadow-md"
      />
      <h1 class="font-serif text-xl text-[#2E2A26] tracking-wide">
        Dikke Boktor
      </h1>
    </div>

    <!-- Rechts: user info / auth -->
    <div class="flex items-center gap-4">
      <span v-if="isLoggedIn()" class="text-[#355E3B] font-medium">
        User: {{ getUsername() }}
      </span>
      <button
        v-if="isLoggedIn()"
        @click="logout"
        class="px-4 py-2 rounded-lg bg-[#7A3E9D] text-white font-semibold hover:bg-[#C97C5D] transition-colors duration-200 shadow"
      >
        Logout
      </button>
    </div>
  </nav>
</template>
