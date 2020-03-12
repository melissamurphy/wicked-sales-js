import React from 'react';
import Header from './header';
import ProductList from './product-list';

export default class App extends React.Component {

  render() {
    return (
      <div>
        <Header />
        <div>
          <ProductList />
        </div>
      </div>
    );
  }
}
