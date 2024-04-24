<script lang="ts">
  import BottomSheet from '$lib/components/BottomSheet.svelte'
  import ChannelSelectItem from './ChannelSelectItem.svelte'
  import { api } from '$lib/api'
  import type { ApiTypes } from '@twixer/core'
  import Divider from '$lib/components/Divider.svelte'

  export let shown = true
  export let channels: string[] = []

  let allChannels: ApiTypes.Channel[] = []

  loadChannels()
  $: if (shown) loadChannels()

  async function loadChannels() {
    allChannels = await $api.client.emitWithAck('user:channels')
  }

  function onChange(channelId: string | null, ev: Event) {
    if (ev.target instanceof HTMLInputElement) {
      set(channelId, ev.target.checked)
    }
  }

  function set(channelId: string | null, checked: boolean) {
    console.log(channelId, checked)
    if (channelId === null) {
      if (checked) {
        channels = []
      }
    }
  }

  function hide() {
    shown = false
  }
</script>

{#if shown}
  <BottomSheet padding={24} class="h-full max-h-[50%]" on:clickOutside={hide}>
    <div class="flex flex-col gap-6">
      <div class="text-default text-center text-[24px] font-extrabold">Preferred Channels</div>

      <ChannelSelectItem name="All channels" value={null} bind:channels />

      <Divider />

      {#if allChannels.length === 0}
        No channels yet
      {:else}
        {#each allChannels as ch}
          <ChannelSelectItem name={ch.name} value={ch.id} bind:channels />
        {/each}
      {/if}
    </div>
  </BottomSheet>
{/if}
