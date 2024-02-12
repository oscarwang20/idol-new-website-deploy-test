import PermissionsManager from '../utils/permissionsManager';
import { NotFoundError, PermissionError } from '../utils/errors';
import ShoutoutsDao from '../dao/ShoutoutsDao';

const shoutoutsDao = new ShoutoutsDao();

export const getAllShoutouts = (): Promise<Shoutout[]> => shoutoutsDao.getAllShoutouts();

export const giveShoutout = async (body: Shoutout, user: IdolMember): Promise<Shoutout> => {
  if (body.giver.email !== user.email) {
    throw new PermissionError(
      `User with email: ${user.email} can't post a shoutout from a different user!`
    );
  }
  return shoutoutsDao.createShoutout(body);
};

export const getShoutouts = async (
  memberEmail: string,
  type: 'given' | 'received',
  user: IdolMember
): Promise<Shoutout[]> => {
  const canEdit: boolean = await PermissionsManager.canGetShoutouts(user);
  if (!canEdit && memberEmail !== user.email) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to get shoutouts!`
    );
  }
  return shoutoutsDao.getShoutouts(memberEmail, type);
};

export const hideShoutout = async (
  uuid: string,
  hide: boolean,
  user: IdolMember
): Promise<void> => {
  const canEdit = await PermissionsManager.canHideShoutouts(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to hide shoutouts!`
    );
  }
  const shoutout = await shoutoutsDao.getShoutout(uuid);
  if (!shoutout) throw new NotFoundError(`Shoutout with uuid: ${uuid} does not exist!`);
  await shoutoutsDao.updateShoutout({ ...shoutout, hidden: hide });
};

export const editShoutout = async (
  uuid: string,
  newMessage: string,
  user: IdolMember
): Promise<Shoutout> => {
  const shoutout = await shoutoutsDao.getShoutout(uuid);
  if (!shoutout) {
    throw new NotFoundError(`Shoutout with uuid: ${uuid} does not exist!`);
  }
  if (shoutout.giver.email !== user.email && !(await PermissionsManager.isLeadOrAdmin(user))) {
    throw new PermissionError(
      `User with email: ${user.email} is not authorized to edit this shoutout!`
    );
  }
  const updatedShoutout = { ...shoutout, message: newMessage };
  return shoutoutsDao.updateShoutout(updatedShoutout);
};

export const deleteShoutout = async (uuid: string, user: IdolMember): Promise<void> => {
  const shoutout = await shoutoutsDao.getShoutout(uuid);
  if (!shoutout) {
    throw new NotFoundError(`No shoutout with id '${uuid}' found.`);
  }
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin && shoutout.giver.email !== user.email) {
    throw new PermissionError(
      `You are not a lead or admin, so you can't delete a shoutout from a different user!`
    );
  }
  await shoutoutsDao.deleteShoutout(uuid);
};
