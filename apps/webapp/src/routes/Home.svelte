<script lang="ts">
  import { apiCurrentUser } from '$lib/api'
  import { appService, appState } from '$lib/app-service'
  import TwixerLogo from '$lib/assets/TwixerLogo.svelte'
  import BottomSheet2 from '$lib/components/BottomSheet2.svelte'
  import UserAvatarButton from '$lib/components/UserAvatarButton.svelte'
  import { tr } from '$lib/i18n'
  import Account from './Account.svelte'
  import Match from './Match.svelte'

  let gendersShown = false
  let channelsShown = false
  let channels: string[] = []

  function startMatchmaking() {
    appService.startMatch()
  }
</script>

{#if $appState === 'match'}
  <Match />
{:else if $appState === 'account'}
  <div class="bg-accent text-accent-dark flex h-full flex-col items-center gap-4 p-4">
    <Account />
  </div>
{:else}
  <div class="bg-accent text-accent-dark flex h-full flex-col gap-4">
    <div class="flex grow flex-col items-center p-4">
      <div class="self-end">
        {#if $apiCurrentUser}
          <UserAvatarButton name={$apiCurrentUser.name} on:click={() => appState.set('account')} />
        {/if}
      </div>

      <div class="flex grow items-center">
        <TwixerLogo />
      </div>
    </div>

    <BottomSheet2 variant="static" backdrop={false} class="shrink-0 p-8">
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <Select icon="👫" value={$tr('girls_and_guys')} on:click={() => (gendersShown = true)} />
          <!-- <Select icon="🚀" value="Channel" on:click={() => (channelsShown = true)} /> -->
        </div>

        <StartVideoChatButton on:click={() => startMatchmaking()} />
      </div>
    </BottomSheet2>
  </div>

  <ChatWithGenderSheet bind:shown={gendersShown} />
  <!-- <ChannelSelectSheet bind:shown={channelsShown} bind:channels /> -->
{/if}
