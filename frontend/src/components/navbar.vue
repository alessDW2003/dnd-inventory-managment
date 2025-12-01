<script setup>
import { useAuth } from "@/composables/useAuth";
import { useRightManager } from "@/composables/useRightManager";
import { useNavigation } from "@/composables/useNavigation";

const { logout, isLoggedIn, getUsername, getRole } = useAuth();
const { hasRight } = useRightManager();
const { goIfAllowed, goLogin } = useNavigation();

const logOutAction = () => {
  logout();
  goLogin();
};
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
        DnD Inventory Manager
      </h1>
    </div>
    <p-button
      v-if="hasRight('Admin')"
      label="start campaign"
      @click="goIfAllowed('/newCampaign', 'Admin')"
    />

    <!-- Rechts: user info / auth -->
    <div class="flex items-center gap-4">
      <span v-if="isLoggedIn()" class="text-[#355E3B] font-medium">
        User: {{ getUsername() }} - {{ getRole() }}
      </span>

      <button
        v-if="isLoggedIn()"
        @click="logOutAction()"
        class="px-4 py-2 rounded-lg bg-[#7A3E9D] text-white font-semibold hover:bg-[#C97C5D] transition-colors duration-200 shadow cursor-pointer"
      >
        Logout
      </button>
    </div>
  </nav>
</template>
