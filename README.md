# ρV-Next

> SSO - Auth provider powered by Ethereum & Next.js .

Sign-In with Ethereum.

使用以太坊对加签后在后端验证签名并存储在 Session & Cookies 中，后可通过 SSO 进行验证。

use ethereum to sign your signature, verify by your backend app, then store it to session & cookies, then you can auth with SSO.

- SSO Authentication with iron-session .
- Mapping Roles by SPSR NFT (BSC Test Network) .

## Authentication

share session fields.

```ts
export interface Credential {
  siwe?: any;
  roles?: string[];
}
```

after login with [https://next.implements.io](https://next.implements.io) . we can get roles and wallet address by cookie-session under `.implements.io` with the fields.

```ts
// app/middleware/iron.ts
import { EggAppConfig, Context } from 'egg';
import { getIronSession } from 'iron-session';

export default (iron: EggAppConfig['iron']) => {
  return async (ctx: Context, next: () => Promise<any>) => {
    const options = iron.options;

    // @ts-ignore
    const ironSession = await getIronSession(ctx.req, ctx.res, options);

    // @ts-ignore
    const { credential } = ironSession;

    if (credential) {
      ctx.session.siwe = credential.siwe;
      ctx.session.roles = credential.roles;
    }

    await next();
  };
};
```

## Prepare

- install [MetaMask](https://metamask.io/download/) and create an acount .

## Develop

```bash
$ pnpm i
$ npm run dev
# or
$ yarn
$ yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## More

- [EIP-4361: Sign-In with Ethereum.](https://eips.ethereum.org/EIPS/eip-4361)
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
