<script lang="ts">
  import { api, apiCurrentUser } from '$lib/api'
  import CoinsAddIcon from '$lib/assets/CoinsAddIcon.svelte'
  import CoinsIcon from '$lib/assets/CoinsIcon.svelte'
  import TonSymbolCircle from '$lib/assets/TonSymbolCircle.svelte'
  import WalletIcon from '$lib/assets/WalletIcon.svelte'
  import WithdrawIcon from '$lib/assets/WithdrawIcon.svelte'
  import BottomSheet2 from '$lib/components/BottomSheet2.svelte'
  import Button from '$lib/components/Button.svelte'
  import { tonConnect } from '$lib/ton'
  import type { ApiTypes } from '@twixer/core'

  const numberFormat = new Intl.NumberFormat()

  $: coinsFormatted = numberFormat.format($apiCurrentUser!.coins)

  let topUpShow = false
  let coinsOffers = $api.client.emitWithAck('coins:get-offers')
  let selectedOffer: ApiTypes.CoinsOffer | null = null

  async function purchase() {
    if (selectedOffer && (await tonConnect.ensureConnectWallet())) {
      const tx = await $api.client.emitWithAck('coins:create-transaction', {
        offerId: selectedOffer.id,
      })

      await tonConnect.purchase(tx.transaction)

      selectedOffer = null
      topUpShow = false
    }
  }
</script>

<BottomSheet2 class="p-6" on:close>
  <div class="mb-[-50px] -translate-y-[50px] self-center">
    <CoinsIcon size={111} />
  </div>

  <div class="text-default mt-4 flex flex-col gap-4">
    <div class="flex flex-col items-center font-medium">
      <div class="text-[28px]">{coinsFormatted}</div>
      <div class="text-grey text-[14px]">Coins</div>
    </div>

    <div class="h-4"></div>

    <div class="flex items-center justify-items-stretch gap-4">
      <div class="basis-1/2"></div>
      <!-- <Button class="basis-1/2" variant="secondary">
        <div class="flex grow items-center justify-between">
          <div>Withdraw</div>
          <WithdrawIcon />
        </div>
      </Button> -->
      <Button class="basis-1/2" on:click={() => (topUpShow = true)}>
        <div class="flex grow items-center justify-between">
          <div>Add coins</div>
          <CoinsAddIcon />
        </div>
      </Button>
    </div>
  </div>
</BottomSheet2>

{#if topUpShow}
  <BottomSheet2 on:close={() => (topUpShow = false)} class="px-6 pt-6">
    <div class="flex h-[60vh] flex-col items-center overflow-hidden">
      <div class="text-default text-[24px] font-extrabold">Coin Recharge</div>

      <div class="text-grey mb-4 mt-8 flex gap-[10px] text-[17px] font-medium">
        <div>Balance:</div>
        <div class="flex items-center gap-1">
          <CoinsIcon size={18} />
          <div>{$apiCurrentUser?.coins}</div>
        </div>
      </div>

      <div class="scroll-track grid grid-cols-2 gap-2 self-stretch overflow-y-scroll pb-6">
        {#await coinsOffers then offers}
          {#each offers.offers as offer}
            <div
              class="bg-bg-secondary flex cursor-pointer select-none flex-col items-center gap-4 rounded-[20px] p-4"
              on:click={() => (selectedOffer = offer)}
            >
              <div class="text-grey flex items-center justify-center gap-2 pt-2">
                <CoinsIcon size={24} />
                <div class="text-[24px] font-extrabold">{offer.coins}</div>
              </div>

              <div
                class="bg-bg text-default flex h-8 items-center gap-1 rounded-[16px] px-3 py-[6px]"
              >
                <div>{offer.tons}</div>
                <TonSymbolCircle size={20} />
              </div>
            </div>
          {/each}
        {/await}
      </div>
    </div>
  </BottomSheet2>
{/if}

{#if selectedOffer}
  <BottomSheet2 variant="blur" class="gap-6 p-6 " on:close={() => (selectedOffer = null)}>
    <div class="text-default text-center text-[17px]">Purchase</div>

    <div class="text-default text-center text-[24px] font-extrabold">{selectedOffer.tons} TON</div>

    {#if $tonConnect.connected}
      <Button on:click={() => purchase()}>
        <WalletIcon />
        Pay by Wallet
      </Button>
    {:else}
      <Button on:click={() => tonConnect.ensureConnectWallet()}>Connect Wallet</Button>
    {/if}
  </BottomSheet2>
{/if}
