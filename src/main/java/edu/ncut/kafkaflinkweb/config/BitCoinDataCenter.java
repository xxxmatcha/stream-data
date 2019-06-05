package edu.ncut.kafkaflinkweb.config;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import javax.servlet.ServletConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import java.util.Collections;
import java.util.Properties;
import java.util.Random;

@WebServlet(name="BitCoinDataCenter",urlPatterns = "/BitCoinDataCenter",loadOnStartup=1) //标记为Servlet不是为了其被访问，而是为了便于伴随Tomcat一起启动
public class BitCoinDataCenter extends HttpServlet implements Runnable{

	public KafkaConsumer<String,String> consumer;

	public BitCoinDataCenter(){}

	public void init(ServletConfig config){
		startup();
	}
	
	public  void startup(){
		new Thread(this).start();
	}
	@Override
	public void run() {
		int bitPrice = 100000;
		while(true){

			//每隔1-3秒就产生一个新价格
			int duration = 1000+new Random().nextInt(2000);
			try {
				Thread.sleep(duration);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			//新价格围绕100000左右50%波动
			float random = 1+(float) (Math.random()-0.5);
			int newPrice = (int) (bitPrice*random);

//			查看的人越多，价格越高
		int total = ServerManager.getTotal();
			newPrice = newPrice*total;
//		Properties props= new Properties();
//
//		props.setProperty("bootstrap.servers","10.5.81.243:9092");
//		props.setProperty("group.id", "test");
//		props.setProperty("enable.auto.commit", "true");
//		props.setProperty("auto.commit.interval.ms", "1000");
//		props.setProperty("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
//		props.setProperty("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
//		System.out.println("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
//		KafkaConsumer<String,String> consumer = new KafkaConsumer<String, String>(props);
//		consumer.subscribe(Collections.singletonList("test3"));
//		while (true){
//			ConsumerRecords<String,String> records = consumer.poll(100);
//
//			for (ConsumerRecord<String, String> record : records) {
//				String messageFormat = "{\"value\":\"%f\",\"total\":%d}";
//				String message = String.format(messageFormat, Float.valueOf(record.value()),total);
//				System.out.println(message);
//				ServerManager.broadCast(message);
//			}
//		}
			String messageFormat = "{\"price\":\"%d\",\"total\":%d}";
			String message = String.format(messageFormat, newPrice,total);
			//广播出去
			ServerManager.broadCast(message);
		}
	}

	public void close() {
		try {
			consumer.close();
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}
}
