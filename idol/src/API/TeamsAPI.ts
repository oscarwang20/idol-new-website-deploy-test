import { APICache } from "../Cache/Cache";
import { environment } from "../environment";
import { APIWrapper } from "./APIWrapper";
import { Emitters } from "../EventEmitter/constant-emitters";
import { Member } from "./MembersAPI";

export type Team = {
  name: string,
  leaders: Member[],
  members: Member[],
  uuid?: string
}

export class TeamsAPI {

  public static getAllTeams(): Promise<Team[]> {
    let funcName = "getAllTeams";
    if (APICache.has(funcName)) {
      return Promise.resolve(APICache.retrieve(funcName));
    }
    else {
      let responseProm = APIWrapper.get(environment.backendURL + 'allTeams',
        {
          withCredentials: true
        })
        .then((res) => res.data);
      return responseProm.then((val) => {
        if (val.error) {
          Emitters.generalError.emit({
            headerMsg: "Couldn't get all teams!",
            contentMsg: "Error was: " + val.error
          });
          return [];
        }
        let teams = val.teams as Team[];
        teams = teams.sort((a, b) => a.name < b.name ? -1 : 1);
        APICache.cache(funcName, teams);
        return teams;
      });
    }
  }

  public static setTeam(team: Team): Promise<any> {
    return APIWrapper.post(environment.backendURL + 'setTeam', team, {
      withCredentials: true
    }).then(res => res.data);
  }

  public static deleteTeam(team: Team): Promise<any> {
    return APIWrapper.post(environment.backendURL + 'deleteTeam', team, {
      withCredentials: true
    }).then(res => res.data);
  }

}