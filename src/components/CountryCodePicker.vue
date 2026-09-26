<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";

interface CountryOption {
  iso: string;
  name: string;
  dialCode: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: string;
  }>(),
  {
    modelValue: "+855",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const isOpen = ref(false);
const search = ref("");
const root = ref<HTMLElement | null>(null);
const displayNames = new Intl.DisplayNames(["en"], { type: "region" });

const countries = getCountries()
  .map((iso) => ({
    iso,
    name: displayNames.of(iso) ?? iso,
    dialCode: `+${getCountryCallingCode(iso)}`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const selectedCountry = computed<CountryOption>(() => {
  return (
    countries.find((country) => country.dialCode === props.modelValue) ??
    countries.find((country) => country.iso === "KH") ??
    countries[0]!
  );
});

const filteredCountries = computed(() => {
  const query = search.value.trim().toLowerCase();
  if (!query) return countries;

  return countries.filter(
    (country) =>
      country.name.toLowerCase().includes(query) ||
      country.iso.toLowerCase().includes(query) ||
      country.dialCode.includes(query),
  );
});

const selectCountry = (country: CountryOption) => {
  emit("update:modelValue", country.dialCode);
  isOpen.value = false;
  search.value = "";
};

const handleOutsideClick = (event: MouseEvent) => {
  if (root.value && !root.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => document.addEventListener("click", handleOutsideClick));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleOutsideClick),
);
</script>

<template>
  <div ref="root" class="relative shrink-0">
    <button
      type="button"
      class="flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm hover:bg-gray-50"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="isOpen = !isOpen"
    >
      <img
        :src="`https://flagcdn.com/w40/${selectedCountry.iso.toLowerCase()}.png`"
        :alt="selectedCountry.name"
        class="h-4 w-6 object-cover ring-1 ring-gray-200"
      />
      <span>{{ selectedCountry.dialCode }}</span>
      <span class="text-gray-400">▾</span>
    </button>

    <div
      v-if="isOpen"
      class="absolute left-0 top-12 z-[2100] w-72 rounded-lg border border-gray-200 bg-white p-2 shadow-xl"
    >
      <input
        v-model="search"
        type="search"
        placeholder="Search country"
        aria-label="Search country"
        class="mb-2 h-9 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-slate-500"
        @click.stop
      />

      <ul class="max-h-60 overflow-y-auto" role="listbox">
        <li v-for="country in filteredCountries" :key="country.iso">
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-slate-100"
            @click="selectCountry(country)"
          >
            <img
              :src="`https://flagcdn.com/w40/${country.iso.toLowerCase()}.png`"
              :alt="country.name"
              class="h-4 w-6 object-cover ring-1 ring-gray-200"
            />
            <span class="min-w-0 flex-1 truncate">{{ country.name }}</span>
            <span class="text-gray-500">{{ country.dialCode }}</span>
          </button>
        </li>
        <li
          v-if="!filteredCountries.length"
          class="px-2 py-3 text-sm text-gray-500"
        >
          No countries found.
        </li>
      </ul>
    </div>
  </div>
</template>
