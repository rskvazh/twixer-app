<script lang="ts">
  import Button from '$lib/components/Button.svelte'
  import Checkbox from '$lib/components/Checkbox.svelte'
  import { tr } from '$lib/i18n'

  $: terms = [$tr('read_and_accept_terms'), $tr('signup_confirm_age')]

  let checkeds = [false, false]

  $: accepted = checkeds.every((i) => i)
</script>

<div class="flex flex-col gap-6">
  <div class="text-default flex flex-col gap-3 pb-5 text-[17px] font-light leading-[20px]">
    {#each terms as term, i}
      <label class="flex gap-4">
        <Checkbox bind:checked={checkeds[i]} />
        <div>{@html term}</div>
      </label>
    {/each}
  </div>

  <Button on:click disabled={!accepted}>{$tr('confirm')}</Button>
</div>
