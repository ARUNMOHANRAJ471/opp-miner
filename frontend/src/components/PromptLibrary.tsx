import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { executePrompt } from '../api/client';
import { startExecution, executionSuccess, executionError } from '../store/promptSlice';
import { setPromptPanelOpen } from '../store/dashboardSlice';
import { PROMPTS, PROMPT_CATEGORIES } from '../types/dashboard';
import styles from './PromptLibrary.module.css';

const CATEGORY_ORDER: (keyof typeof PROMPT_CATEGORIES)[] = ['financial', 'opportunity', 'provider', 'executive'];

export interface PromptLibraryItem {
  id: string;
  category: string;
  label: string;
  promptText: string;
}

export interface PromptLibraryProps {
  prompts?: PromptLibraryItem[];
  categories?: Record<string, string>;
  categoryOrder?: string[];
}

export function PromptLibrary({ 
  prompts = PROMPTS, 
  categories = PROMPT_CATEGORIES,
  categoryOrder = CATEGORY_ORDER 
}: PromptLibraryProps = {}) {
  const dispatch = useDispatch();
  const mutation = useMutation({
    mutationFn: (payload: { promptId: string; promptText: string }) =>
      executePrompt({ promptId: payload.promptId, promptText: payload.promptText }),
    onMutate: (vars) => {
      dispatch(startExecution({ promptId: vars.promptId, promptText: vars.promptText }));
    },
    onSuccess: (data) => {
      dispatch(executionSuccess(data.response ?? ''));
    },
    onError: (err: Error) => {
      dispatch(executionError(err.message));
    },
  });

  const runPrompt = (item: PromptLibraryItem) => {
    mutation.mutate({ promptId: item.id, promptText: item.promptText });
  };

  const byCategory = categoryOrder.map((cat) => ({
    category: cat,
    label: categories[cat] || cat,
    prompts: prompts.filter((p) => p.category === cat),
  })).filter(({ prompts }) => prompts.length > 0);

  const closePanel = () => dispatch(setPromptPanelOpen(false));

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.panelTitle}>Prompt Library</h2>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={closePanel}
          aria-label="Close prompt library"
          title="Close"
        >
          ×
        </button>
      </div>
      <p className={styles.hint}>Click a prompt to run it. Results appear in the execution panel below.</p>
      {byCategory.length > 0 ? (
        byCategory.map(({ category, label, prompts }) => (
          <div key={category} className={styles.category}>
            <h3 className={styles.categoryTitle}>{label}</h3>
            <ul className={styles.list}>
              {prompts.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={styles.promptBtn}
                    onClick={() => runPrompt(item)}
                    disabled={mutation.isPending}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <div className={styles.emptyState}>
          <p>No prompts available. Prompts will be added here.</p>
        </div>
      )}
    </div>
  );
}
