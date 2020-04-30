require('dotenv/config');
const express = require('express');

const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');

const app = express();

app.use(staticMiddleware);
app.use(sessionMiddleware);

app.use(express.json());

app.get('/api/health-check', (req, res, next) => {
  db.query('select \'successfully connected\' as "message"')
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

// new endpoint to your Express.js server that handles
// GET requests to / api / cart.The endpoint should simply respond with an empty JSON array for now.
app.get('/api/cart', (req, res, next) => {
  res.json({});
});

// POST endpoint for /api/cart
// validate the productId in the request body. If it is invalid, respond with a 400 error.
app.post('/api/cart', (req, res, next) => {
  if (!parseInt(req.body.productId, 10)) {
    return res.status(400).json({ error: 'Invalid productId' });
  }
  // select the "price" of the product with the matching "productId"
  const sql = `
    select "price"
      from "products"
      where "productId" = $1
  `;
  db.query(sql, [req.body.productId])

  // Insert a new row into the "cartId" and "createdAt" columns of the "carts" table
    .then(result => {
      if (result.rows[0]) {
        const price = result.rows[0].price;
        // res.json(result.rows[0]);
        const sql2 = `
        insert into "carts" ("cartId", "createdAt")
        values (default, default)
        returning "cartId"
        `;
        return (
          db.query(sql2)
            .then(result => {
              const cartId = result.rows[0].cartId;
              // console.log('first result:', obj, 'second result for cartId:', result.rows[0]);
              return { price: price, cartId: cartId };
            })
        );
      } else {
        next(new ClientError(`No price under product Id ${req.body.productId}`, 400));
      }
    })
  // return the created cartId as well as the price you retrieved in an object.

    .then(obj => {
      // console.log(obj)
      // Assign the cartId you got to the cartId property of the req.session object.
      req.session.cartId = obj.cartId;
      const sql = `
      insert into "cartItems" ("cartId", "productId", "price")
      values ($1, $2, $3)
      returning "cartItemId"
      `;
      return (
        db.query(sql, [obj.cartId, req.body.productId, obj.price])
          .then(result => {
            const cartItemId = result.rows[0].cartItemId;
            return { cartItemId: cartItemId };
          })
      );
    })
    .then(result => {
      // console.log('result:', result);
    })
    .catch(err => next(err));
});

app.get('/api/products', (req, res, next) => {
  const sql = `
    select "productId", "name", "price", "image", "shortDescription"
      from "products"
  `;
  db.query(sql)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

//
app.get('/api/products/:productId', (req, res, next) => {
  const productId = req.params.productId;
  const sql = `
    select *
      from "products"
      where "productId" = $1
  `;
  db.query(sql, [productId])
    .then(result => {
      if (result.rows[0]) {
        res.json(result.rows[0]);
      } else {
        next(new ClientError(`No product found with Id ${productId}`, 404));
      }
    })
    .catch(err => next(err));
});

app.use('/api', (req, res, next) => {
  next(new ClientError(`cannot ${req.method} ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', process.env.PORT);
});
