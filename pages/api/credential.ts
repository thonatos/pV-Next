import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from 'lib/withSession';
import type { Credential } from 'next-app';

const credentialRoute = async (
  req: NextApiRequest,
  res: NextApiResponse<Credential | any>
) => {
  const credential = req.session.credential;

  if (!credential) {
    res.status(403).send('no data');
    return;
  }

  res.json({
    success: true,
    data: {
      credential,
    },
  });
};

export default withSessionRoute(credentialRoute);
