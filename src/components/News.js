import React, { useState, useEffect, useCallback } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export default function News({
  country = "us",
  category = "business",
  pageSize = 10,
  setProgress, // receive setProgress prop from App
}) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const apiKey = process.env.REACT_APP_API_URL;

  // 📰 Set document title dynamically
  useEffect(() => {
    document.title = `${category.charAt(0).toUpperCase() + category.slice(1)} - News`;
  }, [category]);

  // 🔹 Fetch first page only once
  const fetchInitialNews = useCallback(async () => {
    setProgress(20);
    setLoading(true);
    try {
      const newsUrl = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=1&pageSize=${pageSize}`;
      const proxyUrl = `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(newsUrl)}`;
      const response = await fetch(proxyUrl);
      setProgress(50);
      const parsedData = await response.json();

      setArticles(parsedData.articles || []);
      setTotalResults(parsedData.totalResults || 0);
      setProgress(100);
      setPage(1);
    } catch (error) {
      console.error("Initial fetch error:", error);
      setProgress(100);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [country, category, pageSize, apiKey, setProgress]);

  // 🧩 Run only when category or country changes
  useEffect(() => {
    fetchInitialNews();
  }, [fetchInitialNews]);

  // 🔁 Load More - Infinite Scroll
  const fetchMoreData = async () => {
    // ✅ Prevent unnecessary fetch when all articles are loaded
    if (articles.length >= totalResults) return;

    const nextPage = page + 1;
    setProgress(30);
    try {
      const newsUrl = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${nextPage}&pageSize=${pageSize}`;
      const proxyUrl = `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(newsUrl)}`;
      const response = await fetch(proxyUrl);
      setProgress(60);
      const parsedData = await response.json();

      setArticles((prevArticles) => [
        ...prevArticles,
        ...(parsedData.articles || []),
      ]);

      setPage(nextPage);

      // ✅ Keep old totalResults if new one is invalid
      if (parsedData.totalResults && parsedData.totalResults > 0) {
        setTotalResults(parsedData.totalResults);
      }

      setProgress(100);
    } catch (error) {
      console.error("Fetch more error:", error);
      setProgress(100);
    }
  };

  return (
    <div className="container my-3">
      <h2 className="mb-4 text-center" style={{ marginTop: "90px" }}>
        News - Top {category.charAt(0).toUpperCase() + category.slice(1)} Headlines
      </h2>

      {loading && <Spinner />}

      {!loading && (
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length < totalResults && !loading}
          loader={<Spinner />}
          endMessage={
            <p className="text-center text-muted my-3">
              <b>Yay! You have seen it all 🎉</b>
            </p>
          }
        >
          <div className="row">
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <div className="col-md-4" key={index}>
                  <NewsItem
                    title={article.title ? article.title.slice(0, 45) : "No title"}
                    description={
                      article.description
                        ? article.description.slice(0, 88)
                        : "No description"
                    }
                    imageUrl={article.urlToImage}
                    newsUrl={article.url}
                    author={article.author || "Unknown"}
                    date={article.publishedAt}
                    source={article.source?.name}
                  />
                </div>
              ))
            ) : (
              <p className="text-center text-muted">No articles found.</p>
            )}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  setProgress: PropTypes.func, // type check
};
