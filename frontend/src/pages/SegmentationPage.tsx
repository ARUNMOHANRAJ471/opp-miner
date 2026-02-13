import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSegmentationFilters } from '../store/segmentationSlice';
import { FilterBar } from '../components/FilterBar';
import { PopulationMetrics } from '../components/Segmentation/PopulationMetrics';
import { SegmentsList } from '../components/Segmentation/SegmentsList';
import { PromptLibrary } from '../components/PromptLibrary';
import { DashboardAskAI } from '../components/DashboardAskAI';
import { 
  SEGMENTATION_PROMPTS, 
  SEGMENTATION_PROMPT_CATEGORIES, 
  SEGMENTATION_CATEGORY_ORDER 
} from '../types/segmentationPrompts';
import { RootState } from '../store';
import styles from './SegmentationPage.module.css';
import appStyles from '../App.module.css';

export const SegmentationPage: React.FC = () => {
  const dispatch = useDispatch();
  const dashboardFilters = useSelector((state: RootState) => state.dashboard.filters);
  const promptPanelOpen = useSelector((state: RootState) => state.dashboard.promptPanelOpen);

  useEffect(() => {
    dispatch(setSegmentationFilters({
      lob: dashboardFilters.lob,
      geography: dashboardFilters.geography,
      timePeriod: dashboardFilters.timePeriod
    }));
  }, [dispatch, dashboardFilters]);

  return (
    <>
      <FilterBar />
      <div className={styles.page}>
        <main className={appStyles.main}>
          <div className={styles.content}>
            <header className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>AI Segmentation</h1>
              <p className={styles.pageSubtitle}>Population & risk groups — explore AI-identified segments and metrics</p>
            </header>
            <div className={styles.metricsSection}>
              <PopulationMetrics />
            </div>
            <div className={styles.listSection}>
              <SegmentsList />
            </div>
          </div>
          {promptPanelOpen && (
            <aside className={appStyles.promptLibrary}>
              <PromptLibrary 
                prompts={SEGMENTATION_PROMPTS}
                categories={SEGMENTATION_PROMPT_CATEGORIES}
                categoryOrder={SEGMENTATION_CATEGORY_ORDER}
              />
            </aside>
          )}
        </main>
      </div>
      <DashboardAskAI />
    </>
  );
};
