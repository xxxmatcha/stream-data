package edu.ncut.kafkaflinkweb.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static edu.ncut.kafkaflinkweb.controller.generate_jar_rest.CurlTest.execCurlRun;
import static edu.ncut.kafkaflinkweb.controller.generate_jar_rest.CurlTest.execCurlUpload;

import com.squareup.javapoet.MethodSpec;
import com.squareup.javapoet.TypeSpec;
import edu.ncut.kafkaflinkweb.controller.generate_jar_rest.CompilerAndJarTools;
import edu.ncut.kafkaflinkweb.controller.generate_jar_rest.GenerateFlinkTest;
import edu.ncut.kafkaflinkweb.entity.Task;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class RunController {
    @RequestMapping("/runTask")
    @Async
    @ResponseBody
    public void suibian(@RequestBody Task task) throws IOException {
//        String ip = "10.5.81.243";
//        String consumerTopic = "test2";
//        String producerTopic = "filterComputer";
        System.out.println(task);
        double threshold = 40;
        String filter = "filter";
        String jarDir = "D:\\test\\finaltest2";

        String ip = task.getIp();
        String consumerTopic = task.inTopic;
        String producerTopic = task.outTopic;

        //生成代码
        TypeSpec myFlatMap = GenerateFlinkTest.genMyFlatMap(threshold);
        MethodSpec myMain = GenerateFlinkTest.genMain(ip+":9092", consumerTopic, producerTopic, myFlatMap);
        TypeSpec myClass = GenerateFlinkTest.genClass(myMain);
        GenerateFlinkTest.genCode(jarDir,myClass);

        //编译+打包
        CompilerAndJarTools cl = new CompilerAndJarTools(jarDir, jarDir+"/classes", jarDir+ "/target/GenerateFlink.jar");
        cl.complier();
        cl.generateJar();

        //rest
        String[] uploadCmds = new String[]{"curl", "-X", "POST", "-H", "\"Expect:\"", "-F"};
        String jarfile = "\"jarfile=@" + jarDir+ "/target/GenerateFlink.jar" + "\"";
        String cluster = ip + ":8081/jars/upload";
        List<String> uploadJar = new ArrayList<String>();
        for (int i = 0; i < uploadCmds.length ; i++) {
            uploadJar.add(uploadCmds[i]);
        }
        uploadJar.add(jarfile);
        uploadJar.add(cluster);
        String jarId = execCurlUpload(uploadJar);

        String[] runCmds = new String[]{"curl","-X","POST"};
        List<String> runJar = new ArrayList<String>();
        for (int i = 0; i < runCmds.length; i++) {
            runJar.add(runCmds[i]);
        }
        runJar.add("http://"+ip+":8081"+"/jars/"+jarId+"/run");
        System.out.println(runJar);
        execCurlRun(runJar);
    }
}
