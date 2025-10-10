import { memoize } from 'lodash';
import { Chain } from 'viem';

// Chain enum for network identification
export enum ChainId {
  ETH = 'ETH',
  PLUMEMAINNET = 'PLUMEMAINNET',
  INKMAINNET = 'INKMAINNET',
  UNICHAIN = 'UNICHAIN',
  SONEIUMMAINNET = 'SONEIUMMAINNET',
  HYPE = 'HYPE',
  BASE = 'BASE',
  OPTIMISM = 'OPTIMISM',
  SOMNIAMAINNET = 'SOMNIAMAINNET',
  MEZO = 'MEZO',
  BOTANIX = 'BOTANIX',
  CZ = 'CZ',
  KATANA = 'KATANA',
  BOB = 'BOB',
  LINEA = 'LINEA',
  MANTAPACIFIC = 'MANTAPACIFIC',
  ABSTRACTMAINNET = 'ABSTRACTMAINNET',
  HEMI = 'HEMI',
  BERAMAINNET = 'BERAMAINNET',
  RARI = 'RARI',
  SCROLL = 'SCROLL',
  POLY = 'POLY',
  MANTLE = 'MANTLE',
  WORLDCHAIN = 'WORLDCHAIN',
  CELO = 'CELO',
  KAIA = 'KAIA',
  XRPLMAINNET = 'XRPLMAINNET',
  ARBITRUM = 'ARBITRUM',
  TAIKO = 'TAIKO',
  LISK = 'LISK',
  BLAST = 'BLAST',
  COTI = 'COTI',
  APE = 'APE',
  UNIT0 = 'UNIT0',
  SONICMAINNET = 'SONICMAINNET',
  CONFLUX = 'CONFLUX',
  CRONOS = 'CRONOS',
  AVALANCHE = 'AVALANCHE',
  GNOSIS = 'GNOSIS',
  SUPERPOSITION = 'SUPERPOSITION',
  SUPERSEED = 'SUPERSEED',
  ZIRCUIT = 'ZIRCUIT',
  GRAVITY = 'GRAVITY',
  METIS = 'METIS',
  ANCIENT8 = 'ANCIENT8',
  APPCHAIN = 'APPCHAIN',
  DEGEN = 'DEGEN',
  BOBA = 'BOBA',
  GOLD = 'GOLD',
  STORY = 'STORY',
  SHAPE = 'SHAPE',
  REDSTONE = 'REDSTONE',
  POLYGONZK = 'POLYGONZK',
  PERENNIAL = 'PERENNIAL',
  ONCHAINPOINTS = 'ONCHAINPOINTS',
  RONIN = 'RONIN',
  XAI = 'XAI',
  CYBER = 'CYBER',
  CORN = 'CORN',
  PROOFOFPLAY = 'PROOFOFPLAY',
  CAMP = 'CAMP',
  MORPH = 'MORPH',
  MODE = 'MODE',
  MINT = 'MINT',
  FUNKI = 'FUNKI',
  FORMA = 'FORMA',
  FLOW = 'FLOW',
  LENS = 'LENS',
  CORE = 'CORE',
  XLAYER = 'XLAYER',
  CREATOR_CHAIN = 'CREATOR_CHAIN',
  MONAD = 'MONAD',
  NEXUS = 'NEXUS',
  KITE = 'KITE',
  ZENCHAIN = 'ZENCHAIN',
  HELIOS = 'HELIOS',
  TABI_V2 = 'TABI_V2',
  ATHENE = 'ATHENE',
  SAHARA = 'SAHARA',
  RISE = 'RISE',
  PHAROS = 'PHAROS',
}

export enum NETWORKS {
  /* mainnets */
  DEFAULT = 1,
  PLUMEMAINNET = 98866,
  INKMAINNET = 57073,
  UNICHAIN = 130,
  SONEIUMMAINNET = 1868,
  HYPE = 999,
  BASE = 8453,
  OPTIMISM = 10,
  SOMNIAMAINNET = 5031,
  MEZO = 31612,
  BOTANIX = 3637,
  CZ = 56,
  KATANA = 747474,
  BOB = 60808,
  LINEA = 59144,
  MANTAPACIFIC = 169,
  ABSTRACTMAINNET = 2741,
  HEMI = 43111,
  BERA = 80094,
  RARI = 1380012617,
  SCROLL = 534352,
  POLY = 137,
  MANTLE = 5000,
  WORLDCHAIN = 480,
  CELO = 42220,
  KAIA = 8217,
  XRPLMAINNET = 1440000,
  ARBITRUM = 42161,
  TAIKO = 167000,
  LISK = 1135,
  BLAST = 81457,
  COTI = 2632500,
  APE = 33139,
  UNIT0 = 88811,
  SONICMAINNET = 146,
  CONFLUX = 1030,
  CRONOS = 25,
  AVALANCHE = 43114,
  GNOSIS = 100,
  SUPERPOSITION = 55244,
  SUPERSEED = 5330,
  ZIRCUIT = 48900,
  GRAVITY = 1625,
  METIS = 1088,
  ANCIENT8 = 888888888,
  APPCHAIN = 466,
  DEGEN = 666666666,
  BOBA = 288,
  ZORA = 7777777,
  STORY = 1514,
  SHAPE = 360,
  REDSTONE = 690,
  POLYGONZK = 1101,
  PERENNIAL = 1424,
  ONCHAINPOINTS = 17071,
  RONIN = 2020,
  XAI = 660279,
  CYBER = 7560,
  CORN = 21000000,
  PROOFOFPLAY = 70700,
  CAMP = 484,
  MORPH = 2818,
  MODE = 34443,
  MINT = 185,
  FUNKI = 33979,
  FORMA = 984122,
  FLOW = 747,
  LENS = 232,
  CORE = 1116,
  XLAYER = 196,
  PLASMA = 9745,
  GATELAYER = 10088,
  SYNDICATE = 510003,
  OG = 16661,
  ZERO = 543210,
  XDC = 50,
  ZETA = 7000,
  /* testnets */
  SEPOLIA = 11155111,
  CREATOR_CHAIN = 66665,
  MONAD = 10143,
  NEXUS = 393,
  // SOMNIA = 50312,
  KITE = 2368,
  ZENCHAIN = 8408,
  HELIOS = 42000,
  TABI_V2 = 9788,
  ATHENE = 281123,
  SAHARA = 313313,
  RISE = 11155931,
  PHAROS = 688688,
  GIWA = 91342,
}

export const rpcs: { [key in NETWORKS]: string } = {
  [NETWORKS.DEFAULT]: process.env.NEXT_PUBLIC_RPC_DEFAULT!,
  [NETWORKS.BERA]: process.env.NEXT_PUBLIC_RPC_BERA!,
  [NETWORKS.CZ]: process.env.NEXT_PUBLIC_RPC_CZ!,
  [NETWORKS.INKMAINNET]: process.env.NEXT_PUBLIC_RPC_INK!,
  [NETWORKS.ZORA]: process.env.NEXT_PUBLIC_RPC_ZORA!,
  [NETWORKS.BASE]: process.env.NEXT_PUBLIC_RPC_BASE!,
  [NETWORKS.SONICMAINNET]: process.env.NEXT_PUBLIC_RPC_SONIC!,
  [NETWORKS.XRPLMAINNET]: process.env.NEXT_PUBLIC_RPC_XRPL!,
  [NETWORKS.ABSTRACTMAINNET]: process.env.NEXT_PUBLIC_RPC_ABSTRACT!,
  [NETWORKS.SONEIUMMAINNET]: process.env.NEXT_PUBLIC_RPC_SONEIUM!,
  [NETWORKS.PLUMEMAINNET]: process.env.NEXT_PUBLIC_RPC_PLUME!,
  [NETWORKS.HYPE]: process.env.NEXT_PUBLIC_RPC_HYPE!,
  // [NETWORKS.FORM]: process.env.NEXT_PUBLIC_RPC_FORM!,
  [NETWORKS.SCROLL]: process.env.NEXT_PUBLIC_RPC_SCROLL!,
  [NETWORKS.BLAST]: process.env.NEXT_PUBLIC_RPC_BLAST!,
  [NETWORKS.TAIKO]: process.env.NEXT_PUBLIC_RPC_TAIKO!,
  [NETWORKS.POLY]: process.env.NEXT_PUBLIC_RPC_POLY!,
  [NETWORKS.UNICHAIN]: process.env.NEXT_PUBLIC_RPC_UNICHAIN!,
  [NETWORKS.COTI]: process.env.NEXT_PUBLIC_RPC_COTI!,
  [NETWORKS.APE]: process.env.NEXT_PUBLIC_RPC_APE!,
  [NETWORKS.HEMI]: process.env.NEXT_PUBLIC_RPC_HEMI!,
  [NETWORKS.UNIT0]: process.env.NEXT_PUBLIC_RPC_UNIT0!,
  [NETWORKS.CONFLUX]: process.env.NEXT_PUBLIC_RPC_CONFLUX!,
  [NETWORKS.CRONOS]: process.env.NEXT_PUBLIC_RPC_CRONOS!,
  [NETWORKS.OPTIMISM]: process.env.NEXT_PUBLIC_RPC_OPTIMISM!,
  [NETWORKS.KATANA]: process.env.NEXT_PUBLIC_RPC_KATANA!,
  [NETWORKS.LINEA]: process.env.NEXT_PUBLIC_RPC_LINEA!,
  [NETWORKS.RARI]: process.env.NEXT_PUBLIC_RPC_RARI!,
  [NETWORKS.MANTLE]: process.env.NEXT_PUBLIC_RPC_MANTLE!,
  [NETWORKS.BOB]: process.env.NEXT_PUBLIC_RPC_BOB!,
  [NETWORKS.CELO]: process.env.NEXT_PUBLIC_RPC_CELO!,
  [NETWORKS.ARBITRUM]: process.env.NEXT_PUBLIC_RPC_ARBITRUM!,
  [NETWORKS.AVALANCHE]: process.env.NEXT_PUBLIC_RPC_AVALANCHE!,
  [NETWORKS.GNOSIS]: process.env.NEXT_PUBLIC_RPC_GNOSIS!,
  [NETWORKS.LISK]: process.env.NEXT_PUBLIC_RPC_LISK!,
  [NETWORKS.WORLDCHAIN]: process.env.NEXT_PUBLIC_RPC_WORLDCHAIN!,
  [NETWORKS.SUPERPOSITION]: process.env.NEXT_PUBLIC_RPC_SUPERPOSITION!,
  [NETWORKS.SUPERSEED]: process.env.NEXT_PUBLIC_RPC_SUPERSEED!,
  [NETWORKS.ZIRCUIT]: process.env.NEXT_PUBLIC_RPC_ZIRCUIT!,
  [NETWORKS.GRAVITY]: process.env.NEXT_PUBLIC_RPC_GRAVITY!,
  [NETWORKS.METIS]: process.env.NEXT_PUBLIC_RPC_METIS!,
  [NETWORKS.ANCIENT8]: process.env.NEXT_PUBLIC_RPC_ANCIENT8!,
  [NETWORKS.BOBA]: process.env.NEXT_PUBLIC_RPC_BOBA!,
  [NETWORKS.APPCHAIN]: process.env.NEXT_PUBLIC_RPC_APPCHAIN!,
  [NETWORKS.DEGEN]: process.env.NEXT_PUBLIC_RPC_DEGEN!,
  [NETWORKS.MEZO]: process.env.NEXT_PUBLIC_RPC_MEZO!,
  [NETWORKS.BOTANIX]: process.env.NEXT_PUBLIC_RPC_BOTANIX!,
  [NETWORKS.STORY]: process.env.NEXT_PUBLIC_RPC_STORY!,
  [NETWORKS.SHAPE]: process.env.NEXT_PUBLIC_RPC_SHAPE!,
  [NETWORKS.REDSTONE]: process.env.NEXT_PUBLIC_RPC_REDSTONE!,
  [NETWORKS.POLYGONZK]: process.env.NEXT_PUBLIC_RPC_POLYGONZK!,
  [NETWORKS.PERENNIAL]: process.env.NEXT_PUBLIC_RPC_PERENNIAL!,
  [NETWORKS.ONCHAINPOINTS]: process.env.NEXT_PUBLIC_RPC_ONCHAINPOINTS!,
  [NETWORKS.RONIN]: process.env.NEXT_PUBLIC_RPC_RONIN!,
  [NETWORKS.SOMNIAMAINNET]: process.env.NEXT_PUBLIC_RPC_SOMNIA!,
  [NETWORKS.XAI]: process.env.NEXT_PUBLIC_RPC_XAI!,
  [NETWORKS.CYBER]: process.env.NEXT_PUBLIC_RPC_CYBER!,
  [NETWORKS.CORN]: process.env.NEXT_PUBLIC_RPC_CORN!,
  [NETWORKS.PROOFOFPLAY]: process.env.NEXT_PUBLIC_RPC_PROOFOFPLAY!,
  [NETWORKS.CAMP]: process.env.NEXT_PUBLIC_RPC_CAMP!,
  [NETWORKS.MORPH]: process.env.NEXT_PUBLIC_RPC_MORPH!,
  [NETWORKS.MODE]: process.env.NEXT_PUBLIC_RPC_MODE!,
  [NETWORKS.MINT]: process.env.NEXT_PUBLIC_RPC_MINT!,
  [NETWORKS.FUNKI]: process.env.NEXT_PUBLIC_RPC_FUNKI!,
  [NETWORKS.FORMA]: process.env.NEXT_PUBLIC_RPC_FORMA!,
  [NETWORKS.FLOW]: process.env.NEXT_PUBLIC_RPC_FLOW!,
  [NETWORKS.LENS]: process.env.NEXT_PUBLIC_RPC_LENS!,
  [NETWORKS.MANTAPACIFIC]: process.env.NEXT_PUBLIC_RPC_MANTAPACIFIC!,
  [NETWORKS.CORE]: process.env.NEXT_PUBLIC_RPC_CORE!,
  // [NETWORKS.MINT]: process.env.NEXT_PUBLIC_RPC_MINT!,
  [NETWORKS.XLAYER]: process.env.NEXT_PUBLIC_RPC_XLAYER!,
  [NETWORKS.SEPOLIA]: process.env.NEXT_PUBLIC_RPC_SEPOLIA || 'https://1rpc.io/sepolia',
  [NETWORKS.CREATOR_CHAIN]: process.env.NEXT_PUBLIC_RPC_CREATOR_CHAIN!,
  [NETWORKS.MONAD]: process.env.NEXT_PUBLIC_RPC_MONAD!,
  [NETWORKS.NEXUS]: process.env.NEXT_PUBLIC_RPC_NEXUS!,
  // [NETWORKS.MEGA]: process.env.NEXT_PUBLIC_RPC_MEGA!,
  // [NETWORKS.BARTIO]: process.env.NEXT_PUBLIC_RPC_BARTIO!,
  [NETWORKS.TABI_V2]: process.env.NEXT_PUBLIC_RPC_TABI_V2!,
  [NETWORKS.ATHENE]: process.env.NEXT_PUBLIC_RPC_ATHENE!,
  // [NETWORKS.XRPL]: process.env.NEXT_PUBLIC_RPC_XRPL!,
  [NETWORKS.SAHARA]: process.env.NEXT_PUBLIC_RPC_SAHARA!,
  // [NETWORKS.SOMNIA]: process.env.NEXT_PUBLIC_RPC_SOMNIA!,
  [NETWORKS.KAIA]: process.env.NEXT_PUBLIC_RPC_KAIA!,
  [NETWORKS.KITE]: process.env.NEXT_PUBLIC_RPC_KITE!,
  [NETWORKS.ZENCHAIN]: process.env.NEXT_PUBLIC_RPC_ZENCHAIN!,
  [NETWORKS.HELIOS]: process.env.NEXT_PUBLIC_RPC_HELIOS!,
  [NETWORKS.RISE]: process.env.NEXT_PUBLIC_RPC_RISE!,
  [NETWORKS.PHAROS]: process.env.NEXT_PUBLIC_RPC_PHAROS!,
  [NETWORKS.GIWA]: process.env.NEXT_PUBLIC_RPC_GIWA!,
  // [NETWORKS.ZKLINK]: process.env.NEXT_PUBLIC_RPC_ZKLINK!,
  // [NETWORKS.ARTHERA]: process.env.NEXT_PUBLIC_RPC_ARTHERA!,
  // [NETWORKS.NEOX]: process.env.NEXT_PUBLIC_RPC_NEOX!,
  // [NETWORKS.TABI]: process.env.NEXT_PUBLIC_RPC_TABI!
};

export interface NETWORK_TYPE extends Chain {
  chain: ChainId;
  shortName?: string;
  color?: string;
  sellMarket?: string;
  iconUrl?: string;
  gmOnly?: boolean;
  gmSupport?: boolean;
  hidden?: boolean;
}

export const CHAIN_COLOR: { [key in NETWORKS]: string } = {
  [NETWORKS.DEFAULT]: '#FFFFFF',
  [NETWORKS.BERA]: '#FD7108',
  [NETWORKS.CZ]: '#f0b90b',
  [NETWORKS.INKMAINNET]: '#7132f4',
  [NETWORKS.ZORA]: '#72E1EA',
  [NETWORKS.BASE]: '#1653f0',
  [NETWORKS.SONICMAINNET]: '#274363',
  [NETWORKS.XRPLMAINNET]: '#1a1a1a',
  [NETWORKS.ABSTRACTMAINNET]: '#08ce6e',
  [NETWORKS.SONEIUMMAINNET]: '#5FDEF3',
  [NETWORKS.PLUMEMAINNET]: '#f53a39',
  [NETWORKS.HYPE]: '#97fce4',
  // [NETWORKS.FORM]: "#fff",
  [NETWORKS.SCROLL]: '#FFDBB3',
  [NETWORKS.BLAST]: '#F4F53A',
  [NETWORKS.TAIKO]: '#E81899',
  [NETWORKS.POLY]: '#8247E5',
  [NETWORKS.UNICHAIN]: '#f60cb2',
  [NETWORKS.COTI]: '#207ec3',
  [NETWORKS.APE]: '#0052f0',
  [NETWORKS.HEMI]: '#ff6c15',
  [NETWORKS.UNIT0]: '#a1e0c2',
  [NETWORKS.CONFLUX]: '#17B38A',
  [NETWORKS.CRONOS]: '#000000',
  [NETWORKS.OPTIMISM]: '#ff0420',
  [NETWORKS.SOMNIAMAINNET]: '#db045a',
  [NETWORKS.KATANA]: '#1a1a1a',
  [NETWORKS.LINEA]: '#61dfff',
  [NETWORKS.RARI]: '#B16EFF',
  [NETWORKS.MANTLE]: '#000000',
  [NETWORKS.BOB]: '#F25D00',
  [NETWORKS.CELO]: '#2d2d2d',
  [NETWORKS.ARBITRUM]: '#213148',
  [NETWORKS.AVALANCHE]: '#ff394a',
  [NETWORKS.GNOSIS]: '#143628',
  [NETWORKS.LISK]: '#000000',
  [NETWORKS.WORLDCHAIN]: '#2c2c2c',
  [NETWORKS.SUPERPOSITION]: '#1e1e1e',
  [NETWORKS.SUPERSEED]: '#91d3d1',
  [NETWORKS.ZIRCUIT]: '#277E29',
  [NETWORKS.GRAVITY]: '#964d24',
  [NETWORKS.METIS]: '#00d2ff',
  [NETWORKS.ANCIENT8]: '#000000',
  [NETWORKS.BOBA]: '#a3e871',
  [NETWORKS.APPCHAIN]: '#30c75b',
  [NETWORKS.DEGEN]: '#4c2896',
  [NETWORKS.MEZO]: '#fe034c',
  [NETWORKS.BOTANIX]: '#000000',
  [NETWORKS.STORY]: '#000000',
  [NETWORKS.SHAPE]: '#000000',
  [NETWORKS.REDSTONE]: '#f44242',
  [NETWORKS.POLYGONZK]: '#7d3fe3',
  [NETWORKS.PERENNIAL]: '#3224a5',
  [NETWORKS.ONCHAINPOINTS]: '#000000',
  [NETWORKS.RONIN]: '#000000',
  [NETWORKS.XAI]: '#ff0030',
  [NETWORKS.CYBER]: '#079c01',
  [NETWORKS.CORN]: '#000000',
  [NETWORKS.PROOFOFPLAY]: '#000000',
  [NETWORKS.CAMP]: '#000000',
  [NETWORKS.MORPH]: '#11a801',
  [NETWORKS.MODE]: '#dffe00',
  [NETWORKS.MINT]: '#30bf55',
  [NETWORKS.FUNKI]: '#ac9fd5',
  [NETWORKS.FORMA]: '#000000',
  [NETWORKS.FLOW]: '#06ef8a',
  [NETWORKS.LENS]: '#000000',
  [NETWORKS.MANTAPACIFIC]: '#3589f1',
  [NETWORKS.CORE]: '#ff9212',
  [NETWORKS.XLAYER]: '#a7a7a7',
  [NETWORKS.SEPOLIA]: '#627EEA',
  [NETWORKS.CREATOR_CHAIN]: '#F4F53A',
  [NETWORKS.MONAD]: '#826df9',
  [NETWORKS.NEXUS]: '#5c5c5e',
  // [NETWORKS.MEGA]: "#fff",
  // [NETWORKS.BARTIO]: "#FD7108",
  [NETWORKS.TABI_V2]: '#FF8311',
  [NETWORKS.ATHENE]: '#04D693',
  [NETWORKS.SAHARA]: '#f7ff98',
  // [NETWORKS.SOMNIA]: "#db045a",
  [NETWORKS.KAIA]: '#01b8a6',
  [NETWORKS.KITE]: '#00C853',
  [NETWORKS.ZENCHAIN]: '#bbf14b',
  [NETWORKS.HELIOS]: '#002DCB',
  [NETWORKS.RISE]: '#7968e5',
  [NETWORKS.PHAROS]: '#0905b9',
  // [NETWORKS.ZKLINK]: "#04D693",
  // [NETWORKS.ARTHERA]: "#B10C90",
  // [NETWORKS.NEOX]: "#00E599",
  // [NETWORKS.ZKCANDY]: "#D125D6",
  // [NETWORKS.MORPHHOLESKY]: "#00AB00",
  // [NETWORKS.FIRE]: "#4848AC",
};

export const getChainColor = (id: NETWORKS) => CHAIN_COLOR[id];

export const CHAINS: NETWORK_TYPE[] = [
  {
    id: NETWORKS.DEFAULT,
    name: 'Ethereum',
    shortName: 'ETH',
    chain: ChainId.ETH,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/eth.svg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.DEFAULT]] },
    },
    blockExplorers: {
      default: {
        name: 'ETH',
        url: 'https://etherscan.io/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    hidden: true,
  },
  {
    id: NETWORKS.SEPOLIA,
    name: 'Sepolia',
    shortName: 'SEP',
    chain: ChainId.ETH,
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/eth.svg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.SEPOLIA]] },
    },
    blockExplorers: {
      default: {
        name: 'Etherscan',
        url: 'https://sepolia.etherscan.io/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    testnet: true,
  },
  {
    id: NETWORKS.PLUMEMAINNET,
    name: 'Plume Mainnet',
    shortName: 'Plume',
    chain: ChainId.PLUMEMAINNET,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'PLUME', symbol: 'PLUME', decimals: 18 },
    iconUrl: '/img/chainLogos/plume.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.PLUMEMAINNET]] },
    },
    blockExplorers: {
      default: {
        name: 'PLUME',
        url: 'https://explorer.plume.org',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
  },
  {
    id: NETWORKS.INKMAINNET,
    name: 'Ink Mainnet',
    shortName: 'Ink',
    chain: ChainId.INKMAINNET,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/ink.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.INKMAINNET]] },
    },
    blockExplorers: {
      default: {
        name: 'ETH',
        url: 'https://explorer.inkonchain.com/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
  },
  {
    id: NETWORKS.UNICHAIN,
    name: 'Unichain Mainnet',
    shortName: 'Unichain',
    chain: ChainId.UNICHAIN,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/unichain.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.UNICHAIN]] },
    },
    blockExplorers: {
      default: {
        name: 'ETH',
        url: 'https://uniscan.xyz',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
  },
  {
    id: NETWORKS.SONEIUMMAINNET,
    name: 'Soneium Mainnet',
    shortName: 'Soneium',
    chain: ChainId.SONEIUMMAINNET,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/soneium.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.SONEIUMMAINNET]] },
    },
    blockExplorers: {
      default: {
        name: 'ETH',
        url: 'https://soneium.blockscout.com/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
  },
  {
    id: NETWORKS.HYPE,
    name: 'Hyperliquid',
    shortName: 'Hyperliquid',
    chain: ChainId.HYPE,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'HYPE', symbol: 'HYPE', decimals: 18 },
    iconUrl: '/img/chainLogos/hype.svg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.HYPE]] },
    },
    blockExplorers: {
      default: {
        name: 'HYPE',
        url: 'https://www.hyperscan.com/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
  },
  {
    id: NETWORKS.BASE,
    name: 'Base',
    shortName: 'Base',
    chain: ChainId.BASE,
    sellMarket: 'https://element.market/collections/zns-connect-base',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/base.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.BASE]] },
    },
    blockExplorers: {
      default: {
        name: 'ETH',
        url: 'https://base.blockscout.com/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
  },
  {
    id: NETWORKS.OPTIMISM,
    name: 'Optimism',
    shortName: 'Optimism',
    chain: ChainId.OPTIMISM,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/optimism.svg',
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.OPTIMISM]],
      },
    },
    blockExplorers: {
      default: {
        name: 'Optimism Explorer',
        url: 'https://explorer.optimism.io/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.SOMNIAMAINNET,
    name: 'Somnia Mainnet',
    shortName: 'Somnia',
    chain: ChainId.SOMNIAMAINNET,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'SOMI', symbol: 'SOMI', decimals: 18 },
    iconUrl: '/img/chainLogos/somnia.png',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.SOMNIAMAINNET]] },
    },
    blockExplorers: {
      default: {
        name: 'Somnia Mainnet Explorer',
        url: 'https://explorer.somnia.network/',
      },
    },
  },
  {
    id: NETWORKS.MEZO,
    name: 'Mezo',
    shortName: 'Mezo',
    chain: ChainId.MEZO,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 18 },
    iconUrl: '/img/chainLogos/mezo.jpg',
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.MEZO]],
      },
    },
    blockExplorers: {
      default: {
        name: 'Mezo Explorer',
        url: 'https://explorer.mezo.org/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.BOTANIX,
    name: 'Botanix Mainnet',
    shortName: 'Botanix',
    chain: ChainId.BOTANIX,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 18 },
    iconUrl: '/img/chainLogos/botanix.jpg',
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.BOTANIX]],
      },
    },
    blockExplorers: {
      default: {
        name: 'Botanix Explorer',
        url: 'https://botanixscan.io',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.CZ,
    name: 'BNB Smart Chain Mainnet',
    shortName: 'BSC',
    chain: ChainId.CZ,
    sellMarket: 'https://element.market/collections/zns-connect-bnb',
    nativeCurrency: {
      decimals: 18,
      name: 'BNB',
      symbol: 'BNB',
    },
    iconUrl: '/img/chainLogos/bnbchain.png',
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.CZ]],
        webSocket: ['wss://bsc-rpc.publicnode.com'],
      },
    },
    blockExplorers: {
      default: {
        name: 'BscScan',
        url: 'https://bscscan.com',
        apiUrl: 'https://api.bscscan.com/api',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 15921452,
      },
    },
  },
  {
    id: NETWORKS.KATANA,
    name: 'Katana',
    shortName: 'Katana',
    chain: ChainId.KATANA,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/katana.svg',
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.KATANA]],
      },
    },
    blockExplorers: {
      default: {
        name: 'Katana Explorer',
        url: 'https://explorer.katanarpc.com/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
      },
    },
  },
  {
    id: NETWORKS.BOB,
    name: 'BOB',
    shortName: 'BOB',
    chain: ChainId.BOB,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/bob.svg',
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.BOB]],
      },
    },
    blockExplorers: {
      default: {
        name: 'BOB Explorer',
        url: 'https://explorer.gobob.xyz/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.LINEA,
    name: 'Linea',
    shortName: 'Linea',
    chain: ChainId.LINEA,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/linea.png',
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.LINEA]],
      },
    },
    blockExplorers: {
      default: {
        name: 'Linea Explorer',
        url: 'https://explorer.linea.build/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.MANTAPACIFIC,
    name: 'Manta Pacific Mainnet',
    shortName: 'Manta Pacific',
    chain: ChainId.MANTAPACIFIC,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/mantapacific.jpg',
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.MANTAPACIFIC]],
      },
    },
    blockExplorers: {
      default: {
        name: 'Manta Pacific Explorer',
        url: 'https://manta.socialscan.io/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.ABSTRACTMAINNET,
    name: 'Abstract',
    shortName: 'Abstract',
    chain: ChainId.ABSTRACTMAINNET,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/abstract.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.ABSTRACTMAINNET]] },
    },
    blockExplorers: {
      default: { name: 'ETH', url: 'https://abscan.org/' },
    },
    contracts: {
      multicall3: {
        address: '0xAa4De41dba0Ca5dCBb288b7cC6b708F3aaC759E7',
      },
    },
  },
  {
    id: NETWORKS.HEMI,
    name: 'Hemi Mainnet',
    shortName: 'Hemi',
    chain: ChainId.HEMI,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/hemi.svg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.HEMI]] },
    },
    blockExplorers: {
      default: {
        name: 'ETH',
        url: 'https://explorer.hemi.xyz',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
  },
  {
    id: NETWORKS.BERA,
    name: 'Berachain Mainnet',
    shortName: 'Berachain',
    chain: ChainId.BERAMAINNET,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'BERA', symbol: 'BERA', decimals: 18 },
    iconUrl: '/img/chainLogos/berachain.png',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.BERA]] },
    },
    blockExplorers: {
      default: { name: 'BERA', url: 'https://berascan.com/' },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        // blockCreated: 109269,
      },
    },
  },
  {
    id: NETWORKS.RARI,
    name: 'Rari Chain Mainnet',
    shortName: 'Rari',
    chain: ChainId.RARI,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/rari.svg',
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.RARI]],
      },
    },
    blockExplorers: {
      default: {
        name: 'Rari Explorer',
        url: 'https://mainnet.explorer.rarichain.org/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.SCROLL,
    name: 'Scroll',
    shortName: 'Scroll',
    chain: ChainId.SCROLL,
    sellMarket: 'https://element.market/collections/zns-connect-scroll',
    iconUrl: '/img/chainLogos/scroll.png',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.SCROLL]],
        webSocket: ['wss://wss-rpc.scroll.io/ws'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Scrollscan',
        url: 'https://scrollscan.com',
        apiUrl: 'https://api.scrollscan.com/api',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 14,
      },
    },
  },
  {
    id: NETWORKS.POLY,
    name: 'Polygon',
    shortName: 'Polygon',
    chain: ChainId.POLY,
    sellMarket: 'https://element.market/collections/zns-connect-poly',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    iconUrl: '/img/chainLogos/polygon.svg',
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.POLY]],
      },
    },
    blockExplorers: {
      default: {
        name: 'PolygonScan',
        url: 'https://polygonscan.com',
        apiUrl: 'https://api.polygonscan.com/api',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 25770160,
      },
    },
  },
  {
    id: NETWORKS.MANTLE,
    name: 'Mantle',
    shortName: 'Mantle',
    chain: ChainId.MANTLE,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 },
    iconUrl: '/img/chainLogos/mantle.jpg',
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.MANTLE]],
      },
    },
    blockExplorers: {
      default: {
        name: 'Mantle Explorer',
        url: 'https://explorer.mantle.xyz/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.WORLDCHAIN,
    name: 'World Chain',
    shortName: 'World Chain',
    chain: ChainId.WORLDCHAIN,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/worldchain.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.WORLDCHAIN]] },
    },
    blockExplorers: {
      default: {
        name: 'World Chain Explorer',
        url: 'https://worldscan.org/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.CELO,
    name: 'CELO',
    shortName: 'CELO',
    chain: ChainId.CELO,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
    iconUrl: '/img/chainLogos/celo.jpg',
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.CELO]],
      },
    },
    blockExplorers: {
      default: {
        name: 'Celo Explorer',
        url: 'https://explorer.celo.org/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.KAIA,
    name: 'Kaia',
    shortName: 'Kaia',
    chain: ChainId.KAIA,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'KAIA', symbol: 'KAIA', decimals: 18 },
    iconUrl: '/img/chainLogos/kaia.svg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.KAIA]] },
    },
    blockExplorers: {
      default: {
        name: 'KAIA',
        url: 'https://kaiascan.io',
      },
    },
  },
  {
    id: NETWORKS.XRPLMAINNET,
    name: 'XRPL EVM',
    shortName: 'XRPL',
    chain: ChainId.XRPLMAINNET,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'XRP', symbol: 'XRP', decimals: 18 },
    iconUrl: '/img/chainLogos/xrp.jpeg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.XRPLMAINNET]] },
    },
    blockExplorers: {
      default: { name: 'XRP', url: 'https://explorer.xrplevm.org/' },
    },
    contracts: {
      multicall3: {
        address: '0xA7f3d2dEa7a53E7A9FEbBdE5Cf7C69d39D065030',
      },
    },
  },
  {
    id: NETWORKS.ARBITRUM,
    name: 'Arbitrum One',
    shortName: 'Arbitrum',
    chain: ChainId.ARBITRUM,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/arbitrum.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.ARBITRUM]] },
    },
    blockExplorers: {
      default: {
        name: 'Arbitrum Explorer',
        url: 'https://arbiscan.io/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.TAIKO,
    name: 'Taiko Mainnet',
    shortName: 'Taiko',
    chain: ChainId.TAIKO,
    sellMarket: 'https://element.market',
    iconUrl: '/img/chainLogos/taiko.png',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.TAIKO]],
      },
    },
    blockExplorers: {
      default: { name: 'Taiko Mainnet', url: 'https://taikoscan.io' },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 11269,
      },
    },
  },
  {
    id: NETWORKS.LISK,
    name: 'Lisk',
    shortName: 'Lisk',
    chain: ChainId.LISK,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/lisk.png',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.LISK]] },
    },
    blockExplorers: {
      default: {
        name: 'Lisk Explorer',
        url: 'https://blockscout.lisk.com/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.BLAST,
    name: 'Blast',
    shortName: 'Blast',
    chain: ChainId.BLAST,
    sellMarket: 'https://element.market/collections/zns-connect-blast',
    iconUrl: '/img/chainLogos/blast.jpeg',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.BLAST]] },
    },
    blockExplorers: {
      default: { name: 'Blastscan', url: 'https://blastscan.io' },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 212929,
      },
    },
  },
  {
    id: NETWORKS.COTI,
    name: 'COTI Mainnet',
    shortName: 'COTI',
    chain: ChainId.COTI,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'COTI', symbol: 'COTI', decimals: 18 },
    iconUrl: '/img/chainLogos/coti.png',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.COTI]] },
    },
    blockExplorers: {
      default: {
        name: 'COTI',
        url: 'https://mainnet.cotiscan.io',
      },
    },
  },
  {
    id: NETWORKS.APE,
    name: 'ApeChain',
    shortName: 'ApeChain',
    chain: ChainId.APE,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'APE', symbol: 'APE', decimals: 18 },
    iconUrl: '/img/chainLogos/ape.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.APE]] },
    },
    blockExplorers: {
      default: {
        name: 'Apechain Explorer',
        url: 'https://apechain.calderaexplorer.xyz/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.UNIT0,
    name: 'Unit Zero Mainnet',
    shortName: 'Unit Zero',
    chain: ChainId.UNIT0,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'UNIT0', symbol: 'UNIT0', decimals: 18 },
    iconUrl: '/img/chainLogos/unit0.png',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.UNIT0]] },
    },
    blockExplorers: {
      default: {
        name: 'UNIT0',
        url: 'https://explorer.unit0.dev/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
  },
  {
    id: NETWORKS.SONICMAINNET,
    name: 'Sonic Mainnet',
    shortName: 'Sonic',
    chain: ChainId.SONICMAINNET,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'S', symbol: 'S', decimals: 18 },
    iconUrl: '/img/chainLogos/sonic.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.SONICMAINNET]] },
    },
    blockExplorers: {
      default: {
        name: 'S',
        url: 'https://sonicscan.org/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
  },
  {
    id: NETWORKS.CONFLUX,
    name: 'Conflux eSpace',
    shortName: 'Conflux',
    chain: ChainId.CONFLUX,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'CFX', symbol: 'CFX', decimals: 18 },
    iconUrl: '/img/chainLogos/conflux.svg',
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.CONFLUX]],
      },
    },
    blockExplorers: {
      default: {
        name: 'ConfluxScan',
        url: 'https://evm.confluxscan.net/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.CRONOS,
    name: 'Cronos',
    shortName: 'Cronos',
    chain: ChainId.CRONOS,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'CRO', symbol: 'CRO', decimals: 18 },
    iconUrl: '/img/chainLogos/cronos.png',
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.CRONOS]],
      },
    },
    blockExplorers: {
      default: {
        name: 'Cronos Explorer',
        url: 'https://explorer.cronos.org/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.AVALANCHE,
    name: 'Avalanche C-Chain',
    shortName: 'Avalanche',
    chain: ChainId.AVALANCHE,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
    iconUrl: '/img/chainLogos/avalanche.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.AVALANCHE]] },
    },
    blockExplorers: {
      default: {
        name: 'Snowtrace Explorer',
        url: 'https://snowtrace.io/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.GNOSIS,
    name: 'Gnosis',
    shortName: 'Gnosis',
    chain: ChainId.GNOSIS,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'xDAI', symbol: 'xDAI', decimals: 18 },
    iconUrl: '/img/chainLogos/gnosis.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.GNOSIS]] },
    },
    blockExplorers: {
      default: {
        name: 'Gnosis Explorer',
        url: 'https://gnosis.blockscout.com/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.SUPERPOSITION,
    name: 'Superposition',
    shortName: 'Superposition',
    chain: ChainId.SUPERPOSITION,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/superposition.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.SUPERPOSITION]] },
    },
    blockExplorers: {
      default: {
        name: 'Superposition Explorer',
        url: 'https://explorer.superposition.so/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.SUPERSEED,
    name: 'Superseed',
    shortName: 'Superseed',
    chain: ChainId.SUPERSEED,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/superseed.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.SUPERSEED]] },
    },
    blockExplorers: {
      default: {
        name: 'Superseed Explorer',
        url: 'https://explorer.superseed.xyz/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.ZIRCUIT,
    name: 'Zircuit Mainnet',
    shortName: 'Zircuit',
    chain: ChainId.ZIRCUIT,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/zircuit.png',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.ZIRCUIT]] },
    },
    blockExplorers: {
      default: {
        name: 'Zircuit Explorer',
        url: 'https://explorer.zircuit.com/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.GRAVITY,
    name: 'Gravity Alpha Mainnet',
    shortName: 'Gravity',
    chain: ChainId.GRAVITY,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'G', symbol: 'G', decimals: 18 },
    iconUrl: '/img/chainLogos/gravity.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.GRAVITY]] },
    },
    blockExplorers: {
      default: {
        name: 'Gravity Alpha Mainnet Explorer',
        url: 'https://explorer.gravity.xyz/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.METIS,
    name: 'Metis Andromeda Mainnet',
    shortName: 'Metis',
    chain: ChainId.METIS,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'METIS', symbol: 'METIS', decimals: 18 },
    iconUrl: '/img/chainLogos/metis.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.METIS]] },
    },
    blockExplorers: {
      default: {
        name: 'Metis Explorer',
        url: 'https://metisscan.info/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.ANCIENT8,
    name: 'Ancient8',
    shortName: 'Ancient8',
    chain: ChainId.ANCIENT8,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/ancient8.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.ANCIENT8]] },
    },
    blockExplorers: {
      default: {
        name: 'Ancient8 Explorer',
        url: 'https://scan.ancient8.gg/',
      },
    },
    contracts: {
      multicall3: {
        address: '0x4C97D35c668EE5194a13c8DE8Afc18cce40C9F28',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.APPCHAIN,
    name: 'AppChain',
    shortName: 'AppChain',
    chain: ChainId.APPCHAIN,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/appchain.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.APPCHAIN]] },
    },
    blockExplorers: {
      default: {
        name: 'AppChain Explorer',
        url: 'https://explorer.appchain.xyz/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xEB92D3f697F0d7DCbC025912e671d2A979FBFf78',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.DEGEN,
    name: 'Degen Chain',
    shortName: 'Degen',
    chain: ChainId.DEGEN,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'DEGEN', symbol: 'DEGEN', decimals: 18 },
    iconUrl: '/img/chainLogos/degen.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.DEGEN]] },
    },
    blockExplorers: {
      default: {
        name: 'Degen Explorer',
        url: 'https://explorer.degen.tips/',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.BOBA,
    name: 'Boba',
    shortName: 'Boba',
    chain: ChainId.BOBA,
    sellMarket: 'https://element.market',
    iconUrl: '/img/chainLogos/boba.jpg',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.BOBA]],
      },
    },
    blockExplorers: {
      default: {
        name: 'BOBA Scan',
        url: 'https://bobascan.com',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 446859,
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.ZORA,
    name: 'Zora',
    shortName: 'Zora',
    chain: ChainId.GOLD,
    sellMarket: 'https://element.market',
    iconUrl: '/img/chainLogos/zora.png',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.ZORA]],
        webSocket: ['wss://rpc.zora.energy'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Explorer',
        url: 'https://explorer.zora.energy',
        apiUrl: 'https://explorer.zora.energy/api',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.STORY,
    name: 'Story Mainnet',
    shortName: 'Story',
    chain: ChainId.STORY,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'IP', symbol: 'IP', decimals: 18 },
    iconUrl: '/img/chainLogos/story.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.STORY]] },
    },
    blockExplorers: {
      default: { name: 'IP', url: 'https://www.storyscan.io/' },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.SHAPE,
    name: 'Shape Mainnet',
    shortName: 'Shape',
    chain: ChainId.SHAPE,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/shape.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.SHAPE]] },
    },
    blockExplorers: {
      default: {
        name: 'Shape Mainnet Explorer',
        url: 'https://shapescan.xyz/',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.REDSTONE,
    name: 'Redstone',
    shortName: 'Redstone',
    chain: ChainId.REDSTONE,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/redstone.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.REDSTONE]] },
    },
    blockExplorers: {
      default: {
        name: 'Redstone Explorer',
        url: 'https://explorer.redstone.xyz/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.POLYGONZK,
    name: 'Polygon zkEVM',
    shortName: 'Polygon zkEVM',
    chain: ChainId.POLYGONZK,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/polygonzk.png',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.POLYGONZK]] },
    },
    blockExplorers: {
      default: {
        name: 'Polygon zkEVM Explorer',
        url: 'https://zkevm.polygonscan.com',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.PERENNIAL,
    name: 'Perennial',
    shortName: 'Perennial',
    chain: ChainId.PERENNIAL,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/perennial.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.PERENNIAL]] },
    },
    blockExplorers: {
      default: {
        name: 'Perennial Explorer',
        url: 'https://explorer-perennial-lsv53i0ed8.t.conduit.xyz',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.ONCHAINPOINTS,
    name: 'OnChain Points',
    shortName: 'OnChain Points',
    chain: ChainId.ONCHAINPOINTS,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'POP', symbol: 'POP', decimals: 18 },
    iconUrl: '/img/chainLogos/onchainpoints.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.ONCHAINPOINTS]] },
    },
    blockExplorers: {
      default: {
        name: 'OnChain Points Explorer',
        url: 'https://explorer.onchainpoints.xyz/',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.RONIN,
    name: 'Ronin',
    shortName: 'Ronin',
    chain: ChainId.RONIN,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'RON', symbol: 'RON', decimals: 18 },
    iconUrl: '/img/chainLogos/ronin.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.RONIN]] },
    },
    blockExplorers: {
      default: {
        name: 'Ronin Explorer',
        url: 'https://app.roninchain.com/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.XAI,
    name: 'XAI Mainnet',
    shortName: 'XAI',
    chain: ChainId.XAI,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'XAI', symbol: 'XAI', decimals: 18 },
    iconUrl: '/img/chainLogos/xai.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.XAI]] },
    },
    blockExplorers: {
      default: {
        name: 'XAI Mainnet Explorer',
        url: 'https://explorer.xai-chain.net/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.CYBER,
    name: 'Cyber Mainnet',
    shortName: 'Cyber',
    chain: ChainId.CYBER,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/cyber.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.CYBER]] },
    },
    blockExplorers: {
      default: {
        name: 'Cyber Explorer',
        url: 'https://cyber.socialscan.io/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.CORN,
    name: 'Corn Mainnet',
    shortName: 'Corn',
    chain: ChainId.CORN,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'BTCN', symbol: 'BTCN', decimals: 18 },
    iconUrl: '/img/chainLogos/corn.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.CORN]] },
    },
    blockExplorers: {
      default: {
        name: 'Corn Explorer',
        url: 'https://cornscan.io/',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.PROOFOFPLAY,
    name: 'Proof of Play - Apex',
    shortName: 'Proof of Play',
    chain: ChainId.PROOFOFPLAY,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/proofofplay.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.PROOFOFPLAY]] },
    },
    blockExplorers: {
      default: {
        name: 'Proof of Play Apex Explorer',
        url: 'https://explorer-proofofplay-apex-mainnet-0.t.conduit.xyz/',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.CAMP,
    name: 'Camp',
    shortName: 'Camp',
    chain: ChainId.CAMP,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/camp.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.CAMP]] },
    },
    blockExplorers: {
      default: {
        name: 'Camp Explorer',
        url: 'https://camp.cloud.blockscout.com/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.MORPH,
    name: 'Morhph Mainnet',
    shortName: 'Morph',
    chain: ChainId.MORPH,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/morph.jpg',
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.MORPH]],
      },
    },
    blockExplorers: {
      default: {
        name: 'Morph Explorer',
        url: 'https://explorer.morphl2.io/',
      },
    },
    contracts: {
      multicall3: {
        address: '0x35f965903A85e7528437C3Ce0b4bdfbc4E5Fc27c',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.MODE,
    name: 'Mode',
    shortName: 'Mode',
    chain: ChainId.MODE,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/mode.jpg',
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.MODE]],
      },
    },
    blockExplorers: {
      default: {
        name: 'Mode Explorer',
        url: 'https://explorer.mode.network/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.MINT,
    name: 'Mint Mainnet',
    shortName: 'Mint',
    chain: ChainId.MINT,
    sellMarket: 'https://element.market',
    iconUrl: '/img/chainLogos/mint.jpg',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.MINT]],
      },
    },
    blockExplorers: {
      default: {
        name: 'Mint Mainnet Explorer',
        url: 'https://explorer.mintchain.io/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.FUNKI,
    name: 'Funki Mainnet',
    shortName: 'Funki',
    chain: ChainId.FUNKI,
    sellMarket: 'https://element.market',
    iconUrl: '/img/chainLogos/funki.jpg',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.FUNKI]],
      },
    },
    blockExplorers: {
      default: {
        name: 'Funki Mainnet Explorer',
        url: 'https://explorer.funkichain.com/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.FORMA,
    name: 'Forma',
    shortName: 'Forma',
    chain: ChainId.FORMA,
    sellMarket: 'https://element.market',
    iconUrl: '/img/chainLogos/forma.png',
    nativeCurrency: { name: 'TIA', symbol: 'TIA', decimals: 18 },
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.FORMA]],
      },
    },
    blockExplorers: {
      default: {
        name: 'Forma Explorer',
        url: 'https://explorer.forma.art',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.FLOW,
    name: 'Flow EVM Mainnet',
    shortName: 'Flow',
    chain: ChainId.FLOW,
    sellMarket: 'https://element.market',
    iconUrl: '/img/chainLogos/flow.jpg',
    nativeCurrency: { name: 'FLOW', symbol: 'FLOW', decimals: 18 },
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.FLOW]],
      },
    },
    blockExplorers: {
      default: {
        name: 'Flow EVM Mainnet Explorer',
        url: 'https://flowscan.io/evm',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.LENS,
    name: 'Lens',
    shortName: 'Lens',
    chain: ChainId.LENS,
    sellMarket: 'https://element.market',
    iconUrl: '/img/chainLogos/lens.jpg',
    nativeCurrency: { name: 'GHO', symbol: 'GHO', decimals: 18 },
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.LENS]],
      },
    },
    blockExplorers: {
      default: {
        name: 'Lens Explorer',
        url: 'https://explorer.lens.xyz',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.CORE,
    name: 'Core Blockchain Mainnet',
    shortName: 'Core',
    chain: ChainId.CORE,
    sellMarket: 'https://element.market',
    iconUrl: '/img/chainLogos/core.jpg',
    nativeCurrency: { name: 'CORE', symbol: 'CORE', decimals: 18 },
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.CORE]],
      },
    },
    blockExplorers: {
      default: {
        name: 'Core Explorer',
        url: 'https://scan.coredao.org',
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.XLAYER,
    name: 'X Layer',
    shortName: 'X Layer',
    chain: ChainId.XLAYER,
    sellMarket: 'https://element.market',
    iconUrl: '/img/chainLogos/xlayer.jpg',
    nativeCurrency: { name: 'OKB', symbol: 'OKB', decimals: 18 },
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.XLAYER]],
      },
    },
    blockExplorers: {
      default: {
        name: 'X Layer Explorer',
        url: 'https://www.oklink.com/x-layer',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 47416,
      },
    },
    gmSupport: true,
  },
  {
    id: NETWORKS.PLASMA,
    name: "Plasma",
    shortName: "Plasma",
    chain: PrismaChain.PLASMA,
    sellMarket: "https://element.market",
    iconUrl: "/img/chainLogos/plasma.jpg",
    nativeCurrency: { name: "XPL", symbol: "XPL", decimals: 18 },
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.PLASMA]],
      },
    },
    blockExplorers: {
      default: {
        name: "Plasma Explorer",
        url: "https://plasmascan.to",
      },
    },
    contracts: {
      multicall3: {
        address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      },
    },
    gmSupport: true,
  },
  {
    id: NETWORKS.GATELAYER,
    name: "Gate Layer",
    shortName: "Gate Layer",
    chain: PrismaChain.GATELAYER,
    sellMarket: "https://element.market",
    iconUrl: "/img/chainLogos/gatelayer.jpg",
    nativeCurrency: { name: "GT", symbol: "GT", decimals: 18 },
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.GATELAYER]],
      },
    },
    blockExplorers: {
      default: {
        name: "Gate Layer Explorer",
        url: "https://gatescan.org",
      },
    },
    contracts: {
      multicall3: {
        address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      },
    },
    gmSupport: true,
  },
  {
    id: NETWORKS.SYNDICATE,
    name: "Syndicate",
    shortName: "Syndicate",
    chain: PrismaChain.SYNDICATE,
    sellMarket: "https://element.market",
    iconUrl: "/img/chainLogos/syndicate.jpg",
    nativeCurrency: { name: "SYND", symbol: "SYND", decimals: 18 },
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.SYNDICATE]],
      },
    },
    blockExplorers: {
      default: {
        name: "Syndicate Explorer",
        url: "https://commons.explorer.syndicate.io",
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.OG,
    name: "0G Mainnet",
    shortName: "0G",
    chain: PrismaChain.OG,
    sellMarket: "https://element.market",
    iconUrl: "/img/chainLogos/0g.png",
    nativeCurrency: { name: "0G", symbol: "0G", decimals: 18 },
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.OG]],
      },
    },
    blockExplorers: {
      default: {
        name: "0G Explorer",
        url: "https://chainscan.0g.ai/",
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.ZERO,
    name: "ZERϴ",
    shortName: "ZERϴ",
    chain: PrismaChain.ZERO,
    sellMarket: "https://element.market",
    iconUrl: "/img/chainLogos/zero.jpg",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.ZERO]],
      },
    },
    blockExplorers: {
      default: {
        name: "ZERϴ Explorer",
        url: "https://zero-network.calderaexplorer.xyz/",
      },
    },
    contracts: {
      multicall3: {
        address: "0x0307F341a18f1FC1f63a7Ceeac970245A08C5a80",
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.XDC,
    name: "XDC Network",
    shortName: "XDC",
    chain: PrismaChain.XDC,
    sellMarket: "https://element.market",
    iconUrl: "/img/chainLogos/xdc.png",
    nativeCurrency: { name: "XDC", symbol: "XDC", decimals: 18 },
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.XDC]],
      },
    },
    blockExplorers: {
      default: {
        name: "XDC Explorer",
        url: "https://xdcscan.com",
      },
    },
    gmOnly: true,
  },
  {
    id: NETWORKS.ZETA,
    name: "ZetaChain Mainnet",
    shortName: "ZetaChain",
    chain: PrismaChain.ZETA,
    sellMarket: "https://element.market",
    iconUrl: "/img/chainLogos/zeta.jpg",
    nativeCurrency: { name: "ZETA", symbol: "ZETA", decimals: 18 },
    rpcUrls: {
      default: {
        http: [rpcs[NETWORKS.ZETA]],
      },
    },
    blockExplorers: {
      default: {
        name: "ZetaChain Mainnet Explorer",
        url: "https://zetascan.com/",
      },
    },
    contracts: {
      multicall3: {
        address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      },
    },
    gmOnly: true,
  },
  // {
  //   id: NETWORKS.ARTHERA,
  //   name: "Arthera Mainnet",
  //   shortName: "Arthera",
  //   chain: ChainId.ARTHERA,
  //   sellMarket: "https://element.market",
  //   nativeCurrency: { name: "Arthera", symbol: "AA", decimals: 18 },
  //   iconUrl: "/img/chainLogos/arthera.png",
  //   rpcUrls: {
  //     default: { http: [rpcs[NETWORKS.ARTHERA]] },
  //   },
  //   blockExplorers: {
  //     default: { name: "Arthera", url: "https://explorer.arthera.net/" },
  //   },
  //   contracts: {
  //     multicall3: {
  //       address: "0xcA11bde05977b3631167028862bE2a173976CA11",
  //       blockCreated: 4502791,
  //     },
  //   },
  // },
  // {
  //   id: NETWORKS.INK,
  //   name: "Ink Sepolia Testnet",
  //   shortName: "Ink Sepolia",
  //   chain: ChainId.INK,
  //   sellMarket: "https://element.market",
  //   nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  //   iconUrl: "/img/chainLogos/ink.jpg",
  //   rpcUrls: {
  //     default: { http: [rpcs[NETWORKS.INK]] },
  //   },
  //   blockExplorers: {
  //     default: {
  //       name: "ETH",
  //       url: "https://explorer-sepolia.inkonchain.com/",
  //     },
  //   },
  //   contracts: {
  //     multicall3: {
  //       address: "0xcA11bde05977b3631167028862bE2a173976CA11",
  //     },
  //   },
  //   testnet: true,
  // },
  // {
  //   id: NETWORKS.FORM,
  //   name: "Form",
  //   shortName: "Form",
  //   chain: ChainId.FORM,
  //   sellMarket: "https://element.market",
  //   nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  //   iconUrl: "/img/chainLogos/form.png",
  //   rpcUrls: {
  //     default: { http: [rpcs[NETWORKS.FORM]] },
  //   },
  //   blockExplorers: {
  //     default: {
  //       name: "ETH",
  //       url: "https://explorer.form.network/",
  //     },
  //   },
  //   contracts: {
  //     multicall3: {
  //       address: "0xcA11bde05977b3631167028862bE2a173976CA11",
  //     },
  //   },
  // },
  {
    id: NETWORKS.CREATOR_CHAIN,
    name: 'Creator Testnet',
    shortName: 'Creator',
    chain: ChainId.CREATOR_CHAIN,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/creatorchain.png',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.CREATOR_CHAIN]] },
    },
    blockExplorers: {
      default: { name: 'ETH', url: 'https://explorer.creatorchain.io' },
    },
    contracts: {
      multicall3: {
        address: '0x9062BfAdE2AA883361F02C87E831e0fcB15a833B',
      },
    },
    testnet: true,
  },
  {
    id: NETWORKS.MONAD,
    name: 'Monad Testnet',
    shortName: 'Monad',
    chain: ChainId.MONAD,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
    iconUrl: '/img/chainLogos/monad.svg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.MONAD]] },
    },
    blockExplorers: {
      default: { name: 'MON', url: 'http://testnet.monadexplorer.com/' },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    testnet: true,
  },
  {
    id: NETWORKS.NEXUS,
    name: 'Nexus Testnet',
    shortName: 'Nexus',
    chain: ChainId.NEXUS,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'NEX', symbol: 'NEX', decimals: 18 },
    iconUrl: '/img/chainLogos/nexus.svg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.NEXUS]] },
    },
    blockExplorers: {
      default: { name: 'NEX', url: 'https://explorer.nexus.xyz/' },
    },
    testnet: true,
  },
  // {
  //   id: NETWORKS.SOMNIA,
  //   name: "Somnia Testnet",
  //   shortName: "Somnia",
  //   chain: ChainId.SOMNIA,
  //   sellMarket: "https://element.market",
  //   nativeCurrency: { name: "STT", symbol: "STT", decimals: 18 },
  //   iconUrl: "/img/chainLogos/somnia.png",
  //   rpcUrls: {
  //     default: { http: [rpcs[NETWORKS.SOMNIA]] },
  //   },
  //   blockExplorers: {
  //     default: { name: "STT", url: "https://shannon-explorer.somnia.network/" },
  //   },
  //   testnet: true,
  // },
  {
    id: NETWORKS.KITE,
    name: 'KiteAI Testnet',
    shortName: 'KiteAI',
    chain: ChainId.KITE,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'Kite', symbol: 'KITE', decimals: 18 },
    iconUrl: '/img/chainLogos/kite.jpeg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.KITE]] },
    },
    blockExplorers: {
      default: { name: 'KiteAI', url: 'https://testnet.kitescan.ai/' },
    },
    // contracts: {
    //   multicall3: {
    //     address: "0xcA11bde05977b3631167028862bE2a173976CA11",
    //   },
    // },
    testnet: true,
  },
  {
    id: NETWORKS.ZENCHAIN,
    name: 'ZenChain Testnet',
    shortName: 'ZenChain',
    chain: ChainId.ZENCHAIN,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ZTC', symbol: 'ZTC', decimals: 18 },
    iconUrl: '/img/chainLogos/zenchain.svg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.ZENCHAIN]] },
    },
    blockExplorers: {
      default: { name: 'ZTC', url: 'https://zentrace.io/' },
    },
    testnet: true,
    gmSupport: true,
  },
  {
    id: NETWORKS.HELIOS,
    name: 'Helios Testnet',
    shortName: 'Helios',
    chain: ChainId.HELIOS,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'HELIOS', symbol: 'HELIOS', decimals: 18 },
    iconUrl: '/img/chainLogos/helios.svg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.HELIOS]] },
    },
    blockExplorers: {
      default: { name: 'HELIOS', url: 'https://explorer.helioschainlabs.org/' },
    },
    testnet: true,
  },
  // {
  //   id: NETWORKS.MEGA,
  //   name: "MEGA Testnet",
  //   shortName: "MEGA",
  //   chain: ChainId.MEGAETH,
  //   sellMarket: "https://element.market",
  //   nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  //   iconUrl: "/img/chainLogos/mega.svg",
  //   rpcUrls: {
  //     default: { http: [rpcs[NETWORKS.MEGA]] },
  //   },
  //   blockExplorers: {
  //     default: { name: "ETH", url: "https://megaexplorer.xyz" },
  //   },
  //   testnet: true,
  // },
  // {
  //   id: NETWORKS.BARTIO,
  //   name: "Bartio Testnet",
  //   shortName: "Bartio",
  //   chain: ChainId.BERA,
  //   sellMarket: "https://element.market",
  //   nativeCurrency: { name: "BERA", symbol: "BERA", decimals: 18 },
  //   iconUrl: "/img/chainLogos/berachain.png",
  //   rpcUrls: {
  //     default: { http: [rpcs[NETWORKS.BARTIO]] },
  //   },
  //   blockExplorers: {
  //     default: { name: "BERA", url: "https://bartio.beratrail.io/" },
  //   },
  //   contracts: {
  //     multicall3: {
  //       address: "0xcA11bde05977b3631167028862bE2a173976CA11",
  //       blockCreated: 109269,
  //     },
  //   },
  //   testnet: true,
  // },
  {
    id: NETWORKS.TABI_V2,
    name: 'Tabi Testnet V2',
    shortName: 'Tabi',
    chain: ChainId.TABI_V2,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'Tabi', symbol: 'TABI', decimals: 18 },
    iconUrl: '/img/chainLogos/tabi.jpeg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.TABI_V2]] },
    },
    blockExplorers: {
      default: { name: 'Tabi', url: 'https://testnetv2.tabiscan.com/' },
    },
    contracts: {
      multicall3: {
        address: '0x237B529ABD68C4b2DedCc644F9772b46007be441',
      },
    },
    testnet: true,
  },
  // {
  //   id: NETWORKS.PLUME,
  //   name: "Plume Testnet",
  //   shortName: "Plume",
  //   chain: ChainId.PLUME,
  //   sellMarket: "https://element.market",
  //   nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  //   iconUrl: "/img/chainLogos/plume.jpg",
  //   rpcUrls: {
  //     default: { http: [rpcs[NETWORKS.PLUME]] },
  //   },
  //   blockExplorers: {
  //     default: {
  //       name: "ETH",
  //       url: "https://testnet-explorer.plumenetwork.xyz/",
  //     },
  //   },
  //   contracts: {
  //     multicall3: {
  //       address: "0xcA11bde05977b3631167028862bE2a173976CA11",
  //     },
  //   },
  //   testnet: true,
  // },
  // {
  //   id: NETWORKS.SONEIUM,
  //   name: "Soneium Testnet",
  //   shortName: "Soneium Minato",
  //   chain: ChainId.SONEIUM,
  //   sellMarket: "https://element.market",
  //   nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  //   iconUrl: "/img/chainLogos/soneium.jpg",
  //   rpcUrls: {
  //     default: { http: [rpcs[NETWORKS.SONEIUM]] },
  //   },
  //   blockExplorers: {
  //     default: {
  //       name: "ETH",
  //       url: "https://explorer-testnet.soneium.org",
  //     },
  //   },
  //   contracts: {
  //     multicall3: {
  //       address: "0xcA11bde05977b3631167028862bE2a173976CA11",
  //     },
  //   },
  //   testnet: true,
  // },
  {
    id: NETWORKS.ATHENE,
    name: 'Athene Parthenon',
    shortName: 'Athene',
    chain: ChainId.ATHENE,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/athene.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.ATHENE]] },
    },
    blockExplorers: {
      default: {
        name: 'ETH',
        url: 'https://athenescan.io/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    testnet: true,
  },
  // {
  //   id: NETWORKS.XRPL,
  //   name: "XRPL EVM Sidechain Testnet",
  //   shortName: "XRPL",
  //   chain: ChainId.XRPL,
  //   sellMarket: "https://element.market",
  //   nativeCurrency: { name: "XRP", symbol: "XRP", decimals: 18 },
  //   iconUrl: "/img/chainLogos/xrp.jpeg",
  //   rpcUrls: {
  //     default: { http: [rpcs[NETWORKS.XRPL]] },
  //   },
  //   blockExplorers: {
  //     default: { name: "XRP", url: "https://explorer.testnet.xrplevm.org/" },
  //   },
  //   contracts: {
  //     multicall3: {
  //       address: "0x82Cc144D7d0AD4B1c27cb41420e82b82Ad6e9B31",
  //     },
  //   },
  //   testnet: true,
  // },
  {
    id: NETWORKS.SAHARA,
    name: 'SaharaAI Testnet',
    shortName: 'SaharaAI',
    chain: ChainId.SAHARA,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'SAHARA', symbol: 'SAHARA', decimals: 18 },
    iconUrl: '/img/chainLogos/sahara.svg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.SAHARA]] },
    },
    blockExplorers: {
      default: {
        name: 'SAHARA',
        url: 'https://testnet-explorer.saharalabs.ai/',
      },
    },
    testnet: true,
  },
  {
    id: NETWORKS.RISE,
    name: 'RISE Testnet',
    shortName: 'RISE',
    chain: ChainId.RISE,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    iconUrl: '/img/chainLogos/rise.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.RISE]] },
    },
    blockExplorers: {
      default: {
        name: 'RISE Textnet Explorer',
        url: 'https://explorer.testnet.riselabs.xyz/',
      },
    },
    testnet: true,
  },
  {
    id: NETWORKS.PHAROS,
    name: 'Pharos Testnet',
    shortName: 'Pharos',
    chain: ChainId.PHAROS,
    sellMarket: 'https://element.market',
    nativeCurrency: { name: 'PHRS', symbol: 'PHRS', decimals: 18 },
    iconUrl: '/img/chainLogos/pharos.jpg',
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.PHAROS]] },
    },
    blockExplorers: {
      default: {
        name: 'Pharos Textnet Explorer',
        url: 'https://testnet.pharosscan.xyz/',
      },
    },
    testnet: true,
    gmOnly: true,
  },
  {
    id: NETWORKS.GIWA,
    name: "Giwa Sepolia Testnet",
    shortName: "Giwa",
    chain: PrismaChain.GIWA,
    sellMarket: "https://element.market",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    iconUrl: "/img/chainLogos/giwa.svg",
    rpcUrls: {
      default: { http: [rpcs[NETWORKS.GIWA]] },
    },
    blockExplorers: {
      default: {
        name: "Giwa Sepolia Explorer",
        url: "https://sepolia-explorer.giwa.io/",
      },
    },
    testnet: true,
    gmOnly: true,
  },
  // {
  //   id: NETWORKS.NEOX,
  //   name: "NEOX",
  //   shortName: "NEOX",
  //   chain: ChainId.NEOX,
  //   sellMarket: "https://element.market",
  //   nativeCurrency: { name: "Neox", symbol: "GAS", decimals: 18 },
  //   iconUrl: "/img/chainLogos/neox.png",
  //   rpcUrls: {
  //     default: { http: [rpcs[NETWORKS.NEOX]] },
  //   },
  //   blockExplorers: {
  //     default: { name: "Neox", url: "https://xt3scan.ngd.network" },
  //   },
  //   contracts: {
  //     multicall3: {
  //       address: "0xc29a971a547f8a62e4ea8A37fD8465fdec54C60F",
  //       blockCreated: 45296,
  //     },
  //   },
  //   testnet: true,
  // },
  // {
  //   id: NETWORKS.MORPHHOLESKY,
  //   name: "Morph Holesky",
  //   shortName: "Morph",
  //   chain: ChainId.MORPH,
  //   sellMarket: "https://element.market",
  //   nativeCurrency: { name: "Morph", symbol: "ETH", decimals: 18 },
  //   iconUrl: "/img/chainLogos/morphHolesky.png",
  //   rpcUrls: {
  //     default: { http: ["https://rpc-holesky.morphl2.io"] },
  //   },
  //   blockExplorers: {
  //     default: { name: "Morph", url: "https://explorer-holesky.morphl2.io/" },
  //   },
  //   contracts: {
  //     multicall3: {
  //       address: "0x0658417F1Af705a20333Ac1b1B01A2Bf0c139eB3",
  //       blockCreated: 253900,
  //     },
  //   },
  //   testnet: true,
  // },
  // {
  //   id: NETWORKS.FIRE,
  //   name: "5ire Testnet",
  //   shortName: "5ire",
  //   chain: ChainId.FIRE,
  //   sellMarket: "https://element.market",
  //   nativeCurrency: { name: "5ire", symbol: "5ire", decimals: 18 },
  //   iconUrl: "/img/chainLogos/5ire.png",
  //   rpcUrls: {
  //     default: { http: ["https://rpc.ga.5ire.network"] },
  //   },
  //   blockExplorers: {
  //     default: { name: "5ire", url: "https://explorer.ga.5ire.network/" },
  //   },
  //   contracts: {
  //     multicall3: {
  //       address: "0x9Cb7dB97f84c66C2a662890Ab8056c796F3ED9Ab",
  //     },
  //   },
  //   testnet: true,
  // },
  // {
  //   id: NETWORKS.TABI,
  //   name: "Tabi Testnet",
  //   shortName: "Tabi",
  //   chain: ChainId.TABI,
  //   sellMarket: "https://element.market",
  //   nativeCurrency: { name: "Tabi", symbol: "TABI", decimals: 18 },
  //   iconUrl: "/img/chainLogos/tabi.jpeg",
  //   rpcUrls: {
  //     default: { http: [rpcs[NETWORKS.TABI]] },
  //   },
  //   blockExplorers: {
  //     default: { name: "Tabi", url: "https://testnet.tabiscan.com/" },
  //   },
  //   contracts: {
  //     multicall3: {
  //       address: "0xEBdB92A9d94cACF58F3D5A85AC71a8F3ba035E2C",
  //       blockCreated: 2360834,
  //     },
  //   },
  //   testnet: true,
  // },
  // {
  //   id: NETWORKS.ZKLINK,
  //   name: "zkLink Nova",
  //   shortName: "zkLink",
  //   chain: ChainId.ZKLINK,
  //   sellMarket: "https://element.market",
  //   nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  //   iconUrl: "/img/chainLogos/zkLink.png",
  //   rpcUrls: {
  //     default: { http: [rpcs[NETWORKS.ZKLINK]] },
  //   },
  //   blockExplorers: {
  //     default: { name: "ETH", url: "https://explorer.zklink.io" },
  //   },
  //   contracts: {
  //     multicall3: {
  //       address: "0x825267E0fA5CAe92F98540828a54198dcB3Eaeb5",
  //     },
  //   },
  // },
  // {
  //   id: NETWORKS.SONIC,
  //   name: "Sonic Testnet",
  //   shortName: "Sonic",
  //   chain: ChainId.SONIC,
  //   sellMarket: "https://element.market",
  //   nativeCurrency: { name: "S", symbol: "S", decimals: 18 },
  //   iconUrl: "/img/chainLogos/sonic.jpg",
  //   rpcUrls: {
  //     default: { http: [rpcs[NETWORKS.SONIC]] },
  //   },
  //   blockExplorers: {
  //     default: {
  //       name: "S",
  //       url: "https://testnet.soniclabs.com",
  //     },
  //   },
  //   contracts: {
  //     multicall3: {
  //       address: "0xcA11bde05977b3631167028862bE2a173976CA11",
  //     },
  //   },
  //   testnet: true,
  // },
  // {
  //   id: NETWORKS.ZKCANDY,
  //   name: "ZkCandy Testnet",
  //   shortName: "ZkCandy",
  //   chain: ChainId.CANDY,
  //   sellMarket: "https://element.market",
  //   nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  //   iconUrl: "/img/chainLogos/zkCandy.jpeg",
  //   rpcUrls: {
  //     default: { http: ["https://sepolia.rpc.zkcandy.io"] },
  //   },
  //   blockExplorers: {
  //     default: { name: "zkCandy", url: "https://sepolia.explorer.zkcandy.io" },
  //   },
  //   contracts: {
  //     multicall3: {
  //       address: "_",
  //     },
  //   },
  // },
];

export const getChainByID = (id?: NETWORKS) => CHAINS.find((item) => item.id === id) ?? CHAINS[0];

export const getChainByChain = (chain: PrismaChain) =>
  CHAINS.find((item) => item.chain === chain) ?? CHAINS[0];

export const chains = CHAINS as unknown as [NETWORK_TYPE, ...NETWORK_TYPE[]];

export const CHAIN_IDS = chains.map((c) => c.id);

export const CHAIN_IDS_REGISTER = chains.filter((c) => (!c.gmOnly || c.gmSupport) && !c.hidden);

export const mainnets = chains.filter((c) => !c.testnet).map((c) => c.id);
export const testnets = chains.filter((c) => c.testnet).map((c) => c.id);

// Define hot chains (INK, Unichain, Somnia, Plume, Hype) - higher priority
export const hotChains = [
  NETWORKS.INKMAINNET,
  NETWORKS.UNICHAIN,
  NETWORKS.PLUMEMAINNET,
  NETWORKS.HYPE,
];

// Define new chains (last 5 chains from migration history) - excluding hot chains to avoid duplication
export const newChains = [
  NETWORKS.XRPLMAINNET, // Added 2025-07-01
  NETWORKS.KAIA, // Added 2025-06-30
  NETWORKS.UNIT0, // Added 2025-05-27
  NETWORKS.KITE, // Added 2025-05-02
];

export const isChainSupported = memoize((chainId: number) =>
  (CHAIN_IDS as number[]).includes(chainId)
);

export const isSvgSupported = memoize((chainId: number) =>
  [NETWORKS.CZ, NETWORKS.SCROLL, NETWORKS.POLY, NETWORKS.BLAST].includes(chainId)
);
