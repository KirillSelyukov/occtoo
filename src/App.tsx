import { useState, useEffect } from "react";
import InfiniteLoader from "./components/InfiniteLoader";

const loadMoreData = async (page: number, limit: number = 10) => {
  const response = await fetch(
    `https://picsum.photos/v2/list?page=${page}&limit=${limit}`
  );
  const newData = await response.json();
  return newData;
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    loadMoreData(page).then((newData) => {
      setItems((prevData) => [...prevData, ...newData]);
      setIsLoading(false);
      if (newData.length === 0) {
        setHasMore(false);
      }
    });
  }, [page]);

  return (
    <div className="App">
      {items.map((item, index) => (
        <div key={index}>
          <img
            src={`${item.download_url}`}
            alt={`Image ${item.id}`}
            // could use api instead of styling
            style={{ width: "50px", height: "50px" }}
          />
        </div>
      ))}

      <InfiniteLoader
        loadMore={async () => {
          setPage(page + 1);
        }}
        isLoading={isLoading}
        hasMore={hasMore}
        renderLoader={() => <p>Loading...</p>}
        renderItem={(item, index) => (
          <div key={index}>
            <img
              src={`${item.download_url}`}
              alt={`Image ${item.id}`}
              // could use api instead of styling
              style={{ width: "50px", height: "50px" }}
            />
          </div>
        )}
        items={items}
      />
    </div>
  );
}

export default App;
