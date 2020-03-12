import React from 'react';

function ProductListItem(props) {
  const product = props.product;
  return (
    <div className="col-4 mb-4">
      <div className="card shadow-sm">
        <img src={product.image} alt={product.name} className="card-img-top"/>
        <div className="card-body">
          <h5 className="card-title"> {product.name} </h5>
          <p className="card-text text-muted"> {`$${(product.price / 100).toFixed(2)}`} </p>
          <p className="card-text"> {product.shortDescription} </p>
        </div>
      </div>
    </div>
  );
}

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  componentDidMount() {
    this.getProducts();
  }

  getProducts() {
    fetch('/api/products')
      .then(response => response.json())
      .then(productData => {
        this.setState({ products: productData });
      });
  }

  render() {
    return (
      <div className="container">
        <div className="row row-cols-3 my-5">
          {this.state.products.map(product => <ProductListItem product={product} key={product.productId}/>)}
        </div>
      </div>

    );
  }
}

export default ProductList;
