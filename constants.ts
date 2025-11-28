import { Question } from "./types";

// --- RAIKU KNOWLEDGE BASE FOR GEMINI ---
export const RAIKU_CONTEXT = `
You are an expert on Raiku. Raiku is a protocol for Deterministic Scheduling on the Solana blockchain.
Key Features:
1. Deterministic Execution: Raiku ensures transactions are executed in a predictable order, eliminating uncertainty.
2. Slot Marketplace: A mechanism for buying and selling execution slots.
3. AOT (Ahead-of-Time) Scheduling: Transactions are scheduled before the block is built.
4. MEV Protection: By enforcing deterministic ordering, Raiku mitigates malicious Maximal Extractable Value (MEV) strategies like front-running or sandwich trading.
Mission: To make Solana the most robust and fair high-performance blockchain.
Official Links: Website (raiku.com), Twitter (@raikucom).
If the user asks about something unrelated to Raiku, Solana, or blockchain scheduling, politely decline.
Keep answers strictly under 280 characters.
`;

// --- QUIZ QUESTIONS ---

export const SIMPLE_QUESTIONS: Question[] = [
  { id: 's1', question: "What blockchain is Raiku built for?", options: ["Ethereum", "Solana", "Bitcoin", "Cardano"], correctAnswer: "Solana" },
  { id: 's2', question: "What is Raiku's primary goal?", options: ["Deterministic Scheduling", "Minting NFTs", "Yield Farming", "Social Networking"], correctAnswer: "Deterministic Scheduling" },
  { id: 's3', question: "What does AOT stand for in Raiku's context?", options: ["Attack on Titan", "Ahead of Time", "All over There", "Always on Time"], correctAnswer: "Ahead of Time" },
  { id: 's4', question: "Raiku helps protect against which blockchain issue?", options: ["High Gas Fees", "MEV (Maximal Extractable Value)", "Lost Passwords", "Slow Internet"], correctAnswer: "MEV (Maximal Extractable Value)" },
  { id: 's5', question: "What mechanism does Raiku use for ordering?", options: ["Random Lottery", "Slot Marketplace", "First Come First Serve", "Highest Bribe"], correctAnswer: "Slot Marketplace" },
  { id: 's6', question: "Is Raiku a Layer 2 solution?", options: ["Yes", "No, it's a scheduling protocol", "It is a wallet", "It is a separate blockchain"], correctAnswer: "No, it's a scheduling protocol" },
  { id: 's7', question: "What execution model does Raiku enable?", options: ["Probabilistic", "Deterministic", "Chaotic", "Manual"], correctAnswer: "Deterministic" },
  { id: 's8', question: "Which ecosystem does Raiku support?", options: ["Polkadot", "Solana", "Cosmos", "Avalanche"], correctAnswer: "Solana" },
  { id: 's9', question: "What ensures transaction predictability in Raiku?", options: ["Magic", "Pre-ordering via slots", "Miners", "Validators guessing"], correctAnswer: "Pre-ordering via slots" },
  { id: 's10', question: "Can developers use Raiku?", options: ["No, purely internal", "Yes, to optimize transaction flow", "Only for buying tokens", "Only on Sundays"], correctAnswer: "Yes, to optimize transaction flow" },
  { id: 's11', question: "Raiku improves which aspect of Solana?", options: ["TPS exclusively", "Reliability and Fairness", "Wallet UI", "Token prices"], correctAnswer: "Reliability and Fairness" },
  { id: 's12', question: "What replaces the 'gas wars' in Raiku logic?", options: ["Deterministic Slots", "Higher Fees", "Waiting longer", "Lottery tickets"], correctAnswer: "Deterministic Slots" },
];

export const HARD_QUESTIONS: Question[] = [
  { id: 'h1', question: "How does AOT scheduling differ from JIT?", options: ["It's slower", "Scheduled before block building", "Scheduled after execution", "Randomized"], correctAnswer: "Scheduled before block building" },
  { id: 'h2', question: "In the Slot Marketplace, what is traded?", options: ["Raiku Tokens", "Execution rights for specific slots", "NFTs", "Validator keys"], correctAnswer: "Execution rights for specific slots" },
  { id: 'h3', question: "Raiku's MEV protection primarily targets:", options: ["Arbitrage", "Sandwich attacks and Front-running", "Liquidations", "Whale movements"], correctAnswer: "Sandwich attacks and Front-running" },
  { id: 'h4', question: "Deterministic execution implies:", options: ["State transitions are function of input only", "Random outcomes", "Validators choose order", "Network latency decides"], correctAnswer: "State transitions are function of input only" },
  { id: 'h5', question: "Raiku integration requires:", options: ["Forking Solana", "Adopting Raiku SDK/Protocol", "Buying Hardware", "Re-writing Smart Contracts in Python"], correctAnswer: "Adopting Raiku SDK/Protocol" },
  { id: 'h6', question: "The theoretical latency impact of AOT is:", options: ["Infinite", "Negligible/Reduced due to pre-calc", "Doubled", "Tripled"], correctAnswer: "Negligible/Reduced due to pre-calc" },
  { id: 'h7', question: "Who benefits most from Raiku?", options: ["HFT and DeFi protocols", "Gamers", "Artists", "Node Operators only"], correctAnswer: "HFT and DeFi protocols" },
  { id: 'h8', question: "What is the core conflict Raiku solves?", options: ["Storage cost", "Contention access to state", "Network bandwidth", "Validator uptime"], correctAnswer: "Contention access to state" },
  { id: 'h9', question: "Does Raiku replace the Solana runtime?", options: ["Yes", "No, it augments scheduling", "It replaces Sealevel", "It removes PoH"], correctAnswer: "No, it augments scheduling" },
  { id: 'h10', question: "In a deterministic schedule, failed transactions:", options: ["Block the chain", "Are skipped deterministically", "Retry forever", "Crash the node"], correctAnswer: "Are skipped deterministically" },
  { id: 'h11', question: "Raiku's economic model relies on:", options: ["Inflation", "Slot Auction/Market dynamics", "Donations", "Mining"], correctAnswer: "Slot Auction/Market dynamics" },
  { id: 'h12', question: "Deep integration of Raiku allows for:", options: ["Atomic composability guarantees", "Cross-chain swaps", "Free transactions", "Private transactions"], correctAnswer: "Atomic composability guarantees" },
];

export const TOUGH_MANDATORY: Question[] = [
  {
    id: 'tough-south-park',
    question: "describe offmylawn with one of these south park characters.",
    options: ["Eric Theodore Cartman", "Stanley “Stan” Marsh", "Kyle Broflovski", "Kenneth “Kenny” McCormick"],
    correctAnswer: "Eric Theodore Cartman", // Logic handles "any" in Quiz.tsx
    isMandatoryTough: true
  },
  {
    id: 'tough-fight-club',
    question: "the first rule of fight club is",
    options: ["Always invite new members to Fight Club", "you do not talk about Fight Club", "Fight Club meetings must be recorded for review", "Members must wear official Fight Club uniforms"],
    correctAnswer: "you do not talk about Fight Club",
    isMandatoryTough: true
  }
];

export const TIMER_CONFIG = {
  simple: 120,
  hard: 75,
  tough: 45
};