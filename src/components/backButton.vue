
<template>
<button  [routerLink]="navigateTo() ?? null" class="flex items-center gap-1">
  <mat-icon>arrow_back</mat-icon>
  {{ label() }}
</button>
</template>
