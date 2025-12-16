import { Button } from '../ui/Button';

interface DataToggleProps {
  useDummyData: boolean;
  onDataToggle?: (useDummy: boolean) => void;
}

const options = [
  { value: true, label: 'Dummy Data' },
  { value: false, label: 'Instagram API' }
] as const;

export default function DataToggle({ useDummyData, onDataToggle }: DataToggleProps) {
  return (
    <div className="data-toggle">
      {options.map(({ value, label }) => (
        <Button
          key={label}
          className={`data-toggle__button ${useDummyData === value ? 'data-toggle__button--active' : ''}`}
          active={useDummyData === value}
          onClick={() => onDataToggle?.(value)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
