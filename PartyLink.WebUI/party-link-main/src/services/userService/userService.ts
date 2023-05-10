import api from "../instances/api";
import { sha256 } from "../../utils/sha256";

import {
  IByIdResponse,
  ICreateData,
  IIdResponse,
  IUpdateDataInput,
  IUpdateEmailInput,
  IUpdateMobilePhoneInput,
  IUpdatePasswordInput,
  IUpdateResponse,
  IUploadAvatarDataInput
} from "./types";

export const userService = {
  getAll: async () => {
    const response = await api.get<IIdResponse[]>("/api/user");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<IByIdResponse>(`/api/user/${id}`);
    return response.data;
  },

  updateById: async ({ id, data }: IUpdateDataInput) => {
    const response = await api.put<IUpdateResponse>(`/api/user/${id}`, data);
    return response.data;
  },

  uploadAvatarById: async ({ id, data }: IUploadAvatarDataInput) => {
    const response = await api.put(`/api/user/${id}/avatar`, data);
    return response.data;
  },

  updateEmailById: async ({ id, data }: IUpdateEmailInput) => {
    const response = await api.put(`/api/user/${id}/email`, {
      newEmail: data.newEmail,
      passwordHash: (await sha256(data.passwordConfirmation))
    });
    return response.data;
  },

  updateMobilePhoneById: async ({ id, data }: IUpdateMobilePhoneInput) => {
    const response = await api.put(`/api/user/${id}/mobilePhone`, {
      newMobilePhone: data.newMobilePhone,
      passwordHash: (await sha256(data.passwordConfirmation))
    });
    return response.data;
  },

  updatePasswordById: async ({ id, data }: IUpdatePasswordInput) => {
    const response = await api.put(`/api/user/${id}/password`, {
      newPassword: data.newPassword,
      passwordHash: (await sha256(data.passwordConfirmation))
    });
    return response.data;
  },

  create: async (data: ICreateData) => {
    const response = await api.post<IIdResponse>("/api/user", data);
    return response.data;
  },

  delete: async (refreshToken: string) => {
    const response = await api.delete<IIdResponse>("/api/user", {
      data: {
        refreshToken
      }
    });
    return response.data;
  }
}