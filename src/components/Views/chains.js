const Ethereum = {
  hex: "0x1",
  name: "Ethereum",
  rpcUrl:
    "https://eth-mainnet.g.alchemy.com/v2/AKYykRpr3oFzMTn77y4mnVny5HyMtevq",
  ticker: "ETH",
};

const MumbaiTestnet = {
  hex: "0x13881",
  name: "Mumbai Testnet",
  rpcUrl:
    "https://polygon-mumbai.g.alchemy.com/v2/vYPgKMOEm7n6ztzlTWlMPQOPYY5vWDcg",
  ticker: "MATIC",
};

const Polygon = {
  hex: "0x89",
  name: "Polygon",
  rpcUrl:
    "https://polygon-mainnet.g.alchemy.com/v2/u_BOaonoEgMC6otObgAscbeT0CmLDWo5",
  ticker: "MATIC",
};

const zkSyncMainnet = {
  hex: "0x144",
  name: "zkSync Mainnet",
  rpcUrl: "https://zksync-era.blockpi.network/v1/rpc/public	",
  ticker: "ETH",
};

const BinanceSmartChain = {
  hex: "0x38",
  name: "Binance Smart Chain",
  rpcUrl: "https://bsc-dataseed.binance.org/",
  ticker: "BNB",
};

export const CHAINS_CONFIG = {
  "0x1": Ethereum,
  "0x13881": MumbaiTestnet,
  "0x89": Polygon,
  "0x38": BinanceSmartChain,
  "0x144": zkSyncMainnet, // Thêm mạng zkSync vào CHAINS_CONFIG với khóa là hex của nó
};
