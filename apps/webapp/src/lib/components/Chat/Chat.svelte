<script lang="ts">
  import BottomSheet from '$lib/components/BottomSheet.svelte'
  import Input from '$lib/components/Input.svelte'
  import { tick } from 'svelte'
  import IncomingMessage from './IncomingMessage.svelte'
  import OutgoingMessage from './OutgoingMessage.svelte'
  import { api, apiCallMessages, apiCurrentUser } from '$lib/api'

  import { appCurrentMatch } from '$lib/app-service'
  let chatEl: HTMLElement
  let newMessage = ''

  function sendMessage() {
    const msg = newMessage.trim()
    if (msg.length === 0) return

    $api.client.emit('call:send-message', {
      matchId: $appCurrentMatch!.matchId,
      from: $apiCurrentUser!.id,
      text: msg,
    })
    newMessage = ''
  }

  $: if ($apiCallMessages && chatEl) {
    tick().then(() => {
      chatEl.scrollTo({ behavior: 'instant', top: chatEl.scrollHeight })
    })
  }
</script>

<BottomSheet padding={16} on:clickOutside class="h-full max-h-[60%]">
  <div class="flex h-full flex-col gap-6">
    <div class="flex grow flex-col gap-2 overflow-y-scroll" bind:this={chatEl}>
      {#each $apiCallMessages as msg}
        {#if msg.from === $apiCurrentUser?.id}
          <OutgoingMessage text={msg.text} />
        {:else}
          <IncomingMessage text={msg.text} />
        {/if}
      {/each}
    </div>

    <div class="flex shrink-0 flex-col gap-2">
      <div class="text-grey text-center text-[13px] font-medium">Tap message to copy</div>
      <form on:submit|preventDefault={() => sendMessage()}>
        <Input placeholder="Enter message" bind:value={newMessage} />
      </form>
    </div>
  </div>
</BottomSheet>
