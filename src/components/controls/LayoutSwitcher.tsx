import type { LayoutType } from '../../types/layout';
import { GridIcon, CarouselIcon, ListIcon } from '../ui/Icons';
import { UI_MESSAGES } from '../../constants/messages';
import { Button } from '../ui/Button';

interface LayoutSwitcherProps {
  layout: LayoutType;
  onLayoutChange?: (layout: LayoutType) => void;
}

const layoutOptions = [
  { type: 'grid' as const, icon: GridIcon, message: UI_MESSAGES.gridView },
  { type: 'carousel' as const, icon: CarouselIcon, message: UI_MESSAGES.carouselView },
  { type: 'list' as const, icon: ListIcon, message: UI_MESSAGES.listView }
];

export function LayoutSwitcher({ layout, onLayoutChange }: LayoutSwitcherProps) {
  return (
    <div className="layout-switcher" role="group" aria-label="Layout Switcher">
      {layoutOptions.map(({ type, icon: Icon, message }) => (
        <Button
          key={type}
          className={`layout-switcher__button ${layout === type ? 'layout-switcher__button--active' : ''}`}
          active={layout === type}
          onClick={() => onLayoutChange?.(type)}
          title={message}
          aria-label={message}
          aria-pressed={layout === type}
        >
          <Icon />
        </Button>
      ))}
    </div>
  );
}
