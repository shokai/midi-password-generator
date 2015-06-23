"use strict";
localStorage.debug = "*";
import PasswordGenerator from "./PasswordGenerator";

var passgen = new PasswordGenerator(8);
passgen.on("password", function(pass){
  console.log(pass.raw);
  console.log(`password => ${pass.string}`);
});
