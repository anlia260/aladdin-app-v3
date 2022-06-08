import { FormattedMessage } from 'react-intl'
import React from 'react'

export default async function getMenuData() {
  const appMenu = [
    {
      category: true,
      title: 'App',
    },
    {
      title: <FormattedMessage id="nav.home" />,
      key: 'home',
      url: '/home',
      icon: 'home',
    },
    {
      title: <FormattedMessage id="nav.bond" />,
      key: 'bond',
      url: '/bond',
      icon: 'bond',
    },
    {
      title: <FormattedMessage id="nav.stake" />,
      key: 'stake',
      url: '/stake',
      icon: 'stake',
    },
    {
      title: <FormattedMessage id="nav.vaults" />,
      key: 'vaults',
      url: '/vaults',
      icon: 'vaults',
    },

    // {
    //   title: <FormattedMessage id="nav.lootMinings" />,
    //   key: 'loot-minings',
    //   // icon: 'fe fe-anchor',
    //   url: '/loot-minings',
    // },
    // {
    //   title: 'Boule',
    //   key: 'boule-member',
    //   url: '/boule-member',
    // },
    // {
    //   title: 'Boule Plus',
    //   key: 'boule-plus',
    //   url: '/boule-plus',
    //   icon: 'boule-plus',
    // },
    {
      title: 'NFT',
      key: 'bond-nft',
      url: '/bond-nft',
      icon: 'boule-plus',
    },
    // {
    //   title: 'Bond Prize',
    //   key: 'bond-prize',
    //   url: '/bond-prize',
    //   icon: 'bond-prize',
    //   children: [
    //     {
    //       title: 'NFT',
    //       key: 'bond-nft',
    //       url: '/bond-nft',
    //       // icon: 'bond-nft',
    //     },
    //     // {
    //     //   title: 'Bond Draw',
    //     //   key: 'bond-draw',
    //     //   url: '/bond-draw',
    //     //   // icon: 'bond-draw',
    //     // },
    //   ],
    // },
    {
      title: 'Mystery School',
      key: 'mystery',
      url: '/mystery',
      icon: 'mystery',
    },
    // {
    //   title: 'Liquidity Farming',
    //   key: 'liquidityFarming',
    //   icon: 'fe fe-truck',
    //   url: '/liquidity',
    // },
    // {
    //   title: <FormattedMessage id="nav.optionReward" />,
    //   key: 'optionReward',
    //   icon: 'fe fe-dollar-sign',
    //   url: '/reward',
    // },
    // {
    //   title: <FormattedMessage id="nav.membership" />,
    //   key: 'membership',
    //   icon: 'fe fe-user',
    //   url: '/dao',
    // },
  ]

  return appMenu
}
