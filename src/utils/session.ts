import type { Session } from 'next-auth';

export function getUserDisplay(data: Session) {
  return data.user?.name || data.user?.email;
}
