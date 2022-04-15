import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from 'lib/withSession';

const logoutRoute = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  req.session.destroy();
  res.json({
    success: true,
    data: {},
  });
};

export default withSessionRoute(logoutRoute);
