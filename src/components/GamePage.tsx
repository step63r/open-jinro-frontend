import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { Room, initRoom } from '../types/room';
import { User, initUser } from '../types/user';
import {
  Button,
  Container,
  List, ListItem, ListItemText,
  Stack,
} from '@mui/material';

const HUMAN_WIN = 'HumanWin';
const WOLVES_WIN = 'WolvesWin';
const CONTINUE_GAME = 'ContinueGame';

type Props = {
  socket: Socket,
};

const GamePage: React.FC<Props> = ({ socket }) => {
  const [user, setUser] = useState<User>(initUser);
  const [room, setRoom] = useState<Room>(initRoom);
  const [users, setUsers] = useState<User[]>([]);
  const [isAwaiting, setIsAwaiting] = useState<boolean>(false);
  const [suspects, setSuspects] = useState<User[]>([]);
  const [fortuneTellingUser, setFortuneTellingUser] = useState<User | null>(null);
  const [status, setStatus] = useState<string>(CONTINUE_GAME);
  const navigate = useNavigate();

  useEffect(() => {
    const roomId = sessionStorage.getItem('roomId');
    const userId = sessionStorage.getItem('userId');

    // client <--- server
    socket.on('getRoom', (room: Room, users: User[]) => {
      console.log('getRoom');
      setRoom({ ...room });
      setUsers([...users]);
    });

    socket.on('getUser', (user: User) => {
      console.log('getUser');
      setUser({ ...user });
    });

    socket.on('vote', (room: Room, users: User[]) => {
      updateSession(room, users, userId);
      socket.emit('awaitVoting', room.id, userId);
    });

    socket.on('murder', (room: Room, users: User[]) => {
      updateSession(room, users, userId);
      socket.emit('awaitNight', room.id, userId);
    });

    socket.on('hunt', (room: Room, users: User[]) => {
      updateSession(room, users, userId);
      socket.emit('awaitNight', room.id, userId);
    });

    socket.on('awaitDiscussion', (room: Room, users: User[]) => {
      updateSession(room, users, userId);
      setIsAwaiting(false);
    });

    socket.on('awaitVoting', (room: Room, users: User[], suspects: User[]) => {
      updateSession(room, users, userId);
      setSuspects([...suspects]);
      setIsAwaiting(false);
    });

    socket.on('awaitVotingResult', (room: Room, users: User[]) => {
      updateSession(room, users, userId);
      setIsAwaiting(false);
    });

    socket.on('awaitNight', (room: Room, users: User[]) => {
      updateSession(room, users, userId);
      setIsAwaiting(false);
    });

    socket.on('gameSet', (room: Room, users: User[], status: string) => {
      updateSession(room, users, userId);
      setStatus(status);
    });

    // client ---> server
    socket.emit('getRoom', roomId);
    socket.emit('getUser', userId);

    return () => {
      socket.off('getRoom');
      socket.off('getUser');
      socket.off('vote');
      socket.off('murder');
      socket.off('hunt');
      socket.off('awaitDiscussion');
      socket.off('awaitVoting');
      socket.off('awaitVotingResult');
      socket.off('awaitNight');
      socket.off('gameSet');
    };
  }, []);

  /**
   * セッション情報を更新する
   * @param room ルーム
   * @param users ルームに参加中のユーザー一覧
   * @param userId ユーザーID
   */
   const updateSession = (room: Room, users: User[], userId: string | null): void => {
    setRoom({ ...room });
    setUsers([...users]);
    const user = users.find((v) => v.id === userId);
    if (user) {
      setUser({ ...user });
    }
  }

  /**
   * ユーザーIDからユーザー情報を取得する
   * @param id ユーザーID
   * @returns ユーザー情報
   */
  const getUserById = (id: string): User | undefined => {
    const user = users.find((v) => v.id === id);
    return user;
  };

  /**
   * 議論フェーズ終了
   * @param e イベント引数
   */
  const handleDiscussion = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsAwaiting(true);
    socket.emit('awaitDiscussion', room.id, user.id);
  };

  /**
   * 投票ボタン押下
   * @param e イベント引数
   * @param user 投票先ユーザー
   */
  const handleVoting = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, user: User) => {
    e.preventDefault();
    setIsAwaiting(true);
    socket.emit('vote', room.id, user.id);
  };

  /**
   * 投票結果確認完了
   * @param e イベント引数
   */
  const handleVotingResult = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsAwaiting(true);
    socket.emit('awaitVotingResult', room.id, user.id);
  };

  /**
   * 夜フェーズ終了
   * @param e イベント引数
   */
  const handleNight = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsAwaiting(true);
    socket.emit('awaitNight', room.id, user.id);
  };

  /**
   * 人狼の行動
   * @param e イベント引数
   * @param user 襲撃対象ユーザー
   */
  const handleMurder = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, user: User) => {
    e.preventDefault();
    setIsAwaiting(true);
    socket.emit('murder', room.id, user.id);
  };

  /**
   * 占い師の行動
   * @param e イベント引数
   * @param targetUser 占い対象ユーザー
   */
  const handleFortuneTelling = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, targetUser: User) => {
    e.preventDefault();
    setIsAwaiting(true);
    // socket.emit('fortuneTelling', room.id, user.id);
    setFortuneTellingUser(targetUser);  
    socket.emit('awaitNight', room.id, user.id);
  };

  /**
   * 狩人（騎士）の行動
   * @param e イベント引数
   * @param user 守護対象ユーザー
   */
  const handleHunt = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, user: User) => {
    e.preventDefault();
    setIsAwaiting(true);
    socket.emit('hunt', room.id, user.id);
  };

  /**
   * トップページへ
   * @param e イベント引数
   */
  const handleToTopPage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <Stack spacing={2} direction='column' margin={4}>
      <h1>{room.days}日目 - {room.phase}</h1>
      <p>あなたの役職: {user.role}</p>
      {user.role === 'WereWolf' && room.rule.wereWolves > 1 && (
        <>
          <h2>あなた以外の人狼</h2>
          <List>
            {users.filter((v) => v.role === 'WereWolf' && v.id !== user.id).map((user) => (
              <ListItem key={user.id} disablePadding>
                <ListItemText primary={user.name} />
              </ListItem>
            ))}
          </List>
        </>
      )}

      <Container>
        <h2>情報・行動</h2>
        {status === CONTINUE_GAME && !user.isAlive && (
          <p>ゲーム終了までお待ちください。</p>
        )}

        {status === CONTINUE_GAME && user.isAlive && room.phase === 'Discussion' && (
          <>
            {user.role === 'FortuneTeller' && fortuneTellingUser && (
              <p>昨晩占った {fortuneTellingUser.name} は {fortuneTellingUser.role === 'WereWolf' ? '人狼' : '人間'} です。</p>
            )}
            {user.role === 'Medium' && room.lastLynched && (
              <p>昨日追放された {getUserById(room.lastLynched)?.name} は {getUserById(room.lastLynched)?.role === 'WereWolf' ? '人狼' : '人間'} でした。</p>
            )}
            <p>話し合いにより追放するプレイヤーを決めてください。</p>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button variant='contained'
                onClick={handleDiscussion} disabled={isAwaiting}>投票フェーズへ進む</Button>
            </Stack>
          </>
        )}

        {status === CONTINUE_GAME && user.isAlive && room.phase === 'Voting' && (
          <>
            <p>投票先を選択してください。</p>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              {users.filter((v) => v.isAlive && v.id !== user.id).map((user) => (
                <Button variant='contained' key={user.id}
                  onClick={(e) => handleVoting(e, user)} disabled={isAwaiting}>{user.name}</Button>
              ))}
            </Stack>
          </>
        )}

        {status === CONTINUE_GAME && user.isAlive && room.phase === 'VotingResult' && (
          <>
            {room.lastLynched && (
              <>
                <p>投票の結果 {suspects[0]?.name} が追放されました。</p>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant='contained' key={user.id}
                    onClick={handleVotingResult} disabled={isAwaiting}>夜フェーズへ進む</Button>
                </Stack>
                
              </>
            )}
            {!room.lastLynched && room.isFinalVoting && (
              <>
                <p>投票の結果、得票が割れました。</p>
                <p>以下のプレイヤーで決選投票を行います。</p>
                <p>決選投票でも決まらない場合は、このフェーズでは誰も追放されません。</p>
                <List>
                  {suspects.map((suspect) => (
                    <ListItem key={suspect.id}>
                      <ListItemText primary={suspect.name} />
                    </ListItem>
                  ))}
                </List>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant='contained' key={user.id}
                    onClick={handleVotingResult} disabled={isAwaiting}>話し合いフェーズへ進む</Button>
                </Stack>
                
              </>
            )}
            {!room.lastLynched && !room.isFinalVoting && (
              <>
                <p>決選投票の結果、得票が割れました。</p>
                <p>このフェーズでは誰も追放されませんでした。</p>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant='contained' key={user.id}
                    onClick={handleVotingResult} disabled={isAwaiting}>夜フェーズへ進む</Button>
                </Stack>
              </>
            )}
          </>
        )}

        {status === CONTINUE_GAME && user.isAlive && room.phase === 'Night' && (
          <>
            <p>夜になりました。</p>
            {user.role === 'WereWolf' && (
              <>
                <p>襲撃するプレイヤーを選択してください。</p>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  {users.filter((v) => v.isAlive && (v.role === 'FortuneTeller' || v.role === 'Medium' || v.role === 'Maniac' || v.role === 'Villager')).map((user) => (
                    <Button variant='contained' key={user.id}
                      onClick={(e) => handleMurder(e, user)} disabled={isAwaiting}>{user.name}</Button>
                  ))}
                </Stack>
              </>
            )}
            {user.role === 'FortuneTeller' && (
              <>
                <p>占うプレイヤーを選択してください。</p>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  {users.filter((v) => v.isAlive && v.id !== user.id).map((user) => (
                    <Button variant='contained' key={user.id}
                      onClick={(e) => handleFortuneTelling(e, user)} disabled={isAwaiting}>{user.name}</Button>
                  ))}
                </Stack>
                
              </>
            )}
            {user.role === 'Hunter' && (
              <>
                <p>人狼の襲撃から守るプレイヤーを選択してください。</p>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  {users.filter((v) => v.isAlive).map((user) => (
                    <Button variant='contained' key={user.id}
                      onClick={(e) => handleHunt(e, user)} disabled={isAwaiting}>{user.name}</Button>
                  ))}
                </Stack>
              </>
            )}
            {(user.role === 'Medium' || user.role === 'Maniac' || user.role === 'Villager') && (
              <>
                <p>夜の行動はありません。</p>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant='contained' key={user.id}
                    onClick={handleNight} disabled={isAwaiting}>翌日へ進む</Button>
                </Stack>
              </>
            )}
          </>
        )}
        {status !== CONTINUE_GAME && (
          <>
            <p>GAME SET</p>
            <p>{status === HUMAN_WIN ? '村人' : '人狼'}側が勝利しました。</p>
            
          </>
        )}
      </Container>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Container>
          <h2>生存しているプレイヤー</h2>
          <List>
            {users.filter((v) => v.isAlive).map((item) => (
              <ListItemText key={item.id} primary={`${item.name}${!user.isAlive || status !== CONTINUE_GAME ? ` (${item.role})` : ''}`} />
            ))}
          </List>
        </Container>
        <Container>
          <h2>追放・襲撃されたプレイヤー</h2>
          <List>
            {users.filter((v) => !v.isAlive).map((item) => (
              <ListItemText key={item.id} primary={`${item.name}${!user.isAlive || status !== CONTINUE_GAME ? ` (${item.role})` : ''}`} />
            ))}
          </List>
        </Container>
      </Stack>
      {status !== CONTINUE_GAME && (
        <Button variant='outlined' key={user.id}
          onClick={handleToTopPage}>トップへ戻る</Button>
      )}
    </Stack>
  );
}

export default GamePage;
