import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { PromptLibrary } from '../components/PromptLibrary';
import { DashboardAskAI } from '../components/DashboardAskAI';
import {
  OPPORTUNITY_PROMPTS,
  OPPORTUNITY_PROMPT_CATEGORIES,
  OPPORTUNITY_CATEGORY_ORDER,
} from '../types/opportunityPrompts';
import { OpportunitiesListPage } from './OpportunitiesListPage';
import appStyles from '../App.module.css';

export function OpportunitiesPage() {
  const promptPanelOpen = useSelector((s: RootState) => s.dashboard.promptPanelOpen);

  return (
    <>
      <main className={appStyles.main}>
        <OpportunitiesListPage />
        {promptPanelOpen && (
          <aside className={appStyles.promptLibrary}>
            <PromptLibrary
              prompts={OPPORTUNITY_PROMPTS}
              categories={OPPORTUNITY_PROMPT_CATEGORIES}
              categoryOrder={OPPORTUNITY_CATEGORY_ORDER}
            />
          </aside>
        )}
      </main>
      <DashboardAskAI />
    </>
  );
}

