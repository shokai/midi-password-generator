"use strict";

import midi from "midi";
import {EventEmitter} from "events";
import crypto from "crypto";
var debug = require("debug")("webmidipass:enerator");

module.exports = class PasswordGenerator extends EventEmitter{
  constructor(length = 12){
    super();
    this.length = length;

    var input = new midi.input();
    for(let i = 0; i < input.getPortCount(); i++){
      let name = input.getPortName(i);
      console.log(`found device [${i}] "${name}"`);
      input.openPort(i);
    }

    this.queue = [];
    var timeout = null;
    input.on("message", (deltaTime, msg) => {
      debug(msg);
      clearTimeout(timeout);
      var interval = Math.floor(deltaTime / 0.5);
      if(this.queue.length === 0) this.queue.push(`0,${msg[1]}`);
      else this.queue.push(`${interval},${msg[1]}`);
      timeout = setTimeout(() => {
        var raw = this.queue.join("/");
        var pass = {raw: raw, string: this.encode(raw)};
        this.emit("password", pass);
        this.queue = [];
      }, 1000);
    });
  }

  encode(str){
    return crypto.createHash("sha1")
      .update(str, "utf8").digest("hex")
      .slice(0, this.length);
  }

}
