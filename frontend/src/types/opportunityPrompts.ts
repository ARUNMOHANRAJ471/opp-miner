// Opportunity-specific prompt item type (compatible with PromptLibraryItem but scoped to opportunities)
export interface OpportunityPromptItem {
  id: string;
  category: string;
  label: string;
  promptText: string;
}

// Opportunity prompt categories for the Opportunities page
export const OPPORTUNITY_PROMPT_CATEGORIES = {
  pipelineOverview: 'Pipeline & MLR Story',
  financialDrilldowns: 'Financial Drilldowns',
  executionRisks: 'Execution & Delivery Risks',
  boardReadouts: 'Executive & Board Readouts',
} as const;

// Opportunity prompts – will be populated over time
export const OPPORTUNITY_PROMPTS: OpportunityPromptItem[] = [
  {
    id: 'opp-p1',
    category: 'pipelineOverview',
    label: 'How healthy is our opportunity pipeline?',
    promptText: `How healthy is our opportunity pipeline?

You are a healthcare payer CFO advisor.

Using the current opportunity dashboard metrics:

- Identified opportunity
- Addressable opportunity
- Potential net savings
- Affected members
- Projected MLR

Assess:

1. Pipeline strength (weak / moderate / strong)
2. Conversion efficiency (identified → addressable → realizable)
3. Whether savings are sufficient to move MLR toward target
4. Top 2 risks in pipeline assumptions

Be financially precise and executive-focused.`,
  },
  {
    id: 'opp-p2',
    category: 'executionRisks',
    label: 'Are we overestimating realizable savings?',
    promptText: `Are we overestimating realizable savings?

Critically evaluate the pipeline math:

- Identified opportunity
- Addressable opportunity
- Realization rate
- Confidence scores

Assess:

1. Whether realization assumptions appear aggressive or conservative
2. Which opportunities may be inflated
3. Sensitivity if realization drops by 10–20%
4. Likely net MLR impact under downside scenario

Provide a risk-adjusted outlook.`,
  },
  {
    id: 'opp-p3',
    category: 'pipelineOverview',
    label: 'What happens to MLR if we execute this pipeline?',
    promptText: `What happens to MLR if we execute this pipeline?

Using projected MLR and potential net savings:

1. Estimate MLR improvement if full pipeline is realized
2. Estimate MLR improvement at 75% realization
3. Estimate MLR improvement at 50% realization
4. Clarify whether this moves us toward target MLR

Provide a short executive recommendation.`,
  },
  {
    id: 'opp-p4',
    category: 'financialDrilldowns',
    label: 'Which opportunities move margin the fastest?',
    promptText: `Which opportunities move margin the fastest?

Analyze the heatmap opportunities:

- Reduce avoidable inpatient admissions
- Prior authorization approval
- Eliminate duplicate services
- Care gap closure – HEDIS
- Reduce low value care
- Redirect avoidable ED visits

Rank them by:

1. Speed to impact
2. Realizable savings
3. Operational complexity
4. Confidence level

Provide top 3 immediate actions.`,
  },
  {
    id: 'opp-p5',
    category: 'financialDrilldowns',
    label: 'Which opportunity has the best ROI?',
    promptText: `Which opportunity has the best ROI?

Compare all listed opportunities.

Evaluate:

- Estimated savings
- Complexity
- Confidence
- LOB exposure
- Implementation risk

Rank by expected ROI and justify ranking.`,
  },
  {
    id: 'opp-p6',
    category: 'pipelineOverview',
    label: 'Which opportunities are structurally strategic vs tactical?',
    promptText: `Which opportunities are structurally strategic vs tactical?

Classify each opportunity as:

- Tactical short-term win
- Medium-term improvement
- Structural cost reform

Explain why.

Recommend balanced portfolio allocation.`,
  },
  {
    id: 'opp-p7',
    category: 'executionRisks',
    label: 'Validate Reduce Avoidable Inpatient Admissions',
    promptText: `Validate Reduce Avoidable Inpatient Admissions

For the opportunity 'Reduce avoidable inpatient admissions':

- Review estimated savings
- Review confidence
- Review LOBs involved
- Review complexity and status

Assess:

1. Preventability realism
2. Whether inpatient cost is truly modifiable
3. Expected timeline to impact
4. Quality risk

Provide go / delay / re-scope recommendation.`,
  },
  {
    id: 'opp-p8',
    category: 'executionRisks',
    label: 'Is Prior Authorization Approval a margin lever?',
    promptText: `Is Prior Authorization Approval a margin lever?

Evaluate 'Prior authorization approval'.

Assess:

- Savings durability
- Provider abrasion risk
- Compliance risk
- Operational burden
- LOB sensitivity

Conclude whether this is:
- Strong margin lever
- Moderate lever
- High political risk`,
  },
  {
    id: 'opp-p9',
    category: 'executionRisks',
    label: 'Should Eliminate Duplicate Services be scaled immediately?',
    promptText: `Should Eliminate Duplicate Services be scaled immediately?

Evaluate the duplicate services opportunity.

Analyze:

- Savings predictability
- Ease of enforcement
- Quality neutrality
- Provider resistance

Recommend execution strategy.`,
  },
  {
    id: 'opp-p10',
    category: 'financialDrilldowns',
    label: 'Is Care Gap Closure a cost lever or quality lever?',
    promptText: `Is Care Gap Closure a cost lever or quality lever?

Evaluate 'Care gap closure – HEDIS'.

Assess:

- Direct cost reduction potential
- Quality bonus protection
- Regulatory exposure
- Time to financial return

Clarify whether this is defensive or offensive.`,
  },
  {
    id: 'opp-p11',
    category: 'financialDrilldowns',
    label: 'Which LOB drives the most opportunity?',
    promptText: `Which LOB drives the most opportunity?

Analyze opportunity distribution across LOBs.

Determine:

- Which LOB contributes most to total savings
- Which LOB has fastest ROI
- Whether savings concentration increases operational risk

Recommend LOB prioritization.`,
  },
  {
    id: 'opp-p12',
    category: 'interventionOpportunities',
    label: 'Should any of these opportunities move into VBC?',
    promptText: `Should any of these opportunities move into VBC?

Evaluate opportunities for VBC integration.

Assess which:

- Are provider-controllable
- Have stable utilization patterns
- Can shift risk downstream
- Support shared savings models

Recommend VBC strategy alignment.`,
  },
  {
    id: 'opp-p13',
    category: 'executionRisks',
    label: 'What are the biggest execution risks in this pipeline?',
    promptText: `What are the biggest execution risks in this pipeline?

Identify execution risks across all listed opportunities.

Consider:

- Provider engagement
- Care management capacity
- Member adherence
- Regulatory constraints
- Overlapping initiatives

Rank top 3 execution threats.`,
  },
  {
    id: 'opp-p14',
    category: 'executionRisks',
    label: 'Which opportunities are likely to stall?',
    promptText: `Which opportunities are likely to stall?

Using complexity and status fields:

- Identify opportunities at risk of stalling
- Assess bottleneck causes
- Estimate delay cost
- Recommend escalation steps`,
  },
  {
    id: 'opp-p15',
    category: 'boardReadouts',
    label: 'If we fund only two initiatives, which should we pick?',
    promptText: `If we fund only two initiatives, which should we pick?

Assume limited operational capacity.

Select top 2 opportunities that:

- Maximize margin impact
- Have highest realization confidence
- Have manageable complexity
- Minimize regulatory risk

Justify with financial logic.`,
  },
  {
    id: 'opp-p16',
    category: 'boardReadouts',
    label: 'What is the opportunity we are missing?',
    promptText: `What is the opportunity we are missing?

Critically evaluate the opportunity portfolio.

Identify:

- Gaps in opportunity categories
- Over-concentration in certain levers
- Missing structural cost drivers
- Blind spots not represented

Provide recommendations for expansion.`,
  },
  {
    id: 'opp-p17',
    category: 'boardReadouts',
    label: 'Summarize the opportunity portfolio for the board.',
    promptText: `Summarize the opportunity portfolio for the board.

Provide a board-ready summary including:

- Total savings pipeline
- Realization assumptions
- Top 3 margin levers
- Execution risks
- Expected MLR movement
- Strategic direction

Use clear, non-technical language.`,
  },
];

export const OPPORTUNITY_CATEGORY_ORDER: (keyof typeof OPPORTUNITY_PROMPT_CATEGORIES)[] = [
  'pipelineOverview',
  'financialDrilldowns',
  'executionRisks',
  'boardReadouts',
];

