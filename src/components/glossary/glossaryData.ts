export interface GlossaryEntry {
  term: string;              // Display term (e.g., "Savings Account")
  definition: string;        // Beginner-friendly explanation (<100 words)
  category?: string;         // Optional grouping (e.g., "Banking", "Investing")
  aliases?: string[];        // Alternative forms (e.g., ["savings", "savings acct"])
}

export const GLOSSARY_TERMS: GlossaryEntry[] = [
  {
    term: "Savings Account",
    definition: "A bank account that holds your money safely and pays you interest over time. You can withdraw money when needed, but it's meant for saving rather than daily spending.",
    category: "Banking",
    aliases: ["savings", "savings acct"],
  },
  {
    term: "Checking Account",
    definition: "A bank account for everyday transactions like paying bills and buying things. Usually earns little or no interest, but gives you easy access to your money.",
    category: "Banking",
    aliases: ["checking"],
  },
  {
    term: "Interest",
    definition: "Money that grows your savings over time, or money you pay to borrow. When you save, the bank pays you interest. When you borrow, you pay interest to the lender.",
    category: "Banking",
  },
  {
    term: "Investing",
    definition: "Putting money into assets like stocks or bonds with the goal of growing your wealth over time. Involves more risk than saving, but offers higher potential returns.",
    category: "Investing",
    aliases: ["invest", "investment"],
  },
  {
    term: "Compound Interest",
    definition: "Interest earned on both your original money and the interest it has already earned. This creates a snowball effect that helps your money grow faster over time.",
    category: "Banking",
  },
  {
    term: "Emergency Fund",
    definition: "Money set aside for unexpected expenses like car repairs or medical bills. Financial experts recommend saving 3-6 months of living expenses.",
    category: "Banking",
  },
  {
    term: "Budget",
    definition: "A plan for how you'll spend and save your money each month. Helps you track income and expenses so you can reach your financial goals.",
    category: "Personal Finance",
  },
  {
    term: "Debt",
    definition: "Money you owe to someone else. Common types include credit card debt, student loans, and mortgages. Paying off high-interest debt should be a priority.",
    category: "Personal Finance",
  },
  {
    term: "Credit",
    definition: "Your ability to borrow money based on trust that you'll pay it back. Good credit makes it easier and cheaper to borrow for big purchases like homes or cars.",
    category: "Personal Finance",
  },
  {
    term: "Asset",
    definition: "Something you own that has value, like cash, investments, property, or a car. Building assets is key to growing wealth over time.",
    category: "Investing",
  },
  {
    term: "Stock",
    definition: "A share of ownership in a company. When you buy stock, you own a small piece of that business and can profit if the company grows.",
    category: "Investing",
    aliases: ["stocks", "shares"],
  },
  {
    term: "Bond",
    definition: "A loan you give to a company or government that pays you interest over time. Generally safer than stocks but with lower potential returns.",
    category: "Investing",
    aliases: ["bonds"],
  },
  {
    term: "Diversification",
    definition: "Spreading your investments across different types of assets to reduce risk. The idea is 'don't put all your eggs in one basket.'",
    category: "Investing",
    aliases: ["diversify", "diversified"],
  },
  {
    term: "Risk",
    definition: "The chance that an investment will lose value. Higher-risk investments can offer bigger rewards but also bigger losses.",
    category: "Investing",
  },
  {
    term: "Return",
    definition: "The profit or loss you make on an investment. Usually expressed as a percentage of what you originally invested.",
    category: "Investing",
    aliases: ["returns"],
  },
];
