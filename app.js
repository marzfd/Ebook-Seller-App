require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set Static Folder
app.use(express.static(`${__dirname}/public`));

// Index Route
app.get('/', (req, res) => {
    res.render('index', {
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
});

// Charge Route
app.post('/charge', (req, res) => {
  const amount = 1000;

  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer => stripe.charges.create({
    amount,
    description: 'Web App: Ebook-Seller',
    currency: 'usd',
    customer: customer.id
  }))
  .then(charge => res.render('success'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server started on port ' + port);
});