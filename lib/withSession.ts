import {
  NextApiHandler,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { IronSessionOptions } from 'iron-session';
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import type { Credential } from 'next-app';

export const sessionOptions: IronSessionOptions = {
  cookieName: process.env.SECRET_COOKIE_NAME || 'next',
  password: process.env.SECRET_COOKIE_PASSWORD || '',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    domain: process.env.SECRET_COOKIE_OPTIONS_DOMAIN || undefined,
  },
};

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

// Theses types are compatible with InferGetStaticPropsType https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getstaticprops
export function withSessionSsr<
  P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
  handler: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return withIronSessionSsr(handler, sessionOptions);
}

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
  interface IronSessionData {
    nonce?: string;
    credential?: Credential;
  }
}
