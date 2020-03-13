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
  const paramz = [productId];
  // Paramaterized query: Rather than concatenate params right into the sql command, pass them (as 2nd argument in .query) in array to the PostgreSQL server,
  // to screen through "battle-tested parameter substitution code"

  const sql = `
    select *
      from "products"
      where "productId" = $1
  `;
  db.query(sql, paramz)
    .then(result => {
      // Check if columns were found at the requested row (i.e. under that productId)
      // Note if no object found for that row, result.rows will be an empty array (truthy); results.rows[0] will be undefined (falsy)
      if (result.rows[0]) {
        res.json(result.rows[0]);
      } else {
        next(new ClientError(`No product found with Id ${productId}`, 404)); // creates a client error (see 'client-error.js') and passes in as argument to next() method of express if the product wasn't found
      }
    })
    .catch(err => next(err)); // Something goes wrong with the query and the Promise settles to rejected "500 Internal Server Error server error response code indicates that the server encountered an unexpected condition that prevented it from fulfilling the request."
  // "The Promise returned by catch() is rejected if onRejected [callback] throws an error or returns a Promise which is itself rejected; otherwise, it is resolved."
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
