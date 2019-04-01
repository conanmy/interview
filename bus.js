let bus = {};
let listenersMap = {};
bus.on = function(eventName, callback) {
    try {
        return new Promise(function(resolve) {
            console.log(callback);
            if (typeof callback === 'object') {
                let args = callback;
                callbackFunc = args.func;
                if (typeof callbackFunc !== 'function') {
                    throw new Error('Arg func is not function');
                }
                if (args.before) {
                    if (typeof args.before !== 'string') {
                        throw new Error('Arg before is not string');
                    }
                    let targetIndex = null;
                    listenersMap[eventName] && listenersMap[eventName].map(listener, index => {
                        if (listener.name === args.before) {
                            targetIndex = index;
                            return;
                        }
                    });
                    if (typeof targetIndex === null) {
                        throw new Error('Specified func name does not exist');
                    }
                    listenersMap[eventName].splice(targetIndex, 0, wrapCallback(callbackFunc, resolve));
                } else {
                    listenersMap[eventName] = [...(listenersMap[eventName] || []), , wrapCallback(callbackFunc, resolve)];
                }
            } else if (typeof callback === 'function') {
                listenersMap[eventName] = [...(listenersMap[eventName] || []), , wrapCallback(callback, resolve)];
            } else {
                throw new Error('Second param must be obj or func');
            }
        })
    } catch (e) {
        console.log(e);
    }
};
bus.trigger = function(eventName, ...args) {
    listenersMap[eventName].map(listener => listener.apply(bus, args));
};

let callStack = [];
function wrapCallback(callback, resolve) {
    return function() {
        callStack.push(callback.name + ' start');
        console.log(this);
        let reuturnValue = callback.apply(this, arguments);
        if (reuturnValue && reuturnValue.then) {
            reuturnValue.then(function() {
                resolve(callStack);
                callStack.push(callback.name + ' async end');
            });
        } else {
            resolve(callStack);
            callStack.push(callback.name + ' sync end');
        }
    }
}

bus.on('event2', function event2(){console.log('event2 triggered')})
bus.on('event3', function event3(){console.log('event3 triggered')})
const result = bus.on('event1', function event1() {
   let that = this;
   that.trigger('event2')
   return new Promise(function(resolve){
      setTimeout(function(){
        that.trigger('event3')
        resolve()
      }, 1000)
   })
})
result.then(function(callstack){console.log(callstack)})
bus.trigger('event1')