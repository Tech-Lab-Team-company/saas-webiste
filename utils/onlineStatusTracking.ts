import ChangeOnlineStatusParams from "~/features/ChangeOnlineStatus/Core/Params/change_online_statue_params";
import { OnlineStatusEnum } from "~/features/ChangeOnlineStatus/Core/Enums/online_statue.enum";
import ChangeOnlineStatusController from "~/features/ChangeOnlineStatus/presentation/controllers/change_online_statue_controller";

const updateOnlineStatus = async (status: OnlineStatusEnum): Promise<boolean> => {
  if (!import.meta.client) return false;

  try {
    return await ChangeOnlineStatusController.getInstance().changeOnlineStatus(
      new ChangeOnlineStatusParams(status),
    );
  } catch (error) {
    console.warn("Could not update the user's online status.", error);
    return false;
  }
};

export const markUserOnline = () => updateOnlineStatus(OnlineStatusEnum.ONLINE);

export const markUserOffline = () => updateOnlineStatus(OnlineStatusEnum.OFFLINE);
