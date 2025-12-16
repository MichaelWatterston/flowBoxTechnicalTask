import { SearchIcon } from '../ui/Icons';
import { Button } from '../ui/Button';
import { UI_MESSAGES } from '../../constants/messages';

interface SearchFormProps {
  onSearch?: (hashtag: string) => void;
  loading?: boolean;
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const hashtag = formData.get('hashtag') as string;
    if (hashtag?.trim() && onSearch) {
      onSearch(hashtag.trim());
    }
  };
  
  return (
    <form className="search-form" onSubmit={handleSearchSubmit}>
      <input
        type="text"
        name="hashtag"
        className="search-form__input input"
        placeholder={UI_MESSAGES.searchPlaceholder}
        disabled={loading}
      />
      <Button 
        type="submit" 
        className="btn search-form__button" 
        disabled={loading}
        onClick={() => {}}
      >
        <SearchIcon />
        {UI_MESSAGES.searchButton}
      </Button>
    </form>
  );
}
