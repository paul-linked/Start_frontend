import { GlossaryText } from "@/components/glossary/GlossaryText";
import { GlossaryProvider } from "@/components/glossary/GlossaryProvider";

export default function GlossaryTestPage() {
  return (
    <GlossaryProvider>
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'var(--font-body)',
      color: 'var(--game-text)'
    }}>
      <h1 style={{ 
        fontFamily: 'var(--font-display)', 
        marginBottom: '2rem',
        color: 'var(--game-secondary)'
      }}>
        Glossary Widget Test Page
      </h1>
      
      <div style={{ 
        background: 'var(--game-surface)', 
        padding: '1.5rem', 
        borderRadius: '16px',
        marginBottom: '1.5rem',
        border: '1px solid var(--game-border)'
      }}>
        <h2 style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: '1.2rem',
          marginBottom: '1rem',
          color: 'var(--game-secondary)'
        }}>
          Banking Terms
        </h2>
        <p style={{ lineHeight: '1.8', marginBottom: '1rem' }}>
          <GlossaryText>
            You just received $1,000. You can put it in a savings account that earns interest, 
            or keep it in your checking account for easy access. Understanding compound interest 
            is key to building wealth over time.
          </GlossaryText>
        </p>
        <p style={{ lineHeight: '1.8' }}>
          <GlossaryText>
            Building an emergency fund is important for unexpected expenses. Make sure to create 
            a budget to track your spending and avoid debt.
          </GlossaryText>
        </p>
      </div>

      <div style={{ 
        background: 'var(--game-surface)', 
        padding: '1.5rem', 
        borderRadius: '16px',
        marginBottom: '1.5rem',
        border: '1px solid var(--game-border)'
      }}>
        <h2 style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: '1.2rem',
          marginBottom: '1rem',
          color: 'var(--game-secondary)'
        }}>
          Investment Terms
        </h2>
        <p style={{ lineHeight: '1.8', marginBottom: '1rem' }}>
          <GlossaryText>
            When investing, you can buy stocks or bonds. Diversification helps reduce risk 
            while maximizing potential returns. Every asset in your portfolio should serve a purpose.
          </GlossaryText>
        </p>
        <p style={{ lineHeight: '1.8' }}>
          <GlossaryText>
            Good credit makes it easier to borrow money for big purchases. Understanding the 
            relationship between risk and return is essential for successful investing.
          </GlossaryText>
        </p>
      </div>

      <div style={{ 
        background: 'var(--feedback-good-bg)', 
        padding: '1rem', 
        borderRadius: '12px',
        fontSize: '0.9rem',
        color: 'var(--feedback-good-text)'
      }}>
        <strong>How to use:</strong> Hover over the underlined terms (desktop) or tap them (mobile) 
        to see their definitions. Press Escape or click outside to close the tooltip.
      </div>
    </div>
    </GlossaryProvider>
  );
}
