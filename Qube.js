var Sorter = require('./util/sorter');
var Event = require('./util/event');
var socket = require('./util/socket');

/*
 meta = {
  name : moduleName (String)
  after : [
   otherModuleName (String)
  ] (optional)
 }
 module = function({otherModuleName(String) : otherModuleAPI(Object)}, callback(function)) {
  callback(moduleAPI(Object))
 }

 create new module
 */
exports.module = function module(meta, module) {
    Sorter.add(meta, module);
}

/*
 event = eventName (String)
 requester = function(eventName(String), eventInfo(Object), callback(function)) {
  callback([requiredDataKey])
 }
 handler = function(eventName(String), eventInfo(Object), {requestedDataKey : requestedDataValue}, callback(function)) {
  callback(error, {
   data : {
    modifiedDataKey : modifiedDataValue(Object)
   },
   event : [
    {
     event : eventName(String),
     info : eventInfo(Object)
    }
   ],
   load : [
    loadDataKey
   ],
   save : [
    saveDataKey
   ]
  }
 }

 register event listener
 */
exports.on = function on(event, requester, handler) {
    Event.on(event, requester, handler);
}