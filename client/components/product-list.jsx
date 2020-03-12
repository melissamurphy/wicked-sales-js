import React from 'react';

function ProductListItem(props) {
  return (
    <div className="col-4 mb-4">
      <div className="card">
        {/* .card-img-top/bottom for the card's 'image cap' [<--like header/footer] */}
        <img src="/images/snuggie.jpg" alt="shake-weight" className="card-img-top"/>
        {/* "The building block of a card is the .card-body. Use it whenever you need a padded section within a card." */}
        <div className="card-body">
          <h5 className="card-title"> Card title </h5>
          <p className="card-text text-muted"> Price </p>
          <p className="card-text"> Description </p>
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
    // console.log('this.state', this.state);
    return (
      <div className="row-cols-3">
        {/* Responsive 'row-cols-#' creates a row AND sets the # of child-columns per row */}
        <ProductListItem />
      </div>

    );
  }
}

export default ProductList;
