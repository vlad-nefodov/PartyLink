import api from "../instances/api";

export enum EventUserRole {
  Owner = 0,
  Participant = 1,
  Pending = 2
}

export interface IAvatar {
  base64Image: string
}

export interface IEventLocation {
  latitude: number,
  longitude: number
}

export interface IEventTag {
  id: string,
  title: string
}

export interface IEventUserResponse {
  id: string,
  eventUserRole: EventUserRole,
  name: string,
  surname: string,
  avatar: IAvatar;
}

export interface IEventResponse {
  id: string,
  ownerUser: IEventUserResponse,
  participantsCount: number,
  title: string,
  description: string,
  startsAt: string,
  endsAt: string,
  location: IEventLocation,
  tags: IEventTag[]
}

export const eventService = {
  getAll: async () => {
    const response = await api.get<IEventResponse[]>("/api/event");
    return response.data;
  }
}