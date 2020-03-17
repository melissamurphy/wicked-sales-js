import React from 'react';

export default function ProductListItem(props) {
  const product = props.product;
  return (
    <div className="col-4 mb-4">
      <div className="card px-3 shadow-sm">
        <img src={product.image} alt={product.name} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title"> {product.name} </h5>
          <p className="card-text text-muted"> {`$${(product.price / 100).toFixed(2)}`} </p>
          <p className="card-text"> {product.shortDescription} </p>
        </div>
      </div>
    </div>
  );
}
