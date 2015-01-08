import pruno from '..';
import yamlConfig from 'yaml-env-config';

class Configure {
  constructor(params) {
    var config = yamlConfig(params.dir, {absolute: true});
    pruno.setDefaults(config.pruno);
  }
}

export default pruno.extend(Configure);
