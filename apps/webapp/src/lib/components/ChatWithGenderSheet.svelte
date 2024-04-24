<script lang="ts">
  import { tr } from '$lib/i18n'
  import BottomSheet2 from '$lib/components/BottomSheet2.svelte'

  export let shown = true

  $: genders = [
    { icons: ['👩‍🦰', '👨'], name: $tr('girls_and_guys') },
    { icons: ['👩‍🦰'], name: $tr('girls_only') },
    { icons: ['👨'], name: $tr('guys_only') },
  ]
</script>

{#if shown}
  <BottomSheet2 class="p-6" on:close={() => (shown = false)}>
    <div class="flex flex-col gap-6">
      <div class="text-center text-[24px] font-extrabold">{$tr('chat_with_filter')}</div>

      <div class="grid grid-cols-2 grid-rows-2 gap-2 opacity-30">
        {#each genders as gender, i}
          <div
            class={`bg-bg-secondary text-default flex flex-col items-center gap-2 rounded-[20px] px-4 py-3 ${i === 0 ? 'col-span-2' : ''}`}
          >
            <div class="flex gap-2">
              {#each gender.icons as icon}
                <div class="text-[44px] font-medium leading-none">{icon}</div>
              {/each}
            </div>
            <div class="text-[17px] font-medium">{gender.name}</div>
          </div>
        {/each}
      </div>
    </div>
  </BottomSheet2>
{/if}
