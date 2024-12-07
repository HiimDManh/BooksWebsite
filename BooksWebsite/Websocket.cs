using BooksWebsite.Models;
using Fleck;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BooksWebsite
{
    public class Websocket
    {
        public static BookReadingEntities db = new BookReadingEntities();
        static List<UserConnection> connectedUsers = new List<UserConnection>();
        static List<Room> rooms = new List<Room>();

        public void Main()
        {
            var server = new WebSocketServer("wss://0.0.0.0:8181");
            var room = rooms.FirstOrDefault(r => r.RoomName == "NCCD");
            if (room == null)
            {
                room = new Room { RoomName = "NCCD" };
                rooms.Add(room);
            }
            server.Start(socket =>
            {
                UserConnection currentUser = null;

                socket.OnOpen = () =>
                {
                    Console.WriteLine("New connection established.");
                };

                socket.OnClose = () =>
                {
                    Console.WriteLine("Connection closed.");
                    if (currentUser != null)
                    {
                        connectedUsers.Remove(currentUser);
                        LeaveAllRooms(currentUser);
                    }
                };

                socket.OnMessage = message =>
                {
                    Console.WriteLine($"Message received: {message}");

                    var parts = message.Split('|');
                    var command = parts[0];
                    var payload = parts.Length > 1 ? parts[1] : null;

                    switch (command)
                    {
                        case "REGISTER":
                            // Register username
                            currentUser = new UserConnection { Username = payload, Socket = socket };
                            connectedUsers.Add(currentUser);
                            socket.Send("REGISTERED|" + payload);
                            break;

                        case "PRIVATE":
                            // Send private message (format: PRIVATE|recipientUsername|message)
                            if (parts.Length >= 3)
                            {
                                var recipientUsername = parts[1];
                                var privateMessage = parts[2];
                                SendPrivateMessage(currentUser, recipientUsername, privateMessage);
                            }
                            break;

                        case "JOIN_ROOM":
                            // Join a room (format: JOIN_ROOM|roomName)
                            JoinRoom(currentUser, "NCCD");
                            break;

                        case "LEAVE_ROOM":
                            // Leave a room (format: LEAVE_ROOM|roomName)
                            LeaveRoom(currentUser, payload);
                            break;

                        case "ROOM_MESSAGE":
                            // Send a message to a room (format: ROOM_MESSAGE|roomName|message)
                            if (parts.Length >= 3)
                            {
                                var roomName = parts[1];
                                var roomMessage = parts[2];
                                SendRoomMessage(currentUser, roomName, roomMessage);
                            }
                            break;

                        default:
                            socket.Send("ERROR|Unknown command");
                            break;
                    }
                };
            });
        }

        static void SendPrivateMessage(UserConnection sender, string recipientUsername, string message)
        {

            var recipient = db.Users.FirstOrDefault(u => u.username == recipientUsername);
            var rec = connectedUsers.FirstOrDefault(u => u.Username == recipientUsername);
            if (recipient != null)
            {
                Chat chat = new Chat()
                {
                    Message = message,
                    CreateDate = DateTime.Now,
                    Sender = sender.Username,
                    Recipient = recipient.username,
                    StatusRead = false,
                };
                db.Chats.Add(chat);
                db.SaveChanges();
                sender.Socket.Send($"PRIVATE_SENT|{recipientUsername}|{message}|{sender.Username}");
                if (rec != null)
                {
                    rec.Socket.Send($"PRIVATE_SENT|{recipientUsername}|{message}|{sender.Username}");
                }

            }
            else
            {
                sender.Socket.Send($"ERROR|User {recipientUsername} not found");
            }
        }

        static void JoinRoom(UserConnection user, string roomName)
        {
            var room = rooms.FirstOrDefault(r => r.RoomName == roomName);
            if (room == null)
            {
                room = new Room { RoomName = roomName };
                rooms.Add(room);
            }

            if (!room.Users.Contains(user))
            {
                room.Users.Add(user);
                user.Socket.Send($"JOINED_ROOM|{roomName}");
                BroadcastRoomMessage(room, "SERVER", $"{user.Username} has joined the room");
            }
        }

        static void LeaveRoom(UserConnection user, string roomName)
        {
            var room = rooms.FirstOrDefault(r => r.RoomName == roomName);
            if (room != null && room.Users.Contains(user))
            {
                room.Users.Remove(user);
                user.Socket.Send($"LEFT_ROOM|{roomName}");
                BroadcastRoomMessage(room, "SERVER", $"{user.Username} has left the room");

                if (room.Users.Count == 0)
                {
                    rooms.Remove(room); // Remove empty rooms
                }
            }
        }

        static void LeaveAllRooms(UserConnection user)
        {
            foreach (var room in rooms.Where(r => r.Users.Contains(user)).ToList())
            {
                LeaveRoom(user, room.RoomName);
            }
        }

        static void SendRoomMessage(UserConnection sender, string roomName, string message)
        {
            var room = rooms.FirstOrDefault(r => r.RoomName == roomName);
            if (room != null)
            {
                BroadcastRoomMessage(room, sender.Username, message);
            }
            else
            {
                sender.Socket.Send($"ERROR|Room {roomName} not found");
            }
        }

        static void BroadcastRoomMessage(Room room, string sender, string message)
        {
            if (sender != "SERVER")
            {
                MessageChat chat = new MessageChat()
                {
                    Message = message,
                    CreateDate = DateTime.Now,
                    IdUser = sender,
                };
                db.MessageChats.Add(chat);
                db.SaveChanges();
            }
            foreach (var user in room.Users)
            {
                user.Socket.Send($"ROOM_MESSAGE|{room.RoomName}|{sender}|{message}");
            }
        }
    }
    public class UserConnection
    {
        public string Username { get; set; }
        public bool Status { get; set; }
        public IWebSocketConnection Socket { get; set; }
    }

    public class Room
    {
        public string RoomName { get; set; }
        public List<UserConnection> Users { get; set; } = new List<UserConnection>();
    }
}