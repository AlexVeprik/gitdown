var helper = {},
    fs = require('fs'),
    jsonfile = require('jsonfile'),
    gitinfo = require(__dirname + '/gitinfo.js');

helper.compile = function (config, context) {
    var services = {};

    config = config || {};

    if (!config.name) {
        throw new Error('config.name must be provided.');
    }

    /**
     *
     */
    services['npm-version'] = function () {
        var pkg = context.locator.repositoryPath() + '/package.json';

        if (!fs.existsSync(pkg)) {
            throw new Error('./package.json is not found.');
        }

        pkg = jsonfile.readFileSync(pkg);

        return '[![NPM version](http://img.shields.io/npm/v/' + pkg.name + '.svg?style=flat)](https://www.npmjs.org/package/' + pkg.name + ')';
    };

    /**
     *
     */
    services['bower-version'] = function () {
        var bower = context.locator.repositoryPath() + '/bower.json';

        if (!fs.existsSync(bower)) {
            throw new Error('./bower.json is not found.');
        }

        bower = jsonfile.readFileSync(bower);

        return '[![Bower version](http://img.shields.io/bower/v/' + bower.name + '.svg?style=flat)](http://bower.io/search/?q=' + bower.name + ')';
    };

    /**
     *
     */
    services.travis = function () {
        var rep = {},
            badge;

        rep.username = gitinfo.compile({name: 'username'}, context);
        rep.name = gitinfo.compile({name: 'name'}, context);
        rep.branch = gitinfo.compile({name: 'branch'}, context);

        badge = '![Travis build status](http://img.shields.io/travis/' + rep.username + '/' + rep.name + '/' + rep.branch + '.svg?style=flat)';

        return '[' + badge + '](https://travis-ci.org/' + rep.username + '/' + rep.name + ')';
    };

    if (!services[config.name]) {
        throw new Error('config.name "' + config.name + '" is unknown service.');
    }

    return services[config.name]();
};

helper.weight = 10;

module.exports = helper;