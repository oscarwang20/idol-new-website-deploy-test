import { backendURL } from '../environment';
import { Emitters } from '../utils';
import APIWrapper from './APIWrapper';

type TeamEventResponseObj = {
  Event: Event;
  error?: string;
};

export type EventAttendance = TeamEventAttendance;

export type Event = TeamEvent;

export type MemberTECRequests = {
  pending: TeamEventInfo[];
  approved: TeamEventInfo[];
};

export class TeamEventsAPI {
  public static getAllTeamEvents(): Promise<Event[]> {
    const eventsProm = APIWrapper.get(`${backendURL}/getAllTeamEvents`).then((res) => res.data);
    return eventsProm.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get all events",
          contentMsg: `Error was: ${val.err}`
        });
        return [];
      }
      const events = val.events as Event[];
      return events;
    });
  }

  public static getAllTeamEventInfo(): Promise<TeamEventInfo[]> {
    const res = APIWrapper.get(`${backendURL}/getAllTeamEventInfo`).then((res) => res.data);
    return res.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get all events",
          contentMsg: `Error was: ${val.err}`
        });
        return [];
      }
      const events = val.allTeamEventInfo as TeamEventInfo[];
      return events;
    });
  }

  public static getTeamEventForm(uuid: string): Promise<Event> {
    const eventProm = APIWrapper.get(`${backendURL}/getTeamEvent/${uuid}`).then((res) => res.data);
    return eventProm.then((val) => {
      const event = val.event as Event;
      return event;
    });
  }

  public static createTeamEventForm(teamEventInfo: TeamEventInfo): Promise<TeamEventResponseObj> {
    return APIWrapper.post(`${backendURL}/createTeamEvent`, teamEventInfo).then((res) => res.data);
  }

  public static async deleteTeamEventForm(teamEvent: Event): Promise<void> {
    await APIWrapper.post(`${backendURL}/deleteTeamEvent`, teamEvent);
  }

  public static updateTeamEventForm(teamEventInfo: TeamEventInfo): Promise<TeamEventResponseObj> {
    return APIWrapper.post(`${backendURL}/updateTeamEvent`, teamEventInfo).then(
      (rest) => rest.data.event
    );
  }

  public static async clearAllTeamEvents(): Promise<void> {
    await APIWrapper.delete(`${backendURL}/clearAllTeamEvents`);
  }

  public static async requestTeamEventCredit(request: TeamEventAttendance): Promise<void> {
    APIWrapper.post(`${backendURL}/requestTeamEventCredit`, { request });
  }

  public static async deleteTeamEventAttendance(uuid: string): Promise<void> {
    await APIWrapper.post(`${backendURL}/deleteTeamEventAttendance`, { uuid });
  }

  public static async updateTeamEventAttendance(
    teamEventAttendance: TeamEventAttendance
  ): Promise<TeamEventAttendance> {
    return APIWrapper.post(`${backendURL}/updateTeamEventAttendance`, teamEventAttendance).then(
      (res) => res.data
    );
  }

  public static async getTeamEventAttendanceByUser(): Promise<TeamEventAttendance[]> {
    const res = APIWrapper.get(`${backendURL}/getTeamEventAttendanceByUser`).then(
      (res) => res.data
    );
    return res.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get all team event attendance for this user",
          contentMsg: `Error was: ${val.err}`
        });
        return [];
      }
      return val.teamEventAttendance as TeamEventAttendance[];
    });
  }
}
