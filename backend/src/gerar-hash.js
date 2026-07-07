const bcrypt = require('bcrypt');

const senhaEmTextoPuro = '123456'; // troque pela senha que você quer usar para testar

bcrypt.hash(senhaEmTextoPuro, 10).then((hash) => {
  console.log('Hash gerado:', hash);
});