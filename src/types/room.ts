import { Rule, initRule } from './rule';
import { PHASE } from './phase';

/**
 * ルーム定義
 */
export type Room = {
  /** ルームID */
  id: string,
  /** ルーム名 */
  name: string,
  /** ルール */
  rule: Rule,
  /** 参加ユーザーIDリスト */
  userIds: string[],
  /** 進行中フラグ */
  inProgress: boolean,
  /** 経過日数 */
  days: number,
  /** 進行フェーズ */
  phase: PHASE,
  /** 決戦投票フラグ */
  isFinalVoting: boolean,
  /** 最後に追放されたユーザーID */
  lastLynched: string | null,
  /** 最後に襲撃されたユーザーID */
  lastMurdered: string | null,
  /** 最後に守護されたユーザーID */
  lastHunted: string | null,
};

export const initRoom: Room = {
  id: '',
  name: '',
  rule: initRule,
  userIds: [],
  inProgress: false,
  days: 0,
  phase: PHASE.Discussion,
  isFinalVoting: false,
  lastLynched: null,
  lastMurdered: null,
  lastHunted: null,
};
