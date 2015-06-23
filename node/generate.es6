"use strict";

import PasswordGenerator from "../src/PasswordGenerator";

var pasgen = new PasswordGenerator(12);
pasgen.on("password", function(pass){
  console.log(pass.raw);
  console.log(`password => ${pass.string}`);
});
