export interface DashboardMetrics {
  organizational: {
    totalMembers: number;
    totalRevenue: number;
    totalMedicalCost: number;
    adminCost?: number;
    mlr: number;
    pmpm: number;
    revenueChangePercent?: number;
    costChangePercent?: number;
    pmpmChangePercent?: number;
    mlrTarget?: number;
    mlrAboveTarget?: number;
    operatingMargin?: number;
    requiredSavingsToHitTargetMlr?: number;
    highCostConcentration?: {
      top1Pct: number;
      top5Pct: number;
      top10Pct: number;
    };
  };
  opportunity: {
    totalIdentified: number;
    addressable: number;
    realizable: number;
    realized: number;
    affectedMembers?: number;
  };
  costUtilization: {
    edVisitsPer1000: number;
    admissionsPer1000: number;
    readmissionRate: number;
    avgLengthOfStay: number;
    inpatientAdmissionRate: number;
    erUtilization: number;
    outpatientUtilization: number;
    pharmacyCostTrend: number;
  };
  trend: {
    rolling12MonthMlr: number[];
    rolling12MonthPmpm: number[];
    predictiveForecast: {
      mlrNextQuarter: number;
      pmpmNextQuarter: number;
      quarters?: { quarter: number; mlr: number; pmpm: number }[];
    };
  };
  costDistribution?: { name: string; value: number; color: string }[];
}

export interface FilterOptions {
  lob: string[];
  timePeriod: string[];
  geography: string[];
  segment: string[];
}

export const PROMPT_CATEGORIES = {
  financial: 'Financial & Revenue',
  opportunity: 'Opportunity Discovery',
  provider: 'Provider & Population',
  executive: 'Executive Summary',
} as const;

export interface PromptItem {
  id: string;
  category: keyof typeof PROMPT_CATEGORIES;
  label: string;
  promptText: string;
}

export const PROMPTS: PromptItem[] = [
  {
    id: 'p1',
    category: 'executive',
    label: 'How far are we from financial stability?',
    promptText: `How far are we from financial stability?

You are a healthcare payer CFO advisor.

Using:
- Total revenue
- Total cost
- Operating margin
- Current MLR
- Target MLR
- Required savings to hit target

Assess:

1. Current financial stability (stable / fragile / high risk)
2. Required savings pace per quarter to hit 85% MLR
3. Whether current opportunity pipeline is sufficient
4. Biggest financial exposure in next 6 months

Provide a concise executive summary.`,
  },
  {
    id: 'p2',
    category: 'executive',
    label: 'What must happen to reach 85% MLR?',
    promptText: `What must happen to reach 85% MLR?

Using current MLR (90%), operating margin (5%), and required savings ($168.3M):

1. Calculate quarterly savings required.
2. Compare against pipeline realizable savings.
3. Identify the structural vs execution gap.
4. Estimate probability of hitting target under current trajectory.

Be financially precise.`,
  },
  {
    id: 'p3',
    category: 'executive',
    label: 'Is our margin structurally weak or executionally weak?',
    promptText: `Is our margin structurally weak or executionally weak?

Evaluate whether our margin challenge is due to:

- Structural cost concentration
- Rising risk acceleration
- Utilization inefficiency
- Execution shortfall in pipeline

Rank these drivers and explain which is most critical.`,
  },
  {
    id: 'p4',
    category: 'opportunity',
    label: 'Is our opportunity pipeline strong enough?',
    promptText: `Is our opportunity pipeline strong enough?

Using:
- Identified: $130M
- Addressable: $108M
- Realizable: $78M
- Realized: $35M
- Gap: $43M

Assess:

1. Conversion efficiency (identified → realized)
2. Realization credibility
3. Savings velocity required
4. Risk-adjusted savings outlook

Conclude whether pipeline is strong, moderate, or weak.`,
  },
  {
    id: 'p5',
    category: 'opportunity',
    label: 'What is our execution bottleneck?',
    promptText: `What is our execution bottleneck?

Evaluate opportunity funnel:

- % identified becoming addressable
- % addressable becoming realizable
- % realizable becoming realized

Identify:

1. Primary leakage point
2. Estimated financial impact of leakage
3. Recommended corrective action`,
  },
  {
    id: 'p6',
    category: 'opportunity',
    label: 'What happens if realization drops 15%?',
    promptText: `What happens if realization drops 15%?

Stress test the pipeline assuming:

- 15% lower realization
- 2-month delay in execution

Recalculate:

- Total realized savings
- Revised MLR
- Revised operating margin
- Updated required savings gap

Provide downside risk summary.`,
  },
  {
    id: 'p7',
    category: 'provider',
    label: 'Which utilization metric is hurting us most?',
    promptText: `Which utilization metric is hurting us most?

Using:
- ED visits per 1,000
- Admissions per 1,000
- 30-day readmission rate
- Average length of stay

Rank their financial impact on MLR.

Estimate:

1. Avoidable portion
2. Savings potential per metric
3. Which lever moves margin fastest`,
  },
  {
    id: 'p8',
    category: 'financial',
    label: 'Is inpatient spend structurally high?',
    promptText: `Is inpatient spend structurally high?

Using cost distribution:

- Inpatient 35%
- Outpatient 25%
- Professional 16%
- Pharmacy 11%
- Emergency 7%

Evaluate:

1. Whether inpatient share is excessive
2. Portion likely preventable
3. Structural vs behavioral drivers
4. Recommended focus area`,
  },
  {
    id: 'p9',
    category: 'provider',
    label: 'Are we overexposed to high-cost members?',
    promptText: `Are we overexposed to high-cost members?

Using total cost and member count:

Estimate:

1. High-cost concentration ratio
2. Volatility risk
3. Sensitivity of MLR to top 1% cost changes
4. Whether reinsurance or precision care is required`,
  },
  {
    id: 'p10',
    category: 'executive',
    label: 'What is our 12-month outlook?',
    promptText: `What is our 12-month outlook?

Using 12-month rolling MLR and projected trend:

1. Estimate next 4-quarter MLR
2. Forecast PMPM growth
3. Identify structural inflection points
4. Estimate required acceleration in savings

Provide forecast confidence level.`,
  },
  {
    id: 'p11',
    category: 'financial',
    label: 'Are we trending in the right direction?',
    promptText: `Are we trending in the right direction?

Analyze trend lines for:

- MLR
- PMPM
- Revenue growth
- Cost growth

Assess:

1. Directionality
2. Divergence between revenue and cost
3. Margin compression risk`,
  },
  {
    id: 'p12',
    category: 'executive',
    label: 'What is our biggest financial risk?',
    promptText: `What is our biggest financial risk?

Identify the single largest financial risk based on:

- MLR above target
- Cost growth
- Pipeline gap
- Utilization metrics

Quantify exposure and mitigation urgency.`,
  },
  {
    id: 'p13',
    category: 'opportunity',
    label: 'Where should we deploy capital next?',
    promptText: `Where should we deploy capital next?

Given required savings of $168.3M:

Recommend allocation strategy across:

- Care management
- Network contracting
- VBC expansion
- Pharmacy controls
- Administrative efficiency

Rank by expected ROI and speed to impact.`,
  },
  {
    id: 'p14',
    category: 'financial',
    label: 'What if inpatient cost grows 5%?',
    promptText: `What if inpatient cost grows 5%?

Simulate 5% inpatient growth.

Recalculate:

- Total cost
- MLR
- Operating margin
- Required savings to hit 85%

Provide mitigation plan.`,
  },
  {
    id: 'p15',
    category: 'financial',
    label: 'What if revenue grows slower than expected?',
    promptText: `What if revenue grows slower than expected?

Assume premium growth slows to 1%.

Recalculate:

- Margin impact
- MLR
- Required savings
- Risk exposure

Assess defensive strategy.`,
  },
  {
    id: 'p16',
    category: 'executive',
    label: 'Summarize our financial story for the board.',
    promptText: `Summarize our financial story for the board.

Create a board-ready summary including:

- Current MLR vs target
- Operating margin
- Pipeline strength
- Cost structure
- Utilization risk
- Required savings
- Strategic plan

Use plain, non-technical language.`,
  },
  {
    id: 'p17',
    category: 'executive',
    label: 'What is the single message leadership must hear?',
    promptText: `What is the single message leadership must hear?

If you had 60 seconds with the CEO:

1. State current financial position.
2. State biggest structural risk.
3. State most urgent action required.
4. State probability of hitting 85% MLR.

Be direct and data-driven.`,
  },
  {
    id: 'p18',
    category: 'provider',
    label: 'Assess High-Cost Concentration Risk',
    promptText: `Assess High-Cost Concentration Risk

You are a healthcare payer CFO advisor.

Using current total members and total medical cost:

1. Calculate the High-Cost Concentration Ratio for:
   - Top 1% of members
   - Top 5% of members
   - Top 10% of members

2. Estimate:
   - % of total medical spend driven by each cohort
   - Average PMPM of each cohort vs plan average

3. Assess:
   - Whether cost structure is highly concentrated or broadly distributed
   - Volatility risk to MLR if top 1% costs increase by 10%
   - Margin sensitivity to deterioration in top 5%

4. Identify:
   - How much of concentrated spend is likely modifiable
   - Whether focus should be precision (high-cost management) or population-wide strategy

Provide:
- Concentration summary
- Volatility risk rating (Low / Medium / High)
- Recommended strategic focus
- Executive takeaway (3–4 sentences)`,
  },
];
