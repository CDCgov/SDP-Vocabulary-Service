import { expect, renderComponent } from '../test_helper';
import VersionInfo from '../../../webpack/components/VersionInfo';

describe('VersionInfo', () => {
  let component;

  beforeEach(() => {
    const responseSet = {
      id: 3,
      name: 'Test',
      version: 3,
      mostRecent: 4,
      createdAt: new Date(),
      allVersions: [
        {id: 1, name: 'Test', version: 1, mostRecent: 4, createdAt: new Date()},
        {id: 2, name: 'Test', version: 2, mostRecent: 4, createdAt: new Date()},
        {id: 3, name: 'Test', version: 3, mostRecent: 4, createdAt: new Date()},
        {id: 4, name: 'Test', version: 4, mostRecent: 4, createdAt: new Date()},
      ]
    };
    component = renderComponent(VersionInfo, {versionable: responseSet, versionableType: 'responseSet', currentUser: {id: 1, publisher: true}});
  });

  it('should create a list of versions', () => {
    expect(component.find("li").length).to.equal(4);
  });

});
