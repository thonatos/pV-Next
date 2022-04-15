import { SiweMessage } from 'siwe';
import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from 'lib/withSession';
import type { Credential } from 'next-app';

const loginRoute = async (
  req: NextApiRequest,
  res: NextApiResponse<Credential | any>
) => {
  if (req.method !== 'POST') {
    res.status(400).json({
      success: false,
      message: 'invalid method',
    });
    return;
  }

  const { message, signature } = JSON.parse(req.body || '{}');

  if (!message || !signature) {
    res.status(422).json({
      success: false,
      message: 'invalid params',
    });
    return;
  }

  const siwe = new SiweMessage(message);
  const fileds = await siwe.validate(signature);

  const credential: Credential = {
    siwe: fileds,
  };

  req.session.credential = credential;

  await req.session.save();

  res.json({
    success: true,
    data: {
      credential,
    },
  });
};

export default withSessionRoute(loginRoute);
