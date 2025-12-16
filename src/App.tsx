import { useState, useMemo } from 'react';

// Types
import type { LayoutType } from './types/layout';

// Context & Data
import { useInstagram } from './context/InstagramContext';
import { dummyPosts } from './data/dummyPosts';
import { UI_MESSAGES } from './constants/messages';

// Components
import { GridControlPanel, CarouselView, PostList, GridView } from './components';

// Styles
import './styles/App.css';

// Layout component mapping
const LAYOUT_COMPONENTS = {
  list: PostList,
  grid: GridView,
  carousel: CarouselView,
} as const;

function App() {
  const { posts, loading, error, searchHashtag } = useInstagram();
  const [layout, setLayout] = useState<LayoutType>('grid');
  const [useDummyData, setUseDummyData] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  // Handle search - switch to real data and fetch
  const handleSearch = async (hashtag: string) => {
    setUseDummyData(false);
    setHasSearched(true);
    await searchHashtag(hashtag);
  };

  // Handle data toggle
  const handleDataToggle = (useDummy: boolean) => {
    setUseDummyData(useDummy);
    if (useDummy) {
      setHasSearched(false);
    }
  };

  // Memoize derived state
  const displayPosts = useMemo(
    () => (useDummyData ? dummyPosts : posts),
    [useDummyData, posts]
  );
  
  const isLoading = useDummyData ? false : loading;
  const displayError = useDummyData ? null : error;

  // Early returns for loading/error states
  if (isLoading) return <div className="status-message status-message--loading">{UI_MESSAGES.loading}</div>;
  if (displayError) return <div className="status-message status-message--error">{UI_MESSAGES.error(displayError)}</div>;
  
  // Show empty state when on API mode but haven't searched yet
  if (!useDummyData && !hasSearched) {
    return (
      <main>
        <div className="grid-view">
          <GridControlPanel
            onSearch={handleSearch}
            loading={isLoading}
            layout={layout}
            onLayoutChange={setLayout}
            useDummyData={useDummyData}
            onDataToggle={handleDataToggle}
          />
        </div>
      </main>
    );
  }
  
  if (displayPosts.length === 0) return <div className="status-message status-message--empty">{UI_MESSAGES.noPosts}</div>;

  const LayoutComponent = LAYOUT_COMPONENTS[layout];

  return (
    <main>
      <div className="grid-view">
        <GridControlPanel
          onSearch={handleSearch}
          loading={isLoading}
          layout={layout}
          onLayoutChange={setLayout}
          useDummyData={useDummyData}
          onDataToggle={handleDataToggle}
        />
        <LayoutComponent posts={displayPosts} />
      </div>
    </main>
  );
}

export default App;
