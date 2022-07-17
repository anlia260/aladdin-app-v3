import React from 'react'
import Modal from 'components/Modal'
import LogoIcon from 'assets/logo.svg'
import "./style.scss"

const faqList = [
  {
    title: `1.	IFO?`,
    text: `Initial Farm Offering.  A new and fair way to democratize ownership of Concentrator and raise some aCRV funds for Concentrator treasury. Deposit your Curve LPs to Concentrator’s <strong>IFO vaults</strong> just like a regular Concentrator vault, except your yields are automatically exchanged for CTR tokens.  1 aCRV yield harvested = 1 CTR reward`,
  },
  {
    title: `2.	How long does it run?`,
    text: `We are raising 2.5m aCRV for 50% of the FDV token allocation.  The IFO vaults will continue distributing CTR tokens until we reach 2.5m aCRV harvested.  Afterwards vaults automatically revert to earning regular aCRV returns!`,
  },
  {
    title: `3.	So I give up my aCRV yields and receive CTR instead.  Why would I do that?`,
    text: `CTR is Concentrator’s token, and it is designed to be a cash(flow) cow.  CTR uses the Curve ve-lock mechanism, and veCTR holders will vote to allocate/receive up to 50% of the platform’s revenue denominated in aCRV (auto-compounding cvxCRV).  veCTR holders also, of course, receive governance rights.  CTR has a very <a href="https://medium.com/@0xconcentrator_29486/find-your-future-in-a-farm-9e571934c32c" target="_blank">favourable emission schedule</a>.  There will be no CTR emissions after the end of the IFO (no liquidity mining, no new minting), so no inflation.`,
  },
  {
    title: `4.	Can I participate in the IFO using my aCRV?`,
    text: `The IFO vaults only accept Curve LP tokens, not aCRV directly.  However, aCRV can be used to farm CTR by providing liquidity in the <a href="https://app.balancer.fi/#/pool/0x80a8ea2f9ebfc2db9a093bd46e01471267914e490002000000000000000002a2" target="_blank">Balancer IFO Liquidity Pool for aCRV-CTR</a>.  Alternatively, withdraw your cvxCRV and zap it into the cvxCRV/CRV Concentrator vault.  Both of those options allow you to stay mostly exposed to aCRV.`,
  },
  {
    title: `5.	Where can I swap CTR?`,
    text: `There is a <a href="https://app.balancer.fi/#/pool/0x80a8ea2f9ebfc2db9a093bd46e01471267914e490002000000000000000002a2" target="_blank">liquidity pool on Balancer</a> where CTR can be exchanged for aCRV.  This pool is a weighted pool skewed heavily to aCRV, so watch out for slippage on CTR swaps!`,
  },
  {
    title: `6.	Why the unusual weighted Balancer liquidity pool?  Why not just Curve v2/Uni?`,
    text: `
    Neither Curve nor Uni offer fixed weight pools.  The <a href="https://docs.balancer.fi/products/balancer-pools/weighted-pools" target="_blank">weighted Balancer pool</a> skewed heavily to aCRV will allow LPs to provide CTR liquidity while taking on very little impermanent loss compared to just holding aCRV, making LPing in this pool a much less risky option for farming CTR. An interesting side-effect is that bigger buys and sells of the token with the small weight will suffer more slippage in the weighted liquidity pool, and so large scale mercenary farm-and-dump outfits may be less inclined to exploit this launch and dump token price. <br/><br/>
After the IFO is over and all the CTR has been emitted, CTR farming rewards in the Balancer pool will be <strong>discontinued</strong>.
    `,
  },
  {
    title: `7.	What makes the Concentrator IFO more fair than other token launches?`,
    text: `
    Two things: <br/>
    a.	The price.  Everybody farming gets 1 CTR for 1 aCRV, no matter how big your deposit is.  No tokens have ever been sold to anyone for less.<br/>
    b.	The distribution schedule.  No pre-sold tokens and no vesting allotments means no unlock bomb in the future.
    `,
  },
  {
    title: `8.	Why are you raising funds for Concentrator?`,
    text: `Glad you asked, anon!  The aCRV that Concentrator raises are going to be used to improve aCRV liquidity, especially on non-mainnet chains.  Curve is emitting CRV on many chains now but most of the yield opportunities for CRV still live on mainnet.  aCRV will provide a simple option to help CRV holders on other chains like Arbitrum, Avalanche, Optimism, etc to earn yields.  `,
  },
  {
    title: `9.	Is there any way to earn CTR other than farming the IFO?`,
    text: `Yes!  There is a token allocation that will be distributed to the community by veCTR vote called the Community Booster allocation.  People in the community who help to spread Concentrator’s message or otherwise help out during the IFO can be nominated to be on the ballot.  See more details <a href="https://medium.com/@0xconcentrator_29486/lets-concentrate-together-19e575520640" target="_blank">here</a>.<br/><br/>

    Additionally a small airdrop of CTR will be issued to the earliest users of Concentrator.
    
    `,
  },
  {
    title: `10.	I’m a member of the AladdinDAO community and hold (x)ALD.  Do I receive CTR?`,
    text: `AladdinDAO will receive 30% of the CTR tokens.  Aladdin will instantly lock that entire allocation for the maximum duration (4 years) and continually re-lock those tokens.  xALD holders will vote to direct the veCTR governance power held by Aladdin, and any revenue earned by the Aladdin veCTR tokens will be directly claimable by ALD stakers. (We may revamp Aladdin tokenomics at some point)`,
  },
  {
    title: `11.	What’s with the withdrawal fees?`,
    text: `Withdrawal fees are disclosed on both the Deposit and Withdraw windows for each vault.  They are a bit higher than normal during the IFO due to possible higher APY and/or TVL.  Withdrawal fees protect depositors from a big deposit being made just prior to a harvest, then withdrawn right after.  Optimal withdrawal fee is equal to the size of one harvest which can vary so adjustments may be necessary, and after IFO most will likely be adjusted back down.<br/><br/>

    Withdrawal fees do not go to the platform, but instead to other depositors in the pool. 
    `,
  },
  {
    title: `12.	Where can I get more details?`,
    text: `Check out the launch article <a href="https://medium.com/@0xconcentrator_29486/find-your-future-in-a-farm-9e571934c32c" target="_blank">here</a>.`,
  },
]

const IfoFaqModal = props => {
  const { onCancel } = props

  return (
    <Modal onCancel={onCancel} width="900px">
      <div className="flex items-center justify-center gap-4 mb-8">
        <img src={LogoIcon} className="w-52" alt="logo" />
        <div className="text-2xl font-bold">IFO FAQ</div>
      </div>
      {faqList.map(item => (
        <div className="mb-4 pr-2">
          <div className="font-bold">{item.title}</div>
          <div className='faq-text' dangerouslySetInnerHTML={{ __html: item.text }} />
        </div>
      ))}
    </Modal>
  )
}

export default IfoFaqModal
