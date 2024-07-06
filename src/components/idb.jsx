import { openDB } from 'idb';

const dbPromise = openDB('chat-db', 1, {
  upgrade(db) {
    db.createObjectStore('messages', {
      keyPath: 'id',
      autoIncrement: true,
    });
  },
});

export const addMessage = async (message) => {
  const db = await dbPromise;
  await db.add('messages', message);
};

export const getMessages = async (userId) => {
  const db = await dbPromise;
  const allMessages = await db.getAll('messages');
  return allMessages.filter(message => message.userId === userId);
};

export const clearMessages = async () => {
  const db = await dbPromise;
  await db.clear('messages');
};
