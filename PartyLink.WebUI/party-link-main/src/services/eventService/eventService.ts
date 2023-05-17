import api from "../instances/api";

export enum EventUserRole {
  Owner = 0,
  Participant = 1,
  Pending = 2
}

export interface IIdResponse {
  id: string
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

export interface IEventUserRole {
  userId: string,
  role: EventUserRole
}

export interface IEventResponse {
  id: string,
  ownerUser: IEventUserResponse,
  usersRoles: IEventUserRole[]
  participantsCount: number,
  title: string,
  description: string,
  startsAt: Date,
  endsAt: Date,
  location: IEventLocation,
  tags: IEventTag[]
}

export interface ICreateTagData {
  title: string
}

export interface ICreateEventData {
  title: string,
  description: string,
  startsAt: Date,
  endsAt: Date,
  location: IEventLocation,
  tags: ICreateTagData[]
}

export interface IUpdateEventData {
  id: string
  title: string,
  description: string,
  startsAt: Date,
  endsAt: Date,
  location: IEventLocation,
  tags: ICreateTagData[]
}

const getLocalDate = (date: Date) => {
  const timeZoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - timeZoneOffset);
  return localDate as Date;
}

export const eventService = {
  getAll: async () => {
    const response = await api.get<IEventResponse[]>("/api/event");
    return response.data;
  },
  create: async (data: ICreateEventData) => {
    const response = await api.post<IIdResponse>("/api/event", {
      ...data,
      startsAt: getLocalDate(data.startsAt),
      endsAt: getLocalDate(data.endsAt)
    });
    return response.data;
  },
  update: async (data: IUpdateEventData) => {
    const response = await api.put(`/api/event/${data.id}`, {
      ...data,
      startsAt: getLocalDate(data.startsAt),
      endsAt: getLocalDate(data.endsAt)
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<IIdResponse>(`/api/event/${id}`);
    return response.data;
  }
}