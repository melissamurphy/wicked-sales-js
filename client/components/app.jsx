import React from 'react';
import Header from './header';
import ProductList from './product-list';
import ProductDetails from './product-details';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: { name: 'catalog', params: {} }
    };
    this.setView = this.setView.bind(this);
  }

  setView(name, params) {
    this.setState({ view: { name, params } });
  }

  render() {
    if (this.state.view.name === 'catalog') {
      return (
        <div>
          <Header />
          <div>
            <ProductList setView={this.setView} />
          </div>
        </div>
      );
    }
    return (
      <ProductDetails params={this.state.view.params} setView={this.setView} />
    );
  }
}
