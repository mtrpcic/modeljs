# ModelJS
ModelJS is a lightweight model implementation written in Javascript.  It supports static methods and
properties, instance methods, rudimentary caching, and more.

## Defining a Model

Defining a model is easy.  The model definition takes a configuration object which can provide
four keys for customizing your model:

```javascript
var User = new Model({
    init: function(attributes){}, // Define a custom init method
    methods: {},                  // Define any instance methods you want
    statics: {},                  // Add any static methods/properties you want
    cacheKey: ""                  // Set up caching (read the "Caching" section below)
});
```
If you don't specify a custom init method, ModelJS will use a default one for you, which will turn every
key in your `attributes` object into a property of your model instance. A fairly well defined `User` model
might look like:

```javascript
var User = new Model({
    methods: {
        full_name: function(){
            return this.first_name + " " + this.last_name;
        }
    },
    statics: {
        count: 4,
        alert: function(message){
            // Send the message to all users!
        }
    },
    cacheKey: "id"
});
```
## Using Your Models

ModelJS expects that your model instances are initialized with an "attributes object".  You can create and 
use a new model instance by doing:

```javascript
var mike = new User({id: 1, first_name: "Mike", last_name: "Trpcic"});

mike.full_name(); // returns "Mike Trpcic"
mike.id // returns 1
```

## Caching

Model.js supports a basic level of caching. If you provide the `cacheKey` property when defining your model,
the model will be given two additional static methods, as well as one instance method.  If your `cacheKey`
property maps to a defined instance method, ModelJS will use the return value of that method as the key for
caching purposes.

The ModelJS caching system makes heavy use of callback methods.  This is intentional, and allows you to pass
your callbacks into AJAX calls, so you can asynchronously fetch remote data.

**Static Methods**  
Your class gets two methods, `fetch` and `cache`.  The `fetch` method is used to retrieve instances of your
model from the cache.
```javascript
Class.fetch(key, callback, skip_cache);

  // key        => The key that is used to store your object in the cache.
                   This is usually the "cacheKey" property of your instance.
  // callback   => The callback method that will be called and passed your found instance.
  // skip_cache => Tells this fetch request to skip the cache entirely.
```

When using the caching system, you will need to tell ModelJS where to find instances that it does not already
have access to.  You do this by defining your own custom `fetch` method:

```javascript
var User = new Model({
    statics: {
        fetch: function(key, callback){
            // Implement your custom fetch code here.  This example uses jQuery.
            $.get("/user", {user_id: key}, callback);
        }
    },
    cacheKey: "id"
});
```

The `cache` method is used to insert an instance into the cache.  Simply call the method and pass it a model
instance, and it will be inserted into the cache:

```javascript
User.cache(mike);
```

**Instance Methods**  
Every instance of your model will have a default `save` method.  By default, this method only inserts the instance
into the appropriate cache.  In some cases however, you may want to override the default save function (for example,
to push changes to the server).  In this case, you can define an instance method called `save`.  Be careful though!
If you override this method, you will have to _manually_ insert your object into the cache by calling the `Class.cache`
method mentioned above.

```javascript
// Using the default method
function userSaved(instance){
    console.log(instance.full_name() + " saved!");
}
mike.save(userSaved);


// using a custom method
var User = new Model({
    methods: {
        save: function(callback){
            // This example uses jQuery
            $.post("/save_user", {}, callback);
            User.cache(this); // Don't forget to manually save this instance to the cache!
        },
        full_name: function(){
            return this.first_name + " " + this.last_name;
        }
    },
    cacheKey: "id"
});

var mike = new User({id: 1, first_name: "Mike", last_name: "Trpcic"});
mike.save(userSaved);
```

## Inheritance

ModelJS supports inheritance via the `extend` method.  This method takes in a configuration block in the same
way that a new model definition does:

```javascript
var Admin = User.extend({
    init: function(attributes){},
    methods: {},
    statics: {},
    cacheKey: ""
});
```
Your new model will have all the instance and static methods of the parent class, except where you have explicitly
overridden them.  If you want access to an instance method from the parent class, you can access it via the `parent`
attribute of your instance:

```javascript
var admin = new Admin({...});

admin.full_name(); // Call the 'full_name' method of the admin class
admin.parent.full_name(); // Call the 'full_name' method of the parent class (User, in this case)
```

## To Do

* Add a way for an instance to "invalidate" itself and remove itself from the cache
* Add a way to turn an entire array of objects into an entire array of instances with one call
* Add a way to fetch multiple instances of a class at once
* Add a test suite

## Pull Requests

To make a pull request, please do the following:

* Mention what specific version of ModelJS you were using when you encountered the issue/added the feature. This can be accessed by doing Model.version in a console
* Provide a [pastie](http://pastie.org/) or [gist](https://gist.github.com/) that demonstrates the bug/feature
* Make sure you update the minified version of the source as well
* Do **not** modify the `Model.version` attribute.  I will modify that manually when merging the request

## Disclaimer

This code is provided without warranty.  While I strive to maintain backwards compatibility with previous versions,
the code is still under active development.  As this is the case, some revisions may break compatibility with earlier
versions of the library.  Please keep this in mind when using ModelJS.

## Copyright and Licensing

Copyright (c) 2012 Mike Trpcic, released under the MIT license
