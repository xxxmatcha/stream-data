package edu.ncut.kafkaflinkweb.config;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;

public class ServerManager {

	private static Collection<WebsocketServer> servers = Collections.synchronizedCollection(new ArrayList<WebsocketServer>());


	public static void broadCast(String msg){
		for (WebsocketServer websocketServer : servers) {
			try {
				websocketServer.sendMessage(msg);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

	
	public static int getTotal(){
		return servers.size();
	}
	public static void add(WebsocketServer server){
		System.out.println("有新连接加入！ 当前总连接数是："+ servers.size());
		servers.add(server);
	}
	public static void remove(WebsocketServer server){
		System.out.println("有连接退出！ 当前总连接数是："+ servers.size());
		servers.remove(server);
	}
	
	
}
