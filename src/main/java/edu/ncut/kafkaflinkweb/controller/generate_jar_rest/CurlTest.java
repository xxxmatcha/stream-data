package edu.ncut.kafkaflinkweb.controller.generate_jar_rest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class CurlTest {

    String[] cmds = new String[]{"curl", "-X", "POST", "-H", "\"Expect:\"", "-F", "jarfile=@D:\\test\\BuildTest\\target\\GenerateFlink.jar", " http://10.5.81.243:8081/jars/upload"};

    public static String execCurlUpload(List<String> cmds){
        ProcessBuilder pb=new ProcessBuilder(cmds);
        pb.redirectErrorStream(true);
        Process p;
        try {
            p = pb.start();
            BufferedReader br=null;
            String line=null;
            List<String> res = new ArrayList<String>();
            br=new BufferedReader(new InputStreamReader(p.getInputStream()));
            while((line=br.readLine())!=null){
//                System.out.println("\t"+line);
                res.add(line);
            }
            br.close();
            String s = res.subList(res.size()-1,res.size()).toString();
            System.out.println(s.substring(45));
            int i1 = s.indexOf("flink-web-upload/");
            int i2 = s.indexOf(".jar");
            System.out.println(s.substring(i1+17,i2+4));
            return s.substring(i1+17,i2+4);

        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return null;
    }

    public static void execCurlRun(List<String> l){
        ProcessBuilder pb=new ProcessBuilder(l);
        pb.redirectErrorStream(true);
        try {
            pb.start();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {

        String jarfiledir = "D:\\test\\finaltest\\target\\GenerateFlink.jar";
        String jarfile = "\"jarfile=@" + jarfiledir + "\"";

        String ip = "10.5.81.243";
        String cluster = ip + ":8081/jars/upload";
        String[] uploadCmds = new String[]{"curl", "-X", "POST", "-H", "\"Expect:\"", "-F"};
        // , "\"jarfile=@D:\\test\\BuildTest\\target\\GenerateFlink.jar\"", "http://10.5.81.243:8081/jars/upload"

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
