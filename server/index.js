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
