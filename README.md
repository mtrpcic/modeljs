# ModelJS #
ModelJS provides a convenient, lightweight way for developers to convert their standard JSON objects
into models with instance methods, attributes, and class methods.  It supports basiccaching, and uses
a callback system to allow models to be used in conjunction with asynchronous AJAX calls.

# Creating a Model #
Creating a model is easy.  The model definition takes a configuration object, and looks for four
specific keys.  `init` defines the initializer method for your object.  If `init` is not provided,
ModelJS will use a default initializer for you, which will turn every key in your attribute object
into an instance attribute of your model. The  `instanceMethods` and `classMethods` options define 
instance and class level methods, respectively.  The fourth option, `cacheKey`, is discussed below
in the "Caching" section.

    var User = new Model({
        init: function(attributes){
            this.id = attributes.id;
            this.name = attributes.name;
        },
        instanceMethods: {
            sayHello: function(){
                console.log("Hello from " + this.name);
            }
        },
        classMethods: {
            sayGoodbye: function(){
                console.log("Goodbye everyone!");
            }
        }
    });

# Using your Model #
You use your model instances the same as you would any other object:

    var mike = new User({id: 1, name: "Mike"});

    console.log(mike.name);
    mike.sayHello();
    User.sayGoodbye();

# Caching #
Model.js supports a basic level of caching.  If you pass the `cacheKey` property in
when defining your model, it will be given two additional class methods, and all instances
will be given an addition instance method:

    var User = new Model({cacheKey: "id"});
    var mike = new User({id: 1, name: "Mike"});

    User.fetch(key, callback, skip_cache);
    User.cache(instance)

    mike.save(callback);

The `cacheKey` property must be an attribute of your model.  For example, if your user model
has an `id` attribute (as per the example above), you can set the `cacheKey` to `id`. This
field should be unique, otherwise you will have an invalid cache.

The model gets the class method `fetch`  This takes three arguments.  First is the key to
fetch the instance by.  The second, `callback` is the callback that will be called with your instance
passed as the only parameter, and the third option, `skip_cache`, will tell the model to skip
the cache entirely for this fetch.

You can override the fetch method in your `classMethods` definition.  This method should be used
to retrieve an instance of your model from your server.  If a `cacheKey` is set, it will attempt
to load the cached version, but will fall back to your fetch method if no instance is found.

The model also gets the `cache` class method, which takes in an instance of the model as a parameter.
This method will insert that instance into the class cache, using your defined `cacheKey` attribute
as the key.

All instancesof your class will get the "save" method.  By default, this method only calls the class 
`cache` method.  You can override this class to do anything you want, but you will need to manually 
call the class level `cache` method to insert your instance into the cache.

    var User = new Model({
        init: function(attributes){
            this.id = attributes.id;
        },
        instanceMethods: {
    
        },
        classMethods: {
    
        },
        cacheKey: "id"
    });

# To Do #
* Add a way for an instance to "invalidate" itself and remove itself from the cache
* Add a way to turn an entire array of objects into an entire array of instances with one call
* Add a way to fetch multiple instances of a class at once
* Get community ideas

# Pull Requests #
To make a pull request, please do the following:

* Mention what specific version of ModelJS you were using when you encountered the issue/added the feature. This can be accessed by doing Model.version in a console
* Provide a [pastie](http://pastie.org/) or [gist](https://gist.github.com/) that demonstrates the bug/feature
* Make sure you update the minified version of the source as well
* Do **not** modify the `Model.version` attribute.  I will modify that manually when merging the request

# Disclaimer #
This code is provided without warranty.  While I strive to maintain backwards compatibility with previous versions,
the code is still under active development.  As this is the case, some revisions may break compatibility with earlier
versions of the library.  Please keep this in mind when using ModelJS.

# Copyright and Licensing #
Copyright (c) 2012 Mike Trpcic, released under the MIT license
