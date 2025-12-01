<script setup>
import { onMounted, ref, watch } from "vue";
import { container } from "@/services/ServiceContainer";
import { FilterMatchMode } from "@primevue/core/api";
import { useAuth } from "@/composables/useAuth";
import { useNavigation } from "@/composables/useNavigation";
import { useRightManager } from "@/composables/useRightManager";
import navbar from "@/components/navbar.vue";
import { Roles } from "@/constants/Roles";

// ----------------------
// Refs & state
// ----------------------
const items = ref([]);
const users = ref([]);
const userRole = ref("");
const selectedUser = ref("");
const dialogVisible = ref(false);

const options = ref([
  { label: "Weapon (melee)", value: "weapon melee" },
  { label: "Weapon (ranged)", value: "weapon ranged" },
  { label: "Armor (light)", value: "armor light" },
  { label: "Armor (medium)", value: "armor medium" },
  { label: "Armor (heavy)", value: "armor heavy" },
  { label: "Potion", value: "potion" },
  { label: "Jewelry", value: "jewelry" },
  { label: "Misc", value: "misc" },
]);
const filterButtons = [
  {
    label: "Misc",
    icon: "pi pi-box",
    value: "misc",
    bgColor: "#3a3a3a",
    color: "#f5f5f5",
    border: "#666",
  },
  {
    label: "Weapons",
    icon: "pi pi-bullseye",
    value: "weapon",
    bgColor: "#b22222",
    color: "#f5f5f5",
    border: "#d4af37",
  },
  {
    label: "Armor",
    icon: "pi pi-shield",
    value: "armor",
    bgColor: "#2c2c2c",
    color: "#d4af37",
    border: "#d4af37",
  },
  {
    label: "Potions",
    icon: "pi pi-heart-fill",
    value: "potion",
    bgColor: "#1e40af",
    color: "#f5f5f5",
    border: "#d4af37",
  },
  {
    label: "Jewelry",
    icon: "pi pi-star",
    value: "jewelry",
    bgColor: "#d4af37",
    color: "#1b1b1b",
    border: "#b8860b",
  },
];

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

const selectedItem = ref({
  name: "",
  description: "",
  type: "",
  quantity: null,
});

const filteredItems = ref([]);
const selectedFilter = ref("");

// ----------------------
// Use Cases
// ----------------------
const getAllItemsUseCase = container.getGetAllItems();
const addItemUseCase = container.getAddItemUseCase();
const deleteItemUseCase = container.getDeleteItemUseCase();
const updateItemUseCase = container.getUpdateItemUseCase();
const getAllUsersUseCase = container.getAllUsers;

// ----------------------
// Composables
// ----------------------
const { isLoggedIn, getUserId, getUsername, logout, getRole } = useAuth();
const { goLogin, goTo } = useNavigation();
const { hasRight } = useRightManager();

// ----------------------
// User info
// ----------------------
const userId = ref();
const username = ref();

// ----------------------
// Functions
// ----------------------
const fetchItems = async () => {
  items.value = await getAllItemsUseCase.execute(userId.value);
  sortItems();
  filterItems();
};

const sortItems = () => {
  items.value.sort((a, b) => {
    if (a.favourite === b.favourite) {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    return a.favourite ? -1 : 1;
  });
};

const addItem = async () => {
  if (
    !selectedItem.value.name ||
    !selectedItem.value.description ||
    !selectedItem.value.type ||
    !selectedItem.value.quantity
  ) {
    alert("Please fill in all fields");
    return;
  }

  const newItem = {
    ...selectedItem.value,
    favourite: false,
    userId: userId.value,
  };

  await addItemUseCase.execute(newItem);
  closeDialog();
  fetchItems();
};

const updateItem = async () => {
  await updateItemUseCase.execute(selectedItem.value);
  closeDialog();
  fetchItems();
};

const deleteItem = async (item) => {
  await deleteItemUseCase.execute(item.id);
  fetchItems();
};

const updateFavouriteItem = async (item) => {
  item.favourite = !item.favourite;
  await updateItemUseCase.execute(item);
  sortItems();
};

// ----------------------
// Dialog
// ----------------------
const openDialog = (item) => {
  if (item) selectedItem.value = { ...item };
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
  selectedItem.value = { name: "", description: "", type: "", quantity: null };
};

// ----------------------
// Filters
// ----------------------
const filterItems = () => {
  if (!selectedFilter.value) {
    filteredItems.value = [...items.value];
    return;
  }

  filteredItems.value = items.value.filter((item) => {
    if (selectedFilter.value === "weapon")
      return item.type.startsWith("weapon");
    if (selectedFilter.value === "armor") return item.type.startsWith("armor");
    return item.type === selectedFilter.value;
  });
};

watch(selectedFilter, filterItems);

const selectFilterWord = (filterWord) => {
  selectedFilter.value = selectedFilter.value === filterWord ? "" : filterWord;
};

// ----------------------
// DM: fetch users
// ----------------------
const fetchUsers = async () => {
  if (!hasRight("DM")) return;
  const usersRaw = await getAllUsersUseCase.execute();
  users.value = usersRaw;
};

// ----------------------
// Mounted
// ----------------------
onMounted(async () => {
  if (!isLoggedIn()) {
    logout();
    goLogin();
    return;
  }

  userId.value = getUserId();
  username.value = getUsername();
  userRole.value = getRole();

  if (hasRight("DM")) {
    await fetchUsers();
  }

  await fetchItems();
});
</script>

<template>
  <navbar />
  <div v-if="hasRight('DM')" class="dark:text-black p-3">
    select user to look at their inventory:
    <p-select
      v-model="selectedUser"
      :options="users"
      option-label="username"
      option-value="id"
      placeholder="Select a user"
    ></p-select>
  </div>

  <div class="w-[1000px] mx-auto pt-5">
    <p-datatable
      v-model:filters="filters"
      :globalFilterFields="['name']"
      :value="filteredItems"
      class="my-datatable"
      paginator
      :rows="10"
    >
      <template #empty>
        <p class="italic text-sm text-white">Geen items gevonden</p>
      </template>
      <template #header>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background-color: #1b1b1b;
            color: #d4af37;
          "
        >
          <!-- Zoekveld -->
          <div style="display: flex; align-items: center; gap: 8px">
            <p-inputIcon>
              <i
                style="color: #b22222; font-size: 1.1rem"
                class="pi pi-search"
              ></i>
            </p-inputIcon>
            <p-inputText
              v-model="filters['global'].value"
              placeholder="Keyword Search"
              style="
                background-color: #333333;
                color: #f5f5f5;
                border: 1px solid #666666;
                border-radius: 4px;
                padding: 6px 10px;
                outline: none;
              "
            />
          </div>
          <div class="flex gap-2">
            <div class="flex gap-2">
              <p-button
                v-for="btn in filterButtons"
                :key="btn.value"
                :label="btn.label"
                :icon="btn.icon"
                @click="selectFilterWord(btn.value)"
                :style="{
                  backgroundColor: btn.bgColor,
                  color: btn.color,
                  border:
                    (btn.value === selectedFilter ? '4px' : '2px') +
                    ' solid ' +
                    btn.border,
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                }"
              />
            </div>
          </div>

          <!-- Add knop -->
          <p-button
            label="Add Item"
            @click="openDialog"
            style="
              background-color: #b22222;
              color: #f5f5f5;
              border: 1px solid #d4af37;
              border-radius: 4px;
            "
            :style-hover="{ backgroundColor: '#a11b1b' }"
          />
        </div>
      </template>

      <p-column field="name" header="Name" style="width: 20%"> </p-column>
      <!-- <p-column field="description" header="Description"> </p-column> -->
      <p-column field="type" header="Type" style="width: 30%"> </p-column>
      <p-column field="quantity" header="Qty." style="width: 5%"> </p-column>
      <p-column field="favourite" style="width: 5%">
        <template #body="slotProps">
          <div
            v-if="slotProps.data.favourite"
            class="text-yellow-400 text-center"
          >
            <i
              class="pi pi-star-fill cursor-pointer"
              style="font-size: 1rem; color: gold"
              @click="updateFavouriteItem(slotProps.data)"
            ></i>
          </div>
          <div v-else class="text-gray-400 text-center">
            <i
              class="pi pi-star cursor-pointer"
              @click="updateFavouriteItem(slotProps.data)"
              style="font-size: 1rem"
            ></i>
          </div>
        </template>
      </p-column>
      <p-column header="Info" style="width: 5%">
        <template #body="slotProps">
          <div>
            <i
              @click="openDialog(slotProps.data)"
              class="pi pi-info-circle cursor-pointer text-center"
              style="font-size: 1rem"
            ></i>
          </div>
        </template>
      </p-column>
      <p-column style="width: 5%">
        <template #body="slotProps">
          <div>
            <i
              class="pi pi-trash cursor-pointer text-center"
              style="font-size: 1rem; color: red"
              @click="deleteItem(slotProps.data)"
            ></i>
          </div>
        </template>
      </p-column>
    </p-datatable>
  </div>

  <!-- /* Dialog for adding a new item */ -->
  <p-dialog v-model:visible="dialogVisible" modal class="w-[800px]">
    <div class="flex flex-col gap-3 p-4">
      <div class="flex flex-col">
        <label for="name" class="mb-1">Name</label>
        <p-inputText
          id="name"
          v-model="selectedItem.name"
          placeholder="Enter name"
        />
      </div>

      <div class="flex flex-col">
        <label for="description" class="mb-1">Description</label>
        <p-textarea
          v-model="selectedItem.description"
          autoResize
          rows="3"
          placeholder="Enter description"
        />
      </div>

      <div class="flex flex-col">
        <label for="type" class="mb-1">Type</label>
        <p-select
          id="type"
          v-model="selectedItem.type"
          :options="options"
          placeholder="Select type"
          optionLabel="label"
          optionValue="value"
        />
      </div>

      <div class="flex flex-col">
        <label for="quantity" class="mb-1">Quantity</label>
        <p-inputnumber
          v-model="selectedItem.quantity"
          placeholder="Enter quantity"
        />
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <p-button
          label="Cancel"
          severity="secondary"
          @click="(dialogVisible = false), refresSelectedItem()"
        />
        <p-button
          v-if="!selectedItem.id"
          label="Add"
          icon="pi pi-check"
          @click="addItem"
        />
        <p-button
          v-else
          label="Update"
          icon="pi pi-check"
          @click="updateItem"
        />
      </div>
    </div>
  </p-dialog>
</template>
<style>
/* Tailwind colors example: purple/indigo + beige/gold */
/* Header van de tabel */
.my-datatable .p-datatable-thead > tr > th {
  background-color: #2e2a26; /* diep zwart / donkergrijs */
  color: #d4af37; /* zacht goud */
  font-weight: bold;
  text-align: center;
}

/* Achtergrond van de hele tabel */
.my-datatable {
  background-color: #2e2a26; /* donkergrijs voor my tafel */
  color: #f5f5f5; /* lichte tekst voor leesbaarheid */
}

/* Body rijen afwisselend */
.my-datatable .p-datatable-tbody > tr:nth-child(odd) {
  background-color: #3a3a3a; /* medium grijs */
  color: #f5f5f5;
}

.my-datatable .p-datatable-tbody > tr:nth-child(even) {
  background-color: #2e2a26; /* iets donkerder grijs */
  color: #f5f5f5;
}
.my-datatable .p-datatable-header {
  padding: 0px 0px; /* of 0px als je geen padding wilt */
  min-height: 0; /* verwijder vaste hoogte */
}

/* Accent kleuren voor iconen en text */
.text-red-accent {
  color: #b22222; /* donkerrood voor favorieten, alerts */
}

.text-gold {
  color: #d4af37; /* goud voor highlights / icons */
}

.bg-gold {
  background-color: #d4af37;
}

/* Paginator achtergrond en borders */
.my-datatable .p-paginator {
  background-color: #1b1b1b; /* zwart/donkergrijs */
  border-top: 1px solid #d4af37; /* gouden rand */
  color: #d4af37; /* gouden tekst */
}

/* Knoppen van paginator */
.my-datatable .p-paginator .p-paginator-page,
.my-datatable .p-paginator .p-paginator-prev,
.my-datatable .p-paginator .p-paginator-next {
  background-color: #3a3a3a; /* medium grijs */
  color: #f5f5f5; /* lichte tekst */
  border-radius: 0.25rem;
}

/* Actieve pagina */
.my-datatable .p-paginator .p-paginator-page.p-highlight {
  background-color: #b22222; /* rood accent voor actieve pagina */
  color: #f5f5f5; /* lichte tekst */
}
</style>
