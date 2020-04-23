import React from 'react';

export default class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null
    };
  }

  componentDidMount() {
    // console.log('this.props in ProductDetails', this.props);
    // console.log('this.props.params.productId', this.props.params.productId);
    // console.log('product-details:', this.getProductDetails(this.props.params.productId));
    this.getProductDetails(this.props.params);
  }

  getProductDetails(productId) {
    fetch(`/api/products/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(productDetails => this.setState({ product: productDetails }));
  }

  render() {
    const product = this.state.product;
    if (!product) {
      return null;
    }
    return (
      <div className="container my-5">
        <div className="row">
          <div className="column">
            <div className="card px-3 bg-light">
              <p className="text-muted pt-3">{'<'} Back to catalog</p>
              <div className="row">
                <div className="column">
                  <img src={product.image} alt={product.name}/>
                </div>
                <div className="column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted">{`$${(product.price / 100).toFixed(2)}`}</p>
                  <p className="card-text">{product.shortDescription}</p>
                </div>
              </div>
              <div className="row">
                {product.longDescription}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
