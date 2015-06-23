"use strict";

export function getEnv(){
  if(typeof window === "object"){
    return "browser";
  }
  else{
    return "nodejs";
  }
}
