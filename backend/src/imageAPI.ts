import { Request, Response } from 'express';
import { checkLoggedIn } from './api';
import { db, bucket } from './firebase';
import { AllImagesResponse, ImageResponse, ErrorResponse } from './APITypes';
import { ProfileImage } from './DataTypes';
import { getNetIDFromEmail, filterImagesResponse } from './util';

export const allMemberImages = async (
  req: Request,
  res: Response
): Promise<AllImagesResponse | ErrorResponse | undefined> => {
  const files = await bucket.getFiles({ prefix: 'images/' });
  const images = await Promise.all(
    files[0].map(async (file) => {
      let signedURL = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60000 // 15 min
      });
      let fileName = await file.getMetadata().then((data) => data[1].body.name);
      return {
        fileName,
        url: signedURL[0]
      };
    })
  );
  return {
    images: filterImagesResponse(images),
    status: 200
  };
};

export const setMemberImage = async (
  req: Request,
  res: Response
): Promise<ImageResponse | ErrorResponse | undefined> => {
  if (checkLoggedIn(req, res)) {
    const user = await (
      await db.doc(`members/${req.session!.email}`).get()
    ).data();
    if (!user) {
      return {
        status: 401,
        error: `No user with email: ${req.session!.email}`
      };
    }
    const netId: string = getNetIDFromEmail(user.email);
    const file = bucket.file(`images/${netId}.jpg`);
    let signedURL = await file.getSignedUrl({
      action: 'write',
      version: 'v4',
      expires: Date.now() + 15 * 60000 // 15 min
    });
    return {
      status: 200,
      url: signedURL[0]
    };
  }
  return undefined;
};

export const getMemberImage = async (
  req: Request,
  res: Response
): Promise<ImageResponse | ErrorResponse | undefined> => {
  if (checkLoggedIn(req, res)) {
    const user = await (
      await db.doc(`members/${req.session!.email}`).get()
    ).data();
    if (!user) {
      return {
        status: 401,
        error: `No user with email: ${req.session!.email}`
      };
    }
    if (user.email !== req.session!.email) {
      return {
        status: 403,
        error: `User with email: ${
          req.session!.email
        } does not have permission to get members!`
      };
    }
    const netId: string = getNetIDFromEmail(user.email);
    const file = bucket.file(`images/${netId}.jpg`);
    let fileExists = await file.exists().then((result) => result[0]);
    if (!fileExists) {
      return {
        status: 404,
        error: `The requested image (${netId}.jpg) does not exist`
      };
    }
    let signedUrl = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60000
    });
    return {
      status: 200,
      url: signedUrl[0]
    };
  }
  return undefined;
};
