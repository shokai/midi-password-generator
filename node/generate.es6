"use strict";

import PasswordGenerator from "../src/password_generator";

var pasgen = new PasswordGenerator(12);
pasgen.on("password", function(pass){
  console.log(pass.raw);
  console.log(`password => ${pass.string}`);
});
