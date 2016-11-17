# CDC SDP JS

## Overview of JS related tools

### Babel
[Babel](https://babeljs.io/) is the transpiler we use that translates JavaScript from ES2015/ES6 syntax to the older ES5 syntax used by most browsers. It let's us use newer language features now instead of waiting for browsers to support them.

### Webpack
[Webpack](https://webpack.github.io/) is a module bundler that plays a similar role to what we'd used the Rails asset pipeline for in the past. It watches files and applies certain tools to them when they change. This is the tool that calls Babel to translate our JavaScript files. It is also responsible for transpiling our SCSS into CSS. Finally, it bundles files together to build the JS files we load on the client browser.

## Where to put new JS

All JS code needs to be inside the `webpack` folder or Webpack won't see it. For [React](https://facebook.github.io/react/) components you can put it in the `webpack/components` directory.

When creating a new page you will need to create at least two JS files and one ERB file.

### app/views/[resource_name]/[action].html.erb
This is the erb template you will use for anything you want rendered on initial page load. A rough scaffold for it is as follows:

```
<div class='container' id='react-container'>
</div>
<%= javascript_include_tag *webpack_asset_paths([resource_name], extension: 'js') %>
```

This does two things, it loads the JS for the `resource_name` and provides a div for the JS to hook into. This is important since `ReactDOM.render` requires a DOM element to render into.

### webpack/[resource_name].js

This will be the main entry point for whatever javascript you need running on the page. For example, to load a React component and render it you could use:

```
import React from 'react';
import ReactDOM from 'react-dom';
import ResponseSetTable from './components/ResponseSetTable';

const responses = JSON.parse(document.getElementById('responses-json').innerHTML);
ReactDOM.render(<ResponseSetTable initialResponses={responses} />, document.getElementById('response-set-table'));
```
You'll notice the line that parses some DOM element and then passes it into the component. That is a simple method for preloading data on page load. To make it work you can add a simple DOM node in your ERB like:

```
<script type="application/json" id="responses-json">
  <%= raw response_set.responses.to_json %>
</script>
```
This will render JSON into the DOM. This works because the Rails controller loaded the ActiveRecord model and passed it to the ERB template in a variable called `response_set`.

### webpack/components/[ComponentName].js

This is where you would put whatever React component you are building. For example, a very simple component would look like

```
import React from 'react';

export default MyComponent = () => {
  return <span> Hello, World! </span>
}

```

In this project, we have configured Babel to support [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html). You will notice that React components in this project contain HTML-like code. When implementing functionality with JavaScript, much of the HTML that you typically would have placed in an ERB template will now be placed in a React component using JSX.

### config/webpack.config.js
You will have to **EDIT** this file. Add another entry in the `entry` section for your resource. It will look like:

```
'resource_name': webpack/[resource_name].js
```

This is what makes the `*webpack_asset_paths([resource_name], extension: 'js')` in your ERB template work, if the `resource_name` tags don't match it won't find your JS file.
