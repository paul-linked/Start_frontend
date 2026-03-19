import type { NodeScenarios } from "@/types";

export const NODE_01_SCENARIOS: NodeScenarios = {
  reigns: {
    scenario_id: "node01_reigns",
    cards: [
      {
        prompt: "You just received $1,000. What's your first instinct?",
        left: { label: "Spend it", impact: { xp: 5 } },
        right: { label: "Save it", impact: { xp: 20 } },
        tap: { label: "Do nothing", impact: { xp: 10 } },
        lesson: "Saving money gives you options. Spending feels good now, but it's gone forever.",
      },
      {
        prompt: "A friend says keeping money in savings is pointless — you should spend it while you can.",
        left: { label: "Agree, spend", impact: { xp: 5 } },
        right: { label: "Keep saving", impact: { xp: 20 } },
        tap: { label: "Think about it", impact: { xp: 15 } },
        lesson: "Even small savings grow over time. $1,000 at 1.5% earns $150 in 10 years with no effort.",
      },
      {
        prompt: "Your bank offers a savings account with 1.5% interest. It's not much, but it's free money.",
        left: { label: "Not worth it", impact: { xp: 5 } },
        right: { label: "Open it", impact: { xp: 25 } },
        tap: { label: "Maybe later", impact: { xp: 8 } },
        lesson: "A savings account earns interest while you sleep. It's the simplest first step in building wealth.",
      },
    ],
  },
  allocation: {
    scenario_id: "node01_allocation",
    starting_balance: 1000,
    accounts: [
      { id: "checking", label: "Checking", description: "Easy access, 0% interest", interest: 0, color: "#E3EDF8" },
      { id: "savings", label: "Savings", description: "Safe growth, 1.5% interest", interest: 1.5, color: "#E8F2E0" },
      { id: "investing", label: "Investing", description: "Locked for now", interest: 0, color: "#F5F0E3" },
    ],
    goal: "Where should your $1,000 sit?",
    optimal: { checking: 200, savings: 800, investing: 0 },
  },
  event: {
    scenario_id: "node01_event",
    prompt: "Unexpected expense!",
    description: "Your phone screen cracks. Repair costs $300. What do you do?",
    options: [
      { label: "Pay from savings", xp: 25, correct: true, feedback: "Smart — this is exactly what savings are for. You handled the emergency without stress." },
      { label: "Ignore it", xp: 5, correct: false, feedback: "Ignoring problems doesn't make them go away. A cracked screen only gets worse." },
      { label: "Put it on credit", xp: 5, correct: false, feedback: "Borrowing for emergencies costs you extra in interest. Savings let you avoid debt." },
    ],
    time_limit_seconds: 20,
  },
};