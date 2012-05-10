function Model(config, parent_klass){
    // Define the init method for the new class
    var klass = function(attributes){
        if(parent_klass){
            var fn = (config.init ? config.init : parent_klass);    
        } else {
            var fn = (config.init ? config.init : Model.core.init);
        }
        
        fn.call(this, attributes);

        // If this is an extended class, the "parent class" can be
        // accessed via the `parent` attribute
        if(parent_klass){
            this.parent = new parent_klass(attributes);
        }   
    }

    // Assign all methods/statics of the parent class to this class
    if(parent_klass){
        Model.util.apply(parent_klass, klass);
        Model.util.apply(parent_klass.prototype, klass.prototype);
    }

    // Assign static attributes
    Model.util.apply(config.statics, klass);

    // Assign instance methods
    Model.util.apply(config.methods, klass.prototype);

    // Set up caching methods
    if(config.cacheKey){
        klass.cacheKey = config.cacheKey;
        klass.instances = {};

        if(config.statics && config.statics.fetch){
            klass._fetch = config.statics.fetch;
        } else {
            throw "ModelJS Error: You must define a custom `fetch` method when defining a cacheKey";
        }

        if(!config.methods || (config.methods && !config.methods.save)){
            klass.prototype.save = Model.core.save(klass);
        }

        klass.cache = Model.core.cache(klass);
        klass.fetch = Model.core.fetch(klass);
        klass.extend = Model.core.extend(klass);
    }
    return klass;
}

Model.util = {
    "apply": function(host, destination){
        for(item in host){
            destination[item] = host[item];
        }
    }
};

Model.core = {
    init: function(attributes){
        this.attributes = attributes;
        for(attribute in attributes){
            this[attribute] = attributes[attribute];
        }
    },
    fetch: function(klass){
        return function(key, callback, skip_cache){
            if(skip_cache){
                klass._fetch(key, callback);
            } else {
                instance = klass.instances[String(key)];

                if(callback){
                    if(instance){
                        callback(instance)
                    } else {
                        klass._fetch(key, callback);
                    }
                } else {
                    return instance || null;
                }
            }
        }
    },
    cache: function(klass){
        return function(instance){
            key = instance[klass.cacheKey];
            if(key instanceof Function){
                key = instance[klass.cacheKey]();
            }
            klass.instances[String(key)] = instance;
        };
    },
    save: function(klass){
        return function(callback){
            klass.cache(this);
            if(callback) callback(this);
        };
    },
    extend: function(klass){
        return function(config){
            return new Model(config, klass);
        }
    }
};
Model.version = "0.4.1";