import React, { useState, useEffect, useRef, PropsWithChildren } from "react";
import socketIOClient, { Socket, io } from "socket.io-client";
import config from "../../config"; // import { SERVER_URL } from "../../constant/env";


export interface SocketInterface {
  curSocket: Socket;
}

export const SocketContext = React.createContext<SocketInterface>(
  {} as SocketInterface
);

export const SocketContextProvider: React.FC = ({
  children,
}) => {
  // const [curSocket, setCurSocket] = useState<Socket>({} as Socket);

  // useEffect(() => {
  //   const socket = socketIOClient(SERVER_URL);
  //   setCurSocket(socket);
  // }, []);

  const socketRef = useRef(io(config.casinoUrl));

  return (
    <SocketContext.Provider
      value={{
        curSocket: socketRef.current,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
