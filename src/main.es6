"use strict";
import PasswordGenerator from "./PasswordGenerator";
import $ from "jquery";

var target = null;
$("input")
  .on("focus", function(e){
    target = e.target;
  })
  .on("focusout", function(e){
    target = null;
  });

var passgen = new PasswordGenerator(8);
passgen.on("password", function(pass){
  console.log(pass.raw);
  console.log(`password => ${pass.string}`);
  if(target){
    target.value = pass.string;
  }
});
