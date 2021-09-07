import type { NextApiRequest, NextApiResponse } from "next";

const _health = (_: NextApiRequest, res: NextApiResponse): void => {
  res.status(200).json({ ok: true });
};

export default _health;
