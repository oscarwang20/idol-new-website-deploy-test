import APICache from '../Cache/Cache';
import environment from '../environment';
import APIWrapper from './APIWrapper';
import Emitters from '../EventEmitter/constant-emitters';

export default class RolesAPI {
  public static getAllRoles(): Promise<string[]> {
    const funcName = 'getAllRoles';
    if (APICache.has(funcName)) {
      return Promise.resolve(APICache.retrieve(funcName));
    }

    const responseProm = APIWrapper.get(`${environment.backendURL}allRoles`, {
      withCredentials: true,
    }).then((res) => res.data);
    return responseProm.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get all roles!",
          contentMsg: `Error was: ${val.error}`,
        });
        return [];
      }
      let roles = val.roles as string[];
      roles = roles.sort((a, b) => (a < b ? -1 : 1));
      APICache.cache(funcName, roles);
      return roles;
    });
  }
}
