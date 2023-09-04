import React, { useEffect, useRef, useCallback } from "react";

interface InfiniteLoaderProps<T> {
  loadMore: () => Promise<void>;
  isLoading: boolean;
  hasMore: boolean;
  threshold?: number;
  renderLoader: () => React.ReactNode;
  renderItem: (item: T, index: number) => React.ReactNode;
  items: T[];
}

const InfiniteLoader = <T,>({
  loadMore,
  isLoading,
  hasMore,
  threshold = 0.5, // Increase the threshold for loading data(images) earlier
  renderLoader,
  renderItem,
  items,
}: InfiniteLoaderProps<T>) => {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoading && hasMore) {
        loadMore();
      }
    },
    [isLoading, hasMore, loadMore]
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "0px",
      threshold,
    });

    if (loaderRef.current) {
      observerRef.current.observe(loaderRef.current);
    }

    return () => {
      if (observerRef.current && loaderRef.current) {
        observerRef.current.unobserve(loaderRef.current);
      }
    };
  }, [handleIntersection, threshold]);

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>{renderItem(item, index)}</div>
      ))}
      <div ref={loaderRef}>
        {isLoading
          ? renderLoader()
          : hasMore
          ? "Scroll to load more"
          : "No more items to load"}
      </div>
    </div>
  );
};

export default InfiniteLoader;
