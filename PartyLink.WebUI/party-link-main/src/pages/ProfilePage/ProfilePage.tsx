import './ProfilePage.scss';
import { Container, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService/userService';
import { IProfileInfoInputs } from './components/ProfileInfoSection/ProfileInfoSection';
import { ToastContainer, toast } from 'react-toastify';

import {
  IByIdResponse,
  IUpdateDataInput,
  IUpdateEmailInput,
  IUpdateMobilePhoneInput,
  IUpdatePasswordInput,
  IUpdateResponse
} from '../../services/userService/types';

import AvatarSection from './components/AvatarSection/AvatarSection';
import ProfileInfoSection from './components/ProfileInfoSection/ProfileInfoSection';
import ProfileSecuritySection from './components/ProfileSecuritySection/ProfileSecuritySection';
import LoadingContainer from '../../components/LoadingContainer/LoadingContainer';
import { IEmailSectionInputs } from './components/ProfileSecuritySection/components/EmailSection/EmailSection';
import { IMobilePhoneSectionInputs } from './components/ProfileSecuritySection/components/MobilePhoneSection/MobilePhoneSection';
import { IPasswordSectionInputs } from './components/ProfileSecuritySection/components/PasswordSection/PasswordSection';

const ProfilePage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: loadedProfileInfoData,
    isLoading: loadedProfileInfoIsLoading,
    isError: loadedProfileInfoIsError
  } = useQuery<IByIdResponse>('userByIdProfilePage', () => userService.getById(user?.id as string));

  const showSuccess = () => {
    toast.success("Changes applied!");
  }
  const onSuccessChangesHandle = () => {
    queryClient.invalidateQueries('userByIdProfilePage');
    showSuccess();
  }

  const {
    mutate: updateByIdMutate
  } = useMutation<IUpdateResponse, Error, IUpdateDataInput>('userUpdateByIdProfilePage', userService.updateById, {
    onSuccess: onSuccessChangesHandle
  });
  const {
    mutate: uploadAvatarByIdMutate
  } = useMutation('uploadAvatarByIdProfilePage', userService.uploadAvatarById, {
    onSuccess: onSuccessChangesHandle
  });
  const {
    mutate: updateEmailByIdMutate
  } = useMutation('updateEmailByIdProfilePage', userService.updateEmailById, {
    onSuccess: onSuccessChangesHandle
  });
  const {
    mutate: updateMobilePhoneByIdMutate
  } = useMutation('updateMobilePhoneByIdProfilePage', userService.updateMobilePhoneById, {
    onSuccess: onSuccessChangesHandle
  });
  const {
    mutate: updatePasswordByIdMutate
  } = useMutation('updatePasswordByIdProfilePage', userService.updatePasswordById, {
    onSuccess: onSuccessChangesHandle
  });

  const uploadAvatarHandle = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Image = event.target?.result;
      uploadAvatarByIdMutate({
        id: user?.id as string,
        data: {
          base64Image: base64Image as string
        }
      });
    };
    reader.readAsDataURL(file as File);
  }

  const updateInfoDataHandle = (inputs: IProfileInfoInputs) => {
    const updateDataInput: IUpdateDataInput = {
      id: user?.id as string,
      data: {
        newName: inputs.name.val,
        newSurname: inputs.surname.val,
        newGender: inputs.gender
      }
    }
    updateByIdMutate(updateDataInput);
  }

  const updateEmailHandle = (inputs: IEmailSectionInputs) => {
    const updateDataInput: IUpdateEmailInput = {
      id: user?.id as string,
      data: {
        newEmail: inputs.email.val,
        passwordConfirmation: inputs.passwordConfirmation.val
      }
    }
    updateEmailByIdMutate(updateDataInput);
  }

  const updateMobilePhoneHandle = (inputs: IMobilePhoneSectionInputs) => {
    const updateDataInput: IUpdateMobilePhoneInput = {
      id: user?.id as string,
      data: {
        newMobilePhone: inputs.mobilePhone.val,
        passwordConfirmation: inputs.passwordConfirmation.val
      }
    }
    updateMobilePhoneByIdMutate(updateDataInput);
  }

  const updatePasswordHandle = (inputs: IPasswordSectionInputs) => {
    const updateDataInput: IUpdatePasswordInput = {
      id: user?.id as string,
      data: {
        newPassword: inputs.password.val,
        passwordConfirmation: inputs.passwordConfirmation.val
      }
    }
    updatePasswordByIdMutate(updateDataInput);
  }

  if (
    loadedProfileInfoIsLoading ||
    loadedProfileInfoIsError
  )
    return <LoadingContainer />;

  return (
    <Container className="profile-page-container">
      <Row className='justify-content-center'>
        <Col>
          <Container className='profile-form'>
            <Row>
              <Col xs={12} className='mb-4'>
                <AvatarSection {...loadedProfileInfoData as IByIdResponse} onSelectFile={uploadAvatarHandle} />
              </Col>
              <Col xs={12} className='mb-4'>
                <ProfileInfoSection {...loadedProfileInfoData as IByIdResponse} onSubmit={updateInfoDataHandle} />
              </Col>
              <Col xs={12}>
                <ProfileSecuritySection
                  {...loadedProfileInfoData as IByIdResponse}
                  onEmailSubmit={updateEmailHandle}
                  onMobilePhoneSubmit={updateMobilePhoneHandle}
                  onPasswordSubmit={updatePasswordHandle}
                />
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme='colored'
      />
    </Container>
  );
}

export default ProfilePage;