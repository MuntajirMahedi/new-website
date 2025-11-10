import React from "react";

export default function NewsItem({
  title,
  description,
  imageUrl,
  newsUrl,
  author,
  date,
  source,
}) {
  const fallbackImage =
    "https://dims.apnews.com/dims4/default/f3c9330/2147483647/strip/true/crop/5785x3254+0+301/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F89%2F52%2Ff163b1b93b8b9d670ef7f8bd6105%2F57fca08fcaa3423685511f50aa37c30f";

  return (
    <div className="my-3">
      <div className="card">
        <span
          className="position-absolute top-0 translate-middle badge rounded-pill bg-danger"
          style={{ left: "50%", zIndex: "1" }}
        >
          {source}
        </span>

        <img src={imageUrl || fallbackImage} onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage;}}
          className="card-img-top"
          alt={title}
        />

        <div className="card-body">
          <h5 className="card-title">{title}...</h5>
          <p className="card-text">{description}...</p>
          <p className="card-text">
            <small className="text-danger">
              By {author} on {new Date(date).toGMTString()}
            </small>
          </p>
          <a
            href={newsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-danger btn-sm"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
}
