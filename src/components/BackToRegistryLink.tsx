import { PAGES } from '../config/pages.config';

export interface BackToRegistryLinkProps { onBack: () => void }

export function BackToRegistryLink({ onBack }: BackToRegistryLinkProps) {
  return <a className="back-link" href={PAGES.registry} onClick={event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onBack();
  }}>← К картотеке</a>;
}
