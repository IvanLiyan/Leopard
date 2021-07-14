import type { NextApiRequest, NextApiResponse } from "next";

const status = (_: NextApiRequest, res: NextApiResponse): void => {
  res.status(200).json({ ok: true });
};

export default status;
