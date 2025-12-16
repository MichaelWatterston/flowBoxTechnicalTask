import { memo } from 'react';
import type { LayoutType } from '../../types/layout';
import '../../styles/GridView.css';
import '../../styles/controls.css';
import DataToggle from './DataToggle';
import SearchForm from './SearchForm';
import { LayoutSwitcher } from './LayoutSwitcher';


interface GridControlPanelProps {
  onSearch?: (hashtag: string) => void;
  loading?: boolean;
  layout?: LayoutType;
  onLayoutChange?: (layout: LayoutType) => void;
  useDummyData?: boolean;
  onDataToggle?: (useDummy: boolean) => void;
}

const GridControlPanel = memo(function GridControlPanel({
  onSearch,
  loading,
  layout = 'grid',
  onLayoutChange,
  useDummyData = true,
  onDataToggle
}: GridControlPanelProps) {
  return (
    <div className="grid-view__item grid-view__item--search">
      <img src="/assets/logo2.jpg" alt="FlowBox Logo" className="grid-view__logo" />
      <DataToggle useDummyData={useDummyData} onDataToggle={onDataToggle} />
      <SearchForm onSearch={onSearch} loading={loading} />
      <LayoutSwitcher layout={layout} onLayoutChange={onLayoutChange} />
    </div>
  );
});

export default GridControlPanel;
