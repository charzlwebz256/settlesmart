// Conversation history for Nexa, kept on this device only.
const KEY = 'settlesmart.nexa.conversations';
const MAX_CONVERSATIONS = 20;

export function newConversation() {
  return {
    id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: 'New conversation',
    messages: [],
    updatedAt: Date.now(),
  };
}

export function loadConversations() {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch (_e) {
    return [];
  }
}

export function saveConversation(conversation) {
  try {
    const others = loadConversations().filter((c) => c.id !== conversation.id);
    const title =
      conversation.title && conversation.title !== 'New conversation'
        ? conversation.title
        : (conversation.messages.find((m) => m.role === 'user')?.content || 'New conversation').slice(0, 60);
    const next = [{ ...conversation, title, updatedAt: Date.now() }, ...others]
      .filter((c) => c.messages.length > 0)
      .slice(0, MAX_CONVERSATIONS);
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch (_e) {
    return null;
  }
}

export function deleteConversation(id) {
  try {
    const next = loadConversations().filter((c) => c.id !== id);
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch (_e) {
    return null;
  }
}