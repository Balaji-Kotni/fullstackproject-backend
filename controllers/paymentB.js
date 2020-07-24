var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "6vcmfrsgb3yc9bg3",
  publicKey: "w72qjk3qyv44yct4",
  privateKey: "26ee55583f91aa77f1495e37f1aa18a1"
});



exports.getToken =(req, res) => {
    gateway.clientToken.generate({}, function(err, response) {
        if(err) {
            res.status(500).send(err);
        }else {
            res.send(response);
        }
      });
};



exports.processPayment =(req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;

    let amountFromTheClient = req.body.amount;
    
    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        
        options: {
          submitForSettlement: true
        }
      }, function (err, result) {
          if (err){
              res.status(500).json(error);
          }else {
              res.json(result);
          }
      }
      );
};