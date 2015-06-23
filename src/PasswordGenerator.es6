"use strict";

var debug = require("debug")("webmidipass:generator");

import * as Util from "./util";
import {EventEmitter} from "events";
import crypto from "crypto";

if(Util.getEnv() === "nodejs"){
  var midi = require("midi");
}

module.exports = class PasswordGenerator extends EventEmitter{
  constructor(length = 12){
    super();
    this.length = length;
    switch(Util.getEnv()){
    case "nodejs":
      this.initNodejs();
      break;
    case "browser":
      this.initBrowser();
    }

    this.queue = [];
    var timeout = null;
    this.on("midi:message", (deltaTime, msg) => {
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

  initBrowser(){
    if(navigator && typeof navigator.requestMIDIAccess !== "function"){
      throw new Error("Web MIDI API is not supported");
    }
    navigator.requestMIDIAccess()
      .then(webMidi => {
        let it = webMidi.inputs.values();
        while(true){
          let input = it.next();
          if(input.done) break;
          console.log(`found device "${input.value.name}"`);
          let lastAt = 0;
          input.value.onmidimessage = (msg) => {
            var deltaTime = (msg.receivedTime - lastAt)/1000;
            this.emit("midi:message", deltaTime, msg.data);
            lastAt = msg.receivedTime;
          };
        }
      });
  }

  initNodejs(){
    var input = new midi.input();
    for(let i = 0; i < input.getPortCount(); i++){
      let name = input.getPortName(i);
      console.log(`found device [${i}] "${name}"`);
      input.openPort(i);
    }

    input.on("message", (deltaTime, msg) => {
      this.emit("midi:message", deltaTime, msg);
    });
  }

  encode(str){
    return crypto.createHash("sha1")
      .update(str, "utf8").digest("hex")
      .slice(0, this.length);
  }

};
