import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  ReferenceArea,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getDashboardMetrics } from '../api/client';
import type { DashboardMetrics } from '../types/dashboard';
import styles from './Dashboard.module.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PLAN_NAME = 'Presbyterian Health Plan';

const TEAL = '#0d9488';
const PURPLE = '#7c3aed';
const ORANGE = '#ea580c';
const BLUE = '#38bdf8';

export function Dashboard() {
  const filterState = useSelector((s: RootState) => s.dashboard.filters);
  const queryParams = useMemo(() => ({
    lob: filterState.lob || undefined,
    timePeriod: filterState.timePeriod || undefined,
    geography: filterState.geography || undefined,
    segment: filterState.segment || undefined,
  }), [filterState]);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboardMetrics', queryParams],
    queryFn: () => getDashboardMetrics(queryParams as Record<string, string>),
  });

  const chartSeries = useMemo(() => {
    const emptyProjections: Array<{ quarter: number; mlr: number; pmpm: number }> = [];
    if (!data) return { trendWithForecast: [] as Array<{ month: string; mlr: number; pmpm: number; isProjected: boolean }>, hasFourQuarters: false, projections: emptyProjections };
    const m = data as DashboardMetrics;
    const trend = m.trend ?? {
      rolling12MonthMlr: [],
      rolling12MonthPmpm: [],
      predictiveForecast: { mlrNextQuarter: 90, pmpmNextQuarter: 336 },
    };
    const rollingMlr = trend.rolling12MonthMlr ?? [];
    const rollingPmpm = trend.rolling12MonthPmpm ?? [];
    const lineData = rollingMlr.length > 0
      ? rollingMlr.map((v, i) => ({
          month: MONTHS[i] ?? `M${i + 1}`,
          mlr: v,
          pmpm: rollingPmpm[i] ?? 0,
          isProjected: false,
        }))
      : [];
    const forecast = trend.predictiveForecast ?? { mlrNextQuarter: 90, pmpmNextQuarter: 336 };
    const rawQuarters = Array.isArray(forecast.quarters) ? forecast.quarters : [];
    const projections = rawQuarters.length > 0
      ? rawQuarters
      : [{ quarter: 1, mlr: forecast.mlrNextQuarter, pmpm: forecast.pmpmNextQuarter }];
    const forecastPoints = projections.map(({ quarter, mlr, pmpm }) => ({
      month: `Next Q${quarter}`,
      mlr,
      pmpm,
      isProjected: true,
    }));
    const trendWithForecast = lineData.length > 0 ? [...lineData, ...forecastPoints] : forecastPoints;
    return { trendWithForecast, hasFourQuarters: projections.length >= 4, projections };
  }, [data]);

  if (isLoading) return <div className={styles.loading}>Loading dashboard…</div>;
  if (isError) return <div className={styles.error}>Error: {(error as Error).message}</div>;
  if (!data) return <div className={styles.error}>No dashboard data available. Check that the backend is running.</div>;

  const m = data as DashboardMetrics;
  const org = m.organizational;
  const opp = m.opportunity;
  const costDist = m.costDistribution || [];
  const { trendWithForecast, hasFourQuarters } = chartSeries;

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.pageTitle}>
        Key performance metrics and trends for {PLAN_NAME}
      </h1>

      <section className={styles.kpiSection}>
        <div className={styles.kpiGrid}>
          <KpiCard
            icon="members"
            label="TOTAL MEMBERS"
            value={org.totalMembers.toLocaleString()}
            sub="Enrolled population"
          />
          <KpiCard
            icon="revenue"
            label="TOTAL REVENUE"
            value={`$${(org.totalRevenue / 1e9).toFixed(2)}B`}
            sub="Premium revenue"
            changePercent={org.revenueChangePercent}
          />
          <KpiCard
            icon="cost"
            label="TOTAL COST"
            value={`$${(org.totalMedicalCost / 1e9).toFixed(2)}B`}
            sub="Annual spend"
            changePercent={org.costChangePercent}
          />
          <KpiCard
            icon="pmpm"
            label="AVERAGE PMPM"
            value={`$${org.pmpm}`}
            sub="Per member per month"
            changePercent={org.pmpmChangePercent}
          />
          <KpiCard
            icon="mlr"
            label="MEDICAL LOSS RATIO"
            value={`${org.mlr}%`}
            sub={org.mlrAboveTarget != null && org.mlrTarget != null
              ? `${org.mlrAboveTarget} pts above Target: ${org.mlrTarget}%`
              : 'Target: 85%'}
            subHighlight={!!(org.mlrAboveTarget != null && org.mlrAboveTarget > 0)}
          />
          {org.operatingMargin != null && (
            <KpiCard
              icon="margin"
              label="OPERATING MARGIN"
              value={`${org.operatingMargin}%`}
              sub=""
            />
          )}
          {org.requiredSavingsToHitTargetMlr != null && (
            <KpiCard
              icon="savings"
              label="REQUIRED SAVINGS TO HIT TARGET MLR"
              value={`$${(org.requiredSavingsToHitTargetMlr / 1e6).toFixed(1)}M`}
              sub="Additional savings to reach 85% MLR target"
            />
          )}
        </div>
      </section>

      <section className={styles.utilizationSection}>
        <div className={`${styles.utilizationCard} ${styles.opportunityPipelineCard}`}>
          <h3 className={`${styles.utilizationTitle} ${styles.opportunityPipelineTitle}`}>Opportunity Pipeline</h3>
          <div className={`${styles.utilizationGrid} ${styles.opportunityPipelineGrid}`}>
            <div className={styles.utilizationItem}>
              <div className={styles.utilizationValue} style={{ color: TEAL }}>
                ${(opp.totalIdentified / 1e6).toFixed(0)}M
              </div>
              <div className={styles.utilizationLabel}>
                Total Identified
                <span
                  className={styles.utilizationInfoIcon}
                  title="Total cost savings or revenue opportunities identified through analysis (e.g., AI-driven mining, clinical audits, utilization reviews). This is the full pipeline of potential opportunities before any filters."
                  aria-label="Info: Total Identified"
                >
                  i
                </span>
              </div>
            </div>
            <div className={styles.utilizationItem}>
              <div className={styles.utilizationValue} style={{ color: BLUE }}>
                ${(opp.addressable / 1e6).toFixed(0)}M
              </div>
              <div className={styles.utilizationLabel}>
                Addressable ({((opp.addressable / opp.totalIdentified) * 100).toFixed(0)}%)
                <span
                  className={styles.utilizationInfoIcon}
                  title="The portion of identified opportunities that fall within your scope to address—e.g., within your plan's membership, geography, or intervention capabilities. Excludes opportunities outside your control."
                  aria-label="Info: Addressable"
                >
                  i
                </span>
              </div>
            </div>
            <div className={styles.utilizationItem}>
              <div className={styles.utilizationValue} style={{ color: PURPLE }}>
                ${(opp.realizable / 1e6).toFixed(0)}M
              </div>
              <div className={styles.utilizationLabel}>
                Realizable ({((opp.realizable / opp.totalIdentified) * 100).toFixed(0)}%)
                <span
                  className={styles.utilizationInfoIcon}
                  title="The portion of addressable opportunities that can realistically be captured based on intervention effectiveness, implementation feasibility, and historical capture rates. Accounts for operational constraints."
                  aria-label="Info: Realizable"
                >
                  i
                </span>
              </div>
            </div>
            <div className={styles.utilizationItem}>
              <div className={styles.utilizationValue} style={{ color: ORANGE }}>
                ${(opp.realized / 1e6).toFixed(0)}M
              </div>
              <div className={styles.utilizationLabel}>
                Realized ({((opp.realized / opp.totalIdentified) * 100).toFixed(0)}%)
                <span
                  className={styles.utilizationInfoIcon}
                  title="Savings or revenue that has been successfully captured and verified—opportunities that have been executed, tracked, and realized through implemented interventions."
                  aria-label="Info: Realized"
                >
                  i
                </span>
              </div>
            </div>
            {opp.realizable > opp.realized && (
              <div className={styles.utilizationItem}>
                <div className={styles.utilizationValue} style={{ color: '#dc2626' }}>
                  ${((opp.realizable - opp.realized) / 1e6).toFixed(0)}M
                </div>
                <div className={styles.utilizationLabel}>
                  Gap ({(((opp.realizable - opp.realized) / opp.realizable) * 100).toFixed(0)}%)
                  <span
                    className={styles.utilizationInfoIcon}
                    title="The difference between Realizable and Realized opportunities—potential savings that have not yet been captured. The gap% is expressed as a percentage of Realizable."
                    aria-label="Info: Gap"
                  >
                    i
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className={styles.utilizationSection}>
        <div className={`${styles.utilizationCard} ${styles.opportunityPipelineCard}`}>
          <h3 className={`${styles.utilizationTitle} ${styles.opportunityPipelineTitle}`}>Utilization Metrics</h3>
          <div className={`${styles.utilizationGrid} ${styles.opportunityPipelineGrid}`}>
            <div className={styles.utilizationItem}>
              <div className={styles.utilizationValue} style={{ color: TEAL }}>
                {m.costUtilization.edVisitsPer1000}
              </div>
              <div className={styles.utilizationLabel}>ED Visits per 1,000</div>
            </div>
            <div className={styles.utilizationItem}>
              <div className={styles.utilizationValue} style={{ color: PURPLE }}>
                {m.costUtilization.admissionsPer1000}
              </div>
              <div className={styles.utilizationLabel}>Admissions per 1,000</div>
            </div>
            <div className={styles.utilizationItem}>
              <div className={styles.utilizationValue} style={{ color: ORANGE }}>
                {m.costUtilization.readmissionRate}%
              </div>
              <div className={styles.utilizationLabel}>30-Day Readmission Rate</div>
            </div>
            <div className={styles.utilizationItem}>
              <div className={styles.utilizationValue} style={{ color: BLUE }}>
                {m.costUtilization.avgLengthOfStay}
              </div>
              <div className={styles.utilizationLabel}>Average Length of Stay</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>MLR & PMPM Trends</h2>
          <p className={styles.chartSubtitle}>12-month rolling performance + next 4 quarters projected</p>
          <div className={styles.chart}>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={trendWithForecast} margin={{ top: 28, right: 8, left: 0, bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} interval={0} angle={-35} textAnchor="end" />
                <YAxis yAxisId="left" tick={{ fill: '#6b7280', fontSize: 12 }} domain={[85, 92]} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, color: '#111827' }} />
                <Legend />
                {hasFourQuarters && (
                  <>
                    <ReferenceLine yAxisId="left" x="Next Q1" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1} />
                    <ReferenceArea x1="Next Q1" x2="Next Q4" y1={85} y2={92} yAxisId="left" fill="rgba(14, 165, 233, 0.08)" label={{ value: 'Forecast', position: 'top', fill: '#64748b', fontSize: 10 }} />
                  </>
                )}
                <Line yAxisId="left" type="monotone" dataKey="mlr" name="MLR %" stroke={TEAL} strokeWidth={2} dot={{ fill: TEAL }} connectNulls />
                <Line yAxisId="right" type="monotone" dataKey="pmpm" name="PMPM Cost" stroke={PURPLE} strokeWidth={2} dot={{ fill: PURPLE }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Cost Distribution</h2>
          <p className={styles.chartSubtitle}>By service category</p>
          <div className={styles.chartDonut}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart margin={{ top: 16, right: 80, bottom: 60, left: 80 }}>
                <Pie
                  data={costDist}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={1}
                  label={({ name, percent, cx, cy, midAngle, outerRadius }) => {
                    if (percent == null) return null;
                    const RADIAN = Math.PI / 180;
                    const radius = outerRadius + 20;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#6b7280"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        fontSize={11}
                      >
                        {`${name} ${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                  labelLine={{ strokeWidth: 1, stroke: '#e5e7eb' }}
                >
                  {costDist.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, 'Share']} contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
                <Legend 
                  verticalAlign="bottom"
                  height={36}
                  iconSize={10}
                  fontSize={10}
                  wrapperStyle={{ paddingTop: '8px' }}
                  formatter={(value) => <span style={{ fontSize: '10px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  sub,
  changePercent,
  subHighlight,
}: {
  icon: 'members' | 'cost' | 'revenue' | 'pmpm' | 'mlr' | 'opportunities' | 'margin' | 'savings';
  label: string;
  value: string;
  sub: string;
  changePercent?: number;
  subHighlight?: boolean;
}) {
  const iconColor = icon === 'members' ? TEAL : icon === 'cost' ? TEAL : icon === 'revenue' ? '#2563eb' : icon === 'pmpm' ? PURPLE : icon === 'mlr' ? ORANGE : icon === 'opportunities' ? BLUE : icon === 'margin' ? '#059669' : TEAL;
  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiCardHeader}>
        <span className={styles.kpiIcon} style={{ background: iconColor }} aria-hidden>
          {icon === 'members' && '👥'}
          {icon === 'cost' && '💰'}
          {icon === 'revenue' && '🏦'}
          {icon === 'pmpm' && '📊'}
          {icon === 'mlr' && '📈'}
          {icon === 'opportunities' && '💡'}
          {icon === 'margin' && '📉'}
          {icon === 'savings' && '🎯'}
        </span>
        <span className={styles.kpiInfo} title="More information">i</span>
      </div>
      <div className={styles.kpiLabel}>{label}</div>
      <div className={styles.kpiValue}>{value}</div>
      <div className={styles.kpiSub}>
        {changePercent != null && (
          <span className={changePercent >= 0 ? styles.trendUp : styles.trendDown}>
            {changePercent >= 0 ? '↑' : '↓'} {Math.abs(changePercent)}%
          </span>
        )}{' '}
        <span className={subHighlight ? styles.subHighlight : undefined}>{sub}</span>
      </div>
    </div>
  );
}
