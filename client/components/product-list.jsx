import React from 'react';
import ProductListItem from './product-list-item';

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
