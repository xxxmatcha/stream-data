package edu.ncut.kafkaflinkweb.controller.generate_jar_rest;

import com.squareup.javapoet.JavaFile;
import com.squareup.javapoet.MethodSpec;
import com.squareup.javapoet.ParameterizedTypeName;
import com.squareup.javapoet.TypeSpec;
import org.apache.flink.api.common.functions.FilterFunction;
import org.apache.flink.api.common.functions.FlatMapFunction;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.connectors.kafka.FlinkKafkaConsumer;
import org.apache.flink.streaming.connectors.kafka.FlinkKafkaProducer;
import org.apache.flink.util.Collector;

import javax.lang.model.element.Modifier;
import java.io.File;
import java.io.IOException;
import java.util.Properties;

public class GenerateFlinkTest {

    public static TypeSpec genMyFlatMap(double threshold){
        /*
            实现 FlatMap 的接口
         */
        TypeSpec myFlatMap = TypeSpec.anonymousClassBuilder("")
                .addSuperinterface(ParameterizedTypeName.get(FlatMapFunction.class,String.class,String.class))
                .addMethod(MethodSpec.methodBuilder("flatMap")
                        .addAnnotation(Override.class)
                        .addModifiers(Modifier.PUBLIC)
                        .addParameter(String.class,"s")
                        .addParameter(Collector.class,"collector")
                        .returns(void.class)
//                        .addStatement("return $T.valueOf(s)>2.5",Double.class)
                        .beginControlFlow("if (Double.valueOf(s.split(\",\")[1])>$L)",threshold)
                        .addStatement("collector.collect(s + \",anomaly\")")
                        .nextControlFlow("else")
                        .addStatement("collector.collect(s + \",normal\")")
                        .endControlFlow()
                        .build())
                .build();
        return myFlatMap;
    }

    public static MethodSpec genMain(String ip,String consumerTopic,String producerTopic,TypeSpec operator){
        // mian 方法
        MethodSpec main = MethodSpec.methodBuilder("main")
                .addModifiers(Modifier.PUBLIC, Modifier.STATIC)
                .addException(Exception.class)
                .returns(void.class)
                .addParameter(String[].class, "args")
                .addStatement("$T.out.println($S)", System.class, "Hello, JavaPoet!")
                .addStatement("$T env = StreamExecutionEnvironment.getExecutionEnvironment()", StreamExecutionEnvironment.class)
                .addStatement("$T properties = new Properties()",Properties.class)
                .addStatement("properties.setProperty(\"bootstrap.servers\", $S)",ip)
                .addStatement("properties.put(\"auto.offset.reset\", \"latest\")")
                .addStatement("properties.put(\"topic\",$S)",consumerTopic)
                .addStatement("$T<String> stream = env.addSource(new $T<String>($S, new $T(), properties))", DataStream.class, FlinkKafkaConsumer.class, consumerTopic, SimpleStringSchema.class)
//                .addStatement("stream = stream."+filter+"( ($T<String>) s -> Double.valueOf(s)>$L )",FilterFunction.class,threshold)
                .addStatement("stream = stream.flatMap( $L )", operator)
//                .addStatement("})")
//                .beginControlFlow("if (Double.valueOf(s.split(\",\")[1])>$L)",threshold)
//                .addStatement("collector.collect(s + \",anomaly\")")
                .addStatement("stream.addSink(new $T<String>($S, new $T(), properties))", FlinkKafkaProducer.class,producerTopic, SimpleStringSchema.class)
                .addStatement("stream.print()")
                .addStatement("env.execute($S)","dc_test1")
                .build();
        return main;
    }

    public static TypeSpec genClass(MethodSpec main){
        TypeSpec myClass = TypeSpec.classBuilder("GenerateFlink")  //构造一个类,类名
                .addModifiers(Modifier.PUBLIC, Modifier.FINAL)  //定义类的修饰符
                .addMethod(main)            //添加类的方法,也就是上面生成的MethodSpec对象
                .build();
        return myClass;
    }

    public static void genCode(String javaFir,TypeSpec myClass) throws IOException {
        JavaFile javaFile = JavaFile.builder("", myClass)
                .build();
        javaFile.writeTo(System.out);
        javaFile.writeTo(new File(javaFir));
    }

    public static void main(String[] args) throws IOException {
        String ip = "10.5.81.243:9092";
        String consumerTopic = "test2";
        String producerTopic = "filterComputer";
        double threshold = 40;
        String filter = "filter";


        /*
            实现 filter 的接口
         */
        TypeSpec myFilter = TypeSpec.anonymousClassBuilder("")
                .addSuperinterface(ParameterizedTypeName.get(FilterFunction.class,String.class))
                .addMethod(MethodSpec.methodBuilder("filter")
                    .addAnnotation(Override.class)
                    .addModifiers(Modifier.PUBLIC)
                    .addParameter(String.class,"s")
                    .returns(boolean.class)
                    .addStatement("return $T.valueOf(s)>2.5",Double.class)
                    .build())
                .build();

        /*
            实现 FlatMap 的接口
         */
        TypeSpec myFlatMap = TypeSpec.anonymousClassBuilder("")
                .addSuperinterface(ParameterizedTypeName.get(FlatMapFunction.class,String.class,String.class))
                .addMethod(MethodSpec.methodBuilder("flatMap")
                        .addAnnotation(Override.class)
                        .addModifiers(Modifier.PUBLIC)
                        .addParameter(String.class,"s")
                        .addParameter(Collector.class,"collector")
                        .returns(void.class)
//                        .addStatement("return $T.valueOf(s)>2.5",Double.class)
                        .beginControlFlow("if (Double.valueOf(s.split(\",\")[1])>$L)",threshold)
                        .addStatement("collector.collect(s + \",anomaly\")")
                        .nextControlFlow("else")
                        .addStatement("collector.collect(s + \",normal\")")
                        .endControlFlow()
                        .build())
                .build();

        // mian 方法
        MethodSpec main = MethodSpec.methodBuilder("main")
                .addModifiers(Modifier.PUBLIC, Modifier.STATIC)
                .addException(Exception.class)
                .returns(void.class)
                .addParameter(String[].class, "args")
                .addStatement("$T.out.println($S)", System.class, "Hello, JavaPoet!")
                .addStatement("$T env = StreamExecutionEnvironment.getExecutionEnvironment()", StreamExecutionEnvironment.class)
                .addStatement("$T properties = new Properties()",Properties.class)
                .addStatement("properties.setProperty(\"bootstrap.servers\", $S)",ip)
                .addStatement("properties.put(\"auto.offset.reset\", \"latest\")")
                .addStatement("properties.put(\"topic\",$S)",consumerTopic)
                .addStatement("$T<String> stream = env.addSource(new $T<String>($S, new $T(), properties))", DataStream.class, FlinkKafkaConsumer.class, consumerTopic, SimpleStringSchema.class)
//                .addStatement("stream = stream."+filter+"( ($T<String>) s -> Double.valueOf(s)>$L )",FilterFunction.class,threshold)
                .addStatement("stream = stream.flatMap( $L )", myFlatMap)
//                .addStatement("})")
//                .beginControlFlow("if (Double.valueOf(s.split(\",\")[1])>$L)",threshold)
//                .addStatement("collector.collect(s + \",anomaly\")")
                .addStatement("stream.addSink(new $T<String>($S, new $T(), properties))", FlinkKafkaProducer.class,producerTopic, SimpleStringSchema.class)
                .addStatement("stream.print()")
                .addStatement("env.execute($S)","dc_test1")
                .build();

        TypeSpec helloWorld = TypeSpec.classBuilder("GenerateFlink")  //构造一个类,类名
                .addModifiers(Modifier.PUBLIC, Modifier.FINAL)  //定义类的修饰符
                .addMethod(main)            //添加类的方法,也就是上面生成的MethodSpec对象
                .build();

        JavaFile javaFile = JavaFile.builder("", helloWorld)
                .build();

        javaFile.writeTo(System.out);  //System.out  //new File("D:\\test")
        javaFile.writeTo(new File("D:\\test\\finaltest"));
    }
}
