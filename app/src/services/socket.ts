import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://ciphercrew-api.onrender.com';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Set up default listeners
    this.setupDefaultListeners();
  }

  private setupDefaultListeners() {
    if (!this.socket) return;

    // User status updates
    this.socket.on('user_status', (data) => {
      this.emit('user_status', data);
    });

    // Messages
    this.socket.on('new_message', (data) => {
      this.emit('new_message', data);
    });

    this.socket.on('message_reaction', (data) => {
      this.emit('message_reaction', data);
    });

    this.socket.on('message_deleted', (data) => {
      this.emit('message_deleted', data);
    });

    // Typing
    this.socket.on('user_typing', (data) => {
      this.emit('user_typing', data);
    });

    // Room events
    this.socket.on('user_joined', (data) => {
      this.emit('user_joined', data);
    });

    this.socket.on('user_left', (data) => {
      this.emit('user_left', data);
    });

    // Call events
    this.socket.on('incoming_call', (data) => {
      this.emit('incoming_call', data);
    });

    this.socket.on('call_accepted', (data) => {
      this.emit('call_accepted', data);
    });

    this.socket.on('call_rejected', (data) => {
      this.emit('call_rejected', data);
    });

    this.socket.on('call_ended', (data) => {
      this.emit('call_ended', data);
    });

    this.socket.on('call_participant_left', (data) => {
      this.emit('call_participant_left', data);
    });

    // WebRTC signaling
    this.socket.on('webrtc_offer', (data) => {
      this.emit('webrtc_offer', data);
    });

    this.socket.on('webrtc_answer', (data) => {
      this.emit('webrtc_answer', data);
    });

    this.socket.on('webrtc_ice_candidate', (data) => {
      this.emit('webrtc_ice_candidate', data);
    });

    // Watch party
    this.socket.on('watchparty_created', (data) => {
      this.emit('watchparty_created', data);
    });

    this.socket.on('watchparty_joined', (data) => {
      this.emit('watchparty_joined', data);
    });

    this.socket.on('watchparty_sync', (data) => {
      this.emit('watchparty_sync', data);
    });

    // Screen share
    this.socket.on('screenshare_started', (data) => {
      this.emit('screenshare_started', data);
    });

    this.socket.on('screenshare_stopped', (data) => {
      this.emit('screenshare_stopped', data);
    });

    // Game events
    this.socket.on('game_created', (data) => {
      this.emit('game_created', data);
    });

    this.socket.on('player_joined', (data) => {
      this.emit('player_joined', data);
    });

    this.socket.on('player_left', (data) => {
      this.emit('player_left', data);
    });

    this.socket.on('player_ready', (data) => {
      this.emit('player_ready', data);
    });

    this.socket.on('game_action', (data) => {
      this.emit('game_action', data);
    });

    this.socket.on('game_state', (data) => {
      this.emit('game_state', data);
    });
  }

  // Event emitter pattern
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  off(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    });
  }

  // Emit events to server
  joinRoom(roomId: string) {
    this.socket?.emit('join_room', roomId);
  }

  leaveRoom(roomId: string) {
    this.socket?.emit('leave_room', roomId);
  }

  startTyping(roomId: string) {
    this.socket?.emit('typing_start', { roomId });
  }

  stopTyping(roomId: string) {
    this.socket?.emit('typing_stop', { roomId });
  }

  // Call methods
  initiateCall(roomId: string, callType: 'voice' | 'video', targetUserId?: string) {
    this.socket?.emit('call_initiate', { roomId, callType, targetUserId });
  }

  acceptCall(callId: string) {
    this.socket?.emit('call_accept', { callId });
  }

  rejectCall(callId: string) {
    this.socket?.emit('call_reject', { callId });
  }

  endCall(callId: string) {
    this.socket?.emit('call_end', { callId });
  }

  sendWebRTCOffer(callId: string, offer: RTCSessionDescriptionInit, targetUserId: string) {
    this.socket?.emit('webrtc_offer', { callId, offer, targetUserId });
  }

  sendWebRTCAnswer(callId: string, answer: RTCSessionDescriptionInit, targetUserId: string) {
    this.socket?.emit('webrtc_answer', { callId, answer, targetUserId });
  }

  sendICECandidate(callId: string, candidate: RTCIceCandidateInit, targetUserId: string) {
    this.socket?.emit('webrtc_ice_candidate', { callId, candidate, targetUserId });
  }

  // Watch party methods
  createWatchParty(roomId: string, videoUrl: string, platform: string) {
    this.socket?.emit('watchparty_create', { roomId, videoUrl, platform });
  }

  joinWatchParty(partyId: string) {
    this.socket?.emit('watchparty_join', { partyId });
  }

  syncWatchParty(partyId: string, state: 'playing' | 'paused', currentTime: number) {
    this.socket?.emit('watchparty_sync', { partyId, state, currentTime });
  }

  startScreenShare(roomId: string) {
    this.socket?.emit('screenshare_start', { roomId });
  }

  stopScreenShare(roomId: string) {
    this.socket?.emit('screenshare_stop', { roomId });
  }

  // Game methods
  createGame(gameType: string, maxPlayers: number) {
    this.socket?.emit('game_create', { gameType, maxPlayers });
  }

  joinGame(gameId: string) {
    this.socket?.emit('game_join', { gameId });
  }

  setReady(gameId: string, ready: boolean) {
    this.socket?.emit('game_ready', { gameId, ready });
  }

  sendGameAction(gameId: string, action: string, data: any) {
    this.socket?.emit('game_action', { gameId, action, data });
  }

  updateGameState(gameId: string, state: any) {
    this.socket?.emit('game_state_update', { gameId, state });
  }

  leaveGame(gameId: string) {
    this.socket?.emit('game_leave', { gameId });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.listeners.clear();
  }

  get isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
export default socketService;
