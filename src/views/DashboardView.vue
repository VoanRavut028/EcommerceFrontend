<script setup lang="ts">
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const stats = [
  {
    label: "dashboard.totalOrders",
    value: "1,248",
    change: "+12.8%",
    icon: "M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 8H6",
    trend: "up",
  },
  {
    label: "dashboard.revenue",
    value: "$24,780",
    change: "+8.2%",
    icon: "M12 2v20m5-15H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
    trend: "up",
  },
  {
    label: "dashboard.users",
    value: "1,842",
    change: "+5.4%",
    icon: "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-3a4 4 0 0 1 0 8m2 3h3v-2a4 4 0 0 0-3-3.87",
    trend: "up",
  },
  {
    label: "dashboard.products",
    value: "356",
    change: "+2.1%",
    icon: "m12 3 9 5-9 5-9-5 9-5Zm-9 5v10l9 5 9-5V8m-9 5v10",
    trend: "up",
  },
];

const weeklySales = [
  { day: "dashboard.mon", height: "38%" },
  { day: "dashboard.tue", height: "57%" },
  { day: "dashboard.wed", height: "46%" },
  { day: "dashboard.thu", height: "76%" },
  { day: "dashboard.fri", height: "62%" },
  { day: "dashboard.sat", height: "91%" },
  { day: "dashboard.sun", height: "70%" },
];

const recentOrders = [
  {
    id: "#ORD-2048",
    customer: "Sokha Chan",
    date: "Sep 27, 2026",
    amount: "$128.00",
    status: "dashboard.delivered",
    statusStyle: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
  {
    id: "#ORD-2047",
    customer: "Dara Kim",
    date: "Sep 27, 2026",
    amount: "$76.50",
    status: "dashboard.processing",
    statusStyle: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  {
    id: "#ORD-2046",
    customer: "Malis Heng",
    date: "Sep 26, 2026",
    amount: "$214.00",
    status: "dashboard.shipped",
    statusStyle: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    id: "#ORD-2045",
    customer: "Vanna Sok",
    date: "Sep 26, 2026",
    amount: "$43.90",
    status: "dashboard.pending",
    statusStyle: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
];

onMounted(() => {
  loadDashboardData();
});

function loadDashboardData() {
  // TODO: Load live dashboard stats after login and dashboard API integration.
}
</script>

<template>
  <main class="min-h-[calc(100vh-6rem)] bg-dominant px-4 py-6 text-text sm:px-6 sm:py-8 lg:px-10">
    <div class="mx-auto max-w-7xl space-y-6">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-medium text-text-muted">
            {{ t("dashboard.eyebrow") }}
          </p>
          <h1 class="mt-1 text-2xl font-bold tracking-tight text-text-strong sm:text-3xl">
            {{ t("dashboard.title") }}
          </h1>
          <p class="mt-2 text-sm text-text-muted">
            {{ t("dashboard.subtitle") }}
          </p>
        </div>
        <div class="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-text">
          <svg
            class="h-4 w-4 text-text-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18" />
          </svg>
          {{ t("dashboard.last30Days") }}
        </div>
      </header>

      <div class="rounded-lg border border-border bg-accent/60 px-4 py-3 text-sm text-text">
        <span class="font-semibold">{{ t("dashboard.previewLabel") }}</span>
        {{ t("dashboard.previewNotice") }}
      </div>

      <section
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        :aria-label="t('dashboard.stats')"
      >
        <article
          v-for="stat in stats"
          :key="stat.label"
          class="rounded-xl border border-border bg-secondary p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-text-muted">
                {{ t(stat.label) }}
              </p>
              <p class="mt-3 text-2xl font-bold tracking-tight text-text-strong">
                {{ stat.value }}
              </p>
            </div>
            <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-text-strong">
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path :d="stat.icon" />
              </svg>
            </span>
          </div>
          <p class="mt-4 flex items-center gap-1.5 text-xs">
            <span class="font-semibold text-emerald-600 dark:text-emerald-400">
              {{ stat.change }}
            </span>
            <span class="text-text-muted">{{ t("dashboard.vsLastMonth") }}</span>
          </p>
        </article>
      </section>

      <section class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article class="rounded-xl border border-border bg-secondary p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-lg font-semibold text-text-strong">
                {{ t("dashboard.salesOverview") }}
              </h2>
              <p class="mt-1 text-sm text-text-muted">
                {{ t("dashboard.salesOverviewSubtitle") }}
              </p>
            </div>
            <span class="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-text">
              {{ t("dashboard.thisWeek") }}
            </span>
          </div>

          <div class="mt-7 flex h-56 items-end justify-between gap-2 border-b border-border px-1 sm:gap-4">
            <div
              v-for="day in weeklySales"
              :key="day.day"
              class="flex h-full flex-1 flex-col items-center justify-end gap-3"
            >
              <div class="flex h-full w-full items-end">
                <div
                  class="w-full rounded-t-md bg-primary/80 transition-colors hover:bg-primary"
                  :style="{ height: day.height }"
                  :aria-label="t(day.day)"
                ></div>
              </div>
              <span class="pb-2 text-xs text-text-muted">{{ t(day.day) }}</span>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between text-xs text-text-muted">
            <span>{{ t("dashboard.salesChartNote") }}</span>
            <span class="inline-flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-sm bg-primary"></span>
              {{ t("dashboard.sales") }}
            </span>
          </div>
        </article>

        <article class="rounded-xl border border-border bg-secondary p-5 shadow-sm sm:p-6">
          <div class="flex items-start justify-between">
            <div>
              <h2 class="text-lg font-semibold text-text-strong">
                {{ t("dashboard.quickSummary") }}
              </h2>
              <p class="mt-1 text-sm text-text-muted">
                {{ t("dashboard.quickSummarySubtitle") }}
              </p>
            </div>
            <span class="rounded-lg bg-accent p-2 text-text-strong">
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                aria-hidden="true"
              >
                <path d="M3 3v18h18M7 14l4-4 4 3 6-7" />
              </svg>
            </span>
          </div>
          <div class="mt-7">
            <p class="text-sm text-text-muted">{{ t("dashboard.conversionRate") }}</p>
            <p class="mt-2 text-3xl font-bold text-text-strong">3.6%</p>
            <p class="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
              {{ t("dashboard.conversionChange") }}
            </p>
          </div>
          <div class="my-5 border-t border-border"></div>
          <div class="space-y-4">
            <div class="flex items-center justify-between text-sm">
              <span class="text-text-muted">{{ t("dashboard.averageOrder") }}</span>
              <span class="font-semibold text-text-strong">$64.20</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-text-muted">{{ t("dashboard.returningCustomers") }}</span>
              <span class="font-semibold text-text-strong">28.4%</span>
            </div>
          </div>
        </article>
      </section>

      <section class="overflow-hidden rounded-xl border border-border bg-secondary shadow-sm">
        <div class="flex flex-col gap-1 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 class="text-lg font-semibold text-text-strong">
              {{ t("dashboard.recentOrders") }}
            </h2>
            <p class="mt-1 text-sm text-text-muted">
              {{ t("dashboard.recentOrdersSubtitle") }}
            </p>
          </div>
          <span class="text-sm font-medium text-text-muted">
            {{ t("dashboard.sampleRows") }}
          </span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[640px] text-left text-sm">
            <thead class="bg-dominant-alt text-xs uppercase tracking-wide text-text-muted">
              <tr>
                <th class="px-5 py-3 font-medium sm:px-6">{{ t("dashboard.orderId") }}</th>
                <th class="px-5 py-3 font-medium">{{ t("dashboard.customer") }}</th>
                <th class="px-5 py-3 font-medium">{{ t("dashboard.date") }}</th>
                <th class="px-5 py-3 font-medium">{{ t("dashboard.amount") }}</th>
                <th class="px-5 py-3 font-medium">{{ t("dashboard.status") }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                v-for="order in recentOrders"
                :key="order.id"
                class="transition-colors hover:bg-dominant-alt"
              >
                <td class="whitespace-nowrap px-5 py-4 font-semibold text-text-strong sm:px-6">
                  {{ order.id }}
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-text">{{ order.customer }}</td>
                <td class="whitespace-nowrap px-5 py-4 text-text-muted">{{ order.date }}</td>
                <td class="whitespace-nowrap px-5 py-4 font-medium text-text-strong">{{ order.amount }}</td>
                <td class="whitespace-nowrap px-5 py-4">
                  <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="order.statusStyle">
                    {{ t(order.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </main>
</template>
