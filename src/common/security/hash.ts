import * as bcrypt from 'bcrypt';

export const hash = async (
  plan_text: string,
  saltRounds = Number(process.env.saltRounds),
) => {
  const hash = await bcrypt.hash(plan_text, saltRounds);
  return hash;
};

export const compare = async (plan_text: string, hash: string) => {
  const compare = await bcrypt.compare(plan_text, hash);
  return compare;
};
