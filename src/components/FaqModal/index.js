import React from 'react'
import Modal from 'components/Modal'
import LogoIcon from 'assets/logo.svg'

const faqList = [
  {
    title: `1. What is Concentrator?`,
    text: `Concentrator is a yield enhancer that boosts yields on Convex vaults by ~50%!`,
  },
  {
    title: `2. Why use Concentrator?`,
    text: `●	Set & forget to increase Convex yields by ~50%<br/>●	Yield are concentrated into cvxCRV so they earn the most rewards while simultaneously giving exposure to Curve/Convex ecosystem (farm & hold)<br/>●	Claim your rewards at a time of your choosing`
  },
  {
    title: `3. How does it work?`,
    text: `Users deposit Curve LP tokens, which are automatically staked in Convex vaults.  Rewards are periodically harvested, swapped to cvxCRV and deposited in the Concentrator vault.  The Concentrator vault stakes deposited cvxCRV on Convex, then auto-compounds the resulting rewards back to more cvxCRV.<br/>Users may withdraw their cvxCRV from the Concentrator vault at any time, or zap to CRV, CVX, or ETH. <img class="mt-1" src="/resources/images/faq-how-does-it-work.jpeg" />`,
  },
  {
    title: `4. What is aCRV?`,
    text: `
    aCRV simply represents the compounding cvxCRV in the Concentrator vault.  The total amount of cvxCRV contained in the Concentrator vault is equal to the total aCRV balance multiplied by the current index:<br/>
    cvxCRV_Balance = aCRV_Balance * Current_Index<br/>
    Using aCRV to represent a share of the underlying compounding cvxCRV vault simplifies the smart contracts and is more gas efficient.
    `
  },
  {
    title: `5. Is it safe?`,
    text: `Concentrator is built by the experienced and security-obsessed AladdinDAO team, and it is audited by <a href="https://aladdin.club/audits/PeckShield-Audit-Report-AladdinV3Concentrator-v1.0.pdf" target="_blank" class="underline text-blue-100">Peckshield</a> and <a href="https://aladdin.club/audits/AladdinDao_V3_Report_Secbit.pdf" target="_blank" class="underline text-blue-100">SECBIT Labs.</a>`,
  },
  {
    title: `6. How much does it cost`,
    text: `Please refer to <a href="https://docs.aladdin.club/concentrator" target="_blank" class="underline text-blue-100">gitbook</a> for fees. Withdrawal fees are redistributed to liquidity providers in the Concentrator.`,
  },
]

const FaqModal = props => {
  const { onCancel } = props

  return (
    <Modal onCancel={onCancel} width="900px">
      <div className="flex items-center justify-center gap-4 mb-8">
        <img src={LogoIcon} className="w-52" />
        <div className="text-2xl font-bold">FAQ</div>
      </div>
      {faqList.map(item => (
        <div className="mb-4 pr-2">
          <div className="font-bold">{item.title}</div>
          <div dangerouslySetInnerHTML={{ __html: item.text }} />
        </div>
      ))}
    </Modal>
  )
}

export default FaqModal
