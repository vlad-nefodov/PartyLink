export enum Gender {
  Male = 0,
  Female = 1,
  Other = 2
}

export interface ICreateData {
  name: string,
  surname: string,
  gender: Gender,
  email: string,
  mobilePhone: string
  password: string
}

export type IIdResponse = {
  id: string
}

export type IAvatar = {
  base64Image: string
}

export type IByIdResponse = {
  id: string,
  name: string,
  surname: string,
  gender: Gender,
  email: string,
  mobilePhone: string
  avatar: IAvatar | null
}

export type IUpdateData = {
  newName: string,
  newSurname: string,
  newGender: Gender
}

export type IUpdateDataInput = {
  id: string,
  data: IUpdateData
}

export type IUploadAvatarDataInput = {
  id: string,
  data: IAvatar
}

export type IUpdateEmailData = {
  newEmail: string,
  passwordConfirmation: string,
}

export type IUpdateEmailInput = {
  id: string,
  data: IUpdateEmailData
}

export type IUpdateMobilePhoneData = {
  newMobilePhone: string,
  passwordConfirmation: string,
}

export type IUpdateMobilePhoneInput = {
  id: string,
  data: IUpdateMobilePhoneData
}

export type IUpdatePasswordData = {
  newPassword: string,
  passwordConfirmation: string,
}

export type IUpdatePasswordInput = {
  id: string,
  data: IUpdatePasswordData
}

export type IUpdateResponse = {
  id: string,
  name: string,
  surname: string,
  gender: Gender
}