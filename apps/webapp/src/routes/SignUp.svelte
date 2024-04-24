<script lang="ts">
  import { api, apiCurrentUser } from '$lib/api'
  import TwixerLogo from '$lib/assets/TwixerLogo.svelte'
  import Select from '$lib/components/Select.svelte'
  import StartVideoChatButton from '$lib/components/StartVideoChatButton.svelte'
  import Terms from '../lib/components/SignUp/Terms.svelte'
  import { tr } from '$lib/i18n'
  import BottomSheet2 from '$lib/components/BottomSheet2.svelte'

  let name = $apiCurrentUser?.name ?? ''
  // let nameEl: Input
  let gender: (typeof genders)[0] | null = null
  let state: 'start' | 'gender' | 'terms' = 'start'

  $: genders = [
    { icon: '👨', name: $tr('guy'), value: 'MALE' as const },
    { icon: '👩‍🦰', name: $tr('girl'), value: 'FEMALE' as const },
  ]

  function onGender(selectedGender: (typeof genders)[0]) {
    state = 'start'
    gender = selectedGender
  }

  async function signup() {
    if (gender) {
      await $api.client.emitWithAck('user:signup', { name, gender: gender.value })
    }
  }

  function start() {
    if (!gender) {
      state = 'gender'
    } else {
      state = 'terms'
    }
  }
</script>

<div class="flex h-full flex-col">
  <div class="flex grow items-center justify-center">
    <TwixerLogo />
  </div>

  <div class="flex flex-col gap-6 p-8">
    {#if state === 'terms'}
      <Terms on:click={() => signup()} />
    {:else}
      <div class="flex flex-col gap-2">
        <!-- <Input bind:this={nameEl} placeholder="Your Name" bind:value={name} /> -->
        <Select
          value={gender ? gender.name : $tr('your_gender')}
          on:click={() => (state = 'gender')}
        />
      </div>

      <StartVideoChatButton on:click={start} />
    {/if}
  </div>
</div>

{#if state === 'gender'}
  <BottomSheet2 class="p-6" on:close={() => (state = 'start')}>
    <div class="flex flex-col gap-6">
      <div class="text-center text-2xl font-extrabold">{$tr('your_gender')}</div>
      <div class="flex gap-2">
        {#each genders as gender}
          <button
            class="bg-bg-secondary text-default flex grow flex-col items-center justify-center gap-2 rounded-[20px] px-4 py-3"
            on:click={() => onGender(gender)}
          >
            <div class="text-[44px] leading-none">{gender.icon}</div>
            <div class="text-[17px] font-semibold">{gender.name}</div>
          </button>
        {/each}
      </div>

      <div class="text-grey text-center text-[13px] font-medium">
        {$tr('cannot_change_gender_after_reg')}
      </div>
    </div>
  </BottomSheet2>
{/if}
