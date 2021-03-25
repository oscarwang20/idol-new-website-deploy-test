import APICache from '../Cache/Cache';
import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';
import Emitters from '../EventEmitter/constant-emitters';

type MemberResponseObj = {
  status: number;
  member: Member;
  error?: string;
};

export type Member = IdolMember;

export class MembersAPI {
  public static getAllMembers(): Promise<Member[]> {
    const funcName = 'getAllMembers';
    if (APICache.has(funcName)) {
      return Promise.resolve(APICache.retrieve(funcName));
    }

    const responseProm = APIWrapper.get(`${backendURL}/allMembers`, {
      withCredentials: true
    }).then((res) => res.data);
    return responseProm.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get all members!",
          contentMsg: `Error was: ${val.error}`
        });
        return [];
      }
      let mems = val.members as Member[];
      mems = mems.sort((a, b) => (a.firstName < b.firstName ? -1 : 1));
      APICache.cache(funcName, mems);
      return mems;
    });
  }

  public static getMember(email: string): Promise<Member> {
    const responseProm = APIWrapper.get(`${backendURL}/getMember/${email}`, {
      withCredentials: true
    }).then((res) => res.data);
    return responseProm.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get member!",
          contentMsg: `Error was: ${val.error}`
        });
      }
      const mem = val.member as Member;
      return mem;
    });
  }

  public static setMember(member: Member): Promise<MemberResponseObj> {
    return APIWrapper.post(`${backendURL}/setMember`, member, {
      withCredentials: true
    }).then((res) => res.data);
  }

  public static deleteMember(
    memberEmail: string
  ): Promise<{ status: number; error?: string }> {
    return APIWrapper.delete(`${backendURL}/deleteMember/${memberEmail}`, {
      withCredentials: true
    }).then((res) => res.data);
  }

  public static updateMember(member: Member): Promise<MemberResponseObj> {
    return APIWrapper.post(`${backendURL}/updateMember`, member, {
      withCredentials: true
    }).then((res) => res.data);
  }
}
