/**
 * ルール定義
 */
 export type Rule = {
  /** 人狼の数 */
  wereWolves: number,
  /** 占い師の数 */
  fortuneTellers: number,
  /** 霊媒師の数 */
  mediumns: number,
  /** 狩人（騎士）の数 */
  hunters: number,
  /** 狂人の数 */
  maniacs: number,
  /** 村人の数 */
  villagers: number,
};

export const initRule: Rule = {
  wereWolves: 1,
  fortuneTellers: 1,
  mediumns: 0,
  hunters: 0,
  maniacs: 0,
  villagers: 4
};
