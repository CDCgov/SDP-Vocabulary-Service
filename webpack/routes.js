import { camelCase } from './camelcase';
import routes from './_routes';
import 'babel-polyfill';

let exportRoutes = routes;
if(routes.Routes){
  exportRoutes = routes.Routes;
}

Object.keys(exportRoutes).forEach((k) => {
  if (k.endsWith('_path')) {
    const camelRouteName = camelCase(k);
    exportRoutes[camelRouteName] = exportRoutes[k];
  }
});

export default exportRoutes;
