/** Arrow-key navigation for a `role="tablist"`.
 *
 *  A tablist is a promise: ARIA's own pattern says the arrow keys move between tabs and Tab moves
 *  past the whole group, which is why assistive technology announces "tab, 2 of 3" and why a user
 *  reaches for the arrows. Three tablists on this site declared the role, marked aria-selected, and
 *  handled no keys at all, so the arrows did nothing. Found by design-tokens' verify_keyboard gate
 *  (WCAG 2.1.1), which reports it as "uses roving tabindex but ArrowDown/ArrowRight never move
 *  focus".
 *
 *  Attach to each tab, not to the container. The container must not be a tab stop under this
 *  pattern, and putting the handler on it made jsx-a11y ask for tabIndex on the tablist, which is
 *  the opposite of what ARIA wants. The handler finds its own group from the focused tab, so it
 *  cannot disagree with what is rendered:
 *
 *      <button role="tab" onKeyDown={tablistKeys} tabIndex={tabIndexFor(selected)}>
 *
 *  Home and End jump to the ends. The move is focus plus activation, matching the automatic
 *  activation pattern these tabs already use on click.
 */
export function tablistKeys(e: React.KeyboardEvent<HTMLElement>) {
  const KEYS = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
  if (!KEYS.includes(e.key)) return;

  const group = e.currentTarget.closest<HTMLElement>('[role="tablist"]');
  if (!group) return;
  const tabs = [...group.querySelectorAll<HTMLElement>('[role="tab"]')]
    .filter(t => !t.hasAttribute('disabled'));
  if (tabs.length < 2) return;

  const here = tabs.findIndex(t => t === document.activeElement || t.contains(document.activeElement));
  const from = here === -1 ? tabs.findIndex(t => t.getAttribute('aria-selected') === 'true') : here;
  const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;

  let next: number;
  if (e.key === 'Home') next = 0;
  else if (e.key === 'End') next = tabs.length - 1;
  else next = ((from === -1 ? 0 : from) + step + tabs.length) % tabs.length;

  e.preventDefault();
  tabs[next].focus();
  tabs[next].click();
}

/** Roving tabindex: the selected tab is the group's single tab stop, per the same pattern. */
export function tabIndexFor(selected: boolean): 0 | -1 {
  return selected ? 0 : -1;
}
