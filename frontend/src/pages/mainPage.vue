<script setup>
import { onMounted, ref, watch } from "vue";
import { container } from "@/services/ServiceContainer";
import { FilterMatchMode } from "@primevue/core/api";

const items = ref([]);
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
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});
const selectedItem = ref({
  name: "",
  description: "",
  type: "",
  quantity: "",
});
const filteredItems = ref([]);
const selectedFilter = ref();
const getAllItemsUseCase = container.getGetAllItems();
const addItemUseCase = container.getAddItemUseCase();
const deleteItemUseCase = container.getDeleteItemUseCase();
const updateItemUseCase = container.getUpdateItemUseCase();

const fetchItems = async () => {
  items.value = await getAllItemsUseCase.execute(0);
  sorteerItems();
  filteredItems.value = items.value;
  console.log(items.value);
};

const sorteerItems = () => {
  items.value = items.value.sort((a, b) => {
    if (a.favourite === b.favourite) {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA; // meest recent eerst
    }
    return a.favourite ? -1 : 1;
  });
};

const updateItem = async () => {
  await updateItemUseCase.execute(selectedItem.value);
  dialogVisible.value = false;
  fetchItems();
};

const openDialog = (item) => {
  if (item) {
    selectedItem.value = JSON.parse(JSON.stringify(item));
  }

  dialogVisible.value = true;
};

const deleteItem = async (item) => {
  await deleteItemUseCase.execute(item.id);
  fetchItems();
};
const refresSelectedItem = () => {
  selectedItem.value = { name: "", description: "", type: "" };
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
    name: selectedItem.value.name,
    description: selectedItem.value.description,
    type: selectedItem.value.type,
    quantity: selectedItem.value.quantity,
    favourite: false,
    userId: 0,
  };

  console.log("New item:", newItem);
  await addItemUseCase.execute(newItem);
  fetchItems();
  //reset form
  refresSelectedItem();
  dialogVisible.value = false;
};

const updateFavouriteItem = async (item) => {
  item.setFavourite(!item.isFavourite());
  await updateItemUseCase.execute(item);
  sorteerItems();
};

const filterItems = () => {
  console.log("aanger", selectedFilter);
  if (selectedFilter.value !== "") {
    console.log("hier");
    filteredItems.value = items.value.filter((item) => {
      const filter = selectedFilter.value;

      if (filter === "weapon") {
        return item.type.startsWith("weapon");
      }

      if (filter === "armor") {
        return item.type.startsWith("armor");
      }

      return item.type === filter;
    });
  } else filteredItems.value = items.value;
};

watch(selectedFilter, filterItems);
onMounted(async () => {
  fetchItems();
});

const selectFilterWord = (filterWord) => {
  if (selectedFilter.value === filterWord) {
    selectedFilter.value = "";
  } else {
    selectedFilter.value = filterWord;
  }
};
</script>
<template>
  <div class="w-[1000px] mx-auto pt-2 bg-gray-200">
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
            <!-- Misc -->
            <p-button
              label="Misc"
              icon="pi pi-box"
              @click="selectFilterWord('misc')"
              style="
                background-color: #3a3a3a;
                color: #f5f5f5;
                border: 1px solid #666;
                border-radius: 6px;
              "
            />

            <!-- Weapons -->
            <p-button
              label="Weapons"
              icon="pi pi-bullseye"
              @click="selectFilterWord('weapon')"
              style="
                background-color: #b22222;
                color: #f5f5f5;
                border: 1px solid #d4af37;
                border-radius: 6px;
              "
            />

            <!-- Armor -->
            <p-button
              label="Armor"
              icon="pi pi-shield"
              @click="selectFilterWord('armor')"
              style="
                background-color: #2c2c2c;
                color: #d4af37;
                border: 1px solid #d4af37;
                border-radius: 6px;
              "
            />

            <!-- Potions -->
            <p-button
              label="Potions"
              icon="pi pi-heart-fill"
              @click="selectFilterWord('potion')"
              style="
                background-color: #1e40af;
                color: #f5f5f5;
                border: 1px solid #d4af37;
                border-radius: 6px;
              "
            />

            <!-- Jewelry -->
            <p-button
              label="Jewelry"
              icon="pi pi-star"
              @click="selectFilterWord('jewelry')"
              style="
                background-color: #d4af37;
                color: #1b1b1b;
                border: 1px solid #b8860b;
                border-radius: 6px;
              "
            />
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
  background-color: #1b1b1b; /* diep zwart / donkergrijs */
  color: #d4af37; /* zacht goud */
  font-weight: bold;
  text-align: center;
}

/* Achtergrond van de hele tabel */
.my-datatable {
  background-color: #2c2c2c; /* donkergrijs voor my tafel */
  color: #f5f5f5; /* lichte tekst voor leesbaarheid */
}

/* Body rijen afwisselend */
.my-datatable .p-datatable-tbody > tr:nth-child(odd) {
  background-color: #3a3a3a; /* medium grijs */
  color: #f5f5f5;
}

.my-datatable .p-datatable-tbody > tr:nth-child(even) {
  background-color: #2c2c2c; /* iets donkerder grijs */
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
