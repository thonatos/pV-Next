import type { NextApiRequest, NextApiResponse } from 'next';
import { generateNonce } from 'siwe';
import { withSessionRoute } from 'lib/withSession';

const initRoute = async (
  req: NextApiRequest,
  res: NextApiResponse<Credential | any>
) => {
  const nonce = req.session.nonce || generateNonce();
  req.session.nonce = nonce;
  await req.session.save();
  res.json({
    success: true,
    data: {
      nonce,
    },
  });
};

export default withSessionRoute(initRoute);
