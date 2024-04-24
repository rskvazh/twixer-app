<script lang="ts">
  import { apiCurrentUser } from '$lib/api'
  import CoinsIcon from '$lib/assets/CoinsIcon.svelte'
  import TonSymbol from '$lib/assets/TonSymbol.svelte'
  import TonSymbolCircle from '$lib/assets/TonSymbolCircle.svelte'
  import BottomSheet2 from '$lib/components/BottomSheet2.svelte'
  import Button from '$lib/components/Button.svelte'
  import FullAvatar from '$lib/components/FullAvatar.svelte'
  import ActionSection from '$lib/components/ui/ActionSection.svelte'
  import { trGender } from '$lib/i18n'
  import { tonConnect } from '$lib/ton'
  import AccountCoins from './AccountCoins.svelte'

  const footerItems = [
    { text: 'Terms of service', link: '/' },
    { text: 'Privacy Policy', link: '/' },
    { text: 'Feedback', link: '/' },
  ]

  let coinsSheetShow = false
</script>

{#if $apiCurrentUser}
  <BottomSheet2 class="h-[80vh] p-7 pt-0">
    <div class="mb-[-64px] -translate-y-1/2 self-center">
      <FullAvatar>🐼</FullAvatar>
    </div>

    <div class="text-default flex grow flex-col gap-10 overflow-scroll pt-[24px] font-medium">
      <div class="flex flex-col items-center gap-2">
        <div class="text-[28px]">{$apiCurrentUser.name}</div>
        <div class="flex items-center gap-1">
          <span class="text-[20px]">👨</span>
          <span class="text-grey text-[14px] font-medium">{$trGender($apiCurrentUser.gender)}</span>
        </div>
      </div>

      <div class="flex flex-col">
        <ActionSection on:click={() => (coinsSheetShow = true)}>
          <div slot="left"><CoinsIcon /></div>
          Coins
          <div slot="right">{$apiCurrentUser.coins}</div>
        </ActionSection>
      </div>

      <div class="mt-auto flex flex-col gap-[10px]">
        {#if $tonConnect.connected}
          <div class="text-grey text-center text-[17px] font-medium">
            {$tonConnect.walletAddressShort}
          </div>
          <Button variant="secondary" on:click={() => tonConnect.disconnectWallet()}>
            <TonSymbolCircle size={22} />
            <div>Disconnect Wallet</div>
          </Button>
        {:else}
          <Button on:click={() => tonConnect.ensureConnectWallet()}
            ><TonSymbol />Connect Wallet</Button
          >
        {/if}
      </div>

      <!-- <div class="flex flex-col gap-4 px-4 text-[14px]">
        {#each footerItems as item}
          <div><a href={item.link} target="_blank">{item.text}</a></div>
        {/each}
      </div> -->
    </div>
  </BottomSheet2>

  {#if coinsSheetShow}
    <AccountCoins on:close={() => (coinsSheetShow = false)} />
  {/if}
{/if}
