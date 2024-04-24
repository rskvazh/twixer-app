<script lang="ts">
  export let value = ''
  export let icon = ''
</script>

<div
  on:click
  class="bg-bg-secondary text-default flex h-[52px] cursor-pointer items-center gap-3 rounded-[20px] px-4 text-[17px] font-medium active:brightness-90"
>
  {#if icon}
    <div class="pointer-events-none text-[32px] font-medium leading-none">
      {icon}
    </div>
  {/if}

  <div class="pointer-events-none grow">{value}</div>

  <div class="text-grey shrink-0">
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.15572 7.60856C5.61218 8.13048 6.38782 8.13048 6.84428 7.60856L11.6875 2.07081C12.3759 1.28374 11.8525 0 10.8432 0H1.15677C0.147517 0 -0.375873 1.28374 0.312489 2.07081L5.15572 7.60856Z"
        fill="currentColor"
      />
    </svg>
  </div>
</div>
