// Segmentation-specific prompt item type (compatible with PromptItem but with flexible category)
export interface SegmentationPromptItem {
  id: string;
  category: string;
  label: string;
  promptText: string;
}

// Segmentation-specific prompt categories
export const SEGMENTATION_PROMPT_CATEGORIES = {
  segmentAnalysis: 'Segment Analysis',
  populationInsights: 'Population Insights',
  riskAssessment: 'Risk Assessment',
  interventionOpportunities: 'Intervention Opportunities',
} as const;

// Segmentation prompts - ready to be populated
export const SEGMENTATION_PROMPTS: SegmentationPromptItem[] = [
  {
    id: 'seg-p1',
    category: 'riskAssessment',
    label: 'What is the overall risk posture of our population?',
    promptText: `What is the overall risk posture of our population?

Using the current segmentation dashboard:

1. Interpret total members analyzed, rising risk members, and SDOH impacted population.
2. Assess whether the risk distribution (Low / Medium / High / Very High) is healthy.
3. Identify whether cost concentration is driven by high-risk tiers or broad utilization.
4. Estimate near-term MLR pressure based on current distribution.

Provide:
- 3 key risk insights
- 2 near-term financial concerns
- 2 proactive actions`,
  },
  {
    id: 'seg-p2',
    category: 'riskAssessment',
    label: 'Are rising-risk members our biggest future MLR threat?',
    promptText: `Are rising-risk members our biggest future MLR threat?

Analyze the rising risk member population (150,155 members, 23% of population).

Explain:
- How this compares to industry benchmarks
- Whether this signals acceleration into high-risk tiers
- The financial exposure over the next 6–12 months
- Whether this requires immediate intervention

Provide a clear urgency rating: Low / Medium / High.`,
  },
  {
    id: 'seg-p3',
    category: 'populationInsights',
    label: 'What does the SDOH exposure imply for cost control?',
    promptText: `What does the SDOH exposure imply for cost control?

Evaluate the SDOH impacted population (332,952 members; 51%).

Explain:
- How SDOH likely affects ED utilization and admissions
- Whether current utilization metrics reflect SDOH-driven patterns
- What type of interventions would be required
- Whether this is a structural or operational issue

Provide financial and strategic implications.`,
  },
  {
    id: 'seg-p4',
    category: 'interventionOpportunities',
    label: 'Are our admission and ED rates acceptable?',
    promptText: `Are our admission and ED rates acceptable?

Using current utilization metrics:

Admissions / 1k: 78
ED Visits / 1k: 385
Readmission Rate: 14.2%
Average LOS: 4.3

1. Benchmark these metrics conceptually against expected norms.
2. Identify which metric is the largest cost driver.
3. Estimate where avoidable utilization likely exists.
4. Recommend 3 interventions ranked by speed to impact.

Focus on MLR implications.`,
  },
  {
    id: 'seg-p5',
    category: 'interventionOpportunities',
    label: 'Break down total cost across service categories.',
    promptText: `Break down total cost across service categories.

Using the cost distribution by service category:

Inpatient: 38%
Outpatient: 28%
Professional: 18%
Pharmacy: 12%
Emergency: 8%
Other: 6%

1. Identify which category presents the highest leverage.
2. Distinguish structural vs preventable cost.
3. Estimate what portion of inpatient and emergency spend is realistically reducible.
4. Identify whether pharmacy spend is defensive or escalating.

Provide strategic cost levers.`,
  },
  {
    id: 'seg-p6',
    category: 'riskAssessment',
    label: 'Where is the cost concentration across risk tiers?',
    promptText: `Where is the cost concentration across risk tiers?

Using PMPM across risk categories:

Low Risk: $177
Medium Risk: $354
High Risk: $531
Very High Risk: $707

1. Analyze cost gradient across tiers.
2. Identify which tier has the highest MLR leverage.
3. Explain whether focusing on high-risk or rising-risk members yields better ROI.
4. Recommend prioritization strategy.

Be explicit about trade-offs.`,
  },
  {
    id: 'seg-p7',
    category: 'segmentAnalysis',
    label: 'Is "Uncontrolled Diabetics with Comorbidities" a top priority?',
    promptText: `Is "Uncontrolled Diabetics with Comorbidities" a top priority?

Analyze the segment:

Members: 12,450
Total Cost: $276.4M
Cluster PMPM vs Plan PMPM: $1,850 vs $336
Est. Net Savings: $4.5M
Priority: High
Confidence: 88%

1. Validate whether this opportunity is financially material.
2. Explain primary drivers of excess cost.
3. Assess preventability.
4. Estimate realistic MLR improvement.
5. Confirm whether priority should remain High.

Provide a go/no-go recommendation.`,
  },
  {
    id: 'seg-p8',
    category: 'segmentAnalysis',
    label: 'Are High Utilizers (ER Frequent Flyers) a fast MLR win?',
    promptText: `Are High Utilizers (ER Frequent Flyers) a fast MLR win?

Segment:

Members: 3,200
Total Cost: $111.4M
Cluster PMPM vs Plan PMPM: $2,900 vs $336
Est. Net Savings: $2.8M
Confidence: 92%

1. Explain why ED behavior is driving cost.
2. Quantify avoidable portion.
3. Identify which LOB likely dominates this segment.
4. Estimate time-to-impact.

Provide a 90-day action plan summary.`,
  },
  {
    id: 'seg-p9',
    category: 'segmentAnalysis',
    label: 'Evaluate the Post-Acute Care Gaps segment.',
    promptText: `Evaluate the Post-Acute Care Gaps segment.

Segment:

Members: 4,500
Total Cost: $113.4M
Cluster PMPM vs Plan PMPM: $2,100 vs $336
Est. Net Savings: $1.8M
Confidence: 91%

1. Explain why post-discharge gaps create cost spikes.
2. Assess readmission linkage.
3. Estimate quality upside.
4. Evaluate operational feasibility.

Recommend whether to escalate immediately.`,
  },
  {
    id: 'seg-p10',
    category: 'riskAssessment',
    label: 'Is Rising Risk – Pre-CKD a long-term or immediate lever?',
    promptText: `Is Rising Risk – Pre-CKD a long-term or immediate lever?

Segment:

Members: 25,000
Total Cost: $255.0M
Cluster PMPM vs Plan PMPM: $850 vs $336
Est. Net Savings: $1.2M
Confidence: 79%

1. Classify as rising-risk or high-risk.
2. Estimate cost trajectory if no action is taken.
3. Explain long-term MLR impact.
4. Recommend proactive interventions.

Clarify whether this is a defensive or offensive strategy.`,
  },
  {
    id: 'seg-p11',
    category: 'segmentAnalysis',
    label: 'Should Maternity – High Risk be deprioritized?',
    promptText: `Should Maternity – High Risk be deprioritized?

Segment:

Members: 1,500
Total Cost: $57.6M
Cluster PMPM vs Plan PMPM: $3,200 vs $336
Est. Net Savings: $950K
Priority: Low
Confidence: 85%

1. Explain why priority is low despite high PMPM.
2. Evaluate preventability.
3. Assess quality and regulatory sensitivity.
4. Confirm whether deprioritization is appropriate.`,
  },
  {
    id: 'seg-p12',
    category: 'interventionOpportunities',
    label: 'Rank all segments by speed to MLR impact.',
    promptText: `Rank all segments by speed to MLR impact.

Rank the AI identified segments based on:

- Realizable savings
- Confidence
- Time to impact
- Operational feasibility
- Quality risk

Provide:
1. Immediate (0–3 months)
2. Medium-term (3–9 months)
3. Long-term structural plays`,
  },
  {
    id: 'seg-p13',
    category: 'interventionOpportunities',
    label: 'Which segment should go into VBC expansion?',
    promptText: `Which segment should go into VBC expansion?

Evaluate which segment(s):

- Have strong provider attribution
- Show cost controllability
- Have predictable utilization patterns
- Would benefit from shared savings contracts
Recommend VBC model alignment.`,
  },
  {
    id: 'seg-p14',
    category: 'interventionOpportunities',
    label: 'If I could only fund two initiatives, which should they be?',
    promptText: `If I could only fund two initiatives, which should they be?

Assume limited budget and operational capacity.

Select the top 2 segments that:
- Maximize margin impact
- Minimize quality risk
- Have highest realization probability

Justify selection with financial math.`,
  },
  {
    id: 'seg-p15',
    category: 'populationInsights',
    label: 'What is the biggest blind spot in this segmentation dashboard?',
    promptText: `What is the biggest blind spot in this segmentation dashboard?

Critically evaluate this segmentation view.

Identify:
- Missing signals
- Hidden risk not captured
- Potential overestimation of savings
- Execution bottlenecks

Provide executive caution notes.`,
  },
];

export const SEGMENTATION_CATEGORY_ORDER: (keyof typeof SEGMENTATION_PROMPT_CATEGORIES)[] = [
  'segmentAnalysis',
  'populationInsights',
  'riskAssessment',
  'interventionOpportunities',
];
