import { message } from 'antd';
import { createApiClient } from '@/scripts/common/http';

const apiClient = createApiClient();

const LoginCheck = async () => {
  try {
    return await apiClient({
      url: '/account/login',
    }).result;
  } catch (e) {
    return null;
  }
};

const DoLogin = async (nickname) => {
  try {
    await apiClient({
      method: 'post',
      url: '/account/login',
      data: { nickname },
    }).result;
  } catch (e) {
    message.error(e.message);
  }
};

export default {
  API: {
    LoginCheck,
    DoLogin,
  },
};
