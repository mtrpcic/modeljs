function Model(config){
  var klass;
  // Initialize the new function
    if(config.init){
        klass = config.init;
    } else {
        klass = function(attributes){
            this.attributes = attributes;
            for(attribute in attributes){
                this[attribute] = attributes[attribute];
            }
        }
    }

    // Assign class methods
    for(method_name in config.classMethods){
        klass[method_name] = config.classMethods[method_name];
    }
    klass.prototype = config.instanceMethods;
    
    // Set up caching methods
    if(config.cacheKey){
        klass.cacheKey = config.cacheKey;
        klass._fetch = config.classMethods.fetch;
        klass.instances = {};

        if(!config.instanceMethods.save){
            klass.prototype.save = function(fn){
                klass.cache(this);
                if(fn) fn(this);
            }
        }

        klass.cache = function(instance){
            klass.instances[instance[klass.cacheKey]] = instance;
        }

        klass.fetch = function(key, callback, force){
            if(force){
                klass._fetch(key, callback);
            } else {
                instance = klass.instances[key];
                if(instance){
                    callback(instance)
                } else {
                    klass._fetch(key, callback);
                }
            }
        }
    }
    return klass;
}
Model.version = "0.2";