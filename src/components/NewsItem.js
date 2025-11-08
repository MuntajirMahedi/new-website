import React from 'react';

export default function NewsItem({ title, description, imageUrl, newsUrl, author, date, source }) {
  return (
    <div className='my-3'>
      <div className="card">
        <span className="position-absolute top-0 translate-middle badge rounded-pill bg-danger" style={{left:'50%',zIndex:'1'}}>{source}</span>
        <img
          src={!imageUrl ? "https://image.cnbcfm.com/api/v1/image/108124592-1743552142395-gettyimages-923813414-hkk_16_dsc04381.jpeg?v=1762385932&w=1920&h=1080" : imageUrl}
          className="card-img-top"
          alt={title}
        />
        <div className="card-body">
          <h5 className="card-title">{title}...</h5>
          <p className="card-text">{description}...</p>
          <p className="card-text text-danger "><small className="text-danger">By {author} On {new Date(date).toGMTString()}</small></p>
          <a href={newsUrl} target="_blank" rel="noreferrer" className="btn btn-danger btn-sm">
            Read More
          </a>
        </div>
      </div>
    </div>
  );
}
