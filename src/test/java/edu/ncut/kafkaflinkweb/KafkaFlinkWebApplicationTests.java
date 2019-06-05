package edu.ncut.kafkaflinkweb;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.RestTemplate;

@RunWith(SpringRunner.class)
@SpringBootTest
public class KafkaFlinkWebApplicationTests {

    @Test
    public void restTemplateGetTest() {
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> responseEntity = restTemplate.getForEntity("http://10.5.81.243:8081/jobs/overview",
                String.class);
        String body = responseEntity.getBody();
        System.out.println(body);
//        restTemplate.getF("http://xxx.top/notice/list/1/5");
//        System.out.println(notice);
    }

}
